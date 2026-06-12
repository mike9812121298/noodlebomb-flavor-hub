const NB_CACHE = 'noodlebomb-app-shell-v5';
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
  '/uploads/nb-hero-pour.png',
  '/uploads/nb-original-production-front-2026-05.jpeg',
  '/uploads/nb-spicy-production-front-2026-05.jpeg',
  '/uploads/nb-citrus-production-front-2026-05.jpeg',
  '/uploads/nb-shoyu-reserve-front-cutout-clean-2026-05-17.png',
  '/uploads/monthly-subscription-box-2026-05-08.png'
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
