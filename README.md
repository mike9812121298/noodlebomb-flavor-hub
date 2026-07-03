# NoodleBomb — noodlebomb.co

Production brand site for NoodleBomb small-batch ramen sauces and seasonings.
Static HTML served from the repo root on Netlify, with a small React layer
compiled by esbuild.

## Architecture

- **Pages** — every `*.html` at the repo root is a served page (homepage,
  PDPs `product-*.html`, `shop.html`, `seasonings.html`, `monthly-box.html`,
  `rewards.html`, `wholesale.html`, ~35 recipe/use-case SEO pages
  `sauce-for-*.html` / `ramen-sauce-*.html`, legal pages, `404.html`,
  `offline.html`).
- **Pretty URLs** — `netlify.toml` + `_redirects` (kept in parity) map
  canonical slugs to files, e.g. `/original-ramen-sauce` →
  `product-original.html`, `/shoyu-reserve` → `product-shoyu-reserve.html`.
  SEO pages rely on Netlify's default `/<slug>` → `<slug>.html` resolution.
- **React layer** — `npm run build:static` compiles `app.jsx`,
  `components.jsx`, `next-drop.jsx`, `monthly-drop.jsx`, `cart.jsx`,
  `checkout.jsx` → `build/*.js` (gitignored; Netlify builds on deploy).
  The homepage boot-loads react + `build/app.js` after first paint;
  `cart.html` / `checkout.html` mount `build/cart.js` / `build/checkout.js`.
- **Commerce** — the local cart (`cart-store.js`, localStorage) hands off to
  Shopify checkout via the Storefront API (`shopify-config.js`,
  `shopify-checkout.js`); `attribution.js` carries UTM/click IDs through.
  Canonical URL policy: `CANONICAL_URL_MAP.md`.
- **Analytics** — GA4 `G-34HRPRKYCQ` on every content page.
- **Rewards** — Smile.io headless launcher (`page-shared.js`) +
  `/rewards` page, config in `rewards-config.js`.
- **PWA** — `sw.js` precaches the app shell; bump `NB_CACHE` whenever a
  precached asset changes.

## Source-of-truth warning

The six `*.jsx` files were reconstructed 2026-07-01 from the live compiled
bundles (the original JSX-sugar sources lived only in the local deploy
tree). They are valid esbuild input and rebuild to the exact live bundles,
but read as compiled `React.createElement` code. If you still have the
original JSX sources in a deploy tree, prefer committing those.

`src/` is the dormant pre-2026-05 Vite SPA kept for reference; it is not
built or served (`/src/*` is 404-blocked). `ops/` is an internal CRM tool,
also 404-blocked.

## Develop

```sh
npm install
npm run build:static   # compile the JSX layer into build/
python3 -m http.server 8080   # serve the repo root
```

Deploys: Netlify runs `npm run build:static` (see `netlify.toml`) and
publishes the repo root. Keep `VITE_FACEBOOK_PIXEL_ID` unset locally —
the build injects it into HTML in place when present.
