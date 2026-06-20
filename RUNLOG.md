# RUNLOG

## 2026-06-20 — Install Google Analytics 4 / Google tag (G-34HRPRKYCQ) on noodlebomb.co

**Task:** Shopify "Google & YouTube" app reported "Google tag wasn't detected on noodlebomb.co" because the storefront at noodlebomb.co is the custom front-end in this repo (Netlify), not the stock Shopify storefront, so the app can't auto-inject the tag. Installed the official gtag.js site-wide.

### Architecture finding
- **Host:** Netlify project `charming-gumption-458521` (site id `0d8a31c3-6568-444f-ab8a-6320885b6eca`, team NoodleBomb). Custom domain `noodlebomb.co`.
- **Build:** static site. `index.html` is a React shell hydrated by `build/app.js` (home + bundle builder + order-map globe). All other routes are individual static `*.html` pages at repo root (product PDPs, ~40 SEO landing pages, cart/checkout, about/faq/etc.). There is **no shared server-rendered head component** — each page owns its own `<head>`.
- **Existing GA state:** only `index.html` carried a **disabled GA4 stub** (`<!-- GA4 — Disabled … -->` + an empty `dataLayer`/`gtag` shim, no measurement ID, no gtag.js loader). Every other page had **no** GA at all. No live property tag existed → no double-tagging risk.
- **Source-of-truth caveat (per [[nb-prod-deploy]]):** prod = manual Netlify CLI deploy from a live-pinned working copy; git `main`/working tree are behind/diverged from prod. So the deploy was built from **current live bytes + the GA edit only**, NOT from git.

### Change
- Added the official Google tag in `<head>` of **all 56 live HTML pages**:
  ```html
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-34HRPRKYCQ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-34HRPRKYCQ');
  </script>
  ```
- `index.html`: the disabled GA4 **stub was replaced** with the live tag (one tag per page, no second dataLayer shim).
- All other 55 pages: tag inserted immediately after `<head>`.
- The Google Search Console verification file `googleb57d395bf4960168.html` was intentionally left untouched.

### Deploy (Netlify CLI, `env -u NETLIFY_AUTH_TOKEN`, authed as Mike G / NoodleBomb)
- **Rollback point (prior live):** `6a347139af67484efc534038`
- Deploy dir built on **C:** (`C:\tmp\nb-ga-deploy`) because writing the tree to the `A:` drive crashes node's `cpSync`. Every text asset pinned to live bytes; 32 working-tree-only dev files (`.env`, `*.jsx` source, draft/LIVE screenshots, lockfiles, configs) pruned so the dir == live + GA only.
- **Draft 1:** `6a36f03eb9fdc401a1716ee6` (pre-prune)
- **Draft 2 (verified):** `6a36f14b36213333c293fe99`
- **Production:** `6a36f194442f7d37b9642770` — published 2026-06-20.
- 313 files + 1 function (`order-map`, bundled from repo, unchanged). No NB_CACHE/SW bump needed: the SW serves HTML **network-first**, and no cached asset changed.

### Gates
- **GA gate (custom):** deploy dir == live byte-for-byte for every fetchable file except the 56 GA pages; each GA page reverses to exact live bytes (GA is the only delta) and carries exactly one `gtag/js?id=G-34HRPRKYCQ` + one `config`. Cart-shell (`cart-store.js`, `shopify-config.js`, `build/app.js`, `build/components.js`) byte-identical to live. **PASS.**
- **Official `scripts/predeploy-check.mjs`:** 14 JS files parse OK; cart-store/shopify-config complete; sw.js NB_CACHE present. **PASS.**

### Live verification (noodlebomb.co)
- 12 representative pages (home, cart, checkout, about, seasonings, original PDP, fire-dust PDP, an SEO page, rewards, faq, monthly-box, recipes): all HTTP 200, exactly **1** gtag loader + **1** config in `<head>`, stub gone.
- Google serves `gtag.js?id=G-34HRPRKYCQ` → HTTP 200 and the served script references the ID → property is provisioned; the tag fires a GA `collect` call when a browser loads any page.
- Pruned junk confirmed not served: `/draft-firedust-mobile.jpeg` → 404, `/.env` → 404.

### Note on conversion stitching
Browse/traffic events now fire from **noodlebomb.co** (this front-end). **Purchases complete on the Shopify checkout (separate domain)** — that purchase conversion event still depends on the **Shopify-side** Google tag (the Google & YouTube app handles checkout pages). GA4 stitches the two via the shared measurement ID.
