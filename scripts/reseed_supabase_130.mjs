import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://alqdlwwccejxykulolhh.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_amEQhxzFogq16u4U4bbNng_cy1447k3";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function reseed130() {
  console.log("==================================================");
  printMessage("RESEEDING SUPABASE WITH 130-BOX AUTHORITATIVE INVENTORY");
  console.log("==================================================");

  // 1. Read clean JSON dataset
  const jsonPath = path.resolve(process.cwd(), "src/data/screenguards.json");
  const rawJson = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(rawJson);

  console.log(`Read ${data.boxes.length} boxes from ${jsonPath}.`);

  // 2. Fetch existing models and delete all
  console.log("1. Deleting all existing models from Supabase...");
  // Delete all models where id is not null (effectively truncating models table)
  const { error: delModelsErr } = await supabase.from("models").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delModelsErr) {
    console.error("❌ Failed to clear models table:", delModelsErr.message);
  } else {
    console.log("  ✓ Models table cleared successfully");
  }

  // 3. Fetch existing boxes and delete all
  console.log("2. Deleting all existing boxes from Supabase...");
  const { error: delBoxesErr } = await supabase.from("boxes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delBoxesErr) {
    console.error("❌ Failed to clear boxes table:", delBoxesErr.message);
  } else {
    console.log("  ✓ Boxes table cleared successfully");
  }

  // 4. Insert 130 boxes in batches
  console.log("3. Inserting 130 boxes into Supabase...");
  const boxRows = data.boxes.map((box) => ({
    id: box.id,
    box_number: box.boxNumber,
    display_size: box.displaySize ?? "Unknown",
    title: box.title,
    raw_text: box.rawText ?? null,
  }));

  for (let i = 0; i < boxRows.length; i += 50) {
    const batch = boxRows.slice(i, i + 50);
    const { error: insertBoxErr } = await supabase.from("boxes").upsert(batch, { onConflict: "id" });
    if (insertBoxErr) {
      console.error(`❌ Boxes insert error on batch ${i / 50 + 1}:`, insertBoxErr.message);
      process.exit(1);
    }
  }
  console.log("  ✓ 130 boxes inserted successfully");

  // 5. Insert model relationships in batches
  console.log("4. Inserting model relationships into Supabase...");
  const modelRows = [];
  for (const b of data.boxes) {
    for (const m of b.compatibleModels) {
      modelRows.push({
        box_id: b.id,
        model_name: m,
      });
    }
  }

  for (let i = 0; i < modelRows.length; i += 100) {
    const batch = modelRows.slice(i, i + 100);
    const { error: insertModelErr } = await supabase.from("models").insert(batch);
    if (insertModelErr) {
      console.error(`❌ Models insert error on batch ${i / 100 + 1}:`, insertModelErr.message);
      process.exit(1);
    }
  }
  console.log(`  ✓ ${modelRows.length} model relationships inserted successfully`);

  // 6. Verification query from live Supabase
  console.log("5. Auditing live Supabase row counts...");
  const { data: boxesCount, error: boxCountErr } = await supabase.from("boxes").select("id", { count: "exact" });
  const { data: modelsCount, error: modelCountErr } = await supabase.from("models").select("id", { count: "exact" });

  if (boxCountErr || modelCountErr) {
    console.error("❌ Count verification error:", boxCountErr?.message || modelCountErr?.message);
  } else {
    console.log(`  ✓ Live Supabase boxes count: ${boxesCount.length}`);
    console.log(`  ✓ Live Supabase models count: ${modelsCount.length}`);
  }

  console.log("==================================================");
  console.log("🎉 SUPABASE RESEEDING COMPLETE!");
  console.log("==================================================");
}

function printMessage(msg) {
  console.log(msg);
}

reseed130().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
