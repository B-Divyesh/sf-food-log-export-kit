import { expect, test } from '@playwright/test';

const licenseKey = 'sb_license:food-log-export-kit';
const verdictKey = `${licenseKey}:verdict`;

test('@claim:csv-export exports one CSV row per sample entry', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: '12 entries are ready' })).toBeVisible();
  const summary = page.getByLabel('Import summary');
  await expect(summary).toContainText('11meals');
  await expect(summary).toContainText('0recipes');
  await expect(summary).toContainText('1weights');
  await expect(summary).toContainText('4days');
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

test('@claim:json-archive exports every consistent field and note', async ({ page }) => {
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

test('@claim:demo-discard keeps sample data isolated and discards it on exit', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('real-workspace-probe', 'untouched'));
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: '12 entries are ready' })).toBeVisible();
  await page.getByRole('button', { name: 'Recipes' }).click();
  await expect(page.getByText('0 shown')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('12 shown')).toBeVisible();
  const keysDuringDemo = await page.evaluate(() => Object.keys(localStorage));
  expect(keysDuringDemo).toEqual(['real-workspace-probe']);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole('heading', { name: 'Choose a tracker export' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /entries are ready/ })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('real-workspace-probe'))).toBe('untouched');
});

test('@claim:privacy-no-account runs without an account, analytics, or tracking', async ({ page, context }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/app');
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.getByText(/sign in|log in|create account/i)).toHaveCount(0);
  await page.getByRole('button', { name: 'Load sample data' }).click();
  await expect(page.getByRole('heading', { name: '12 entries are ready' })).toBeVisible();
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const remoteScripts = await page.locator('script[src]').evaluateAll((scripts) => scripts.map((script) => (script as HTMLScriptElement).src).filter((src) => new URL(src).origin !== location.origin));
  expect(remoteScripts).toEqual([]);
});

test('@claim:format-import reads comma, semicolon, tab CSV, and JSON', async ({ page }) => {
  await page.goto('/app');
  const input = page.locator('#file-input');
  await input.setInputFiles({ name: 'comma.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Food,Calories\n2025-01-31,Tomato soup,210') });
  await expect(page.getByText('Tomato soup')).toBeVisible();
  await page.getByRole('button', { name: 'Clear this import' }).click();
  await input.setInputFiles({ name: 'semicolon.csv', mimeType: 'text/csv', buffer: Buffer.from('Date;Food;Calories\n2025-02-01;Bean stew;330') });
  await expect(page.getByText('Bean stew')).toBeVisible();
  await page.getByRole('button', { name: 'Clear this import' }).click();
  await page.locator('#file-input').setInputFiles({ name: 'tab.csv', mimeType: 'text/tab-separated-values', buffer: Buffer.from('Date\tFood\tCalories\n2025-02-02\tMushroom toast\t275') });
  await expect(page.getByText('Mushroom toast')).toBeVisible();
  await page.getByRole('button', { name: 'Clear this import' }).click();
  const jsonShapes = [
    [{ date: '2025-02-03', name: 'Array rice', kcal: 410 }],
    ...['entries', 'records', 'meals', 'foods', 'items', 'data'].map((key, index) => ({ [key]: [{ date: `2025-02-${String(index + 4).padStart(2, '0')}`, name: `${key} rice`, kcal: 410 }] }))
  ];
  for (const [index, shape] of jsonShapes.entries()) {
    await page.locator('#file-input').setInputFiles({ name: `archive-${index}.json`, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(shape)) });
    await expect(page.getByRole('heading', { name: '1 entries are ready' })).toBeVisible();
    await page.getByRole('button', { name: 'Clear this import' }).click();
  }
});

test('@claim:batch-import combines multiple files with a valid cached license', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:food-log-export-kit', 'test-license');
    localStorage.setItem('sb_license:food-log-export-kit:verdict', JSON.stringify({ token: 'test-license', valid: true, checked: Date.now() }));
  });
  await page.goto('/app');
  await page.locator('#file-input').setInputFiles([
    { name: 'year-one.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Food,Calories\n2024-01-01,Soup,180') },
    { name: 'year-two.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify([{ date: '2025-01-01', name: 'Rice bowl', kcal: 410 }])) }
  ]);
  await expect(page.getByRole('heading', { name: '2 entries are ready' })).toBeVisible();
  await expect(page.getByText('2 source files')).toBeVisible();
});

test('@claim:free-behavior offers one-file selection and keeps both exports free', async ({ page }) => {
  await page.goto('/app');
  const input = page.locator('#file-input');
  await expect(input).not.toHaveAttribute('multiple', '');
  await input.setInputFiles({ name: 'first.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Food,Calories\n2025-01-01,Soup,180') });
  await expect(page.getByRole('heading', { name: '1 entries are ready' })).toBeVisible();
  await expect(page.getByText('1 source file')).toBeVisible();
  await expect(page.getByText('Soup')).toBeVisible();
  for (const name of ['Export CSV', 'Export JSON']) {
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name }).click();
    const stream = await (await downloadEvent).createReadStream();
    let body = '';
    for await (const chunk of stream) body += chunk.toString();
    expect(body).toContain('Soup');
  }
  expect(await page.evaluate((key) => localStorage.getItem(key), licenseKey)).toBeNull();
});

test('@claim:normalized-types normalizes meal, recipe, nutrition, and weight fields', async ({ page }) => {
  await page.goto('/app');
  await page.locator('#file-input').setInputFiles({
    name: 'all-types.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ records: [
      { date: '2025-03-01', type: 'meal', meal: 'Lunch', food: 'Bean bowl', calories: 430, protein: 22, carbohydrates: 61, fat: 12 },
      { date: '2025-03-02', type: 'recipe', recipe: 'Tomato soup', servings: 2, calories: 280 },
      { date: '2025-03-03', type: 'weight', weight: 68.4 }
    ] }))
  });
  const summary = page.getByLabel('Import summary');
  await expect(summary).toContainText('1meals');
  await expect(summary).toContainText('1recipes');
  await expect(summary).toContainText('1weights');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const stream = await (await downloadEvent).createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  const archive = JSON.parse(body);
  expect(archive.records).toEqual(expect.arrayContaining([
    expect.objectContaining({ kind: 'meal', item: 'Bean bowl', calories: 430, protein_g: 22, carbs_g: 61, fat_g: 12 }),
    expect.objectContaining({ kind: 'recipe', item: 'Tomato soup', amount: '2' }),
    expect.objectContaining({ kind: 'weight', item: 'Body weight', weight_kg: 68.4 })
  ]));
});

test('@claim:lossy-fields names and preserves every populated unrecognized field', async ({ page }) => {
  await page.goto('/app');
  await page.locator('#file-input').setInputFiles({
    name: 'tracker-with-fiber.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Date,Food,Calories,Fiber,Empty custom field\n2026-08-29,Bean bowl,430,12,')
  });
  await expect(page.getByText('Review 1 conversion note')).toBeVisible();
  await page.getByText('Review 1 conversion note').click();
  await expect(page.getByText('Row 2: Fiber')).toBeVisible();
  await expect(page.getByText('“Fiber” from tracker-with-fiber.csv is not a standard archive field. Its value was preserved in JSON under unmapped_fields.')).toBeVisible();
  await expect(page.getByText('Empty custom field')).toHaveCount(0);

  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const stream = await (await downloadEvent).createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  const archive = JSON.parse(body);
  expect(archive.records[0].unmapped_fields).toEqual({ Fiber: '12' });
  expect(archive.issues).toContainEqual(expect.objectContaining({ row: 2, field: 'Fiber', value: '12' }));
});

test('@claim:explained-drops lists every unusable row and file', async ({ page }) => {
  await page.addInitScript(({ licenseKey, verdictKey }) => {
    localStorage.setItem(licenseKey, 'test-license');
    localStorage.setItem(verdictKey, JSON.stringify({ token: 'test-license', valid: true, checked: Date.now() }));
  }, { licenseKey, verdictKey });
  await page.goto('/app');
  await page.locator('#file-input').setInputFiles([
    { name: 'broken.csv', mimeType: 'text/csv', buffer: Buffer.from('Unknown,Columns\n1,2') },
    { name: 'mixed.csv', mimeType: 'text/csv', buffer: Buffer.from('Date,Food,Calories\n2025-01-01,Soup,180\n2025-01-02,,200') }
  ]);
  await expect(page.getByText('1 entries are ready')).toBeVisible();
  await expect(page.getByText('Review 2 conversion notes')).toBeVisible();
  await page.getByText('Review 2 conversion notes').click();
  await expect(page.getByText('broken.csv', { exact: false })).toBeVisible();
  await expect(page.getByText('No food or weight column was found.', { exact: false })).toBeVisible();
  await expect(page.getByText('No food, recipe, or weight was found. This row was not exported.')).toBeVisible();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const stream = await (await downloadEvent).createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  const archive = JSON.parse(body);
  expect(archive.records).toHaveLength(1);
  expect(archive.issues).toEqual(expect.arrayContaining([expect.objectContaining({ row: 0, field: 'broken.csv' })]));
});

test('@claim:validation-notes flags invalid dates and explains unreadable, comma-formatted, and negative numbers', async ({ page }) => {
  await page.goto('/app');
  await page.locator('#file-input').setInputFiles({
    name: 'boundary.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Date,Food,Calories,Protein\n2025-99-99,Impossible date,"1,234",-5\n,Missing date,not-a-number,2\n2025-01-03,Decimal comma,"1,5",3\n2025-01-04,European grouping,"1.234,5",4\n2025-01-05,Ambiguous comma,"12,34,56",5')
  });
  await expect(page.getByText('Date missing').first()).toBeVisible();
  await expect(page.getByRole('cell', { name: '1,234', exact: true })).toBeVisible();
  await expect(page.getByText('Review 8 conversion notes')).toBeVisible();
  await page.getByText('Review 8 conversion notes').click();
  await expect(page.getByText('not a real calendar date', { exact: false })).toBeVisible();
  await expect(page.getByText('No date was found', { exact: false })).toBeVisible();
  await expect(page.getByText('not a number', { exact: false })).toBeVisible();
  await expect(page.getByText('comma as a thousands separator', { exact: false })).toBeVisible();
  await expect(page.getByText('comma as the decimal mark', { exact: false })).toBeVisible();
  await expect(page.getByText('dots for thousands and a comma for decimals', { exact: false })).toBeVisible();
  await expect(page.getByText('ambiguous number format', { exact: false })).toBeVisible();
  await expect(page.getByText('negative value was kept', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: /nutrition advice|meal plan|recommend/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /nutrition advice|meal plan|recommend/i })).toHaveCount(0);
});

test('@claim:license-restore restores a license token on a fresh device', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/food-log-export-kit/verify?license=restored-token', (route) => {
    expect(route.request().method()).toBe('GET');
    expect(route.request().postData()).toBeNull();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Have a license?' }).click();
  await page.getByLabel('License token').fill('restored-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Licensed', { exact: false })).toBeVisible();
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), licenseKey)).toBe('restored-token');
});

test('@claim:license-request-data-boundary sends only the license token during verification', async ({ page }) => {
  let requestUrl = '';
  await page.route('https://api.sociobot.in/api/v1/products/food-log-export-kit/verify?license=private-token', (route) => {
    requestUrl = route.request().url();
    expect(route.request().method()).toBe('GET');
    expect(route.request().postData()).toBeNull();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/app');
  await page.getByRole('button', { name: 'Load sample data' }).click();
  await expect(page.getByText('Oatmeal with blueberries')).toBeVisible();
  await page.getByRole('button', { name: 'Have a license?' }).click();
  await page.getByLabel('License token').fill('private-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Licensed', { exact: false })).toBeVisible();
  expect(new URL(requestUrl).searchParams.get('license')).toBe('private-token');
  expect(requestUrl).not.toContain('Oatmeal');
  expect(requestUrl).not.toContain('calories');
});

test('@claim:paid-purchase live checkout redirects to Dodo hosted checkout', async ({ page, request }) => {
  await page.goto('/');
  const buy = page.getByRole('link', { name: 'Buy the batch-import license' });
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/food-log-export-kit/checkout');
  const response = await request.get(await buy.getAttribute('href') as string, { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  const redirect = new URL(response.headers().location);
  expect(redirect.origin).toBe('https://checkout.dodopayments.com');
  expect(redirect.pathname).toMatch(/^\/session\/cks_/);
});

test('@regression:F12-1 live license verification stays available and rate-limited', async ({ request }, testInfo) => {
  // F12-1 was a live 503 from both checkout and verification. The checkout
  // contract is covered by @claim:paid-purchase immediately above; use one
  // fresh, harmless token here to prove the verification service returns its
  // normal JSON before enforcing its documented per-client limit.
  test.setTimeout(60_000);
  const token = `qa-invalid-f12-1-${testInfo.workerIndex}-${Date.now()}`;
  const endpoint = `https://api.sociobot.in/api/v1/products/food-log-export-kit/verify?license=${encodeURIComponent(token)}`;
  const responses = [];
  for (let attempt = 0; attempt < 31; attempt += 1) responses.push(await request.get(endpoint, { maxRedirects: 0 }));

  // The public test environment can share an egress address with another
  // verifier, so its partial allowance can already be spent. A normal reply
  // and a properly headed 429 still prove both halves of the public contract.
  let normal = responses.find((response) => response.status() === 200);
  const throttled = responses.find((response) => response.status() === 429);
  expect(throttled).toBeDefined();
  const retryAfter = throttled?.headers()['retry-after'] ?? '';
  expect(retryAfter).toMatch(/^\d+$/);

  if (!normal) {
    await new Promise((resolve) => setTimeout(resolve, (Number(retryAfter) + 1) * 1_000));
    normal = await request.get(endpoint, { maxRedirects: 0 });
  }

  if (!normal) throw new Error('Verification did not return a normal response after its retry window.');
  expect(normal.status()).toBe(200);
  await expect(normal.json()).resolves.toEqual({ expires_at: null, reason: 'invalid', valid: false });
});

test('@claim:revoked-license a replacement token never reuses another token verdict', async ({ page }) => {
  await page.addInitScript(({ licenseKey, verdictKey }) => {
    localStorage.setItem(licenseKey, 'known-valid');
    localStorage.setItem(verdictKey, JSON.stringify({ token: 'known-valid', valid: true, checked: Date.now() }));
  }, { licenseKey, verdictKey });
  let verificationRequests = 0;
  await page.route('https://api.sociobot.in/api/v1/products/food-log-export-kit/verify?license=revoked-replacement', async (route) => {
    verificationRequests += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null }) });
  });
  await page.goto('/app?license=revoked-replacement');
  await expect(page.getByText('This license is no longer active.')).toBeVisible();
  expect(verificationRequests).toBe(1);
  await expect(page.getByText('✓ Licensed')).toHaveCount(0);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), licenseKey)).toBe('revoked-replacement');
  expect(new URL(page.url()).searchParams.has('license')).toBe(false);
});

test('@claim:detected-platform-downloads selects each published operating-system and Mac architecture asset', async ({ browser }) => {
  const release = {
    tag_name: 'v0.1.7',
    html_url: 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.7',
    assets: [
      ['Food.Log.Export.Kit_0.1.7_aarch64.dmg', 'mac-arm.dmg'],
      ['Food.Log.Export.Kit_0.1.7_x64.dmg', 'mac-intel.dmg'],
      ['Food.Log.Export.Kit_0.1.7_x64_en-US.msi', 'windows.msi'],
      ['Food.Log.Export.Kit_0.1.7_amd64.AppImage', 'linux.AppImage']
    ].map(([name, file]) => ({ name, browser_download_url: `https://github.com/B-Divyesh/sf-food-log-export-kit/releases/download/v0.1.7/${file}` }))
  };
  const cases = [
    { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', architecture: '', label: 'Download for Linux', file: 'linux.AppImage' },
    { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', architecture: '', label: 'Download for Windows', file: 'windows.msi' },
    { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', architecture: 'arm', label: 'Download for macOS', file: 'mac-arm.dmg' },
    { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', architecture: 'x86', label: 'Download for macOS', file: 'mac-intel.dmg' }
  ];
  for (const item of cases) {
    const context = await browser.newContext({ userAgent: item.userAgent });
    await context.addInitScript((architecture) => {
      if (architecture) Object.defineProperty(navigator, 'userAgentData', { configurable: true, value: { getHighEntropyValues: async () => ({ architecture }) } });
    }, item.architecture);
    const page = await context.newPage();
    await page.route('https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/latest', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(release) }));
    await page.goto('/');
    const button = page.getByRole('link', { name: item.label });
    const releaseNotes = page.getByRole('link', { name: 'Read release notes on GitHub' });
    const escapedFile = item.file.replaceAll('.', '\\.');
    const assetName = release.assets.find((asset) => asset.browser_download_url.endsWith(item.file))?.name;
    await expect(button).toHaveAttribute('href', new RegExp(escapedFile + '$'));
    await expect(page.locator('#download-note')).toHaveText(assetName as string);
    await expect(releaseNotes).toHaveAttribute('href', release.html_url);
    await context.close();
  }
});

test('@claim:offline-reload reopens the demo without a network', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/demo');
  await expect(page.getByLabel('Sample record')).toContainText('Oatmeal with blueberries');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.reload();
  await expect(page.getByLabel('Sample record')).toContainText('Oatmeal with blueberries');
  await context.setOffline(true);
  await page.reload();
  expect(errors).toEqual([]);
  await expect(page.getByLabel('Sample record')).toContainText('Oatmeal with blueberries');
  await expect(page.getByText('You are offline')).toBeVisible();
});
