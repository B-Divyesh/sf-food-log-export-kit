import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const worker = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
const currentCache = worker.match(/const CACHE = '([^']+)'/)?.[1];

if (!currentCache) throw new Error('The service worker must declare its cache name.');

const legacyWorker = `
const CACHE = 'food-log-export-kit-v5';
self.addEventListener('install', (event) => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.put('/', new Response('<!doctype html><title>Food Log Export Kit 0.1.5</title><main><h1 id="legacy-build">Version 0.1.5</h1></main>', { headers: { 'Content-Type': 'text/html' } }));
  await self.skipWaiting();
})()));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET' && new URL(event.request.url).origin === location.origin && event.request.mode === 'navigate') {
    event.respondWith(caches.match('/'));
  }
});
`;

test('@regression:pwa-update replaces a controlled v5 worker and stale navigation shell', async ({ browser }) => {
  const context = await browser.newContext();
  try {
    await context.route('**/sw.js', (route) => route.fulfill({ contentType: 'application/javascript', body: legacyWorker }));
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

    await page.reload();
    await expect(page.locator('#legacy-build')).toHaveText('Version 0.1.5');

    const controllerChanged = page.evaluate(() => new Promise<void>((resolve) => {
      navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
    }));
    await context.unroute('**/sw.js');
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) throw new Error('Expected the legacy service worker registration.');
      await registration.update();
    });
    await controllerChanged;
    await page.waitForFunction(async (cacheName) => {
      const names = await caches.keys();
      return names.includes(cacheName) && !names.includes('food-log-export-kit-v5');
    }, currentCache);

    await page.reload();
    await expect(page.locator('#legacy-build')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Save your food history' })).toBeVisible();
  } finally {
    await context.close();
  }
});
