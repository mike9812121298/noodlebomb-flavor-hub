/* NoodleBomb traffic-source attribution capture - standalone, dependency-free.
 * Added 2026-06 to fix headless attribution loss.
 *
 * WHY: noodlebomb.co is a headless storefront; the Shopify checkout
 * (nu2vqa-ma.myshopify.com) is a separate origin. The cross-origin handoff
 * drops the original click IDs + UTMs, so ~half of orders land "unattributed"
 * and Meta over-credits itself. This module captures the click IDs + UTMs on
 * the FIRST landing pageview, persists them (localStorage + cookie fallback),
 * and exposes them as Shopify cart attributes so the TRUE source rides into the
 * order - visible in Shopify admin (order "Additional details") and CSV exports.
 *
 * FIRST-TOUCH WINS: once a record is stored within the visit window it is not
 * overwritten, so the ad that earned the click keeps the credit even if the
 * shopper later returns direct/branded before converting.
 *
 * Public API - window.NB_ATTRIBUTION:
 *   get()               -> captured fields object (or {})
 *   getCartAttributes() -> [{key,value}] ready for Shopify CartInput.attributes
 *   getNote()           -> short human-readable source summary (Shopify note)
 *   capture()           -> force a capture pass (returns current record)
 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;
  if (window.NB_ATTRIBUTION) return; // idempotent across duplicate includes

  var STORAGE_KEY = 'nb_attribution_v1';
  var COOKIE_KEY = 'nb_attr';
  var COOKIE_DAYS = 90;
  var VISIT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30-day first-touch lock

  var CLICK_IDS = ['fbclid', 'gclid', 'ttclid', 'msclkid'];
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  function readLocal() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeLocal(obj) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) { /* ignore */ }
  }

  function readCookie() {
    try {
      var m = document.cookie.match(/(?:^|;\s*)nb_attr=([^;]+)/);
      return m ? JSON.parse(decodeURIComponent(m[1])) : null;
    } catch (e) { return null; }
  }

  function writeCookie(obj) {
    try {
      var exp = new Date(Date.now() + COOKIE_DAYS * 86400000).toUTCString();
      document.cookie = COOKIE_KEY + '=' + encodeURIComponent(JSON.stringify(obj)) +
        '; expires=' + exp + '; path=/; SameSite=Lax';
    } catch (e) { /* ignore */ }
  }

  function readStored() { return readLocal() || readCookie(); }

  function persist(obj) { writeLocal(obj); writeCookie(obj); }

  function isFresh(obj) {
    return !!(obj && obj.captured_at_ms && (Date.now() - obj.captured_at_ms) < VISIT_WINDOW_MS);
  }

  function captureFromUrl() {
    var params;
    try { params = new URLSearchParams(window.location.search || ''); }
    catch (e) { return null; }

    var data = {};
    var found = false;
    CLICK_IDS.forEach(function (k) {
      var v = params.get(k);
      if (v) { data[k] = v; found = true; }
    });
    UTM_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) { data[k] = v; found = true; }
    });
    // Record landing context regardless of params so a direct/organic
    // first-touch is still distinguishable from "never captured".
    data.landing_page = (window.location.pathname || '') + (window.location.search || '');
    data.referrer = document.referrer || '';
    data.captured_at = new Date().toISOString();
    data.captured_at_ms = Date.now();
    data.has_marketing_params = found;
    return data;
  }

  function ensureCaptured() {
    var existing = readStored();
    if (isFresh(existing)) {
      persist(existing); // refresh cookie TTL; value unchanged (first-touch lock)
      return existing;
    }
    var captured = captureFromUrl();
    if (captured) { persist(captured); return captured; }
    return existing || null;
  }

  function truncate(v) { return String(v).slice(0, 255); }

  function getCartAttributes() {
    var d = readStored() || {};
    var out = [];
    function push(key, val) {
      if (val == null || val === '') return;
      var s = truncate(val);
      if (s) out.push({ key: key, value: s });
    }
    CLICK_IDS.forEach(function (k) { push(k, d[k]); });
    UTM_KEYS.forEach(function (k) { push(k, d[k]); });
    push('nb_landing_page', d.landing_page);
    push('nb_referrer', d.referrer);
    push('nb_first_touch_at', d.captured_at);
    return out;
  }

  function inferredSource(d) {
    if (d.utm_source) return d.utm_source;
    if (d.fbclid) return 'facebook';
    if (d.gclid) return 'google';
    if (d.ttclid) return 'tiktok';
    if (d.msclkid) return 'microsoft';
    return '';
  }

  function getNote() {
    var d = readStored() || {};
    var src = inferredSource(d);
    var bits = [];
    if (src) bits.push('source=' + src);
    if (d.utm_medium) bits.push('medium=' + d.utm_medium);
    if (d.utm_campaign) bits.push('campaign=' + d.utm_campaign);
    return bits.length ? ('NB attribution - ' + bits.join(' / ')) : '';
  }

  window.NB_ATTRIBUTION = {
    get: function () { return readStored() || {}; },
    getCartAttributes: getCartAttributes,
    getNote: getNote,
    capture: ensureCaptured
  };

  ensureCaptured();
})();
