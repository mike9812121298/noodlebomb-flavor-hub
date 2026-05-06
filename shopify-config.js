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
 *   2. Add `noodlebomb.co` and `www.noodlebomb.co` to the Headless app's
 *      "Allowed domains" so the public token works from the production site.
 *      Without this, the cartCreate call returns 403 "host_not_allowed".
 *   3. Fill in the variantIds map below with each product's variant GID.
 *      Get them from a browser fetch on a allowed origin:
 *        fetch('https://noodlebomb.myshopify.com/api/2024-10/graphql.json', {
 *          method: 'POST',
 *          headers: {
 *            'Content-Type': 'application/json',
 *            'X-Shopify-Storefront-Access-Token': PUBLIC_TOKEN
 *          },
 *          body: JSON.stringify({ query: '{ products(first:20){ edges{ node{ title handle variants(first:1){ edges{ node{ id } } } } } } }' })
 *        }).then(r=>r.json()).then(console.log)
 *   4. Set `enabled: true`.
 *   5. Run `npm run build:static` and deploy.
 *
 * Token note: we use the *public* Storefront API access token (no shpat_
 * prefix). Public tokens are intended for client-side embedding — they're
 * scoped to allowed domains, so even though the value is visible in the
 * compiled JS bundle, only requests from approved origins succeed. The
 * private `shpat_...` token is for server-to-server use; do not put it in
 * client-side code.
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

    // Storefront API version (pin to a known version; bump quarterly).
    apiVersion: '2024-10',

    // ── Product mapping ─────────────────────────────────────────────
    // Map local cart slugs → Shopify variant GIDs.
    // Format: 'gid://shopify/ProductVariant/1234567890'
    // PENDING: will be filled in once products exist in the Shopify store.
    variantIds: {
      original: 'gid://shopify/ProductVariant/REPLACE',
      citrus:   'gid://shopify/ProductVariant/REPLACE',
      spicy:    'gid://shopify/ProductVariant/REPLACE',
      trio:     'gid://shopify/ProductVariant/REPLACE'
    }
  };
})();

