import { describe, expect, it } from 'vitest';
import { parseCsv } from '../../src/csv';
import { exportArchive, exportCsv } from '../../src/exporter';
import { importText } from '../../src/importer';

describe('CSV parser', () => {
  it('reads quoted commas, newlines, and escaped quotes', () => {
    expect(parseCsv('Date,Food,Notes\n2025-01-01,"Soup, tomato","said ""good"""')).toEqual([
      ['Date', 'Food', 'Notes'],
      ['2025-01-01', 'Soup, tomato', 'said "good"']
    ]);
  });

  it('detects semicolon exports', () => {
    const result = importText('Date;Food;Calories\n2025-01-01;Soup;180', 'history.csv');
    expect(result.records[0]).toMatchObject({ item: 'Soup', calories: 180 });
  });
});

describe('normalization', () => {
  it('reads a JSON archive list and flags bad dates', () => {
    const result = importText(JSON.stringify({ entries: [{ date: 'not-a-date', name: 'Porridge', kcal: '320 kcal' }] }), 'food.json');
    expect(result.records[0]).toMatchObject({ item: 'Porridge', calories: 320, date: '' });
    expect(result.issues.some((issue) => issue.field === 'date')).toBe(true);
  });

  it('explains unusable rows', () => {
    const result = importText('Date,Food,Calories\n2025-01-01,Soup,180\n2025-01-02,,220', 'history.csv');
    expect(result.records).toHaveLength(1);
    expect(result.issues).toHaveLength(1);
    expect(result.totalRows).toBe(2);
  });

  it('rejects empty and unknown files in plain words', () => {
    expect(() => importText('', 'empty.csv')).toThrow('file is empty');
    expect(() => importText('x,y\n1,2', 'unknown.csv')).toThrow('No food or weight column');
  });
});

describe('exports', () => {
  const result = importText('Date,Meal,Food,Calories\n2025-01-01,Lunch,"Soup, tomato",180', 'history.csv');

  it('writes a stable spreadsheet CSV', () => {
    const csv = exportCsv(result.records);
    expect(csv.split('\r\n')).toHaveLength(2);
    expect(csv).toContain('"Soup, tomato"');
  });

  it('writes a versioned JSON archive', () => {
    const archive = JSON.parse(exportArchive(result.records, result.issues));
    expect(archive).toMatchObject({ format: 'food-log-export-kit', version: 1, record_count: 1 });
  });
});
