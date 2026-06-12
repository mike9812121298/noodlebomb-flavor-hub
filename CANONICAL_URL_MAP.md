# NoodleBomb Canonical URL Map (locked 2026-05-07)

**Source of truth.** If you're confused about where something lives, this file decides.

## Architecture (Forever Fix)

```
┌────────────────────────────────────────────────────────────────────┐
│  noodlebomb.co  (Netlify, React/Vite static)                       │
│  Brand front: hero, recipes, about, FAQ, story, social.            │
│  All "Buy" / "Shop" / "Add to Cart" CTAs route to Shopify.         │
└──────────────────────────┬─────────────────────────────────────────┘
                           │ 302 redirects
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│  nu2vqa-ma.myshopify.com  (Shopify Basic, paid)                    │
│  Cash register: PDPs, cart, checkout, orders, payments, tax,       │
│  shipping, Klaviyo, Judge.me reviews, Shopify Email, GA4, ads.     │
│  Custom domain target: shop.noodlebomb.co (when Wix is migrated).  │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  shop.noodlebomb.co  (Wix — LEGACY, subscription-only)             │
│  4 active Monthly Box subscribers. Existing billing pages stay.    │
│  NEW commerce traffic does NOT go here. No public storefront role. │
│  No links from noodlebomb.co. Will be retired after subs migrate.  │
└────────────────────────────────────────────────────────────────────┘
```

## Canonical URL Table

| What | Canonical URL | Hosted on |
|------|---------------|-----------|
| Homepage | https://noodlebomb.co/ | Netlify (React) |
| About | https://noodlebomb.co/about | Netlify |
| Recipes | https://noodlebomb.co/recipes | Netlify |
| FAQ | https://noodlebomb.co/faq | Netlify |
| Cart (drawer fallback) | https://noodlebomb.co/cart | Netlify |
| Shop (lineup) | https://nu2vqa-ma.myshopify.com/collections/all | Shopify |
| PDP — Original | https://nu2vqa-ma.myshopify.com/products/original | Shopify |
| PDP — Spicy Tokyo | https://nu2vqa-ma.myshopify.com/products/spicy-tokyo | Shopify |
| PDP — Citrus Shoyu | https://nu2vqa-ma.myshopify.com/products/citrus-shoyu | Shopify |
| PDP — The NoodleBomb Trio | https://nu2vqa-ma.myshopify.com/products/the-noodlebomb-trio | Shopify |
| PDP - Shoyu Reserve preorder | https://nu2vqa-ma.myshopify.com/products/shoyu-reserve | Shopify |
| Shopify cart | https://nu2vqa-ma.myshopify.com/cart | Shopify |
| Checkout | https://nu2vqa-ma.myshopify.com/checkouts/* | Shopify hosted |
| Monthly Box subs (legacy) | https://shop.noodlebomb.co/* | Wix (do not link) |

## Redirect Map (noodlebomb.co)

All redirects defined in `_redirects` and `netlify.toml`:

| From | To | Code |
|------|----|----|
| /shop | https://nu2vqa-ma.myshopify.com/collections/all | 302 |
| /shop/* | https://nu2vqa-ma.myshopify.com/:splat | 302 |
| /product/original-ramen | …/products/original | 302 |
| /product/spicy-tokyo | …/products/spicy-tokyo | 302 |
| /product/citrus-shoyu | …/products/citrus-shoyu | 302 |
| /product/trio | …/products/the-noodlebomb-trio | 302 |
| /product/the-noodlebomb-trio | …/products/the-noodlebomb-trio | 302 |
| /product/shoyu-reserve | .../products/shoyu-reserve | 302 |
| /shoyu-reserve | .../products/shoyu-reserve | 302 |
| /product-page/noodlebomb-variety-3-pack | /ramen-sauce-trio | 301 |
| https://www.noodlebomb.co/product-page/noodlebomb-variety-3-pack | https://noodlebomb.co/ramen-sauce-trio | 301 |
| /post/garlic-bomb-chicken-ramen-recipe | /garlic-bomb-chicken-ramen | 301 |
| https://www.noodlebomb.co/post/garlic-bomb-chicken-ramen-recipe | https://noodlebomb.co/garlic-bomb-chicken-ramen | 301 |
| /product-page/monthl | /monthly-box | 301 |
| https://www.noodlebomb.co/product-page/monthl | https://noodlebomb.co/monthly-box | 301 |
| /product-page/monthly-ramen-box | /monthly-box | 301 |
| https://www.noodlebomb.co/product-page/monthly-ramen-box | https://noodlebomb.co/monthly-box | 301 |
| /product/* (other) | …/collections/all | 302 |
| /product-page/* | …/collections/all | 302 |
| /cart-page | …/cart | 302 |
| /category/* | …/collections/:splat | 302 |
| /ramensauce | …/products/original | 302 |
| /ramensauce-1 | …/products/citrus-shoyu | 302 |
| /ramensauce-2 | …/products/spicy-tokyo | 302 |
| /cart | /cart.html | 200 (rewrite) |
| /checkout | /checkout.html | 200 (rewrite) |
| /about, /recipes, /faq | /*.html | 200 (rewrite) |

302 (not 301) on commerce redirects is intentional — lets us cut over to a custom Shopify domain such as shop.noodlebomb.co later without polluting Google's redirect cache for 6+ months.

## Where each tool plugs in

| Tool | Where it lives | Notes |
|------|----------------|-------|
| GA4 | Shopify (auto via Google & YouTube channel) + noodlebomb.co (manual) | Replace placeholder ID once Mike provides |
| Klaviyo (email) | Shopify | Triggered by cart, checkout, customer events |
| Judge.me / Loox (reviews) | Shopify | Plug into PDPs |
| Meta / TikTok ads pixel | Shopify (auto via channel) + .co (manual) | Use Shopify Conversion API |
| Subscriptions (future, new) | Shopify (Recharge or native) | NOT Wix |
| B2B / wholesale portal (future) | Shopify (Shopify B2B on Plus) or separate | TBD |

## Existing Wix Subscribers — DO NOT BREAK

The 4 active Monthly Ramen Box subscribers continue billing through Wix. Their:
- Billing dashboard URL: https://shop.noodlebomb.co/account
- Subscription management: Wix Subscriptions (under Wix dashboard)
- Renewal cadence: Monthly, in their original card-on-file

When Wix subs are migrated to Shopify (post-launch), update this map.

## What changed (2026-05-07 forever fix)

- /product/* now 302→Shopify per-flavor (was 200-rewrite to /index.html, which caused duplicate-content SEO + blank PDP perception)
- /shop and /shop/* now 302→Shopify (was 404)
- Wix-pattern legacy URLs (/product-page, /cart-page, /category, /ramensauce*) now 302→Shopify (was 302→Wix)
- noscript fallback Wix links in index.html → Shopify (premium consistency, even for no-JS users)
- GA4 placeholder removed from index.html (was firing pageviews to ghost ID)

## Future cutover (when ready)

When Mike wires Shopify to a custom subdomain (typical: shop2.noodlebomb.co or moves Wix off shop.noodlebomb.co and points it at Shopify):

1. Update _redirects to use the custom domain
2. Update shopify-config.js `domain` field
3. Update this map
4. Test all redirects
5. Update sitemap.xml

Until then, .myshopify.com URLs are the canonical Shopify destination.
