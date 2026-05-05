/* NoodleBomb Shopify config — feature-flagged, OFF by default.
 *
 * To go live with Shopify checkout:
 *   1. Create a Shopify Basic account at shopify.com
 *   2. Add the 4 products: original, citrus, spicy, trio
 *   3. Generate a Storefront API access token (Settings → Apps → Develop apps → Create app
 *      → Configure Storefront API scopes → Install)
 *   4. Find each product's variant ID:
 *        Admin → Products → [product] → URL contains the product ID
 *        For variant ID: use the Storefront API explorer or run:
 *        curl -X POST https://YOUR_STORE.myshopify.com/api/2024-10/graphql.json \
 *          -H "X-Shopify-Storefront-Access-Token: TOKEN" \
 *          -H "Content-Type: application/json" \
 *          -d '{"query":"{ products(first:10){ edges{ node{ handle variants(first:1){ edges{ node{ id } } } } } } }"}'
 *   5. Fill in the values below.
 *   6. Set enabled: true.
 *   7. Build (npm run build:static) and deploy.
 *
 * The Wix flow remains the fallback when enabled is false OR if the Shopify
 * API call fails for any reason.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  window.NB_SHOPIFY = {
    // ── Feature flag ────────────────────────────────────────────────
    // Flip to true once everything below is filled in.
    enabled: false,

    // ── Store identity ──────────────────────────────────────────────
    // Your Shopify store domain (the *.myshopify.com one, NOT the custom domain).
    domain: 'REPLACE_WITH_STORE.myshopify.com',

    // Public Storefront API access token (safe to expose client-side).
    // NOT the Admin API token — that one is private and would be a security issue.
    storefrontToken: 'REPLACE_WITH_STOREFRONT_ACCESS_TOKEN',

    // Storefront API version (pin to a known version; bump quarterly).
    apiVersion: '2024-10',

    // ── Product mapping ─────────────────────────────────────────────
    // Map local cart slugs → Shopify variant GIDs.
    // Format: 'gid://shopify/ProductVariant/1234567890'
    // Get these from the Storefront API or Admin product page URL.
    variantIds: {
      original: 'gid://shopify/ProductVariant/REPLACE',
      citrus:   'gid://shopify/ProductVariant/REPLACE',
      spicy:    'gid://shopify/ProductVariant/REPLACE',
      trio:     'gid://shopify/ProductVariant/REPLACE'
    }
  };
})();
