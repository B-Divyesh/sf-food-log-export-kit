const CACHE = 'food-log-export-kit-v3';
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
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('/'))));
});
