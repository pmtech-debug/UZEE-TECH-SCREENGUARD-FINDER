import Fuse from "fuse.js";
import type { Box, SearchResultItem } from "@/types/screenguard";

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

export function searchBoxes(fuse: Fuse<Box>, query: string): SearchResultItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Direct exact box number match check e.g. "box 01", "box 1", "01", "49"
  const boxMatch = trimmed.match(/^(?:box\s*)?(\d{1,3})$/i);
  if (boxMatch) {
    const num = parseInt(boxMatch[1], 10);
    const boxNumStr = `BOX ${num < 10 ? "0" + num : num}`;
    
    // Check if fuse list has this exact box
    const exactBox = fuse.getIndex().docs.find(
      (b) => b.boxNumber.toUpperCase() === boxNumStr || b.boxNumber.toUpperCase() === `BOX ${num}`
    );
    if (exactBox) {
      // Return as top score
      const fuseResults = fuse.search(trimmed);
      const filtered = fuseResults.filter((r) => r.item.id !== exactBox.id);
      return [
        { item: exactBox, score: 0, matchedModel: exactBox.boxNumber },
        ...filtered.map((r) => ({ item: r.item, score: r.score })),
      ];
    }
  }

  const results = fuse.search(trimmed);

  return results.map((res) => {
    // Find best matched model string inside compatibleModels
    const queryLower = trimmed.toLowerCase();
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

    return {
      item: res.item,
      score: res.score,
      matchedModel: bestModel || res.item.compatibleModels[0],
    };
  });
}
