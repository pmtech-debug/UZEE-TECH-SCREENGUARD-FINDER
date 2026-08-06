import { getSupabaseClient } from "./supabase";
import type { Box } from "@/types/screenguard";

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
  models: ModelRow[];
}

// ─── Converters ───────────────────────────────────────────────────────────────
function rowToBox(row: BoxWithModelsRow): Box {
  return {
    id: row.id,
    boxNumber: row.box_number,
    displaySize: row.display_size,
    title: row.title,
    compatibleModels: Array.isArray(row.models)
      ? row.models.map((m) => m.model_name)
      : [],
    rawText: row.raw_text ?? undefined,
  };
}

// ─── Data Access Layer (Normalized Boxes + Models) ─────────────────────────────

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

  if (error) {
    console.error("[db] getAllBoxes error:", error.message);
    throw new Error(error.message);
  }

  return (data as unknown as BoxWithModelsRow[]).map(rowToBox);
}

/** Insert or update a box and its models */
export async function upsertBox(box: Box): Promise<Box> {
  const supabase = getSupabaseClient();

  // 1. Upsert parent box record
  const boxRow = {
    id: box.id,
    box_number: box.boxNumber,
    display_size: box.displaySize ?? "Unknown",
    title: box.title,
    raw_text: box.rawText ?? null,
  };

  const { error: boxError } = await supabase
    .from("boxes")
    .upsert(boxRow, { onConflict: "id" });

  if (boxError) {
    console.error("[db] upsertBox box error:", boxError.message);
    throw new Error(boxError.message);
  }

  // 2. Replace models for this box (delete existing + insert new list)
  const { error: deleteError } = await supabase
    .from("models")
    .delete()
    .eq("box_id", box.id);

  if (deleteError) {
    console.error("[db] upsertBox delete models error:", deleteError.message);
    throw new Error(deleteError.message);
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
      throw new Error(modelsError.message);
    }
  }

  return {
    id: box.id,
    boxNumber: box.boxNumber,
    displaySize: box.displaySize ?? "Unknown",
    title: box.title,
    compatibleModels: box.compatibleModels,
    rawText: box.rawText,
  };
}

/** Delete a box by id (Child models are automatically removed via ON DELETE CASCADE) */
export async function deleteBox(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("boxes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[db] deleteBox error:", error.message);
    throw new Error(error.message);
  }
}
