export interface Drug {
  id: string;
  name: string;
  company: string;
  ingredient: string;
  effect: string;
  dosage: string;
  caution: string;
  category: string;
  shape: string;
}

export interface DrugSearchResponse {
  results: Drug[];
  total: number;
}

export type DrugSearchMode = "name" | "ingredient";
