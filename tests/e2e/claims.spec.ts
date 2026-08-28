import { expect, test } from '@playwright/test';

test('@claim:csv-export exports one CSV row per sample entry', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: '12 entries are ready' })).toBeVisible();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  let csv = '';
  for await (const chunk of stream) csv += chunk.toString();
  expect(csv.split('\r\n')).toHaveLength(13);
  expect(csv).toContain('date,type,meal,item,amount,unit,calories_kcal');
  expect(csv).toContain('Oatmeal with blueberries');
});

test('@claim:json-archive exports every normalized field and note', async ({ page }) => {
  await page.goto('/demo');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  const archive = JSON.parse(body);
  expect(archive.format).toBe('food-log-export-kit');
  expect(archive.records).toHaveLength(12);
  expect(archive.records[0]).toHaveProperty('protein_g');
  expect(archive).toHaveProperty('issues');
});

test('@claim:local-only demo conversion sends no cross-origin request', async ({ page }) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'All entries' }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await downloadEvent;
  expect(crossOrigin).toEqual([]);
});

test('@claim:format-import reads CSV, semicolon CSV, and JSON', async ({ page }) => {
  await page.goto('/app');
  const input = page.locator('#file-input');
  await input.setInputFiles({ name: 'semicolon.csv', mimeType: 'text/csv', buffer: Buffer.from('Date;Food;Calories\n2025-02-01;Bean stew;330') });
  await expect(page.getByText('Bean stew')).toBeVisible();
  await page.getByRole('button', { name: 'Clear this import' }).click();
  await page.locator('#file-input').setInputFiles({ name: 'archive.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ entries: [{ date: '2025-02-02', name: 'Rice bowl', kcal: 410 }] })) });
  await expect(page.getByText('Rice bowl')).toBeVisible();
});

test('@claim:batch-import combines multiple files with a valid cached license', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:food-log-export-kit', 'test-license');
    localStorage.setItem('sb_license:food-log-export-kit:verdict', JSON.stringify({ valid: true, checked: Date.now() }));
  });
  await page.goto('/app');
  await page.locator('#file-input').setInputFiles([
    { name: 'year-one.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Food,Calories\n2024-01-01,Soup,180') },
    { name: 'year-two.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify([{ date: '2025-01-01', name: 'Rice bowl', kcal: 410 }])) }
  ]);
  await expect(page.getByRole('heading', { name: '2 entries are ready' })).toBeVisible();
  await expect(page.getByText('2 source files')).toBeVisible();
});

test('@claim:explained-drops lists every unusable row', async ({ page }) => {
  await page.goto('/app');
  await page.locator('#file-input').setInputFiles({ name: 'mixed.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Food,Calories\n2025-01-01,Soup,180\n2025-01-02,,200') });
  await expect(page.getByText('1 entries are ready')).toBeVisible();
  await expect(page.getByText('Review 1 conversion note')).toBeVisible();
  await page.getByText('Review 1 conversion note').click();
  await expect(page.getByText('No food, recipe, or weight was found. This row was not exported.')).toBeVisible();
});

test('@claim:offline-reload reopens the demo without a network', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/demo');
  await expect(page.getByText('Oatmeal with blueberries')).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  expect(errors).toEqual([]);
  await expect(page.getByText('Oatmeal with blueberries')).toBeVisible();
  await expect(page.getByText('You are offline')).toBeVisible();
});
