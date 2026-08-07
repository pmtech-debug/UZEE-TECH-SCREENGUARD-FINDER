import { createSearchEngine, searchBoxes } from "../src/lib/search";
import * as fs from "fs";
import * as path from "path";

const jsonPath = path.resolve(process.cwd(), "src", "data", "screenguards.json");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
const fuse = createSearchEngine(data.boxes);

const testQueries = [
  { input: "SAMSUNG A06", expectedBox: "BOX 49" },
  { input: "SAM A06", expectedBox: "BOX 49" },
  { input: "IPHONE 15", expectedBox: "BOX 23" },
  { input: "IP 15", expectedBox: "BOX 23" },
  { input: "REDMI 13C", expectedBox: "BOX 49" },
  { input: "RM 13C", expectedBox: "BOX 49" },
  { input: "OPPO FIND X8", expectedBox: "BOX 91" },
  { input: "OP FIND X8", expectedBox: "BOX 91" },
  { input: "VIVO T5X", expectedBox: "BOX 106" },
  { input: "VO T5X", expectedBox: "BOX 106" },
  { input: "REALME GT2 PRO", expectedBox: "BOX 103" },
  { input: "REAL GT2 PRO", expectedBox: "BOX 103" },
  { input: "POCO F8 PRO", expectedBox: "BOX 105" },
  { input: "POC F8 PRO", expectedBox: "BOX 105" },
  { input: "XIAOMI 17 PRO MAX", expectedBox: "BOX 99" },
  { input: "XM 17 PRO MAX", expectedBox: "BOX 99" },
  { input: "ONEPLUS 15T", expectedBox: "BOX 104" },
  { input: "1+ 15T", expectedBox: "BOX 104" },
];

let passed = 0;
for (const test of testQueries) {
  const results = searchBoxes(fuse, test.input);
  const topMatch = results[0]?.item.boxNumber;
  if (topMatch === test.expectedBox) {
    console.log(`✅  "${test.input}" → ${topMatch}`);
    passed++;
  } else {
    console.error(`❌  "${test.input}" → Expected ${test.expectedBox}, got ${topMatch}`);
  }
}

if (passed === testQueries.length) {
  console.log(`\n🎉 ALL ${passed}/${testQueries.length} SEARCH ALIAS TESTS PASSED!`);
} else {
  console.error(`\n❌ ${testQueries.length - passed} tests failed`);
  process.exit(1);
}
