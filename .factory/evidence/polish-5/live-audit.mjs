import { strict as assert } from 'node:assert';
import { writeFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const origin = 'https://food-log-export-kit.sociobot.in';
const routes = [
  ['/', 'Food Log Export Kit — Save your food history', 200],
  ['/?demo=1', 'Demo — Food Log Export Kit', 200],
  ['/demo', 'Demo — Food Log Export Kit', 200],
  ['/app', 'Archive — Food Log Export Kit', 200],
  ['/privacy', 'Privacy — Food Log Export Kit', 200],
  ['/terms', 'Terms — Food Log Export Kit', 200],
  ['/not-a-real-route', 'Page not found — Food Log Export Kit', 404]
];
const expectedNavigation = [
  ['Demo', '/demo'],
  ['How it works', '/#how'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms']
];
const report = { checkedAt: new Date().toISOString(), routes: [], demo: {}, import: {}, payment: {}, release: {}, focus: {}, copy: {}, errors: [] };
const browser = await chromium.launch();

async function downloadText(page, action) {
  const event = page.waitForEvent('download');
  await action();
  const stream = await (await event).createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  return body;
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  for (const [path, title, status] of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), status, `${path} status`);
    assert.equal(await page.title(), title, `${path} title`);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(await page.locator('meta[name="description"]').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
    assert.equal(await page.locator('meta[property="og:title"]').count(), 1);
    assert.equal(await page.locator('meta[name="twitter:card"]').count(), 1);
    const navigation = await page.getByLabel('Main navigation').locator('a').evaluateAll((links) => links.map((link) => [
      link.textContent?.trim() ?? '',
      `${link.pathname}${link.hash}`
    ]));
    assert.deepEqual(navigation, expectedNavigation, `${path} navigation`);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));
    const unexpectedErrors = status === 404 ? errors.filter((message) => !message.includes('server responded with a status of 404')) : errors;
    assert.deepEqual(serious, [], `${path} serious accessibility issues`);
    assert.deepEqual(unexpectedErrors, [], `${path} console errors`);
    if (status === 404 && viewport.width === 1440) await page.screenshot({ path: '.factory/evidence/polish-5/live-404.png', fullPage: true });
    report.routes.push({ path, viewport, status, title, navigation, serious: serious.length, errors: unexpectedErrors });
    await page.close();
  }
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    localStorage.setItem('real:sentinel', 'untouched');
    sessionStorage.setItem('real:session', 'untouched');
  });
  const page = await context.newPage();
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
  const banner = page.getByText('Demo — sample data, nothing is saved', { exact: true });
  const record = page.getByLabel('Sample record');
  await banner.waitFor();
  assert.match(await record.textContent(), /Oatmeal with blueberries/);
  const box = await record.boundingBox();
  assert(box && box.y + box.height <= 844, 'sample record is inside the first mobile viewport');
  await page.getByRole('button', { name: 'Recipes' }).click();
  assert.equal(await page.getByText('0 shown').textContent(), '0 shown');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert.equal(await page.getByText('12 shown').textContent(), '12 shown');
  const csv = await downloadText(page, () => page.getByRole('button', { name: 'Export CSV' }).click());
  const archive = JSON.parse(await downloadText(page, () => page.getByRole('button', { name: 'Export JSON' }).click()));
  assert.equal(csv.split('\r\n').length, 13);
  assert.equal(archive.records.length, 12);
  assert.deepEqual(await page.evaluate(() => [localStorage.getItem('real:sentinel'), sessionStorage.getItem('real:session')]), ['untouched', 'untouched']);
  assert(requests.every((url) => new URL(url).origin === origin), 'demo requests stay same-origin');
  await page.getByRole('link', { name: 'Start for real' }).click();
  assert.equal(new URL(page.url()).pathname, '/app');
  await page.getByRole('heading', { name: 'Choose a tracker export' }).waitFor();
  assert.equal(await page.getByRole('heading', { name: /entries are ready/ }).count(), 0);
  report.demo = { firstRecordBottom: box.y + box.height, resetCount: 12, csvRows: 12, jsonRecords: 12, storageUntouched: true, crossOriginRequests: 0, exitPath: '/app' };
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${origin}/app`);
  await page.locator('#file-input').setInputFiles({
    name: 'tracker-with-fiber.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Date,Food,Calories,Fiber\n2026-08-29,Bean bowl,430,12')
  });
  await page.getByText('Review 1 conversion note').click();
  await page.getByText('Row 2: Fiber').waitFor();
  const archive = JSON.parse(await downloadText(page, () => page.getByRole('button', { name: 'Export JSON' }).click()));
  assert.deepEqual(archive.records[0].unmapped_fields, { Fiber: '12' });
  assert(requests.every((url) => new URL(url).origin === origin), 'food import stays same-origin');
  report.import = { fiberNote: true, fiberPreserved: true, crossOriginRequests: 0 };
  await context.close();
}

{
  const response = await fetch('https://api.sociobot.in/api/v1/products/food-log-export-kit/checkout', { redirect: 'manual' });
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get('location')).origin, 'https://checkout.dodopayments.com');
  report.payment = { status: 303, checkoutOrigin: 'https://checkout.dodopayments.com' };
}

{
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  const download = page.getByRole('link', { name: 'Download for Linux' });
  const notes = page.getByRole('link', { name: 'Read release notes on GitHub' });
  const downloadUrl = await download.getAttribute('href');
  const notesUrl = await notes.getAttribute('href');
  assert.match(downloadUrl, /releases\/download\/v0\.1\.7\/Food\.Log\.Export\.Kit_0\.1\.7_amd64\.AppImage$/);
  assert.equal(notesUrl, 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.7');
  report.release = { downloadUrl, notesUrl };
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(origin);
  await page.getByLabel('Main navigation').getByRole('link', { name: 'Privacy' }).click();
  await page.getByRole('heading', { name: 'Your food data stays with you' }).waitFor();
  await page.waitForFunction(() => document.activeElement?.tagName === 'H1');
  assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Your food data stays with you');
  await page.goBack();
  await page.getByRole('heading', { name: 'Save your food history' }).waitFor();
  await page.waitForFunction(() => document.activeElement?.tagName === 'H1');
  assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Save your food history');
  report.focus = { privacy: true, backToLanding: true };
  const body = await page.locator('body').innerText();
  for (const oldCopy of ['Use CSV now', 'No account scraping', 'Unmapped fields are reported']) assert(!body.includes(oldCopy), `old copy remains: ${oldCopy}`);
  for (const newCopy of ['Use the CSV in a spreadsheet', 'The app does not sign in to your tracker', 'Unrecognized fields appear in conversion notes']) assert(body.includes(newCopy), `new copy missing: ${newCopy}`);
  report.copy = { oldPhrasesAbsent: true, replacementsPresent: true };
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${origin}/demo`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  assert.match(await page.getByLabel('Sample record').textContent(), /Oatmeal with blueberries/);
  assert.match(await page.getByText('You are offline').textContent(), /You are offline/);
  report.demo.offlineReload = true;
  await context.close();
}

await browser.close();
writeFileSync('.factory/evidence/polish-5/live-audit.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ routes: report.routes.length, demo: report.demo, import: report.import, payment: report.payment, release: report.release, focus: report.focus, copy: report.copy }));
