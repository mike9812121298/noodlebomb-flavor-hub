# NoodleBomb Canonical URL Map (updated 2026-07-01; originally locked 2026-05-07)

**Source of truth.** If you're confused about where something lives, this file decides.

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│  noodlebomb.co  (Netlify — static HTML + esbuild React layer)      │
│  Brand front AND product catalog: homepage, local PDPs             │
│  (/original-ramen-sauce, /shoyu-reserve, …), /shop lineup page,    │
│  ~35 recipe/use-case SEO pages, local cart (localStorage).         │
│  GA4 G-34HRPRKYCQ · Smile.io rewards ("Flavor Club").              │
└──────────────────────────┬─────────────────────────────────────────┘
                           │ Storefront-API cartCreate → hosted checkout
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│  nu2vqa-ma.myshopify.com  (Shopify Basic, paid)                    │
│  Cash register: checkout, orders, payments, tax, shipping.         │
│  Legacy per-flavor deep links still 302 here (old ads/emails).     │
│  Custom domain target: shop.noodlebomb.co (when Wix is migrated).  │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  shop.noodlebomb.co  (Wix — LEGACY, subscription-only)             │
│  4 active Monthly Box subscribers. Existing billing pages stay.    │
│  NEW commerce traffic does NOT go here. No public storefront role. │
│  No links from noodlebomb.co. Will be retired after subs migrate.  │
└────────────────────────────────────────────────────────────────────┘
```

Since the 2026-05-07 "forever fix", PDPs and the shop lineup have moved
BACK onto the brand domain (local static pages); Shopify remains the
checkout. Browsing happens on noodlebomb.co, paying happens on Shopify.

## Canonical URL Table

| What | Canonical URL | Hosted on |
|------|---------------|-----------|
| Homepage | https://noodlebomb.co/ | Netlify |
| Shop (lineup) | https://noodlebomb.co/shop | Netlify (shop.html) |
| PDP — Original | https://noodlebomb.co/original-ramen-sauce | Netlify |
| PDP — Spicy Tokyo | https://noodlebomb.co/spicy-tokyo-ramen-sauce | Netlify |
| PDP — Citrus Shoyu | https://noodlebomb.co/citrus-shoyu-ramen-sauce | Netlify |
| PDP — Spicy Shoyu | https://noodlebomb.co/spicy-shoyu-ramen-sauce | Netlify |
| PDP — Shoyu Reserve | https://noodlebomb.co/shoyu-reserve | Netlify |
| PDP — Fire Dust | https://noodlebomb.co/fire-dust | Netlify |
| PDP — Roasted Garlic Sesame | https://noodlebomb.co/roasted-garlic-sesame | Netlify |
| Trio bundle page | https://noodlebomb.co/ramen-sauce-trio | Netlify |
| Seasonings line | https://noodlebomb.co/seasonings | Netlify |
| About / Recipes / FAQ | https://noodlebomb.co/{about,recipes,faq} | Netlify |
| Monthly Box | https://noodlebomb.co/monthly-box | Netlify |
| Rewards | https://noodlebomb.co/rewards | Netlify |
| Wholesale | https://noodlebomb.co/wholesale | Netlify |
| Cart | https://noodlebomb.co/cart | Netlify |
| Checkout handoff | https://noodlebomb.co/checkout → Shopify | Netlify → Shopify |
| Shopify checkout | https://nu2vqa-ma.myshopify.com/checkouts/* | Shopify hosted |
| Monthly Box subs (legacy) | https://shop.noodlebomb.co/* | Wix (do not link) |

## Redirect Map (noodlebomb.co)

Behavior verified against production 2026-07-01; defined in `_redirects`
and `netlify.toml` (keep both in parity — Netlify reads `_redirects` first).

| From | To | Code |
|------|----|----|
| /shop | /shop.html | 200 (rewrite) |
| /shop/* | /shop?s=:splat | 301 |
| /product/original-ramen | …/products/original (Shopify) | 302 |
| /product/spicy-tokyo | …/products/spicy-tokyo (Shopify) | 302 |
| /product/citrus-shoyu | …/products/citrus-shoyu (Shopify) | 302 |
| /product/trio, /product/the-noodlebomb-trio | …/products/the-noodlebomb-trio | 302 |
| /product/{fire-dust,roasted-garlic-sesame,shoyu-reserve} | root slugs | 301 |
| /product/* (other) | 404 | 404 |
| /product-page/* | …/collections/all (Shopify) | 302 |
| /cart-page | …/cart (Shopify) | 302 |
| /category/* | …/collections/:splat (Shopify) | 302 |
| /ramensauce, /ramensauce-1, /ramensauce-2 | Shopify PDPs | 302 |
| /product-{original,spicy,citrus,spicy-shoyu}.html | pretty URLs | 301 |
| /cart, /checkout | /cart.html, /checkout.html | 200 (rewrite) |
| /about, /recipes, /faq, /monthly-box, /privacy, /terms, /shipping-returns, /rewards, /wholesale, /seasonings, product slugs | /*.html | 200 (rewrite) |
| /src/*, /public/*, /node_modules/*, config files | /404.html | 404 |

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
