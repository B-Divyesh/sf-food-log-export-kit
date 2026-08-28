import { parseCsv } from './csv';
import type { FoodRecord, ImportIssue, ImportResult, RecordKind } from './types';

const aliases: Record<keyof Omit<FoodRecord, 'id' | 'source'>, string[]> = {
  kind: ['type', 'entry type', 'category'],
  date: ['date', 'day', 'timestamp', 'datetime', 'time'],
  meal: ['meal', 'meal name', 'meal_name', 'occasion', 'group'],
  item: ['food', 'food name', 'food_name', 'name', 'item', 'recipe', 'description'],
  amount: ['amount', 'quantity', 'qty', 'serving amount', 'serving_size', 'servings'],
  unit: ['unit', 'serving unit', 'serving_unit', 'measure'],
  calories: ['calories', 'kcal', 'energy', 'energy (kcal)'],
  protein_g: ['protein', 'protein (g)', 'protein_g', 'proteins'],
  carbs_g: ['carbs', 'carbohydrates', 'carbs (g)', 'carbohydrates (g)', 'carbs_g'],
  fat_g: ['fat', 'fat (g)', 'total fat', 'fat_g'],
  weight_kg: ['weight', 'weight (kg)', 'body weight', 'weight_kg'],
  notes: ['notes', 'note', 'comment']
};

const normalized = (value: string) => value.trim().toLowerCase().replaceAll(/\s+/g, ' ');
const asText = (value: unknown) => value == null ? '' : String(value).trim();

function findValue(row: Record<string, unknown>, field: keyof typeof aliases): string {
  const entries = Object.entries(row);
  const wanted = [field, ...aliases[field]].map(normalized);
  const found = entries.find(([key]) => wanted.includes(normalized(key)));
  return asText(found?.[1]);
}

function asNumber(value: string, row: number, field: string, issues: ImportIssue[]): number | null {
  if (!value) return null;
  const match = value.trim().match(/^([+-]?\d[\d.,]*)(?:\s*[a-zA-Z%]+)?$/);
  if (!match) {
    issues.push({ row, field, value, message: `“${value}” is not a number. The field was left empty.` });
    return null;
  }
  const token = match[1];
  let cleaned = token;
  let interpretation = '';
  if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(token)) {
    cleaned = token.replaceAll(',', '');
    interpretation = `“${value}” used a comma as a thousands separator. It was read as ${cleaned}.`;
  } else if (/^[+-]?\d{1,3}(\.\d{3})+,\d+$/.test(token)) {
    cleaned = token.replaceAll('.', '').replace(',', '.');
    interpretation = `“${value}” used dots for thousands and a comma for decimals. It was read as ${cleaned}.`;
  } else if (/^[+-]?\d+,\d{1,2}$/.test(token)) {
    cleaned = token.replace(',', '.');
    interpretation = `“${value}” used a comma as the decimal mark. It was read as ${cleaned}.`;
  } else if (token.includes(',')) {
    issues.push({ row, field, value, message: `“${value}” uses an ambiguous number format. The field was left empty.` });
    return null;
  }
  const result = Number(cleaned);
  if (!Number.isFinite(result)) {
    issues.push({ row, field, value, message: `“${value}” is not a number. The field was left empty.` });
    return null;
  }
  if (interpretation) issues.push({ row, field, value, message: interpretation });
  if (result < 0) issues.push({ row, field, value, message: `A negative value was kept for ${field}. Check it against the source file.` });
  return result;
}

function asDate(value: string, row: number, issues: ImportIssue[]): string {
  if (!value) {
    issues.push({ row, field: 'date', message: 'No date was found. Add one before relying on timeline order.' });
    return '';
  }
  const iso = value.match(/^(\d{4}-\d{2}-\d{2})(?:$|[T\s])/)?.[1];
  if (iso) {
    const parsedIso = new Date(`${iso}T00:00:00Z`);
    if (!Number.isNaN(parsedIso.getTime()) && parsedIso.toISOString().slice(0, 10) === iso) return iso;
    issues.push({ row, field: 'date', value, message: `“${value}” is not a real calendar date. The original value was kept in notes.` });
    return '';
  }
  if (/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(value)) {
    issues.push({ row, field: 'date', value, message: `“${value}” has an ambiguous day and month order. Use YYYY-MM-DD. The original value was kept in notes.` });
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    issues.push({ row, field: 'date', value, message: `“${value}” could not be read as a date. The original value was kept in notes.` });
    return '';
  }
  return parsed.toISOString().slice(0, 10);
}

function mapRecord(row: Record<string, unknown>, index: number, source: string, issues: ImportIssue[]): FoodRecord | null {
  const item = findValue(row, 'item');
  const weight = findValue(row, 'weight_kg');
  if (!item && !weight) {
    issues.push({ row: index, field: 'row', message: 'No food, recipe, or weight was found. This row was not exported.' });
    return null;
  }
  const rawKind = findValue(row, 'kind').toLowerCase();
  const meal = findValue(row, 'meal');
  const kind: RecordKind = rawKind.includes('recipe') ? 'recipe' : rawKind.includes('weight') || !!weight || meal.toLowerCase() === 'weight' ? 'weight' : 'meal';
  const dateRaw = findValue(row, 'date');
  const date = asDate(dateRaw, index, issues);
  const note = findValue(row, 'notes');
  return {
    id: `${source}-${index}-${dateRaw}-${item || weight}`.replace(/[^a-z0-9-]/gi, '').slice(0, 80),
    kind,
    date,
    meal: kind === 'weight' ? '' : meal,
    item: item || 'Body weight',
    amount: findValue(row, 'amount'),
    unit: findValue(row, 'unit'),
    calories: asNumber(findValue(row, 'calories'), index, 'calories', issues),
    protein_g: asNumber(findValue(row, 'protein_g'), index, 'protein', issues),
    carbs_g: asNumber(findValue(row, 'carbs_g'), index, 'carbohydrates', issues),
    fat_g: asNumber(findValue(row, 'fat_g'), index, 'fat', issues),
    weight_kg: asNumber(weight || (kind === 'weight' ? findValue(row, 'amount') : ''), index, 'weight', issues),
    source,
    notes: !date && dateRaw ? [note, `Original date: ${dateRaw}`].filter(Boolean).join('; ') : note
  };
}

function objectsFromJson(input: unknown): Record<string, unknown>[] {
  if (Array.isArray(input)) return input.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
  if (!input || typeof input !== 'object') return [];
  const object = input as Record<string, unknown>;
  for (const key of ['entries', 'records', 'meals', 'foods', 'items', 'data']) {
    if (Array.isArray(object[key])) return objectsFromJson(object[key]);
  }
  return [object];
}

export function importText(text: string, filename: string): ImportResult {
  const issues: ImportIssue[] = [];
  const trimmed = text.trim();
  if (!trimmed) throw new Error('The file is empty. Export it from your tracker again, then choose the new file.');
  let objects: Record<string, unknown>[];
  let detectedFormat: string;
  if (filename.toLowerCase().endsWith('.json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    let parsed: unknown;
    try { parsed = JSON.parse(trimmed); }
    catch { throw new Error('The JSON file is incomplete or damaged. Choose an unedited export from your tracker.'); }
    objects = objectsFromJson(parsed);
    detectedFormat = 'JSON archive';
  } else {
    const rows = parseCsv(trimmed);
    if (rows.length < 2) throw new Error('The CSV has a heading row but no entries. Choose an export that contains your history.');
    const headers = rows[0];
    if (!headers.some((header) => [...aliases.item, ...aliases.weight_kg].includes(normalized(header)))) {
      throw new Error('No food or weight column was found. Use a CSV with a Food, Name, Item, Recipe, or Weight heading.');
    }
    objects = rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
    detectedFormat = 'Delimited CSV';
  }
  const records = objects.map((row, index) => mapRecord(row, index + 2, filename, issues)).filter((record): record is FoodRecord => record !== null);
  if (!records.length) throw new Error('No usable food, recipe, or weight entries were found. Check the file and try another export.');
  return { records, issues, source: filename, detectedFormat, totalRows: objects.length };
}
