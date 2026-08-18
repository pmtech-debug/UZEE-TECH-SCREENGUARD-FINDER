import { createSearchEngine, searchBoxes } from "../src/lib/search";
import screenguards from "../src/data/screenguards.json";
import type { Box } from "../src/types/screenguard";

const boxes = screenguards.boxes as Box[];
const searchEngine = createSearchEngine(boxes);

const userTestCases = [
  {
    query: "Samsung A34",
    expectedBoxes: ["BOX 050"],
    forbiddenBoxes: ["BOX 055"]
  },
  {
    query: "Redmi Note 10",
    expectedBoxes: ["BOX 049", "BOX 053", "BOX 063"],
    forbiddenBoxes: ["BOX 046"]
  },
  {
    query: "OnePlus 9RT",
    expectedBoxes: ["BOX 094", "BOX 113", "BOX 130"],
    forbiddenBoxes: ["BOX 085", "BOX 062", "BOX 126"]
  },
  {
    query: "SAM A34",
    expectedBoxes: ["BOX 050"],
    forbiddenBoxes: ["BOX 055"]
  },
  {
    query: "IP 13",
    expectedBoxes: ["BOX 009", "BOX 007", "BOX 010"],
    forbiddenBoxes: []
  },
  {
    query: "RM Note 10",
    expectedBoxes: ["BOX 049", "BOX 053", "BOX 063"],
    forbiddenBoxes: ["BOX 046"]
  },
  {
    query: "OPPO A57",
    expectedBoxes: ["BOX 073", "BOX 109"],
    forbiddenBoxes: []
  },
  {
    query: "Tecno Pova 5 Pro",
    expectedBoxes: ["BOX 110"],
    forbiddenBoxes: []
  }
];

console.log("==================================================");
console.log("TESTING APPLICATION SEARCH ENGINE QA PRECISION");
console.log("==================================================");

let passedCount = 0;
let failedCount = 0;

for (const tc of userTestCases) {
  const results = searchBoxes(searchEngine, tc.query);
  const matchedBoxNums = results.map(r => r.item.boxNumber);

  let hasErrors = false;

  for (const exp of tc.expectedBoxes) {
    if (!matchedBoxNums.includes(exp)) {
      console.error(`❌ Query "${tc.query}": Missing expected box ${exp}. Got: [${matchedBoxNums.join(", ")}]`);
      hasErrors = true;
    }
  }

  for (const forb of tc.forbiddenBoxes) {
    if (matchedBoxNums.includes(forb)) {
      console.error(`❌ Query "${tc.query}": Contained FORBIDDEN false-positive box ${forb}! Got: [${matchedBoxNums.join(", ")}]`);
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    console.log(`✓ Query "${tc.query}" → PERFECT! Returned: [${matchedBoxNums.join(", ")}]`);
    passedCount++;
  } else {
    failedCount++;
  }
}

console.log("==================================================");
console.log(`Summary: ${passedCount} passed, ${failedCount} failed.`);
if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL USER SEARCH QA PRECISION TESTS PASSED!");
}
