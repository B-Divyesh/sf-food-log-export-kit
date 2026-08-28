export type RecordKind = 'meal' | 'recipe' | 'weight';

export interface FoodRecord {
  id: string;
  kind: RecordKind;
  date: string;
  meal: string;
  item: string;
  amount: string;
  unit: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  weight_kg: number | null;
  source: string;
  notes: string;
}

export interface ImportIssue {
  row: number;
  field: string;
  message: string;
  value?: string;
}

export interface ImportResult {
  records: FoodRecord[];
  issues: ImportIssue[];
  source: string;
  detectedFormat: string;
  totalRows: number;
}
