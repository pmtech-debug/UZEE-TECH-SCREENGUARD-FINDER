/**
 * One-time seeder script — reads src/data/screenguards.json and inserts
 * all 106 boxes into Supabase.
 *
 * Usage (after setting up .env.local):
 *   npx tsx scripts/seed-supabase.ts
 *
 * Only run this ONCE after creating your Supabase project and running schema.sql.
 * If you re-run it, the upsert (on conflict id) will safely overwrite existing rows.
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load .env.local
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
  category?: string;
  notes?: string;
}

interface ScreenguardData {
  boxes: Box[];
}

async function seed() {
  const dataPath = path.resolve(process.cwd(), "src", "data", "screenguards.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const data: ScreenguardData = JSON.parse(raw);

  console.log(`📦  Seeding ${data.boxes.length} boxes into Supabase…`);

  const rows = data.boxes.map((box: Box) => ({
    id: box.id,
    box_number: box.boxNumber,
    display_size: box.displaySize ?? "Unknown",
    title: box.title,
    models: box.compatibleModels,
    raw_text: box.rawText ?? null,
    category: box.category ?? null,
    notes: box.notes ?? null,
  }));

  // Upsert in batches of 50
  const BATCH = 50;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase
      .from("screenguards")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`❌  Error on batch ${i / BATCH + 1}:`, error.message);
      process.exit(1);
    }
    inserted += batch.length;
    console.log(`  ✓  ${inserted}/${rows.length} rows upserted`);
  }

  console.log("\n✅  Seeding complete!");
}

seed().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});
