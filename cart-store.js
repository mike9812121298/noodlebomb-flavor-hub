/* NoodleBomb cart store — vanilla JS, localStorage-backed.
 * Shared between index.html, cart.html, and checkout.html.
 * Exposes a single global: window.NB_CART
 *
 * Item shape: { slug, name, price, qty, attributes? }
 *   slug   — internal product key (matches Wix deep-link map keys)
 *   name   — display label
 *   price  — number, USD
 *   qty    — integer >= 1
 */

/* ── Meta Pixel bootstrap (added 2026-06-22, ad-audit fix) ─────────────────
 * cart.html / checkout.html load cart-store.js but NOT page-shared.js, so the
 * pixel bootstrap is mirrored here to guarantee PageView fires on EVERY page.
 * Idempotent and identical to the copy in page-shared.js (single fbq init,
 * single PageView per page). Same pixel id Shopify uses (976149235141968) so
 * browser events consolidate with the Shopify CAPI stream. */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var PIXEL_ID = '976149235141968';
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
    } catch (e) {}
  }
  ensureFbq();
  if (!window.__nbPixelPageViewFired) {       // PageView exactly once per page load
    window.__nbPixelPageViewFired = true;
    track('PageView');
  }
  window.NB_PIXEL = window.NB_PIXEL || { track: track, PIXEL_ID: PIXEL_ID };
})();

(function () {
  'use strict';

  var STORAGE_KEY = 'nb_cart_v2';
  var BUS = (typeof window !== 'undefined') ? new EventTarget() : null;
  var CHANGE = 'nb-cart-change';
  var FREE_SHIPPING_THRESHOLD = 29.99;
  var RETIRED_SLUGS = {};  // Spicy Shoyu is live; keep this empty unless Mike retires a slug.
  var PRODUCT_CATALOG = {
    original: { slug: 'original', name: 'Original', price: 12.99 },
    spicy: { slug: 'spicy', name: 'Spicy Tokyo', price: 12.99 },
    citrus: { slug: 'citrus', name: 'Citrus Shoyu', price: 12.99 },
    trio: { slug: 'trio', name: 'The NoodleBomb Trio', price: 32.99 },
    shoyu: { slug: 'shoyu', name: 'Shoyu Reserve', price: 12.99 },
    shoyuspicy: { slug: 'shoyuspicy', name: 'Spicy Shoyu', price: 12.99 },
    firedust: { slug: 'firedust', name: 'NoodleBomb Fire Dust', price: 10.99 },
    rgs: { slug: 'rgs', name: 'NoodleBomb Roasted Garlic Sesame', price: 10.99 }
  };

  function isRetiredSlug(slug) {
    return !!RETIRED_SLUGS[String(slug || '')];
  }

  function safeRead() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(function (item) {
        return item && !isRetiredSlug(item.slug);
      }) : [];
    } catch (e) {
      return [];
    }
  }

  function safeWrite(items) {
    try {
      var cleanItems = Array.isArray(items) ? items.filter(function (item) {
        return item && !isRetiredSlug(item.slug);
      }) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanItems));
    } catch (e) { /* ignore */ }
  }

  function emitChange() {
    if (BUS) BUS.dispatchEvent(new Event(CHANGE));
  }

  function getItems() { return safeRead(); }

  function getItemCount() {
    return safeRead().reduce(function (n, i) { return n + (i.qty || 0); }, 0);
  }

  function getSubtotal() {
    return safeRead().reduce(function (s, i) { return s + (Number(i.price) || 0) * (Number(i.qty) || 0); }, 0);
  }

  function normalizeAttributes(attributes) {
    if (!Array.isArray(attributes)) return [];
    return attributes
      .filter(function (a) { return a && a.key && a.value; })
      .map(function (a) {
        return {
          key: String(a.key),
          value: String(a.value)
        };
      });
  }

  function attributesKey(attributes) {
    return JSON.stringify(normalizeAttributes(attributes));
  }

  function hasFreeShippingTrio(items) {
    return (items || safeRead()).some(function (i) { return i.slug === 'trio' && (Number(i.qty) || 0) > 0; });
  }

  function getBottleCount(items) {
    return (items || safeRead()).reduce(function (n, i) { return n + ((i.slug === 'trio' ? 3 : 1) * (Number(i.qty) || 0)); }, 0);
  }

  // Free US shipping rule (2026-06): automatic free US shipping at $29.99+.
  // Site messaging only; final shipping is enforced at Shopify checkout.
  function qualifiesForFreeShipping(items) {
    var list = items || safeRead();
    return getSubtotal(list) >= FREE_SHIPPING_THRESHOLD;
  }

  function add(item) {
    if (!item || !item.slug) return;
    if (isRetiredSlug(item.slug)) return;
    var items = safeRead();
    var normalizedAttributes = normalizeAttributes(item.attributes);
    var incomingAttributesKey = attributesKey(normalizedAttributes);
    var existing = items.find(function (i) {
      return i.slug === item.slug && attributesKey(i.attributes) === incomingAttributesKey;
    });
    var qty = item.qty || 1;
    if (existing) {
      existing.qty += qty;
    } else {
      var nextItem = {
        slug: item.slug,
        name: item.name || item.slug,
        price: Number(item.price) || 0,
        qty: qty
      };
      if (normalizedAttributes.length) nextItem.attributes = normalizedAttributes;
      items.push(nextItem);
    }
    safeWrite(items);
    emitChange();
    // Meta Pixel AddToCart — fired from the single canonical add() chokepoint,
    // so EVERY add path reports it: PDP buttons, the "Power up your cart" /
    // "You might also like" upsell strips, the bundle builder, Flavor Finder,
    // and ?add= quick links. value + currency + content ids included so Meta's
    // purchase optimization, Advantage+ and lookalikes get clean signal.
    var atcPrice = Number(item.price) || 0;
    var atcValue = Math.round(atcPrice * qty * 100) / 100;
    try {
      if (window.NB_PIXEL && typeof window.NB_PIXEL.track === 'function') {
        window.NB_PIXEL.track('AddToCart', {
          content_ids: [item.slug],
          content_name: item.name || item.slug,
          content_type: 'product',
          contents: [{ id: item.slug, quantity: qty, item_price: atcPrice }],
          value: atcValue,
          currency: 'USD'
        });
      }
    } catch (e) { /* analytics must never break the cart */ }
    // GA4 add_to_cart mirrors the same canonical add() chokepoint so Google
    // Ads / GA4 can see the cart step before Shopify checkout begin_checkout.
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: atcValue,
          items: [{
            item_id: item.slug,
            item_name: item.name || item.slug,
            price: atcPrice,
            quantity: qty
          }]
        });
      }
    } catch (e) { /* analytics must never break the cart */ }
  }

  function addFromUrl() {
    if (typeof window === 'undefined' || !window.URLSearchParams) return;
    var params = new URLSearchParams(window.location.search || '');
    var rawAdds = params.getAll('add').reduce(function (list, value) {
      return list.concat(String(value || '').split(','));
    }, []);
    var slugs = rawAdds.map(function (slug) { return slug.trim(); }).filter(function (slug, index, list) {
      return slug && PRODUCT_CATALOG[slug] && list.indexOf(slug) === index;
    });
    if (!slugs.length) return;
    var qty = Math.max(1, Math.floor(Number(params.get('qty')) || 1));
    slugs.forEach(function (slug) {
      add(Object.assign({}, PRODUCT_CATALOG[slug], { qty: qty }));
    });
    params.delete('add');
    params.delete('qty');
    var next = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + (window.location.hash || '');
    window.history.replaceState({}, '', next);
  }

  function sameAttributes(a, b) {
    return attributesKey(a) === attributesKey(b);
  }

  function setQty(slug, qty, attributes) {
    var items = safeRead();
    var n = Math.max(0, Math.floor(Number(qty) || 0));
    var hasAttributes = arguments.length >= 3;
    if (n === 0) {
      items = items.filter(function (i) {
        return hasAttributes
          ? !(i.slug === slug && sameAttributes(i.attributes, attributes))
          : i.slug !== slug;
      });
    } else {
      var found = items.find(function (i) {
        return hasAttributes
          ? i.slug === slug && sameAttributes(i.attributes, attributes)
          : i.slug === slug;
      });
      if (found) found.qty = n;
    }
    safeWrite(items);
    emitChange();
  }

  function remove(slug, attributes) {
    if (arguments.length >= 2) setQty(slug, 0, attributes);
    else setQty(slug, 0);
  }

  function clear() {
    safeWrite([]);
    emitChange();
  }

  function onChange(handler) {
    if (!BUS) return function () {};
    BUS.addEventListener(CHANGE, handler);
    // Sync between tabs
    var storageHandler = function (e) {
      if (e.key === STORAGE_KEY) handler(new Event(CHANGE));
    };
    window.addEventListener('storage', storageHandler);
    return function () {
      BUS.removeEventListener(CHANGE, handler);
      window.removeEventListener('storage', storageHandler);
    };
  }

  if (typeof window !== 'undefined') {
    window.NB_CART = {
      getItems: getItems,
      getItemCount: getItemCount,
      getSubtotal: getSubtotal,
      add: add,
      setQty: setQty,
      remove: remove,
      clear: clear,
      onChange: onChange,
      hasFreeShippingTrio: hasFreeShippingTrio,
      qualifiesForFreeShipping: qualifiesForFreeShipping,
      getBottleCount: getBottleCount,
      FLAT_SHIPPING: 3.50,
      PRIORITY_SHIPPING: 12,
      FREE_SHIPPING_THRESHOLD: FREE_SHIPPING_THRESHOLD
    };
    addFromUrl();
  }
})();
