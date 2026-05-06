/* NoodleBomb Shopify config — feature-flagged, OFF by default.
 *
 * Status: PAID store wired. Variant GIDs captured 2026-05-06.
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
 *        fetch('https://nu2vqa-ma.myshopify.com/api/2026-04/graphql.json', {
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
    enabled: true,

    // ── Store identity ──────────────────────────────────────────────
    // Migrated from dev store noodlebomb.myshopify.com → paid store nu2vqa-ma.myshopify.com on 2026-05-06.
    domain: 'nu2vqa-ma.myshopify.com',

    // Public Storefront API access token (origin-restricted; safe in JS).
    // Generated via Headless app on paid store 2026-05-06.
    storefrontToken: 'f59fc9587d70903d22d0b8cc53e882b7',

    // Storefront API version. Shopify deprecates each version on a rolling
    // 12-month window. SUNSET CHECK: bump before 2027-04-01 (review quarterly).
    // Bumped 2026-05-06 from 2024-10 → 2026-04 (latest stable). Verified cartCreate works.
    // See https://shopify.dev/docs/api/usage/versioning
    apiVersion: '2026-04',

    // ── Product mapping ─────────────────────────────────────────────
    // Map local cart slugs → Shopify variant GIDs.
    // Format: 'gid://shopify/ProductVariant/1234567890'
    // Captured from paid store via Storefront API 2026-05-06.
    variantIds: {
      original: 'gid://shopify/ProductVariant/53998041596214',
      citrus:   'gid://shopify/ProductVariant/53998041071926',
      spicy:    'gid://shopify/ProductVariant/53998042120502',
      trio:     'gid://shopify/ProductVariant/53998042644790'
    }
  };
})();
