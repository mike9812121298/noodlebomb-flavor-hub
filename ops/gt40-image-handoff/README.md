# GT40 Marine image handoff

Asset inventory pulled from the live https://gt40marine.com (Netlify-hosted Next.js
storefront) so missing images in the GT40 app (`mike9812121298/pwclab-testflight`)
can be filled in. This session was scoped to `noodlebomb-flavor-hub` only, so the
artifacts are staged here for pickup by a session running in the app repo.

## Contents

- `gt40-image-manifest.csv` — all 112 unique images referenced by the live site,
  one row per image: `url, first_seen_page, alt_or_product`. Covers the home,
  about, faq, gelcoat, guides, products/shop, stages, where-we-run, and
  wholesale pages.
- `fetch-gt40-images.sh` — downloads everything in the manifest into
  `./gt40-images/` (default; pass a different output dir as `$1`). Site-local
  assets keep their paths (`v5/…`, `globe/…`, `icons/…`); CDN files land in
  `wix/` and `shopify/` with readable names. Verified end-to-end: 112 files,
  ~85 MB, no empty downloads.

## Source breakdown

| Source | Count | What |
|---|---|---|
| `gt40marine.com/v5/…`, `/globe/…`, `/icons/…` | 17 | Logo, hero carousel, ski model cutouts, stage-kit promo, PWA icons — local assets in the live deploy |
| `static.wixstatic.com/media/a4d090_…` | ~70 | Product photography (Wix Media Manager, account `a4d090…`) |
| `cdn.shopify.com/s/files/1/0719/7071/7738/…` | ~25 | Newer product photos (Shopify store files) |

All 118 product cards on the live /products page have images, so the live site is a
complete source — `alt_or_product` in the manifest maps each CDN image to its
product name for matching against gaps in the app.
