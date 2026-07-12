const NB_CACHE = 'noodlebomb-app-shell-v38-smooth-20260712';
const NB_CURRENT_HERO = '/uploads/nb-hero-pour-page.webp?v=20260712-stability';
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
  NB_CURRENT_HERO,
  '/uploads/nb-original-approved-front-v2-20260710-normalized.webp',
  '/uploads/nb-spicy-approved-front-v3-20260710-normalized.webp',
  '/uploads/nb-citrus-approved-front-v3-20260710-normalized.webp',
  '/uploads/nb-shoyu-reserve-front-approved-20260711-normalized.webp',
  '/uploads/nb-shoyu-spicy-front-approved-20260711-normalized.webp',
  '/uploads/nb-fire-dust-approved-front-20260710-normalized.webp',
  '/uploads/nb-rgs-approved-front-20260710-normalized.webp',
  '/uploads/nb-trio-approved-20260711.webp',
  '/uploads/nb-pour-vs-shake-approved-20260711.webp'
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

  // Older cached app bundles requested this image without a cache key. Serve
  // the approved current artwork from the new cache so a stale failed HTTP
  // cache entry cannot surface Safari's blue broken-image icon.
  if (url.pathname === '/uploads/nb-hero-pour-page.webp') {
    event.respondWith(
      caches.open(NB_CACHE)
        .then((cache) => cache.match(NB_CURRENT_HERO))
        .then((cached) => cached || fetch(NB_CURRENT_HERO, { cache: 'reload' }))
    );
    return;
  }

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
