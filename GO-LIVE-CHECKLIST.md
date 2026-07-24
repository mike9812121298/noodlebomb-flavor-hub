# NoodleBomb Go-Live Checklist (2026-07-02)

Owner actions, in priority order. Each unlocks something already built on
branch `claude/noodle-bomb-audit-6xss78` (PRs #19 / #20).

## 1. Shopify prices → unlocks THE DEPLOY (reviews, bundle, all fixes)

Shopify admin → Products → edit each variant price:

| Product | Variant ID | Change to |
|---|---|---|
| Original Ramen Sauce | 53998041596214 | **$12.99** |
| Spicy Tokyo Ramen Sauce | 53998042120502 | **$12.99** |
| Citrus Shoyu Ramen Sauce | 53998041071926 | **$12.99** |
| Shoyu Reserve | 54006619636022 | **$12.99** |
| Shoyu Reserve — Spicy | 54097354686774 | **$12.99** |
| Ramen Sauce Trio | 53998042644790 | **$32.99** |

The session watches `products.json`; when all six show the new prices,
PR #20 merges to `main` (= production deploy of the whole reconciled
tree) per owner instruction 2026-07-02 ("get the reviews live").

## 1b. Every price change must also reach the ad platforms

**Added 2026-07-24 after a miss.** The $11.99 → $12.99 change above shipped to
the site and Shopify on 2026-07-02 and was verified "sitewide, zero $11.99
residuals" — but *sitewide* meant this repo. A live Meta ad kept quoting $11.99
for the next 22 days, and none of the monitoring noticed, because it all watches
spend and ROAS rather than ad copy.

Ad copy lives **only in Meta Ads Manager**. It is not in this repo, so it never
appears in a diff, never gets reviewed, and no CI check can see it. It has to be
walked manually.

When any price, size, or product claim changes, check every surface:

- [ ] Site (this repo) — PDP copy + Product JSON-LD + `cart-store.js` catalog
- [ ] Shopify variant prices (section 1 above)
- [ ] **Meta Ads Manager** — primary text, headline, and description of every
      ACTIVE ad; also paused ads you may re-enable
- [ ] Meta/Instagram Shop catalog feed, if a product feed is connected
- [ ] Amazon, Walmart, Etsy, eBay listings
- [ ] Klaviyo flow + campaign templates with hardcoded prices
- [ ] Wholesale sheet MSRP (`wholesale.html`)

An ad quoting a price checkout will not honor is a Meta policy risk, not only a
brand one.

**Automated backstop:** `openclaw-mission-control` now runs an ad-claims
watchdog every 6 hours (`.github/workflows/ad-claims.yml`) that reads live Meta
ad copy and diffs it against live noodlebomb.co prices, heat levels, and sizes.
It needs the `META_ACCESS_TOKEN` and `META_AD_ACCOUNT_ID` repo secrets set there
to read anything; until then it reports UNCHECKED rather than green. Treat it as
a safety net, not a substitute for the list above.

## 2. Welcome popup → email capture + first-order offer

1. Shopify admin → Discounts → create code `WELCOME10` (10% off, first
   order / one use per customer).
2. Edit `welcome-popup.js`: set `enabled: true` (code/copy already match
   `WELCOME10`; adjust if you pick a different code).

## 3. Klaviyo → real email flows (welcome, abandoned cart)

1. Create a Klaviyo account wired to the Shopify store; make a list
   ("Flavor Club"); grab the **public API key** (a.k.a. company ID,
   6–7 chars) and the **list ID**.
2. Edit `page-shared.js` → `NB_KLAVIYO = { companyId: '…', listId: '…' }`.
   Every footer email form on every page then subscribes to Klaviyo
   (formsubmit.co stays as the fallback). Also update
   `welcome-popup.js` `formAction` if you want the popup on Klaviyo too.
3. In Klaviyo, turn on: Welcome series (deliver WELCOME10), Abandoned
   checkout, Browse abandonment, Post-purchase review request.

## 4. Judge.me (or Loox) → first-party reviews + Google stars

1. Install from the Shopify app store (Judge.me free tier is fine).
2. Turn on the post-purchase review-request email (~14 days after
   delivery) and import/solicit past-customer reviews.
3. Then ask Claude to wire `aggregateRating` structured data on the PDPs
   (deliberately NOT done for the Amazon quotes — Google requires
   first-party reviews).

## 5. Subscribe & Save → recurring revenue

1. Shopify: add a subscription app (native subscriptions or Appstle
   etc.), create selling plans on the sauce products (suggest 10–15%
   off, every 30/45/60 days).
2. Send the **SellingPlan IDs** (`gid://shopify/SellingPlan/…`) to
   Claude → the PDP/bundle toggle UI gets added. The cart/checkout
   plumbing already passes `sellingPlanId` end-to-end (cart-store.js →
   shopify-checkout.js cartCreate).
3. Longer term: migrate the 4 Wix Monthly Box subscribers to Shopify,
   then retire Wix (see CANONICAL_URL_MAP.md).

## 6. Reserve Drop bundle (optional AOV play)

Create a "Reserve Drop" product in Shopify (~$33.99: Shoyu Reserve +
Spicy Shoyu + Fire Dust). Send the variant ID → site wires it using the
trio line-item pattern.

## 7. Traffic

- **Search Console**: verify noodlebomb.co (DNS TXT, or send Claude the
  HTML-file token to commit), then submit `https://noodlebomb.co/sitemap.xml`.
- **Meta pixel**: already firing site-wide (ID 976149235141968 in
  cart-store.js / page-shared.js) — confirm it matches the Business
  Manager pixel, then a small retargeting budget can run against it.
- **SEO landing pages**: the 34 `sauce-for-*` pages need real photos to
  rank; supply photography when available.

## Already done, waiting only on the deploy

Review marquee (13 real Amazon reviews) · full bundle builder lineup ·
$12.99/$32.99 verbiage everywhere · free shipping at $32.99 · shop
quick-add · cart price hardening · mobile iOS crash mitigations ·
SEO/JSON-LD fixes · sitemap.
