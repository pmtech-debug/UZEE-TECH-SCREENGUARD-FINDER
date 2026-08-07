import Fuse from "fuse.js";
import type { Box, SearchResultItem } from "@/types/screenguard";

// ─── Bidirectional Brand Aliases Mapping ───────────────────────────────────────
const BRAND_ALIASES: Record<string, string[]> = {
  ip: ["iphone"],
  iphone: ["ip"],
  sam: ["samsung", "galaxy"],
  samsung: ["sam", "galaxy"],
  galaxy: ["sam", "samsung"],
  rm: ["redmi", "xiaomi"],
  redmi: ["rm", "xiaomi"],
  xiaomi: ["rm", "redmi", "xm"],
  op: ["oppo"],
  oppo: ["op"],
  vo: ["vivo"],
  vivo: ["vo"],
  "1+": ["oneplus"],
  oneplus: ["1+"],
  real: ["realme"],
  realme: ["real"],
  xm: ["xiaomi", "redmi"],
  poc: ["poco"],
  poco: ["poc"],
};

/**
 * Generates search query variations by replacing brand tokens with their aliases.
 * e.g., "Samsung A06" -> ["Samsung A06", "SAM A06", "Galaxy A06"]
 */
function expandQueryWithAliases(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tokens = trimmed.split(/\s+/);
  const variations: string[][] = [[]];

  for (const token of tokens) {
    const tokenLower = token.toLowerCase();
    const aliases = BRAND_ALIASES[tokenLower];

    const nextVariations: string[][] = [];
    const options = aliases ? [token, ...aliases] : [token];

    for (const prefix of variations) {
      for (const opt of options) {
        nextVariations.push([...prefix, opt]);
      }
    }
    variations.length = 0;
    variations.push(...nextVariations);
  }

  // Combine back into string queries, cap at 8 variations
  const queries = Array.from(
    new Set(variations.map((v) => v.join(" ")))
  ).slice(0, 8);

  return queries;
}

export function createSearchEngine(boxes: Box[]) {
  const fuseOptions = {
    keys: [
      { name: "boxNumber", weight: 0.35 },
      { name: "compatibleModels", weight: 0.45 },
      { name: "displaySize", weight: 0.15 },
      { name: "title", weight: 0.15 },
    ],
    threshold: 0.38,
    distance: 100,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeScore: true,
  };

  return new Fuse(boxes, fuseOptions);
}

export function searchBoxes(
  fuse: Fuse<Box>,
  query: string
): SearchResultItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Direct exact box number match check e.g. "box 01", "box 1", "01", "49"
  const boxMatch = trimmed.match(/^(?:box\s*)?(\d{1,3})$/i);
  if (boxMatch) {
    const num = parseInt(boxMatch[1], 10);
    const boxNumStr = `BOX ${num < 10 ? "0" + num : num}`;

    const exactBox = fuse
      .getIndex()
      .docs.find(
        (b) =>
          b.boxNumber.toUpperCase() === boxNumStr ||
          b.boxNumber.toUpperCase() === `BOX ${num}`
      );
    if (exactBox) {
      const fuseResults = fuse.search(trimmed);
      const filtered = fuseResults.filter((r) => r.item.id !== exactBox.id);
      return [
        { item: exactBox, score: 0, matchedModel: exactBox.boxNumber },
        ...filtered.map((r) => ({ item: r.item, score: r.score })),
      ];
    }
  }

  // Expand query with brand aliases (IP ↔ IPHONE, SAM ↔ SAMSUNG, RM ↔ REDMI, OP ↔ OPPO, VO ↔ VIVO, etc.)
  const expandedQueries = expandQueryWithAliases(query);

  const resultMap = new Map<
    string,
    { item: Box; score: number; matchedModel?: string }
  >();

  for (const q of expandedQueries) {
    const fuseResults = fuse.search(q);

    for (const res of fuseResults) {
      const existing = resultMap.get(res.item.id);
      const currentScore = res.score ?? 1;

      if (!existing || currentScore < existing.score) {
        // Find best matched model string inside compatibleModels
        const queryLower = q.toLowerCase();
        const queryTokens = queryLower.split(/\s+/).filter(Boolean);

        let bestModel: string | undefined;
        let maxMatchCount = 0;

        for (const model of res.item.compatibleModels) {
          const modelLower = model.toLowerCase();

          if (modelLower === queryLower) {
            bestModel = model;
            break;
          }

          let count = 0;
          for (const token of queryTokens) {
            if (modelLower.includes(token)) {
              count++;
            }
          }

          if (count > maxMatchCount) {
            maxMatchCount = count;
            bestModel = model;
          }
        }

        resultMap.set(res.item.id, {
          item: res.item,
          score: currentScore,
          matchedModel: bestModel || res.item.compatibleModels[0],
        });
      }
    }
  }

  return Array.from(resultMap.values()).sort(
    (a, b) => (a.score ?? 1) - (b.score ?? 1)
  );
}
