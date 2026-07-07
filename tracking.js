/* NoodleBomb unified tracking bootstrap — SINGLE source of truth for GA4 + Meta.
 *
 * Included in the <head> of EVERY page via one line:
 *     <script src="/tracking.js"></script>
 *
 * WHY THIS EXISTS: tracking tags were previously copy-pasted per page and drifted
 * into two disjoint families — GA4 on browse pages, Meta Pixel on the cart flow,
 * and NEITHER on content/SEO pages. That meant Meta never saw a product view and
 * GA4 never saw the cart→checkout path. This file consolidates both tags in one
 * place so every page gets both and the tags can never diverge again.
 *
 * IDEMPOTENT: safe alongside the mirrored Meta bootstrap still in cart-store.js.
 * It shares the exact guard flags (`__nbPixelPageViewFired`, `__nbGa4Configured`)
 * so whichever runs first wins and the other no-ops — no double init, no double
 * PageView, no double GA4 config. tracking.js loads synchronously in <head>, so
 * it wins over the deferred cart-store.js on cart/checkout pages.
 *
 * PRIVACY: only product/commerce fields ever leave the page — no email, name,
 * address, or phone.
 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  /* ── GA4 (Google Analytics 4) ─────────────────────────────────────────── */
  var GA4_ID = 'G-34HRPRKYCQ';
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  if (!window.__nbGa4Configured) {
    window.__nbGa4Configured = true;
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    (document.head || document.getElementsByTagName('head')[0]).appendChild(g);
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
  }

  /* ── Meta (Facebook) Pixel ────────────────────────────────────────────── */
  var PIXEL_ID = '976149235141968';  // same id Shopify's checkout pixel uses → browser + CAPI consolidate
  function ensureFbq() {
    if (window.fbq) return;                 // canonical single init — no double-load
    var n = window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    var t = document.createElement('script');
    t.async = true; t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    var s = document.getElementsByTagName('script')[0];
    if (s && s.parentNode) s.parentNode.insertBefore(t, s);
    else document.head.appendChild(t);
    window.fbq('init', PIXEL_ID);
  }
  function track(event, params) {
    try {
      ensureFbq();
      if (params && Object.keys(params).length) window.fbq('track', event, params);
      else window.fbq('track', event);
    } catch (e) { /* analytics must never break the page */ }
  }
  ensureFbq();
  if (!window.__nbPixelPageViewFired) {       // PageView exactly once per page load
    window.__nbPixelPageViewFired = true;
    track('PageView');
  }
  window.NB_PIXEL = window.NB_PIXEL || { track: track, PIXEL_ID: PIXEL_ID };

  /* ── Shared commerce helpers (used by product pages + cart-store.js) ───── */
  window.NB_TRACK = window.NB_TRACK || {
    viewItem: function (item) {
      // item: { slug, name, price }
      var price = Number(item.price) || 0;
      try {
        window.gtag('event', 'view_item', {
          currency: 'USD', value: price,
          items: [{ item_id: item.slug, item_name: item.name, price: price, quantity: 1 }]
        });
      } catch (e) {}
      track('ViewContent', {
        content_ids: [item.slug], content_name: item.name,
        content_type: 'product', value: price, currency: 'USD'
      });
    }
  };
})();
