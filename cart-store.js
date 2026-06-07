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
(function () {
  'use strict';

  var STORAGE_KEY = 'nb_cart_v2';
  var BUS = (typeof window !== 'undefined') ? new EventTarget() : null;
  var CHANGE = 'nb-cart-change';
  var PRODUCT_CATALOG = {
    original: { slug: 'original', name: 'Original', price: 11.99 },
    spicy: { slug: 'spicy', name: 'Spicy Tokyo', price: 11.99 },
    citrus: { slug: 'citrus', name: 'Citrus Shoyu', price: 11.99 },
    trio: { slug: 'trio', name: 'The NoodleBomb Trio', price: 29.99 },
    shoyu: { slug: 'shoyu', name: 'Shoyu Reserve', price: 11.99 }
  };

  function safeRead() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function safeWrite(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) { /* ignore */ }
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

  function qualifiesForFreeShipping(items) {
    var list = items || safeRead();
    var subtotal = list.reduce(function (s, i) { return s + (Number(i.price) || 0) * (Number(i.qty) || 0); }, 0);
    return subtotal >= 29.99 || hasFreeShippingTrio(list);
  }

  function add(item) {
    if (!item || !item.slug) return;
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
  }

  function addFromUrl() {
    if (typeof window === 'undefined' || !window.URLSearchParams) return;
    var params = new URLSearchParams(window.location.search || '');
    var slug = params.get('add');
    if (!slug || !PRODUCT_CATALOG[slug]) return;
    var qty = Math.max(1, Math.floor(Number(params.get('qty')) || 1));
    add(Object.assign({}, PRODUCT_CATALOG[slug], { qty: qty }));
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
      FREE_SHIPPING_THRESHOLD: 29.99
    };
    addFromUrl();
  }
})();
