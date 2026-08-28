export function detectDelimiter(text: string): string {
  const line = text.replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0] ?? '';
  const candidates = [',', ';', '\t'];
  return candidates.reduce((best, value) => countOutsideQuotes(line, value) > countOutsideQuotes(line, best) ? value : best, ',');
}

function countOutsideQuotes(line: string, needle: string): number {
  let quoted = false;
  let count = 0;
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === '"') {
      if (quoted && line[i + 1] === '"') i += 1;
      else quoted = !quoted;
    } else if (!quoted && line[i] === needle) count += 1;
  }
  return count;
}

export function parseCsv(text: string): string[][] {
  const delimiter = detectDelimiter(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) { row.push(field.trim()); field = ''; }
    else if (char === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ''; }
    else if (char !== '\r') field += char;
  }
  if (field.length || row.length) { row.push(field.trim()); rows.push(row); }
  return rows.filter((values) => values.some(Boolean));
}

export function encodeCsv(rows: Array<Array<string | number | null>>): string {
  return rows.map((row) => row.map((value) => {
    const raw = value == null ? '' : String(value);
    return /[",\n\r]/.test(raw) ? `"${raw.replaceAll('"', '""')}"` : raw;
  }).join(',')).join('\r\n');
}
