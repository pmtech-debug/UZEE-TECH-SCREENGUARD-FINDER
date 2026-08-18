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
  moto: ["motorola"],
  motorola: ["moto"],
};

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

/**
 * Normalizes text for model token comparisons.
 * Standardizes common model variations e.g. "S24 FE" <-> "S24FE"
 */
function normalizeText(text: string): string {
  let t = text.toLowerCase().trim();
  t = t.replace(
    /\b(s|a|m|n|x|z|g|y|t|c|v|f|p|r|e|k|i|q|b)(\d+)\s*(fe|pro|plus|max|lite|ultra|gt|se|neo|5g|4g|i|s|g|t|c)\b/gi,
    "$1$2 $3"
  );
  return t;
}

/**
 * Tests if a compatible model string genuinely matches the search query.
 */
function matchModelString(
  query: string,
  model: string
): { isMatch: boolean; score: number } {
  const qNorm = normalizeText(query);
  const mNorm = normalizeText(model);

  const qTokens = qNorm.split(/\s+/).filter(Boolean);
  if (qTokens.length === 0) return { isMatch: false, score: 1 };

  // Identify brand tokens in query
  const qBrands = new Set<string>();
  const qModelTokens: string[] = [];

  for (const token of qTokens) {
    if (BRAND_ALIASES[token]) {
      qBrands.add(token);
      for (const alias of BRAND_ALIASES[token]) {
        qBrands.add(alias);
      }
    } else {
      qModelTokens.push(token);
    }
  }

  // If query contains brand token(s), model MUST match at least one brand alias
  if (qBrands.size > 0) {
    const hasBrand = Array.from(qBrands).some((b) => mNorm.includes(b));
    if (!hasBrand) return { isMatch: false, score: 1 };
  }

  // If query contains only brand (e.g. "Samsung"), match all models of that brand
  if (qModelTokens.length === 0) {
    return { isMatch: true, score: 0.1 };
  }

  // Check each non-brand model token against model string with strict digit boundaries
  for (const qt of qModelTokens) {
    const qtUnspaced = qt.replace(/\s+/g, "");

    // Regex pattern: word boundary before, and no trailing digit if qt ends in digit
    const endsWithDigit = /\d$/.test(qt);
    const patternStr =
      "\\b" +
      qt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      (endsWithDigit ? "(?!\\d)" : "\\b");
    const pattern = new RegExp(patternStr, "i");

    const mUnspaced = mNorm.replace(/\s+/g, "");
    const patternUnspacedStr =
      "\\b" +
      qtUnspaced.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      (endsWithDigit ? "(?!\\d)" : "\\b");
    const patternUnspaced = new RegExp(patternUnspacedStr, "i");

    const isTokenMatch = pattern.test(mNorm) || patternUnspaced.test(mUnspaced);

    if (!isTokenMatch) {
      return { isMatch: false, score: 1 };
    }
  }

  // Calculate score for ranking (lower is better)
  if (qNorm === mNorm) {
    return { isMatch: true, score: 0.0 }; // Exact match
  }

  // Base model match (e.g. "iPhone 16 6.1" for query "iPhone 16")
  if (mNorm.startsWith(qNorm + " ")) {
    return { isMatch: true, score: 0.01 };
  }

  return { isMatch: true, score: 0.05 };
}

export function searchBoxes(
  fuse: Fuse<Box>,
  query: string
): SearchResultItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Extract all boxes from Fuse index
  const boxes: Box[] = fuse.getIndex().docs as Box[];

  // 1. Direct exact Box Number match check e.g. "box 01", "box 1", "01", "49", "SD-F050"
  const boxMatch = trimmed.match(/^(?:box\s*|sd-f)?(\d{1,3})$/i);
  if (boxMatch) {
    const num = parseInt(boxMatch[1], 10);
    const formattedBoxNum = `BOX ${num < 10 ? "00" + num : num < 100 ? "0" + num : num}`;
    const altBoxNum = `BOX ${num < 10 ? "0" + num : num}`;
    const idMatch = `SD-F${num < 10 ? "00" + num : num < 100 ? "0" + num : num}`;

    const exactBoxes = boxes.filter(
      (b) =>
        b.boxNumber.toUpperCase() === formattedBoxNum ||
        b.boxNumber.toUpperCase() === altBoxNum ||
        b.boxNumber.toUpperCase() === `BOX ${num}` ||
        b.id.toUpperCase() === idMatch
    );

    if (exactBoxes.length > 0) {
      return exactBoxes.map((b) => ({
        item: b,
        score: 0,
        matchedModel: b.boxNumber,
      }));
    }
  }

  // 2. High-precision Model Matching
  const precisionResults: SearchResultItem[] = [];

  for (const box of boxes) {
    let bestScore = 1;
    let bestMatchedModel: string | undefined;

    for (const model of box.compatibleModels) {
      const match = matchModelString(trimmed, model);
      if (match.isMatch && match.score < bestScore) {
        bestScore = match.score;
        bestMatchedModel = model;
      }
    }

    if (bestScore < 1 && bestMatchedModel) {
      precisionResults.push({
        item: box,
        score: bestScore,
        matchedModel: bestMatchedModel,
      });
    }
  }

  // Helper for stock status priority rank
  const getStockRank = (box: Box) => {
    const verified = box.stockCountVerified ?? false;
    const qty = box.stockQuantity ?? 0;
    if (!verified) return 2; // NOT_COUNTED
    if (qty >= 4) return 0;  // IN_STOCK
    if (qty >= 1) return 1;  // LOW_STOCK
    return 3;               // OUT_OF_STOCK
  };

  // If precision matching found genuine results, return them sorted by match score, then stock status, then box number
  if (precisionResults.length > 0) {
    return precisionResults.sort(
      (a, b) =>
        (a.score ?? 1) - (b.score ?? 1) ||
        getStockRank(a.item) - getStockRank(b.item) ||
        a.item.boxNumber.localeCompare(b.item.boxNumber)
    );
  }

  // 3. Fallback to Fuse fuzzy search ONLY if no precision model matches exist
  const fuseResults = fuse.search(trimmed);
  return fuseResults
    .map((r) => ({
      item: r.item,
      score: r.score,
      matchedModel: r.item.compatibleModels[0],
    }))
    .sort(
      (a, b) =>
        (a.score ?? 1) - (b.score ?? 1) ||
        getStockRank(a.item) - getStockRank(b.item) ||
        a.item.boxNumber.localeCompare(b.item.boxNumber)
    );
}

