import { createSearchEngine, searchBoxes } from "../src/lib/search";
import screenguards from "../src/data/screenguards.json";
import type { Box } from "../src/types/screenguard";

const boxes = screenguards.boxes as Box[];
const searchEngine = createSearchEngine(boxes);

const testQueries = [
  "iPhone 6",
  "iPhone 13",
  "Pixel 8",
  "Samsung A34 5G",
  "SAM A34 5G",
  "A34 5G",
  "Samsung A06",
  "SAM A06",
  "A06",
  "Redmi Note 10",
  "RM NOTE 10",
  "OPPO A57",
  "OP A57",
  "OnePlus 9RT",
  "1+ 9 RT",
  "Tecno Pova 5 Pro",
  "Honor X8",
  "IP 13",
  "IP 6"
];

console.log("=" * 60);
console.log("TESTING APPLICATION SEARCH ENGINE WITH 130-BOX DATASET");
console.log("=" * 60);

let passed = 0;
let failed = 0;

for (const q of testQueries) {
  const results = searchBoxes(searchEngine, q);
  if (results.length > 0) {
    const matchedBoxes = results.map(r => r.item.boxNumber).join(", ");
    console.log(`✓ Query: "${q}" → Found ${results.length} box(es): ${matchedBoxes} (Top match: ${results[0].item.boxNumber})`);
    passed++;
  } else {
    console.error(`❌ Query: "${q}" → NO BOX FOUND!`);
    failed++;
  }
}

console.log("=" * 60);
console.log(`Results: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL SEARCH ENGINE TESTS PASSED!");
}
