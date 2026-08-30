// Bump this cache when the worker changes. Navigation requests are also
// network-first so a later app-shell deployment cannot pin an installed
// client even if a worker update is delayed by HTTP caching.
const CACHE = 'food-log-export-kit-v7';
const SHELL = ['/', '/app', '/demo', '/privacy', '/terms', '/404.html', '/404.css', '/favicon.svg', '/art/archive-kitchen-720.webp', '/art/archive-kitchen-1280.webp'];
self.addEventListener('install', (event) => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);
  const html = await (await fetch('/')).text();
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
  await cache.addAll(assets);
  await self.skipWaiting();
})()));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));

async function networkFirst(request) {
  try {
    // Reload bypasses any browser HTTP-cache entry left by the previous worker.
    const response = await fetch(new Request(request, { cache: 'reload' }));
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match('/')) || Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
    return response;
  } catch {
    return (await caches.match('/')) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(event.request.mode === 'navigate' ? networkFirst(event.request) : cacheFirst(event.request));
});
