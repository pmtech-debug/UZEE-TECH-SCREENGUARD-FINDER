/**
 * One-time seeder script — reads src/data/screenguards.json and inserts
 * all 106 boxes and 800+ models into normalized Supabase tables (boxes & models).
 *
 * Usage (after setting up .env.local):
 *   npx tsx scripts/seed-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌  Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Box {
  id: string;
  boxNumber: string;
  displaySize?: string;
  title: string;
  compatibleModels: string[];
  rawText?: string;
}

interface ScreenguardData {
  boxes: Box[];
}

async function seed() {
  const dataPath = path.resolve(process.cwd(), "src", "data", "screenguards.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const data: ScreenguardData = JSON.parse(raw);

  console.log(`📦  Seeding ${data.boxes.length} boxes into Supabase…`);

  const boxRows = data.boxes.map((box: Box) => ({
    id: box.id,
    box_number: box.boxNumber,
    display_size: box.displaySize ?? "Unknown",
    title: box.title,
    raw_text: box.rawText ?? null,
  }));

  // 1. Upsert boxes in batches of 50
  for (let i = 0; i < boxRows.length; i += 50) {
    const batch = boxRows.slice(i, i + 50);
    const { error } = await supabase
      .from("boxes")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`❌  Boxes error on batch ${i / 50 + 1}:`, error.message);
      process.exit(1);
    }
  }

  console.log("  ✓  Boxes upserted successfully");

  // 2. Prepare models
  const modelRows: { box_id: string; model_name: string }[] = [];
  for (const b of data.boxes) {
    for (const model of b.compatibleModels) {
      modelRows.push({ box_id: b.id, model_name: model });
    }
  }

  // Clear existing models before inserting fresh ones
  const boxIds = data.boxes.map((b) => b.id);
  await supabase.from("models").delete().in("box_id", boxIds);

  // Insert models in batches of 100
  for (let i = 0; i < modelRows.length; i += 100) {
    const batch = modelRows.slice(i, i + 100);
    const { error } = await supabase.from("models").insert(batch);
    if (error) {
      console.error(`❌  Models error on batch ${i / 100 + 1}:`, error.message);
      process.exit(1);
    }
  }

  console.log(`  ✓  ${modelRows.length} model relationships inserted successfully`);
  console.log("\n✅  Seeding complete!");
}

seed().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});
