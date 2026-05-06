/* NoodleBomb Shopify config — feature-flagged, OFF by default.
 *
 * Status: store + token captured. Variant IDs pending until products exist.
 *
 * To go live with Shopify checkout:
 *   1. Confirm 4 products are created in the Shopify store and published
 *      to the Headless sales channel:
 *        - Original ($11.99)
 *        - Citrus Shoyu ($11.99)
 *        - Spicy Tokyo ($11.99)
 *        - The NoodleBomb Trio ($29.99)
 *   2. Fill in the variantIds map below with each product's variant GID.
 *      Get them from a browser fetch on a allowed origin:
 *        fetch('https://noodlebomb.myshopify.com/api/2024-10/graphql.json', {
 *          method: 'POST',
 *          headers: {
 *            'Content-Type': 'application/json',
 *            'X-Shopify-Storefront-Access-Token': PUBLIC_TOKEN
 *          },
 *          body: JSON.stringify({ query: '{ products(first:20){ edges{ node{ title handle variants(first:1){ edges{ node{ id } } } } } } }' })
 *        }).then(r=>r.json()).then(console.log)
 *   3. Set `enabled: true`.
 *   4. Run `npm run build:static` and deploy.
 *
 * Token note: we use the *public* Storefront API access token (no shpat_
 * prefix). It IS visible in the compiled JS bundle to anyone who views
 * source — that's intended. The Headless sales channel does NOT expose a
 * configurable per-token origin allowlist in its current UI (verified
 * 2026-05). The token's safety relies on:
 *   (a) the unauthenticated_* scopes — can't read orders, customers, or
 *       admin data; can only query published products and create carts,
 *   (b) Shopify's per-IP rate limiting on the Storefront API,
 *   (c) the fact that "abusing" cartCreate just generates checkout URLs
 *       that someone would still have to pay through to cause damage.
 *
 * Acceptable risk for these scopes. The private `shpat_...` token must
 * NEVER ship in client-side code — that one CAN read sensitive data.
 *
 * The Wix flow remains the fallback when enabled is false OR if the
 * Shopify API call errors at runtime.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  window.NB_SHOPIFY = {
    // ── Feature flag ────────────────────────────────────────────────
    // Flip to true once variantIds below are filled in and noodlebomb.co
    // is on the Headless app's allowed-domains list.
    enabled: false,

    // ── Store identity ──────────────────────────────────────────────
    domain: 'noodlebomb.myshopify.com',

    // Public Storefront API access token (origin-restricted; safe in JS).
    storefrontToken: '6e1316274bfe7f5fcc9c8edd8a4cdcf7',

    // Storefront API version. Shopify deprecates each version on a rolling
    // 12-month window. SUNSET CHECK: bump before 2025-10-01 (review quarterly).
    // See https://shopify.dev/docs/api/usage/versioning
    apiVersion: '2024-10',

    // ── Product mapping ─────────────────────────────────────────────
    // Map local cart slugs → Shopify variant GIDs.
    // Format: 'gid://shopify/ProductVariant/1234567890'
    variantIds: {
      original: 'gid://shopify/ProductVariant/45491811582131',
      citrus:   'gid://shopify/ProductVariant/45491823706291',
      spicy:    'gid://shopify/ProductVariant/45491823804595',
      trio:     'gid://shopify/ProductVariant/45491823902899'
    }
  };
})();

