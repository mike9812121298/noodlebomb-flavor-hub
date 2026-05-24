# Environment Variables

Configure these in Netlify at **Site settings -> Environment variables**.

| Variable | Used for | Netlify scope | Needed at | Example format |
| --- | --- | --- | --- | --- |
| `VITE_SHOPIFY_STORE_DOMAIN` | Shopify Storefront API domain for product queries and cart creation. | Builds | Build time | `nu2vqa-ma.myshopify.com` |
| `VITE_SHOPIFY_API_VERSION` | Storefront API version used by the headless client. | Builds | Build time | `2026-04` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | Public Storefront access token for published product reads and cart creation. | Builds | Build time | `0123456789abcdef0123456789abcdef` |
| `VITE_SHOPIFY_SELLING_PLAN_ID_30D` | Shopify Subscriptions selling plan ID for Subscribe & Save every 30 days. | Builds | Build time | `gid://shopify/SellingPlan/1234567890` |
| `VITE_SHOPIFY_SELLING_PLAN_ID_45D` | Shopify Subscriptions selling plan ID for Subscribe & Save every 45 days. | Builds | Build time | `gid://shopify/SellingPlan/1234567891` |
| `VITE_SHOPIFY_SELLING_PLAN_ID_60D` | Shopify Subscriptions selling plan ID for Subscribe & Save every 60 days. | Builds | Build time | `gid://shopify/SellingPlan/1234567892` |
| `VITE_META_PIXEL_ID` | Meta Pixel ID for React-side tracking when the Vite app owns the page shell. | Builds | Build time | `1234567890123456` |
| `META_PIXEL_ID` | Meta Pixel ID for server-side Conversions API events from Netlify Functions. | Functions | Runtime | `1234567890123456` |
| `META_CAPI_ACCESS_TOKEN` | Meta Conversions API access token for Purchase and InitiateCheckout webhook events. | Functions | Runtime | `EAABsbCS1iHgBO...` |
| `META_GRAPH_API_VERSION` | Optional Meta Graph API version override for Conversions API calls. | Functions | Runtime | `v23.0` |
| `META_TEST_EVENT_CODE` | Optional Meta Events Manager test code for validating server events before production use. | Functions | Runtime | `TEST12345` |
| `VITE_KLAVIYO_ACCOUNT_ID` | Klaviyo public account/company ID for Active on Site tracking when the Vite app owns the page shell. | Builds | Build time | `AbCd12` |

Notes:

- `VITE_SHOPIFY_STOREFRONT_TOKEN` must be a Storefront API token from the Headless sales channel, not a Shopify Admin token. Do not use `shpat_...`.
- Netlify injects `VITE_*` values into the browser bundle during build, so set the scope to **Builds** and trigger a fresh deploy after changing them. If the three selling plan IDs are missing, the PDP renders Subscribe & Save as a disabled preview and defaults to one-time purchase.
- Function-only values such as `META_CAPI_ACCESS_TOKEN` should be scoped to **Functions** in Netlify. They are server-side runtime secrets and must not use the `VITE_` prefix.
- The current production deploy still publishes the root static shell via `npm run build:static`. That shell uses `shopify-config.js` and `page-shared.js`; keep their public Shopify, Meta, and Klaviyo values aligned until the Vite SPA becomes the deployed shell.
- Shopify Admin API tokens are intentionally not listed here because PR #4 does not use Admin API access in browser code.
