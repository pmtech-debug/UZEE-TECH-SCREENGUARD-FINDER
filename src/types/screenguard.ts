export interface Box {
  id: string;
  boxNumber: string;
  displaySize?: string;
  title: string;
  compatibleModels: string[];
  rawText?: string;
  category?: string;
  notes?: string;
}

export interface ScreenguardData {
  version: string;
  lastUpdated: string;
  totalBoxes: number;
  boxes: Box[];
}

export interface SearchResultItem {
  item: Box;
  score?: number;
  matchedModel?: string;
}
