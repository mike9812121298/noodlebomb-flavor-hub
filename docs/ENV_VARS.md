# Environment Variables

Configure these in Netlify at **Site settings -> Environment variables**.

| Variable | Used for | Netlify scope | Needed at | Example format |
| --- | --- | --- | --- | --- |
| `VITE_SHOPIFY_STORE_DOMAIN` | Shopify Storefront API domain for product queries and cart creation. | Builds | Build time | `nu2vqa-ma.myshopify.com` |
| `VITE_SHOPIFY_API_VERSION` | Storefront API version used by the headless client. | Builds | Build time | `2026-04` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | Public Storefront access token for published product reads and cart creation. | Builds | Build time | `0123456789abcdef0123456789abcdef` |
| `VITE_META_PIXEL_ID` | Meta Pixel ID for React-side tracking when the Vite app owns the page shell. | Builds | Build time | `1234567890123456` |
| `VITE_KLAVIYO_ACCOUNT_ID` | Klaviyo public account/company ID for Active on Site tracking when the Vite app owns the page shell. | Builds | Build time | `AbCd12` |

Notes:

- `VITE_SHOPIFY_STOREFRONT_TOKEN` must be a Storefront API token from the Headless sales channel, not a Shopify Admin token. Do not use `shpat_...`.
- Netlify injects `VITE_*` values into the browser bundle during build, so set the scope to **Builds** and trigger a fresh deploy after changing them.
- The current production deploy still publishes the root static shell via `npm run build:static`. That shell uses `shopify-config.js` and `page-shared.js`; keep their public Shopify, Meta, and Klaviyo values aligned until the Vite SPA becomes the deployed shell.
- Shopify Admin API tokens are intentionally not listed here because PR #4 does not use Admin API access in browser code.
