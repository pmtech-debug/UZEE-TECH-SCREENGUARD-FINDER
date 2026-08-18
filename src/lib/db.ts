import { getSupabaseClient } from "./supabase";
import type { Box, InventoryTransaction, PurchaseItem } from "@/types/screenguard";

// ─── Local Memory Store for Fallback / Offline Inventory Transactions ─────────
const localTransactions: InventoryTransaction[] = [];
const localPurchaseList: PurchaseItem[] = [];
const localStockState: Record<string, { quantity: number; verified: boolean }> = {};

export function deriveStockStatus(
  quantity: number,
  verified = false,
  lowStockThreshold = 3
): "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "NOT_COUNTED" {
  if (!verified) return "NOT_COUNTED";
  if (quantity <= 0) return "OUT_OF_STOCK";
  if (quantity <= lowStockThreshold) return "LOW_STOCK";
  return "IN_STOCK";
}

// ─── Interfaces for Joined Query Result ────────────────────────────────────────
interface ModelRow {
  model_name: string;
}

interface BoxWithModelsRow {
  id: string;
  box_number: string;
  display_size: string;
  title: string;
  raw_text: string | null;
  category: string | null;
  notes: string | null;
  source: string | null;
  verification: string | null;
  stock_quantity?: number | null;
  stock_count_verified?: boolean | null;
  models: ModelRow[];
}

// ─── Converters ───────────────────────────────────────────────────────────────
function rowToBox(row: BoxWithModelsRow): Box {
  const override = localStockState[row.id];
  const stockQuantity = override
    ? override.quantity
    : Math.max(0, row.stock_quantity ?? 0);
  const stockCountVerified = override
    ? override.verified
    : (row.stock_count_verified ?? false);

  return {
    id: row.id,
    boxNumber: row.box_number,
    displaySize: row.display_size,
    title: row.title,
    compatibleModels: Array.isArray(row.models)
      ? row.models.map((m) => m.model_name)
      : [],
    rawText: row.raw_text ?? undefined,
    category: row.category ?? undefined,
    notes: row.notes ?? undefined,
    source: row.source ?? undefined,
    verification: row.verification ?? undefined,
    stockQuantity,
    stockCountVerified,
    stockStatus: deriveStockStatus(stockQuantity, stockCountVerified),
  };
}

// ─── Data Access Layer (Normalized Boxes + Models + Inventory) ────────────────

/** Fetch all boxes with their compatible models via 1-to-many join */
export async function getAllBoxes(): Promise<Box[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("boxes")
    .select(`
      id,
      box_number,
      display_size,
      title,
      raw_text,
      models (
        model_name
      )
    `)
    .order("box_number", { ascending: true });

  if (error || !data || data.length < 263) {
    if (error) {
      console.warn("[db] Supabase query warning, using local JSON data:", error.message);
    } else {
      console.log(`[db] Supabase database has unseeded/legacy data (${data?.length ?? 0} rows < 263 master groups). Using local master JSON data.`);
    }
    const jsonModule = await import("@/data/screenguards.json");
    const jsonBoxes = (jsonModule.default.boxes || jsonModule.boxes) as Box[];
    return jsonBoxes.map((b) => {
      const override = localStockState[b.id];
      const qty = override ? override.quantity : Math.max(0, b.stockQuantity ?? 0);
      const ver = override ? override.verified : (b.stockCountVerified ?? false);
      return {
        ...b,
        stockQuantity: qty,
        stockCountVerified: ver,
        stockStatus: deriveStockStatus(qty, ver),
      };
    });
  }

  return (data as unknown as BoxWithModelsRow[]).map(rowToBox);
}

/** Insert or update a box and its models */
export async function upsertBox(box: Box): Promise<Box> {
  const supabase = getSupabaseClient();

  const stockQty = Math.max(0, box.stockQuantity ?? 0);
  const stockVer = box.stockCountVerified ?? false;

  const isNewBoxState = !localStockState[box.id];
  localStockState[box.id] = { quantity: stockQty, verified: stockVer };

  if (isNewBoxState && (stockQty > 0 || stockVer)) {
    const tx: InventoryTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      groupId: box.id,
      transactionType: "INITIAL_STOCK",
      quantityChange: stockQty,
      previousQuantity: 0,
      newQuantity: stockQty,
      boxNumber: box.boxNumber,
      note: "Initial stock setup",
      createdAt: new Date().toISOString(),
    };
    localTransactions.unshift(tx);
  }

  const boxRow: Record<string, unknown> = {
    id: box.id,
    box_number: box.boxNumber,
    display_size: box.displaySize ?? "Unknown",
    title: box.title,
    raw_text: box.rawText ?? null,
    category: box.category ?? "Super-D",
    notes: box.notes ?? null,
    source: box.source ?? null,
    verification: box.verification ?? null,
  };

  const { error: boxError } = await supabase
    .from("boxes")
    .upsert(boxRow, { onConflict: "id" });

  if (boxError) {
    console.error("[db] upsertBox box error:", boxError.message);
  }

  // Replace models for this box (delete existing + insert new list)
  const { error: deleteError } = await supabase
    .from("models")
    .delete()
    .eq("box_id", box.id);

  if (deleteError) {
    console.error("[db] upsertBox delete models error:", deleteError.message);
  }

  if (box.compatibleModels.length > 0) {
    const modelRows = box.compatibleModels.map((m) => ({
      box_id: box.id,
      model_name: m,
    }));

    const { error: modelsError } = await supabase
      .from("models")
      .insert(modelRows);

    if (modelsError) {
      console.error("[db] upsertBox insert models error:", modelsError.message);
    }
  }

  return {
    ...box,
    displaySize: box.displaySize || "Unknown",
    stockQuantity: stockQty,
    stockCountVerified: stockVer,
    stockStatus: deriveStockStatus(stockQty, stockVer),
  };
}

/** Delete a box by id */
export async function deleteBox(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  delete localStockState[id];

  const { error } = await supabase
    .from("boxes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[db] deleteBox error:", error.message);
    throw new Error(error.message);
  }
}

// ─── Inventory Management Data Access Functions ────────────────────────────────

/** Update stock for a group (SOLD, RESTOCK, ADJUSTMENT) */
export async function updateStock(
  groupId: string,
  action: "SALE" | "RESTOCK" | "ADJUSTMENT",
  amountOrChange: number,
  note?: string
): Promise<Box> {
  const allBoxes = await getAllBoxes();
  const box = allBoxes.find((b) => b.id === groupId);

  if (!box) {
    throw new Error(`Group '${groupId}' not found`);
  }

  const prevQty = box.stockQuantity ?? 0;
  let newQty = prevQty;
  let qtyChange = 0;

  if (action === "SALE") {
    qtyChange = -1;
    newQty = prevQty - 1;
  } else if (action === "RESTOCK") {
    qtyChange = Math.max(1, Math.floor(amountOrChange));
    newQty = prevQty + qtyChange;
  } else if (action === "ADJUSTMENT") {
    if (amountOrChange < 0) {
      throw new Error(`Stock quantity cannot be set to a negative number (${amountOrChange})`);
    }
    newQty = Math.floor(amountOrChange);
    qtyChange = newQty - prevQty;
  }

  if (newQty < 0) {
    throw new Error(`Stock quantity cannot be negative (current: ${prevQty}, attempted change: ${qtyChange})`);
  }

  // Update memory state
  localStockState[groupId] = { quantity: newQty, verified: true };

  // Log transaction
  const tx: InventoryTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    groupId,
    transactionType: action,
    quantityChange: qtyChange,
    previousQuantity: prevQty,
    newQuantity: newQty,
    boxNumber: box.boxNumber,
    note: note || (action === "SALE" ? "Customer sale" : action === "RESTOCK" ? "Restock added" : "Physical stock count adjustment"),
    createdAt: new Date().toISOString(),
  };

  localTransactions.unshift(tx);

  // Try updating Supabase (ignore error if columns don't exist yet on remote)
  const supabase = getSupabaseClient();
  try {
    await supabase
      .from("boxes")
      .update({ stock_quantity: newQty, stock_count_verified: true })
      .eq("id", groupId);

    await supabase.from("inventory_transactions").insert({
      group_id: groupId,
      transaction_type: action,
      quantity_change: qtyChange,
      previous_quantity: prevQty,
      new_quantity: newQty,
      box_number: box.boxNumber,
      note: tx.note,
    });
  } catch (e) {
    console.warn("[db] Supabase stock transaction log notice:", e);
  }

  return {
    ...box,
    stockQuantity: newQty,
    stockCountVerified: true,
    stockStatus: deriveStockStatus(newQty),
  };
}

/** Get inventory history for a group or all groups */
export async function getInventoryHistory(groupId?: string): Promise<InventoryTransaction[]> {
  const supabase = getSupabaseClient();
  try {
    let query = supabase
      .from("inventory_transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (groupId) {
      query = query.eq("group_id", groupId);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data.map((t) => ({
        id: t.id,
        groupId: t.group_id,
        transactionType: t.transaction_type,
        quantityChange: t.quantity_change,
        previousQuantity: t.previous_quantity,
        newQuantity: t.new_quantity,
        boxNumber: t.box_number,
        note: t.note,
        createdAt: t.created_at,
      }));
    }
  } catch (e) {}

  // Return local transactions filtered by groupId if specified
  if (groupId) {
    return localTransactions.filter((t) => t.groupId === groupId);
  }
  return localTransactions;
}

/** Get current Purchase List items */
export async function getPurchaseList(): Promise<PurchaseItem[]> {
  const allBoxes = await getAllBoxes();
  const boxMap = new Map(allBoxes.map((b) => [b.id, b]));

  const supabase = getSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("purchase_list")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((p) => {
        const b = boxMap.get(p.group_id);
        return {
          id: p.id,
          groupId: p.group_id,
          boxNumber: b?.boxNumber || p.group_id,
          title: b?.title || "",
          compatibleModels: b?.compatibleModels || [],
          currentQuantity: b?.stockQuantity ?? 0,
          requestedQuantity: p.requested_quantity,
          status: p.status,
          note: p.note,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        };
      });
    }
  } catch (e) {}

  return localPurchaseList.map((p) => {
    const b = boxMap.get(p.groupId);
    return {
      ...p,
      boxNumber: b?.boxNumber || p.groupId,
      title: b?.title || "",
      compatibleModels: b?.compatibleModels || [],
      currentQuantity: b?.stockQuantity ?? 0,
    };
  });
}

/** Add a group to Purchase List */
export async function addToPurchaseList(
  groupId: string,
  requestedQuantity = 1,
  note?: string
): Promise<PurchaseItem> {
  const allBoxes = await getAllBoxes();
  const b = allBoxes.find((box) => box.id === groupId);

  const existing = localPurchaseList.find(
    (p) => p.groupId === groupId && p.status !== "RECEIVED" && p.status !== "CANCELLED"
  );

  if (existing) {
    existing.requestedQuantity += requestedQuantity;
    if (note) existing.note = note;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  const newItem: PurchaseItem = {
    id: `pur-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    groupId,
    boxNumber: b?.boxNumber || groupId,
    title: b?.title || "",
    compatibleModels: b?.compatibleModels || [],
    currentQuantity: b?.stockQuantity ?? 0,
    requestedQuantity: Math.max(1, requestedQuantity),
    status: "NEEDS ORDER",
    note: note || "Reorder requested",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localPurchaseList.unshift(newItem);

  const supabase = getSupabaseClient();
  try {
    await supabase.from("purchase_list").insert({
      group_id: groupId,
      requested_quantity: newItem.requestedQuantity,
      status: newItem.status,
      note: newItem.note,
    });
  } catch (e) {}

  return newItem;
}

/** Update status of a purchase list item */
export async function updatePurchaseStatus(
  purchaseId: string,
  status: "NEEDS ORDER" | "ORDERED" | "RECEIVED" | "CANCELLED",
  note?: string
): Promise<PurchaseItem> {
  const item = localPurchaseList.find((p) => p.id === purchaseId);
  if (!item) {
    throw new Error(`Purchase item '${purchaseId}' not found`);
  }

  item.status = status;
  if (note) item.note = note;
  item.updatedAt = new Date().toISOString();

  // If status is RECEIVED, automatically prompt/execute RESTOCK for requested quantity
  if (status === "RECEIVED" && item.requestedQuantity > 0) {
    await updateStock(
      item.groupId,
      "RESTOCK",
      item.requestedQuantity,
      `Auto-restocked from Purchase Order (ID: ${item.id})`
    );
  }

  const supabase = getSupabaseClient();
  try {
    await supabase
      .from("purchase_list")
      .update({ status, note: item.note, updated_at: item.updatedAt })
      .eq("id", purchaseId);
  } catch (e) {}

  return item;
}

/** Save bulk stock counts from Stock Count Mode */
export async function saveBulkStockCounts(
  counts: { groupId: string; quantity: number }[]
): Promise<number> {
  let countSaved = 0;
  for (const item of counts) {
    if (typeof item.quantity === "number" && item.quantity >= 0) {
      await updateStock(item.groupId, "ADJUSTMENT", item.quantity, "Stock Count Mode verification");
      countSaved++;
    }
  }
  return countSaved;
}


