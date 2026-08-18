import { NextResponse } from "next/server";
import {
  updateStock,
  getInventoryHistory,
  getPurchaseList,
  addToPurchaseList,
  updatePurchaseStatus,
  saveBulkStockCounts,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const groupId = searchParams.get("groupId");

    if (type === "history") {
      const history = await getInventoryHistory(groupId || undefined);
      return NextResponse.json({ history });
    }

    if (type === "purchase") {
      const purchaseList = await getPurchaseList();
      return NextResponse.json({ purchaseList });
    }

    const history = await getInventoryHistory(groupId || undefined);
    const purchaseList = await getPurchaseList();
    return NextResponse.json({ history, purchaseList });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to fetch inventory data", details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "update_stock") {
      const { groupId, stockAction, amount, note } = body;
      if (!groupId || !stockAction) {
        return NextResponse.json({ error: "groupId and stockAction are required" }, { status: 400 });
      }
      const updatedBox = await updateStock(groupId, stockAction, Number(amount || 0), note);
      return NextResponse.json({ success: true, box: updatedBox });
    }

    if (action === "add_purchase_item") {
      const { groupId, requestedQuantity, note } = body;
      if (!groupId) {
        return NextResponse.json({ error: "groupId is required" }, { status: 400 });
      }
      const item = await addToPurchaseList(groupId, Number(requestedQuantity || 1), note);
      return NextResponse.json({ success: true, item });
    }

    if (action === "update_purchase_status") {
      const { purchaseId, status, note } = body;
      if (!purchaseId || !status) {
        return NextResponse.json({ error: "purchaseId and status are required" }, { status: 400 });
      }
      const item = await updatePurchaseStatus(purchaseId, status, note);
      return NextResponse.json({ success: true, item });
    }

    if (action === "save_bulk_counts") {
      const { counts } = body;
      if (!Array.isArray(counts)) {
        return NextResponse.json({ error: "counts must be an array" }, { status: 400 });
      }
      const countSaved = await saveBulkStockCounts(counts);
      return NextResponse.json({ success: true, countSaved });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Inventory request failed", details: message }, { status: 500 });
  }
}
