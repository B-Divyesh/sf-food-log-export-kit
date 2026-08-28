import { encodeCsv } from './csv';
import type { FoodRecord, ImportIssue } from './types';

export const csvHeaders = ['date', 'type', 'meal', 'item', 'amount', 'unit', 'calories_kcal', 'protein_g', 'carbs_g', 'fat_g', 'weight_kg', 'notes', 'source'];

export function exportCsv(records: FoodRecord[]): string {
  return encodeCsv([
    csvHeaders,
    ...records.map((record) => [record.date, record.kind, record.meal, record.item, record.amount, record.unit, record.calories, record.protein_g, record.carbs_g, record.fat_g, record.weight_kg, record.notes, record.source])
  ]);
}

export function exportArchive(records: FoodRecord[], issues: ImportIssue[]) {
  return JSON.stringify({
    format: 'food-log-export-kit',
    version: 1,
    created_at: new Date().toISOString(),
    record_count: records.length,
    issue_count: issues.length,
    fields: {
      calories: 'kilocalories',
      protein_g: 'grams',
      carbs_g: 'grams',
      fat_g: 'grams',
      weight_kg: 'kilograms'
    },
    records,
    issues
  }, null, 2);
}

export async function saveText(name: string, contents: string, mime: string): Promise<void> {
  if ('__TAURI_INTERNALS__' in window) {
    const [{ save }, { writeTextFile }] = await Promise.all([import('@tauri-apps/plugin-dialog'), import('@tauri-apps/plugin-fs')]);
    const path = await save({ defaultPath: name, filters: [{ name: mime.includes('csv') ? 'CSV file' : 'JSON archive', extensions: [name.split('.').pop() ?? 'txt'] }] });
    if (path) await writeTextFile(path, contents);
    return;
  }
  const url = URL.createObjectURL(new Blob([contents], { type: mime }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
