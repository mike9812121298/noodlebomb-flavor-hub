const NB_CACHE = 'noodlebomb-app-shell-v27-freeship-20260702';
const NB_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/cart.html',
  '/monthly-box.html',
  '/recipes.html',
  '/page-shared.css',
  '/page-shared.js',
  '/cart-store.js',
  '/shopify-config.js',
  '/shopify-checkout.js',
  '/build/components.js',
  '/build/monthly-drop.js',
  '/build/next-drop.js',
  '/build/app.js',
  '/favicon.ico',
  '/icons/noodlebomb-icon-192.png',
  '/icons/noodlebomb-icon-512.png',
  '/uploads/nb-hero-lineup-dark-2026-06-07.webp',
  '/uploads/nb-hero-lineup-rotate-2026-06-15.webp',
  '/uploads/nb-original-front-cutout-2026-05-09.webp',
  '/uploads/nb-spicy-front-cutout-2026-05-09.webp',
  '/uploads/nb-citrus-front-cutout-2026-05-09.webp',
  '/uploads/nb-shoyu-reserve-front-cutout-v2-2026-06-07.webp',
  '/uploads/monthly-subscription-box-2026-05-08.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NB_CACHE)
      .then((cache) => cache.addAll(NB_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== NB_CACHE).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(NB_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(NB_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
