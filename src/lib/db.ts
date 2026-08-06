import { getSupabaseClient } from "./supabase";
import type { Box } from "@/types/screenguard";

// ─── Row shape coming from Supabase ───────────────────────────────────────────
interface SupabaseRow {
  id: string;
  box_number: string;
  display_size: string;
  title: string;
  models: string[];
  raw_text: string | null;
  category: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Converters ───────────────────────────────────────────────────────────────
function rowToBox(row: SupabaseRow): Box {
  return {
    id: row.id,
    boxNumber: row.box_number,
    displaySize: row.display_size,
    title: row.title,
    compatibleModels: Array.isArray(row.models) ? row.models : [],
    rawText: row.raw_text ?? undefined,
    category: row.category ?? undefined,
    notes: row.notes ?? undefined,
  };
}

function boxToRow(box: Box): Omit<SupabaseRow, "created_at" | "updated_at"> {
  return {
    id: box.id,
    box_number: box.boxNumber,
    display_size: box.displaySize ?? "Unknown",
    title: box.title,
    models: box.compatibleModels,
    raw_text: box.rawText ?? null,
    category: box.category ?? null,
    notes: box.notes ?? null,
  };
}

// ─── Data Access Layer ────────────────────────────────────────────────────────

/** Fetch all boxes, ordered by box_number */
export async function getAllBoxes(): Promise<Box[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("screenguards")
    .select("*")
    .order("box_number", { ascending: true });

  if (error) {
    console.error("[db] getAllBoxes error:", error.message);
    throw new Error(error.message);
  }

  return (data as SupabaseRow[]).map(rowToBox);
}

/** Insert or update a single box (upsert on id) */
export async function upsertBox(box: Box): Promise<Box> {
  const supabase = getSupabaseClient();
  const row = boxToRow(box);

  const { data, error } = await supabase
    .from("screenguards")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("[db] upsertBox error:", error.message);
    throw new Error(error.message);
  }

  return rowToBox(data as SupabaseRow);
}

/** Delete a box by id */
export async function deleteBox(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("screenguards")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[db] deleteBox error:", error.message);
    throw new Error(error.message);
  }
}
