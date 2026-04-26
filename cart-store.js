/* NoodleBomb cart store — vanilla JS, localStorage-backed.
 * Shared between index.html, cart.html, and checkout.html.
 * Exposes a single global: window.NB_CART
 *
 * Item shape: { slug, name, price, qty }
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

  function add(item) {
    if (!item || !item.slug) return;
    var items = safeRead();
    var existing = items.find(function (i) { return i.slug === item.slug; });
    var qty = item.qty || 1;
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        slug: item.slug,
        name: item.name || item.slug,
        price: Number(item.price) || 0,
        qty: qty
      });
    }
    safeWrite(items);
    emitChange();
  }

  function setQty(slug, qty) {
    var items = safeRead();
    var n = Math.max(0, Math.floor(Number(qty) || 0));
    if (n === 0) {
      items = items.filter(function (i) { return i.slug !== slug; });
    } else {
      var found = items.find(function (i) { return i.slug === slug; });
      if (found) found.qty = n;
    }
    safeWrite(items);
    emitChange();
  }

  function remove(slug) { setQty(slug, 0); }

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
      FREE_SHIPPING_THRESHOLD: 40
    };
  }
})();
