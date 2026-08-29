import { exportArchive, exportCsv, saveText } from './exporter';
import { icons } from './icons';
import { importText } from './importer';
import { checkoutUrl, optimisticLicense, storedLicense, verifyLicense } from './license';
import { sampleCsv } from './sample';
import { footer } from './shell';
import type { FoodRecord, ImportIssue } from './types';

interface AppState {
  records: FoodRecord[];
  issues: ImportIssue[];
  sources: string[];
  demo: boolean;
  licensed: boolean;
  error: string;
  notice: string;
  status: string;
  filter: 'all' | 'meal' | 'recipe' | 'weight';
}

const emptyState = (demo: boolean): AppState => ({ records: [], issues: [], sources: [], demo, licensed: demo ? false : optimisticLicense(), error: '', notice: '', status: '', filter: 'all' });
let state = emptyState(false);

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char);
const number = (value: number | null, suffix = '') => value == null ? '<span class="missing">—</span>' : `${value.toLocaleString()}${suffix}`;

function totals(records: FoodRecord[]) {
  return {
    meals: records.filter((record) => record.kind === 'meal').length,
    recipes: records.filter((record) => record.kind === 'recipe').length,
    weights: records.filter((record) => record.kind === 'weight').length,
    dates: new Set(records.map((record) => record.date).filter(Boolean)).size
  };
}

function appHeader(): string {
  return `<header class="app-header">
    <a class="wordmark" href="/" data-link aria-label="Food Log Export Kit home"><span class="wordmark-mark" aria-hidden="true">F</span><span>Food Log <b>Export Kit</b></span></a>
    <div class="app-header-actions"><span class="local-badge">${icons.shield} On this device</span><nav aria-label="Main navigation"><a href="/" data-link>Home</a><a href="/demo" data-link ${state.demo ? 'aria-current="page"' : ''}>Demo</a><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a></nav></div>
  </header>`;
}

function demoBanner(): string {
  if (!state.demo) return '';
  return `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span>Try every export with this separate sample.</span><div><button class="text-button" id="reset-demo">Reset demo</button><a class="text-button" href="/app" data-link>Start for real</a></div></aside>`;
}

function steps(): string {
  const active = state.records.length ? 2 : 1;
  return `<ol class="stage-rail" aria-label="Archive stages">
    <li class="${active === 1 ? 'active' : 'done'}"><span>1</span><div><b>Import</b><small>Choose exports</small></div></li>
    <li class="${active === 2 ? 'active' : ''}"><span>2</span><div><b>Review</b><small>Check every row</small></div></li>
    <li><span>3</span><div><b>Export</b><small>Save CSV + JSON</small></div></li>
    <li><span>4</span><div><b>Keep</b><small>Store anywhere</small></div></li>
  </ol>`;
}

function demoFirstRecord(): string {
  if (!state.demo || !state.records.length) return '';
  const record = state.records[0];
  return `<article class="demo-first-record" aria-label="Sample record"><span>14 Apr · Breakfast</span><b>${escapeHtml(record.item)}</b><strong>${number(record.calories)} kcal</strong><small>Sample record ready to review</small></article>`;
}

function emptyPanel(): string {
  return `<section class="import-panel" aria-labelledby="import-title">
    <div class="import-copy"><p class="eyebrow">Stage 1 · Import</p><h2 id="import-title">Choose a tracker export</h2><p>Use a CSV or JSON file you exported from your food tracker. We check its headings before reading any entries.</p>
      <div class="support-row"><span>${icons.check} CSV with comma, semicolon, or tabs</span><span>${icons.check} JSON lists and archives</span><span>${icons.check} Dot decimals; comma formats are explained in notes</span></div>
    </div>
    <div class="drop-zone" id="drop-zone">
      <span class="large-icon">${icons.file}</span><h3>Drop your export here</h3><p>or choose it from this device</p>
      <button class="primary-button" id="choose-file">Choose export</button>
      <input class="visually-hidden" id="file-input" aria-label="Choose a tracker export" type="file" accept=".csv,.json,text/csv,application/json" ${state.licensed ? 'multiple' : ''} />
      <small>Your file stays on this device.</small>
    </div>
    ${!state.demo ? `<button class="sample-link" id="load-sample">No export nearby? Load sample data</button>` : ''}
    ${state.error ? `<div class="error-box" role="alert">${icons.warn}<div><b>The file could not be imported.</b><p>${escapeHtml(state.error)}</p></div></div>` : ''}
  </section>`;
}

function reviewPanel(): string {
  const summary = totals(state.records);
  const shown = state.filter === 'all' ? state.records : state.records.filter((record) => record.kind === state.filter);
  return `<section class="review-panel" aria-labelledby="review-title">
    <div class="review-heading"><div><p class="eyebrow">Stage 2 · Review</p><h2 id="review-title">${state.records.length} entries are ready</h2><p>${state.sources.length} source ${state.sources.length === 1 ? 'file' : 'files'} · ${state.issues.length ? `${state.issues.length} notes need a look` : 'No conversion notes'}</p></div>
      <button class="secondary-button" id="add-file">${icons.file} Add another file</button><input class="visually-hidden" id="file-input" aria-label="Choose another tracker export" type="file" accept=".csv,.json,text/csv,application/json" ${state.licensed ? 'multiple' : ''} />
    </div>
    <div class="summary-strip" aria-label="Import summary"><div><strong>${summary.meals}</strong><span>meals</span></div><div><strong>${summary.recipes}</strong><span>recipes</span></div><div><strong>${summary.weights}</strong><span>weights</span></div><div><strong>${summary.dates}</strong><span>days</span></div></div>
    ${state.issues.length ? `<details class="issues"><summary>${icons.warn} Review ${state.issues.length} conversion ${state.issues.length === 1 ? 'note' : 'notes'}</summary><ol>${state.issues.map((issue) => `<li><b>${issue.row > 0 ? `Row ${issue.row}: ${escapeHtml(issue.field)}` : `File: ${escapeHtml(issue.field)}`}</b><span>${escapeHtml(issue.message)}</span></li>`).join('')}</ol></details>` : `<p class="success-line">${icons.check} No rows or populated fields need a conversion note.</p>`}
    <div class="table-tools"><div class="filter-group" role="group" aria-label="Filter entries">${(['all', 'meal', 'recipe', 'weight'] as const).map((filter) => `<button class="filter ${state.filter === filter ? 'selected' : ''}" data-filter="${filter}">${filter === 'all' ? 'All entries' : `${filter[0].toUpperCase()}${filter.slice(1)}s`}</button>`).join('')}</div><span>${shown.length} shown</span></div>
    <div class="record-table-wrap"><table class="record-table"><caption class="sr-only">Normalized food log entries</caption><thead><tr><th>Date</th><th>Meal</th><th>Item</th><th>Amount</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead><tbody>${shown.map((record) => `<tr><td data-label="Date">${escapeHtml(record.date || 'Date missing')}</td><td data-label="Meal">${escapeHtml(record.kind === 'weight' ? 'Weight' : record.meal || '—')}</td><td data-label="Item"><b>${escapeHtml(record.item)}</b>${record.notes ? `<small>${escapeHtml(record.notes)}</small>` : ''}</td><td data-label="Amount">${escapeHtml([record.amount, record.unit].filter(Boolean).join(' ') || '—')}</td><td data-label="Calories">${number(record.calories)}</td><td data-label="Protein">${number(record.protein_g, ' g')}</td><td data-label="Carbs">${number(record.carbs_g, ' g')}</td><td data-label="Fat">${number(record.fat_g, ' g')}</td></tr>`).join('')}</tbody></table></div>
    <div class="export-bar"><div><p class="eyebrow">Stage 3 · Export</p><h3>Save your archive</h3><p>CSV opens in spreadsheets. JSON keeps normalized fields, unmapped values, and conversion notes.</p></div><div class="export-actions"><button class="primary-button" id="export-csv">${icons.download} Export CSV</button><button class="secondary-button" id="export-json">${icons.archive} Export JSON</button></div></div>
    <button class="danger-link" id="clear-import">Clear this import</button>
  </section>`;
}

function licensePanel(): string {
  if (state.demo) return '';
  return `<aside class="license-panel"><div><span class="archive-stamp">${state.licensed ? 'LICENSE ACTIVE' : 'OPTIONAL'}</span><h2>${state.licensed ? 'Batch-import license is active' : 'Import several exports together'}</h2><p>${state.licensed ? 'Choose several CSV or JSON files in one step.' : 'The free app handles one file at a time. A $19 one-time batch-import license adds multi-file selection.'}</p></div>${state.licensed ? '<span class="licensed-mark">✓ Licensed</span>' : `<div class="license-actions"><a class="small-button" href="${checkoutUrl()}" rel="external">Buy the batch-import license</a><button class="text-button" id="show-license">Have a license?</button></div>`}<form id="license-form" class="license-form hidden"><label for="license-token">License token</label><div><input id="license-token" name="license" autocomplete="off" required /><button class="small-button">Verify license</button></div></form></aside>`;
}

export function renderApp(root: HTMLElement, demo: boolean): void {
  if (state.demo !== demo) state = emptyState(demo);
  if (demo && !state.records.length) loadSample(false);
  document.title = `${demo ? 'Demo' : 'Archive'} — Food Log Export Kit`;
  root.innerHTML = `${appHeader()}${demoBanner()}<main id="main" class="app-main"><div class="app-title"><div><p class="eyebrow">Private archive workspace</p><h1 tabindex="-1">Save your food history</h1><p>Check a tracker export, fix surprises, then keep a CSV and JSON copy.</p></div><span class="connection-status" id="connection">${navigator.onLine ? '● Ready offline' : '○ You are offline'}</span></div>${demoFirstRecord()}${steps()}${state.notice ? `<p class="notice" role="status">${escapeHtml(state.notice)}</p>` : ''}${state.records.length ? reviewPanel() : emptyPanel()}${licensePanel()}</main>${footer()}<div id="app-status" class="sr-only" aria-live="polite">${escapeHtml(state.status)}</div>`;
  bindApp(root);
}

function loadSample(render = true): void {
  const result = importText(sampleCsv, 'sample-food-history.csv');
  state.records = result.records;
  state.issues = result.issues;
  state.sources = [result.source];
  state.error = '';
  state.status = `${result.records.length} sample entries loaded.`;
  if (render) rerender();
}

let currentRoot: HTMLElement | null = null;
function rerender() { if (currentRoot) renderApp(currentRoot, state.demo); }

async function readFiles(files: FileList | File[]): Promise<void> {
  const list = Array.from(files);
  if (!list.length) return;
  if (!state.licensed && list.length > 1) state.notice = 'The free app imports one file at a time. Only the first file was opened.';
  const selected = state.licensed ? list : list.slice(0, 1);
  state.error = '';
  const failures: string[] = [];
  let imported = 0;
  for (const file of selected) {
    try {
      const result = importText(await file.text(), file.name);
      state.records.push(...result.records);
      state.issues.push(...result.issues);
      state.sources.push(file.name);
      imported += result.records.length;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The file could not be read. Choose another export.';
      failures.push(`${file.name}: ${message}`);
      state.issues.push({ row: 0, field: file.name, value: file.name, message: `This file was not imported. ${message}` });
    }
  }
  if (!state.records.length && failures.length) state.error = failures.join(' ');
  state.status = `${imported} ${imported === 1 ? 'entry' : 'entries'} imported.${failures.length ? ` ${failures.length} ${failures.length === 1 ? 'file needs' : 'files need'} a look.` : ''}`;
  rerender();
}

function bindApp(root: HTMLElement): void {
  currentRoot = root;
  const input = root.querySelector<HTMLInputElement>('#file-input');
  root.querySelector('#choose-file')?.addEventListener('click', () => input?.click());
  root.querySelector('#add-file')?.addEventListener('click', () => input?.click());
  input?.addEventListener('change', () => input.files && void readFiles(input.files));
  const drop = root.querySelector('#drop-zone');
  drop?.addEventListener('dragover', (event) => { event.preventDefault(); drop.classList.add('dragging'); });
  drop?.addEventListener('dragleave', () => drop.classList.remove('dragging'));
  drop?.addEventListener('drop', (event) => { event.preventDefault(); drop.classList.remove('dragging'); if ((event as DragEvent).dataTransfer?.files) void readFiles((event as DragEvent).dataTransfer!.files); });
  root.querySelector('#load-sample')?.addEventListener('click', () => loadSample());
  root.querySelector('#reset-demo')?.addEventListener('click', () => { state = emptyState(true); loadSample(); });
  root.querySelector('#clear-import')?.addEventListener('click', () => { state.records = []; state.issues = []; state.sources = []; state.status = 'The imported entries were cleared.'; rerender(); });
  root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => button.addEventListener('click', () => { state.filter = button.dataset.filter as AppState['filter']; rerender(); }));
  root.querySelector('#export-csv')?.addEventListener('click', async () => { await saveText('food-log.csv', exportCsv(state.records), 'text/csv;charset=utf-8'); state.status = `CSV exported with ${state.records.length} entries.`; announce(); });
  root.querySelector('#export-json')?.addEventListener('click', async () => { await saveText('food-log-archive.json', exportArchive(state.records, state.issues), 'application/json'); state.status = `JSON archive exported with ${state.records.length} entries.`; announce(); });
  root.querySelector('#show-license')?.addEventListener('click', () => { root.querySelector('#license-form')?.classList.remove('hidden'); root.querySelector<HTMLInputElement>('#license-token')?.focus(); });
  root.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async (event) => { event.preventDefault(); const token = root.querySelector<HTMLInputElement>('#license-token')?.value ?? ''; state.notice = 'Checking the license…'; rerender(); const result = await verifyLicense(token); state.licensed = result.licensed; state.notice = result.licensed ? 'License verified. Batch import is ready.' : result.notice || 'That license could not be verified.'; rerender(); });
}

function announce() { const live = document.querySelector('#app-status'); if (live) live.textContent = state.status; }

window.addEventListener('online', () => { const value = document.querySelector('#connection'); if (value) value.textContent = '● Ready offline'; });
window.addEventListener('offline', () => { const value = document.querySelector('#connection'); if (value) value.textContent = '○ You are offline'; });

export function startApp(root: HTMLElement, demo: boolean): void {
  state = emptyState(demo);
  if (!demo && storedLicense()) void verifyLicense().then((result) => { state.licensed = result.licensed; state.notice = result.notice; rerender(); });
  renderApp(root, demo);
}
