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

  it('rejects impossible ISO calendar dates without losing the original value', () => {
    const result = importText('Date,Food\n2025-99-99,Impossible date', 'history.csv');
    expect(result.records[0]).toMatchObject({ date: '', notes: 'Original date: 2025-99-99' });
    expect(result.issues).toContainEqual(expect.objectContaining({ field: 'date', value: '2025-99-99' }));
  });

  it('interprets grouped comma numbers explicitly and flags negative nutrition', () => {
    const result = importText('Date,Food,Calories,Protein\n2025-01-01,Soup,"1,234",-5', 'history.csv');
    expect(result.records[0]).toMatchObject({ calories: 1234, protein_g: -5 });
    expect(result.issues.map((issue) => issue.message)).toEqual(expect.arrayContaining([
      expect.stringContaining('comma as a thousands separator'),
      expect.stringContaining('negative value was kept')
    ]));
  });

  it('explains unusable rows', () => {
    const result = importText('Date,Food,Calories\n2025-01-01,Soup,180\n2025-01-02,,220', 'history.csv');
    expect(result.records).toHaveLength(1);
    expect(result.issues).toHaveLength(1);
    expect(result.totalRows).toBe(2);
  });

  it('preserves populated unmapped fields and names their source row', () => {
    const result = importText('Date,Food,Calories,Fiber,Unused\n2026-08-29,Bean bowl,430,12,', 'tracker.csv');
    expect(result.records[0].unmapped_fields).toEqual({ Fiber: '12' });
    expect(result.issues).toContainEqual(expect.objectContaining({
      row: 2,
      field: 'Fiber',
      value: '12',
      message: expect.stringContaining('tracker.csv')
    }));
    expect(result.issues.some((issue) => issue.field === 'Unused')).toBe(false);
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
