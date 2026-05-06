/* NoodleBomb Shopify checkout client.
 *
 * Exposes window.NB_SHOPIFY_CHECKOUT with:
 *   isEnabled()                     → boolean (config.enabled && all values filled)
 *   createCheckoutUrl(items)        → Promise<string>  Shopify hosted checkout URL
 *   handleCheckoutClick(items, e)   → Promise<void>    intercepts a click, redirects
 *
 * The cart is built on Shopify only at click-time. Local cart (window.NB_CART)
 * stays the source of truth until checkout, which avoids API roundtrips on every
 * add/remove and keeps the drawer instant.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  function isEnabled() {
    var c = window.NB_SHOPIFY;
    if (!c || !c.enabled) return false;
    if (!c.domain || c.domain.indexOf('REPLACE') !== -1) return false;
    if (!c.storefrontToken || c.storefrontToken.indexOf('REPLACE') !== -1) return false;
    // Require at least one mapped variant — otherwise no checkout can succeed.
    var v = c.variantIds || {};
    var hasMapped = false;
    for (var k in v) {
      if (v[k] && v[k].indexOf('REPLACE') === -1) { hasMapped = true; break; }
    }
    if (!hasMapped) return false;
    return true;
  }

  function variantIdFor(slug) {
    var c = window.NB_SHOPIFY;
    var id = c && c.variantIds && c.variantIds[slug];
    if (!id || id.indexOf('REPLACE') !== -1) return null;
    return id;
  }

  function buildLines(items) {
    var lines = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var variantId = variantIdFor(it.slug);
      if (!variantId) continue; // skip unmapped items
      lines.push({
        merchandiseId: variantId,
        quantity: Math.max(1, Math.floor(it.qty || 1))
      });
    }
    return lines;
  }

  function createCheckoutUrl(items) {
    var c = window.NB_SHOPIFY;
    var lines = buildLines(items || []);
    if (lines.length === 0) {
      return Promise.reject(new Error('No mapped Shopify variants for cart items'));
    }

    var query = 'mutation cartCreate($input: CartInput!) {' +
      '  cartCreate(input: $input) {' +
      '    cart { id checkoutUrl }' +
      '    userErrors { field message }' +
      '  }' +
      '}';

    var endpoint = 'https://' + c.domain + '/api/' + c.apiVersion + '/graphql.json';

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': c.storefrontToken
      },
      body: JSON.stringify({
        query: query,
        variables: { input: { lines: lines } }
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('Shopify HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      var result = data && data.data && data.data.cartCreate;
      if (!result) throw new Error('Malformed Shopify response');
      if (result.userErrors && result.userErrors.length > 0) {
        throw new Error(result.userErrors.map(function (e) { return e.message; }).join('; '));
      }
      var url = result.cart && result.cart.checkoutUrl;
      if (!url) throw new Error('No checkoutUrl in Shopify response');
      return url;
    });
  }

  // Intercepts a click on a checkout link/button. If Shopify is enabled and
  // succeeds, redirects to the Shopify checkout URL. Otherwise falls through
  // (lets the default href / fallbackUrl handle it).
  function handleCheckoutClick(items, e, fallbackUrl) {
    if (!isEnabled()) return Promise.resolve(false);
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    return createCheckoutUrl(items).then(function (url) {
      window.location.href = url;
      return true;
    }).catch(function (err) {
      if (window.console && console.error) console.error('Shopify checkout failed:', err);
      // Fall back to the existing href / Wix URL so the user is never stranded.
      if (fallbackUrl) window.location.href = fallbackUrl;
      return false;
    });
  }

  window.NB_SHOPIFY_CHECKOUT = {
    isEnabled: isEnabled,
    createCheckoutUrl: createCheckoutUrl,
    handleCheckoutClick: handleCheckoutClick
  };
})();
