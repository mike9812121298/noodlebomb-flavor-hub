# Readable phone lineup: Everyday Extraordinary + Shoyu Reserve

On phones, the homepage's **Everyday Extraordinary** artwork and the **Shoyu
Reserve** section shrink a desktop layout down to phone width. Measured on an
iPhone Pro Max (440px wide), 2026-09-22:

| Element | On the phone now | With this module |
|---|---|---|
| Icon captions, small labels | ~6px | 12px minimum |
| Taglines (small caps) | ~8px | 13px |
| Intro and card copy | ~8–9px | 16–17px |
| Card titles | ~17–19px | 30px |
| Prices | ~15–16px | 26px |
| Add to cart | ~21–25px tall, ~9.5px text | 50px tall, 16px text |
| Icon + caption pairs | 22 | 0 |

This module is the phone version of both sections, rebuilt with the words as
live text. It keeps the same artwork, colors and copy. Below 900px it replaces
the originals; desktop does not change.

## Files

- `home-lineup.css` scopes every style under `.nbx`, so nothing leaks into the
  rest of the page.
- `home-lineup.js` handles one-tap add through `window.NB_CART`
  (cart-store.js), so Meta Pixel and GA4 AddToCart fire the same way they do
  everywhere else on the site. Without the cart store, each button's href
  (`/cart?add=<slug>&qty=1`) adds the item on the cart page instead.
- `sections.html` holds the two blocks to paste.

## Integrate (about 10 minutes, in the folder production deploys from)

1. Add `class="nbx-hide-mobile"` to the live Everyday artwork section and to
   the live Shoyu Reserve section.
2. Paste the Everyday block from `sections.html` directly after the Everyday
   section, and the Reserve block directly after the Reserve section.
3. Replace the image placeholders with files the live sections already use,
   so phones download nothing new:
   - `{{EVERYDAY_ART}}`: the Everyday artwork (the 2:3 image, used twice).
   - `{{RESERVE_HERO}}`: the Reserve hero image with the soy pour.
   - `{{RESERVE_PANEL_ORIGINAL}}`, `{{RESERVE_PANEL_SPICY}}` and
     `{{RESERVE_PANEL_BLACK_GARLIC}}`: the three bottle scenes.
4. In `<head>`:
   ```html
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Satisfy&display=swap">
   <link rel="stylesheet" href="/home-lineup/home-lineup.css">
   ```
   Before `</body>`, after `cart-store.js`:
   ```html
   <script defer src="/home-lineup/home-lineup.js"></script>
   ```
   Inter is already on the page. Desktop never renders `.nbx`, so it never
   downloads the two new fonts.
5. Check at 390px and 440px widths. Nothing should be under 12px, every tap
   target should be 44px or more, and nothing should scroll sideways.

## Tuning a crop

Each artwork slice sits in a `.nbx-crop` box with four values. All four are
fractions of the image's **width**, so they hold at any resolution:

- `--cx` and `--cy` set the slice's left and top edges.
- `--cw` and `--ch` set its width and height.

If a band shows the wrong slice, raise `--cy` to move it down or lower it to
move it up. The Everyday values are exact: they were measured from the live
2:3 artwork. The Reserve hero values assume the hero image spans the full
section width, so check them once against the real file.

## Notes

- **Black Garlic "Notify me at launch"** opens an email field in place. It
  posts to formsubmit.co like the footer newsletter, so the Klaviyo intercept
  in `page-shared.js` picks it up once Klaviyo is configured. If the live page
  already has its own notify flow, point the form there instead.
- **Anchors:** if nav links point at an id on either original section, those
  links won't work on phones while the section is hidden. Add the same target
  to the new block, e.g. `#nbx-everyday` or `#nbx-reserve`.
- **Service worker:** if the live `sw.js` precaches `index.html`, bump
  `NB_CACHE` so returning visitors get the new markup.
