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


---
## 2026-06-20 — GOD MODE 3-fix deploy attempt (Cowork/Desktop Commander) — HELD pre-deploy for decision

**Baseline:** Mirrored live (deploy 6a36f194442f7d37b9642770, published 2026-06-20 20:01) from noodlebomb.co into `.nbov-live`.
- 312/313 files fetched and SHA1-verified EXACTLY against tmp/nbov/files.json.
- `/netlify.toml` (313th): NOT publicly served (404), API returns metadata only, not in git history (max committed 12,139B vs live 19,102B), not on disk. Genuinely unobtainable byte-for-byte.
  - Reconstructed from repo netlify.toml + 3 redirect rules recovered from `.netlify/netlify.toml` resolved dump (`/rewards`, `/spicy-shoyu-ramen-sauce`, `/product-spicy-shoyu.html`), all 3 verified live. Reconstruction resolves to EXACTLY the live ruleset: 102 redirects (set-equal), 10 headers (set-equal), same build/functions. RULE-equivalent, not byte-identical (sha d6de3a48…).

**Fix status vs live reality:**
- (c) GA4 G-34HRPRKYCQ: ALREADY LIVE & FIRING site-wide (56/57 HTML files; index head has gtag.js + config). Commit 0227fd0 already in live. NO CHANGE NEEDED.
- (a) RGS image: PDP + homepage strip reference /uploads/nb-roasted-garlic-sesame-{front,angled,back}-2026-06-16.webp — ALL 404 on live (never uploaded; the rollback baseline predates them). Produced clean transparent FRONT webp from real white-bg upload (nb-roasted-garlic-sesame-upload-2026-05-17.png, 1122×1402), border-flood cutout + edge feather, verified no halo on dark bg. Saved to A:\Documents\Claude\ and staged in .nbov-live/uploads. angled/back have no real source (only placeholders) — not produced.
- (b) Citrus bottom-crop: not yet confirmed against live render; will not guess-edit live brand CSS without confirmation.

**HELD before prod deploy pending Mike's direction (no deploy performed; rollback id 6a36f194442f7d37b9642770 unused).**


---
## 2026-06-21 — IMAGE-404 FIX shipped to PROD (Cowork live-baseline overlay)

**Method:** live-baseline overlay. Copied verified live mirror `.nbov-live` → `.nbov-ship`; edited only the broken image refs; gate + manifest-diff; `netlify deploy --dir .nbov-ship` (draft → prod) with token unset so NB login is used. Functions (`order-map`) bundled from `netlify/functions`.

**Root cause:** a batch of `*-2026-06-15` hero/lifestyle/pour + `*-2026-06-16` RGS angled/back/thumb + `nb-*-front-2026-06-18` refs were wired into HTML but never uploaded → hard 404s. Not a webview quirk.

**Fix:** 81 ref replacements across 13 HTML files, each broken ref repointed to that product's existing loading front cutout:
- Original/Citrus/Spicy → `nb-<flavor>-front-cutout-v2-2026-06-07.webp`
- Fire Dust → `nb-fire-dust-front-cutout-2026-06-10.webp`
- Shoyu Reserve → `nb-shoyu-reserve-front-cutout-v2-2026-06-07.webp` (also fixes salmon/tuna/udon/seasonings/soy-sauce-for-noodles)
- Spicy Shoyu → `nb-shoyu-spicy-front-cutout-v1-2026-06-07.webp`
- Trio → `nb-trio-package-studio-v2.jpg`
- RGS angled/back/all thumbs → `nb-roasted-garlic-sesame-front-2026-06-16.webp`

**Gates:** manifest-diff = exactly 13 HTML changed (0 added/removed) + rule-equivalent netlify.toml. Syntax gate PASS (14 JS ok, cart-store/shopify-config complete, NB_CACHE present).

**Verification:** draft `6a3838315e379f7a06250b23` — all PDPs 0 broken, hero naturalWidth 606, order-map fn 200. Prod verified — all PDPs 0 broken, RGS PDP 0 broken.

**Deploy ids:** DRAFT `6a3838315e379f7a06250b23` · **PROD `6a3838a66a5a1f7c41b3453d`** · ROLLBACK `6a36f194442f7d37b9642770` (`netlify api restoreSiteDeploy` if needed).

**NOT in this deploy (deferred/flagged):** white-bg→transparent bottles (incl RGS, needs rembg pass); 3 dead routes (/build-your-bundle, /collections/all, /products/shoyu-reserve); mobile button-label overflow; ingredient/allergen correction (needs canonical Amazon source at high confidence). Image heroes/lifestyles are front-cutout stopgaps — see reshoot list.


---
## 2026-06-21 — DEPLOY #2 (routes + mobile CSS) shipped to PROD; transparency & ingredients resolved by inspection

**PROD deploy id:** `6a3841dbc994adc8902f0589` · **ROLLBACK baseline:** `6a3838a66a5a1f7c41b3453d` (deploy #1).
Method: same live-baseline overlay on `.nbov-ship`; gate PASS; `netlify deploy --dir .nbov-ship` draft → verify → `--prod`.

**Changed files (vs deploy #1):** `netlify.toml` (config, redirects), `page-shared.css` (mobile CTA fix), `sw.js` (NB_CACHE v34→v35). order-map function preserved.

1. **Dead routes (FIXED + verified on prod):**
   - `/products/shoyu-reserve` → `/product/shoyu-reserve` (200)
   - `/collections/all` → Shopify Products storefront (real-nav verified; bare fetch 404 was stale SW, self-heals on v35)
   - `/build-your-bundle` → `/shop` → Shopify
   - ALSO restored 3 live redirect rules deploy #1 had dropped (root netlify.toml was 99 rules vs live 102): `/rewards`, `/spicy-shoyu-ramen-sauce`, `/product-spicy-shoyu.html` — all verified 200. Root netlify.toml now carries the full 105-rule set (102 live-equivalent + 3 new).

2. **Mobile button overflow (FIXED, caveat):** appended scoped `@media (max-width:600px)` rule to page-shared.css so CTA pills (.nav-cta/.drawer-cta/.pdp-cta/.mobile-pdp-bar a/.btn/.btn-accent/.hero-cta-row a/.lineup-buy-btn/.trio-bundle-cta/.bundle-add/.sticky-cart-bar a) wrap instead of clip. Desktop provably unaffected (scoped). NOTE: mobile viewport could not be emulated in tooling (resize_window didn't narrow innerWidth), so the mobile render was not pixel-verified — eyeball on a phone; instant rollback available.

3. **White-bg→transparent (NO CHANGE NEEDED — verified):** alpha analysis of every PDP main image post-deploy#1 shows all are clean transparent cutouts (edge_transp 0.5–1.0, white_edge 0.0): original/citrus/spicy/shoyu-reserve/spicy-shoyu front-cutout-v2/v1, fire-dust front-cutout, RGS front-2026-06-16 (edges 100% transparent). Only the Trio uses a neutral light-gray studio JPG (loads fine; not a halo). The audit's "7 white-bg" reflected the pre-deploy#1 state. rembg not required.

4. **Ingredients/allergens (FLAGGED — NOT changed, deliberately):** the live Amazon Original listing conflicts fundamentally with the site copy — Amazon lists chicken stock, beef bouillon, Worcestershire (ANCHOVIES → undeclared FISH allergen), honey, sriracha, ginger, and "no MSG"; the site lists kombu + MSG, contains wheat/soy only, 7 fl oz vs Amazon 5 oz. Cannot confirm canonical at high confidence; per guardrail, did NOT guess allergen text. Needs physical-label source from Mike. (Sources: Amazon B0DVLPBKRN.)

**Verification:** prod redirects ✓, Original PDP hero loads + 0 broken images ✓, order-map preserved ✓, manifest-diff = only the 3 intended config/asset files vs deploy #1 ✓, gate PASS ✓.


---
## 2026-06-21 — DEPLOY #3 (cart-drawer 3-fix) shipped to PROD — Cowork live-baseline overlay

**PROD deploy id:** `6a386e8daf6748085d5342ac` · **DRAFT:** `6a386df9e5c27202e0b994c0` · **ROLLBACK baseline:** `6a3841dbc994adc8902f0589` (deploy #2).
Instant restore: `netlify api restoreSiteDeploy --data '{"deploy_id":"6a3841dbc994adc8902f0589"}'` (run with NETLIFY_AUTH_TOKEN unset so Mike's NB login is used).

**Baseline note (IMPORTANT):** `.nbov-live` was STALE (sw v34, pre deploy#1/#2) — overlaying on it would have REVERTED today's image-404 + route/mobile fixes. The true current-live tree = `.nbov-ship` (sw v35 == published deploy #2). Overlay was built on a fresh copy `.nbov-cart` (robocopy /MIR of `.nbov-ship`), edited, gated, deployed. `.nbov-cart` now == live (deploy #3) — use it as the next baseline.

**Changed files (manifest-diff vs live `.nbov-ship` — exactly 3):**
- `build/components.js` (cart-drawer Nav bundle) — Fix 1 + Fix 3
- `uploads/nb-roasted-garlic-sesame-front-2026-06-16-thumb.webp` — NEW (transparent, 400x400, 28,688 B) — Fix 2
- `sw.js` — NB_CACHE v35 -> v36 (required: `build/components.js` is precached & served cache-first; without the bump returning visitors keep the old bundle)

**The 3 fixes (cart drawer / mini-cart upsell rows in components.js):**
1. **Thumbnails 2x:** Fire Dust / RGS "Power up your cart" thumbnail box 44x44 -> 88x88 (padding 3->6). Row is flex/auto-height; label+tag ellipsize, Add button intact, no overlap.
2. **RGS white box -> transparent:** root cause = referenced `...front-2026-06-16-thumb.webp` was never uploaded (404) -> empty light `--paper-3` box read as a white box. Generated the missing thumb from the verified-transparent `nb-roasted-garlic-sesame-front-2026-06-16.webp` (edges alpha 0) at the exact path the code already expects — no JS ref change. Now shows the bottle like Fire Dust.
3. **Banner middot:** components.js carried a literal double-backslash `"\\u00b7"` in the free-shipping line -> rendered the literal `·`. Replaced with `\xB7` (the file's working middot convention) -> renders `... FREE US SHIPPING · ELSE $3.50 FLAT`.

**Gates:** `scripts/predeploy-check.mjs` on `.nbov-cart` PASS (14 JS parse OK; cart-store/shopify-config complete; NB_CACHE present). `new Function()` parse of edited components.js OK. Manifest-diff = +1 / ~2 / -0 (only intended files).

**Verification:**
- DRAFT (clean origin, no SW): banner `... FREE US shipping · else $3.50 flat` (middot true, literal-escape false); RGS upsell thumb naturalWidth 400 in 88x88 box; Fire Dust 88x88.
- PROD raw HTTP (no cache): `/build/components.js` 200 -> box88 + `\xB7` + no `\\u00b7`; RGS thumb 200 image/webp 28,688 B; Fire Dust thumb 200; `sw.js` NB_CACHE v36; `order-map` fn 200 (preserved); getSite.published_deploy.id == 6a386e8daf6748085d5342ac (ready).
- Scope check: homepage seasoning strip (separate 44px component) intentionally unchanged — edit was confined to the cart drawer.
- SW: returning visitors self-heal to v36 (skipWaiting + clients.claim + activate purge of v34/v35) on next load.

**Caveat:** Chrome `resize_window` did not narrow `innerWidth` (same limit logged in deploy #2); drawer render is viewport-independent so the 3 fixes hold at mobile width. Desktop Commander reconnects handled with retries — no duplicate deploys.


---
## 2026-06-21 — DEPLOY #4 (checkout email-gate hardening) shipped to PROD — Cowork live-baseline overlay

**PROD deploy id:** `6a38772134af397f02db27c7` · **DRAFT:** `6a38754de5c27211a6b99481` · **ROLLBACK baseline:** `6a386e8daf6748085d5342ac` (deploy #3).
Instant restore: `netlify api restoreSiteDeploy --data '{"deploy_id":"6a386e8daf6748085d5342ac"}'` (run with NETLIFY_AUTH_TOKEN unset so Mike's NB login is used).

**Baseline note:** current-live tree = `.nbov-cart` (== deploy #3). Overlay built on a fresh `robocopy /MIR` copy `.nbov-gate`, edited, gated, deployed. `.nbov-gate` now == live (deploy #4) — use it as the next baseline. `.nbov-live` remains STALE; do not use.

**FILE-LOCATION CORRECTION (important for future edits):** the checkout email gate / PAY handler is NOT in `build/components.js` (that is the Nav/cart-drawer bundle). It lives in `checkout.jsx` → compiled `build/checkout.js`, which is what `checkout.html` loads. The task brief said components.js; the real file is checkout.js. Source `checkout.jsx` was edited and rebuilt with esbuild (verified byte-identical to live before editing, so the rebuild is a clean single-file diff).

**Changed files (manifest-diff vs live `.nbov-cart` — exactly 2):**
- `build/checkout.js` — email-gate hardening (rebuilt from edited `checkout.jsx`)
- `sw.js` — NB_CACHE v36 -> v37 (required: `build/checkout.js` is served **cache-first** by the SW fetch handler — runtime-cached even though not in the precache list — so returning visitors who had hit /checkout would otherwise keep the old bundle)

**The fix (root cause of "can't reach checkout"):** both PAY buttons (desktop summary + sticky-mobile) were `disabled={!emailValid || redirecting}`. With an empty/invalid email the button was DISABLED, so the onClick `proceed()` never fired and its `setEmailTouched(true)` feedback never showed — a dead, greyed button. Changes:
1. Buttons now `disabled={redirecting}` only — clickable with an invalid email so the handler runs.
2. `proceed()` bail now: `setEmailTouched(true)` + focus the email input (`focus({preventScroll:true})` w/ fallback) + `scrollIntoView({block:'center'})`.
3. Email `<input>` gains `ref`, `aria-invalid={emailTouched && !emailValid}`, `aria-describedby="checkout-email-error"`.
4. Error `<div>` gains `id="checkout-email-error"` + `role="alert"`; message is now `email.trim()===''` ? "Enter your email to continue." : "Please enter a valid email address."
The valid-email path (validEmail → NB_SHOPIFY_CHECKOUT.createCheckoutUrl → window.location) is UNCHANGED.

**CART-QTY VERDICT (6→11 bottles across reloads): TEST ARTIFACT — no code change.** Ran a reload-inflation harness (`tmp/cart-reload-test.cjs`, vm-loads the live `.nbov-cart/cart-store.js` against a shared mock localStorage): 5 plain reloads of a 6-bottle cart (singles AND 2×trio) leave qty unchanged; the `?add=` path adds exactly once and `history.replaceState` strips the param so subsequent reloads don't re-add. The ONLY way to accumulate across "reloads" is keeping `?add=` in the URL every load (user/test-driven nav) — not a localStorage merge. `safeRead` returns the stored array verbatim; `add` merges by slug+attributes; no v1→v2 migration re-add. cart-store.js left untouched.

**Gates:** `scripts/predeploy-check.mjs .nbov-gate` PASS (14 JS parse OK; cart-store/shopify-config complete; NB_CACHE v37 present). esbuild rebuild diff vs live = exactly the 5 intended edits. Manifest-diff = ~2 / +0 / -0 (only checkout.js + sw.js).

**Verification:**
- DRAFT (`6a38754de5c27211a6b99481`, real Chrome via Cowork): seeded 2×Original → /checkout. Empty-email PAY → inline "Enter your email to continue." (role=alert), input aria-invalid=true + error border, focus moved to email, stayed on /checkout (button NOT dead). Entered valid email → PAY → **redirected to Shopify hosted checkout** (`shop.app/checkout/...`, "Checkout - NoodleBomb", 2×Original, $26.98) — redirect fires; not stuck on /cart. So the email gate WAS the root cause; shopify-checkout.js needed no change.
- PROD raw HTTP (no cache): published_deploy.id == 6a38772134af397f02db27c7 (state ready); `/build/checkout.js` 200 has new message + `disabled: redirecting` + no `disabled: !emailValid`; `/sw.js` NB_CACHE v37; `/.netlify/functions/order-map` 200 (preserved).
- Returning visitors self-heal to v37 (SW activate purges v36) on next load.

**Caveat:** Desktop Commander reconnected mid-run (flap); deploys are single-shot, no duplicates (verified one PROD deploy id).


---
## 2026-06-22 — DEPLOY #5 (transparent real-label cutouts site-wide + upsell strip fix) — Cowork live-baseline overlay

**PROD deploy id:** `6a393377114aa9e820a2bb22` (noodlebomb.co, state ready) · **DRAFT:** `6a39324ed93f96e724a7f1d7` · **ROLLBACK baseline:** `6a38772134af397f02db27c7` (deploy #4).
Instant restore: `netlify api restoreSiteDeploy --data '{"deploy_id":"6a38772134af397f02db27c7"}'` (run with NETLIFY_AUTH_TOKEN unset so Mike's NB login is used).

**Baseline note:** current-live tree at start = `.nbov-gate` (== deploy #4, confirmed via getSite published_deploy.id before deploy). Overlay built on a fresh `robocopy /MIR` copy `.nbov-img22`, edited, gated, deployed. `.nbov-img22` now == live (deploy #5) — use it as the next baseline. `.nbov-live`/`.nbov-ship`/`.nbov-cart`/`.nbov-gate` are now stale.

**Objective:** wire the 7 verified transparent real-label cutouts (A:\Documents\Claude\NB_transparent_cutouts\, dated 2026-06-22) into every product-image surface in ONE deploy; kill white-bg/404/old-label bottle shots; fix the "add a shake" topper strip (Fire Dust 404, RGS white-bg, thumbs too small).

**Asset pipeline (PIL):** each new 2000x2000 RGBA cutout alpha-trimmed to the bottle bbox, padded 3%, downscaled to 1200px long side, encoded webp (q82 full / q85 thumb). 11 new files written to `.nbov-img22/uploads` (all corners alpha=0, transparency verified):
- Full: nb-{original,citrus,spicy-tokyo,fire-dust,roasted-garlic-sesame,shoyu-reserve}-cutout-2026-06-22.webp
- Thumb (400x400 contain): nb-{original,citrus,spicy-tokyo,fire-dust,roasted-garlic-sesame}-cutout-2026-06-22-thumb.webp

**Ref strategy:** NEW dated filenames + blanket repoint (cache-safe; OG was already webp->webp). OLD upload files kept on disk (zero 404 risk for any missed/social/schema ref). 408 refs repointed across 50 files (build/app.js, cart.js, checkout.js, components.js, page-shared.js, sw.js precache, 44 HTML incl. all 6 PDPs, recipe/sauce-for pages, seasonings, trio page schema image array).

**Upsell strips (both Fire Dust + RGS) — repointed to new cutouts + enlarged:**
1. **PDP topper "Finish your bowl / Shake on a topper"** (page-shared.js): thumb box `clamp(108px,24vw,132px)` -> `clamp(140px,30vw,176px)`, padding 8->6px. Fire Dust ref `nb-fire-dust-front-cutout-2026-06-10.webp` (404 on the live strip) -> `nb-fire-dust-cutout-2026-06-22.webp`; RGS `nb-roasted-garlic-sesame-front-2026-06-16.webp` (read white) -> `nb-roasted-garlic-sesame-cutout-2026-06-22.webp`.
2. **Cart-drawer "Power up your cart"** (build/components.js): thumb box 88x88 -> 112x112; FD/RGS thumbs -> new `-cutout-2026-06-22-thumb.webp`.

**SW:** NB_CACHE `v37-bundle-20260621` -> `v38-bundle-20260622` (page-shared.js + build/components.js + precached image entries changed; returning visitors self-heal on next load).

**Gates:** predeploy-check.mjs on `.nbov-img22` PASS (14 JS parse OK; cart-store/shopify-config complete; NB_CACHE v38). Manifest-diff vs `.nbov-gate` = +11 new webp / ~50 modified (6 JS/bundles + sw.js + 44 HTML) / -0 removed. Ref-integrity check: all 11 new refs resolve on disk; only pre-existing missing asset is `nb-hero-lineup-newlabels-2026-06-15.webp` (homepage hero composite, unchanged/out of scope).

**Verification — DRAFT `6a39324ed93f96e724a7f1d7`:** all 11 cutouts 200 image/webp; page-shared.js carries new FD+RGS refs + `clamp(140px,30vw,176px)` and old FD ref gone; components.js `width: 112` + new thumbs; sw v38; all 6 PDP HTML reference new cutouts; old files still 200 (no 404); order-map fn 200. Real-Chrome render of the topper on /citrus-shoyu-ramen-sauce: Fire Dust 573x1200 + RGS 566x1200 both load (not broken), transparent on dark tiles, 176x176 boxes, rows clean with Add buttons. Screenshot captured.

**Verification — PROD `6a393377114aa9e820a2bb22` (raw HTTP, no cache):** getSite published_deploy.id == 6a393377114aa9e820a2bb22 (ready); 6 new cutouts 200 image/webp on noodlebomb.co; sw v38; topper new refs + 176; cart drawer 112 + new thumbs; order-map fn 200.

**The 3 specific live bugs — FIXED & verified:** (1) Fire Dust upsell thumb 404 -> loads transparent cutout; (2) RGS upsell thumb white-bg -> transparent real-label cutout; (3) both upsell thumbnails enlarged (topper +33% to 176px, cart drawer 88->112).

**Still on a non-transparent/placeholder image (deliberately NOT forced):**
- **Shoyu Reserve Spicy** (product-spicy-shoyu.html): no real photo exists yet — left on current `nb-shoyu-spicy-front-cutout-v1` per instruction.
- **Trio:** visible instance on ramen-sauce-trio.html is an intentional wide cinematic studio JPG (loads fine, faint neutral bg, no 404); its other refs are og:image/twitter:image/schema across 8 static pages where a transparent webp would regress social cards. Left as-is; new `nb-trio-cutout-2026-06-22.webp` generated and available if we later want it on visible surfaces.
- **Homepage hero lineup** `nb-hero-lineup-newlabels-2026-06-15.webp`: pre-existing 404 (all-bottles composite, never uploaded; not a single-bottle cutout). Out of scope — needs a reshot/rendered lineup composite.
- Secondary PDP gallery views (back / side-panel / depth / angle / texture) left on existing assets — only the FRONT bottle + cart/upsell thumbs were swapped.

**Caveat:** Desktop Commander flapped twice mid-run + one CDP renderer timeout in Chrome; handled with retries and disk-logged deploy output — single DRAFT + single PROD deploy id, no duplicates (confirmed via getSite).


---
## 2026-06-22 — FRESH-WEEK P0 RE-AUDIT (verify-only; NO deploy) — Cowork live-baseline check

**Outcome: all 3 code-fixable P0s from the Fresh-Week audit are ALREADY RESOLVED on live prod `6a393377114aa9e820a2bb22`. No code change, no deploy.** The audit premises are stale — they pre-date Mike creating the RGS Shopify product (~2026-06-22) and the deploys that wired RGS, repointed Monthly Box → Shopify, and canonicalized www → apex. Rollback baseline (untouched): `6a38772134af397f02db27c7`. Live (untouched): `6a393377114aa9e820a2bb22`, SW `v38-bundle-20260622`.

**P0 #1 — Monthly Box links → Wix:** FALSE on live. `/monthly-box` + homepage CTAs all point to valid, PAYABLE Shopify subscription products; zero Wix links anywhere in deployable files.
- Verified via `cart/add.js`: id `54099648545078`+plan `8721727798` → "Monthly Ramen Box" $29.99/mo "Deliver every month"; id `54099648577846`+plan `8721695030` → "Premium Monthly Ramen Box" $39.99/mo.
- Real-browser: every subscribe CTA href = `nu2vqa-ma.myshopify.com/cart/add?...&selling_plan=...`; `anyWixLinks: []`. Grep of all deployable HTML/JS/CSS/TOML for `shop.noodlebomb.co` = EMPTY (only docs/`src/`/`tmp/`/`.nbov-*` copies still mention Wix; none deployed).

**P0 #2 — RGS unbuyable but addable → broken checkout:** FALSE on live. Mike created the Shopify product; RGS is now fully buyable and wired.
- Storefront API: product `roasted-garlic-sesame`, variant `54125810614582`, SKU `NB-RGS-3.2OZ`, barcode `00884400705570`, $10.99, availableForSale=true, in stock (headless channel).
- Live `shopify-config.js` maps `rgs: gid://…/54125810614582`; `build/app.js` sells RGS in BUNDLE_ADDONS/FINISHING_SPICES/lineup ($10.99, "In Stock"); `page-shared.js` topper adds it; PDP `/product/roasted-garlic-sesame` = "Add to cart — $10.99" (not Notify-me; schema price 10.99, InStock).
- `cartCreate` with the GID → valid checkoutUrl, $10.99, "NoodleBomb Roasted Garlic Sesame", 0 userErrors. Real-browser `NB_SHOPIFY_CHECKOUT.createCheckoutUrl([{slug:'rgs',qty:1}])` (updated SW v38 client) → valid Shopify checkout URL. So adding RGS at $10.99 is now CORRECT, not a broken checkout.
- KNOWN CAVEAT (not a regression, inherent): cache-first SW first-load lag — a returning visitor on a pre-rgs cached `shopify-config.js` executes the stale config for ONE navigation → RGS-only checkout throws "No mapped Shopify variants" / mixed cart drops RGS; self-heals next nav. A redeploy does not fix this.

**P0 #3 — www → bare Shopify (nu2vqa-ma.myshopify.com):** FALSE on live. `www.noodlebomb.co` 301-redirects (Server: Netlify) to apex `noodlebomb.co` across all paths, path-preserving (`/`, `/shop`, `/product/...`, `/monthly-box`, `/cart` all → apex). Apex = branded Netlify site (title "NoodleBomb Ramen Sauce | Small-Batch Japanese-Inspired Sauce"). No bare-Shopify leak. www→apex canonicalization already in place at the Netlify/DNS layer.

**Why NO deploy:** deployed bytes already satisfy all 3 P0s; per deploy discipline an unnecessary redeploy only risks regression and re-introduces the same one-load SW lag. The working tree (`A:\noodlebomb-repo` root) is BEHIND live (its `shopify-config.js` has no `rgs`, RGS PDP still Notify-me) — a working-tree deploy would REGRESS the RGS wiring. Live truth remains the `.nbov-img22` overlay tree.

**STILL FOR MIKE (Shopify admin — out of repo scope):**
(a) Password-protect / `noindex` the bare Shopify store `nu2vqa-ma.myshopify.com` so it isn't public + indexable (the audit's root-cause concern; www is already canonicalized but the myshopify host itself is still directly reachable/indexable).
(b) Remove the forced subscription / "authorize recurring charge" / Subscribe&Save selling plans on ONE-TIME sauce bottles in Shopify selling plans (Monthly Box subscription is legitimate and should stay).

---

## 2026-06-22 — Meta Pixel + landing-page conversion leak fix (ad audit, act_1940339179947447)

**Symptoms (Meta, Jun 20–21):** (1) funnel inversion — AddToCart(6) < InitiateCheckout(21); (2) 168 link clicks → only 26 landing-page views (15.5%).

**ROOT CAUSE (single, unifying):** noodlebomb.co (the headless marketing storefront — where ads land AND where ~all add-to-cart happens) had **NO Meta Pixel at all**. Only the Shopify checkout domain (`nu2vqa-ma.myshopify.com`) carried a pixel (id `976149235141968`, via Shopify's Facebook & Instagram channel, CAPI on). Consequence: `PageView` never fired on brand-domain landing pages (→ LPV ≈ 0 for apex traffic) and `AddToCart` only fired on the rare Shopify-storefront add, while `InitiateCheckout` fired reliably on the Shopify checkout users were funneled into → ATC << IC inversion. NOT a duplicate/double-init (there was no init to dedupe); the opposite — a missing storefront pixel.

**FIX (in code, pinned-to-live overlay):**
- Added an idempotent Meta Pixel bootstrap (loads `fbevents.js`, `fbq('init','976149235141968')`, fires `PageView` once/page, exposes `window.NB_PIXEL.track`) to BOTH `page-shared.js` (homepage + all content/PDP pages) and `cart-store.js` (covers `cart.html`/`checkout.html`, which don't load page-shared.js) → 100% page coverage. Idempotency guard (`if(window.fbq)return` + `__nbPixelPageViewFired`) = single canonical init, no double-load.
- Fired `AddToCart` (content_ids + content_name + contents + value + currency) inside `NB_CART.add()` — the single chokepoint every add path uses (PDP buttons, "Power up your cart" / "You might also like" upsell strips, bundle builder, Flavor Finder, ?add= quick links). One hook = all paths; no React rebuild needed.
- Reused Shopify's pixel id `976149235141968` so on-site browser events consolidate with the Shopify CAPI stream into ONE pixel.
- `InitiateCheckout`: intentionally NOT added on-domain — Shopify already fires it once per real checkout-start on the checkout domain; adding ours would double-count the already-higher IC. (No IC code exists in the storefront, so no over-firing from us.)
- Bumped SW `NB_CACHE` v38 → **v39-metapixel-20260622** (page-shared.js + cart-store.js are in NB_ASSETS precache; required or returning visitors keep the pixel-less cached copies).

**Files changed (3 + cache bump):** `page-shared.js`, `cart-store.js`, `sw.js`. `netlify.toml` shipped behavior-verified-equivalent to live (every redirect probed identical; live byte-copy not fetchable).

**Deploy discipline:** overlay base rebuilt byte-identical to current live (326/326 files; 325 sourced locally by sha1-match, 1 = netlify.toml verified-equivalent). Syntax gate PASS (14 JS, cart-shell complete). Manifest-diff PASS — only the 4 intended files differ, 0 missing. Draft `6a3956d0b3f2cc759694ca57` → browser-verified → promoted.

**Prod deploy id: `6a39579ba080426424d9d127`  |  ROLLBACK target: `6a393377114aa9e820a2bb22`** (the prior published prod, GA4 deploy).

**Live verification (browser, noodlebomb.co):** `fbq` present, pixel `976149235141968`, **PageView fires on load** (POST facebook.com/tr → 200) on homepage AND PDP `/original-ramen-sauce`; **AddToCart fires** on real add-to-cart click + canonical chokepoint (POST facebook.com/tr → 200) with correct value/currency/content_ids. Init config loads once/page (no double-init). Indexability gate clean (/, all PDPs, /seasonings, /rewards = 200; /cart correctly NOINDEX; /shop→302, /collections/all→301→/shop intact; robots+sitemap 200). Pre-existing unrelated 404 (`uploads/nb-hero-lineup-newlabels-2026-06-15.webp`) present identically on prod before+after — not a regression.

**LOGIN-GATED CHECK FOR MIKE (Meta Events Manager — not authenticated here):** confirm the pixel attached to ad account `act_1940339179947447` IS `976149235141968` (it is NoodleBomb's Shopify-configured FB pixel + the only pixel in the live stack, so almost certainly yes). If the ad account uses a different pixel id, swap `PIXEL_ID` in page-shared.js + cart-store.js. Also recommended: point ad destinations at fast canonical apex pages (`/`, `/original-ramen-sauce`, etc. — all 200 + now pixel-instrumented) rather than `/product/{original,spicy,citrus,rgs,spicy-shoyu}` or `/shop`, which 302-hop to the bare `myshopify.com/collections/all` (extra latency + lands on a generic, separately-attributed page — a second driver of the LPV drop).

2026-06-22T09:11:09  NB-PMAX-CONV-FIX (Cowork)  STATUS=DIAGNOSED/ESCALATE
  Root cause: PMax primary 'Purchase' conv action 7648349470 (WEBPAGE/gtag, AW-18239578229,
    primary_for_goal=true, ENABLED) can never fire — NB is headless; checkout completes off-origin
    on Shopify (nu2vqa-ma.myshopify.com / Shop Pay). Site google-ads.ts fires begin_checkout only.
    Result: 0 tracked conv (account-wide 0 conv / 30d) vs ~50 paid Shopify orders 6/12-6/22.
  Live API (NB 721-811-5372): Campaign #1 PMax now PAUSED; spend only 6/18 $7.84 / 6/19 $31.59 /
    6/20 $17.68 (90 clicks, $57.10, 0 conv, ROAS 0); no spend 6/21-6/22; budget $17.18/day.
    Google&YouTube channel installed + Merchant Center 5803540067 linked, but NO channel conv
    action exists -> channel conversion tracking NOT active.
  Fixed autonomously: none shippable. Site deploy would NOT capture off-origin checkout (no-op,
    not shipped). Conv action config already correct (enabled+primary). All NB Shopify admin tokens
    EXPIRED (atkn_latest 6/13, noodlev7 runtime 5/28) -> 401; re-mint needs Mike.
  Staged: work\nb_pmax_conv_fix_2026-06-22\offline_conversion_import.py (DRY_RUN, needs valid token).
  DECISION FOR MIKE: keep PMax PAUSED (already is; $0 ongoing waste). Re-enable only after either
    (A) enable conversion tracking in Shopify Google&YouTube channel, or (B) re-auth Shopify so the
    staged gclid offline-import runs. Then verify conv register before unpausing.

================================================================================
2026-06-22 — NB STOREFRONT: on-brand /shop + correct Shoyu Reserve image
================================================================================
DEFECTS (Mike): (1) /shop "doesn't feel like an NB product page" — it 302'd off
  noodlebomb.co to the BARE Shopify store (nu2vqa-ma.myshopify.com/collections/all);
  (2) Shoyu Reserve showed the WRONG image (old BLACK-label design) on /shop & a PDP.

ROOT CAUSE: /shop (and /shop/*) redirected to bare Shopify in BOTH netlify.toml and
  _redirects → customers dropped out of the branded experience AND saw Shopify's old
  black-label Shoyu image (shopify file shoyu_reserve_label_v2_2026-06-07_cutout.webp +
  shoyu-reserve-front-transparent.png — both the wrong black label). The on-site PDP
  /product/shoyu-reserve was ALREADY correct on live (cream "Pantry Series" cutout
  nb-shoyu-reserve-cutout-2026-06-22.webp); working tree was BEHIND live there.

FIX (4 files):
  + shop.html (NEW) — on-site NB-branded catalog. Cloned live nav/footer/chrome,
    page-shared.css + seasoning-line.css (sku-card grid), GA4 G-34HRPRKYCQ in <head>,
    Meta Pixel via page-shared.js. 7 SKUs as branded cards linking to on-site PDPs
    (Original/Spicy Tokyo/Citrus $11.99, Shoyu Reserve/Spicy Shoyu $11.99, Fire Dust/
    RGS $10.99) + Trio bundle strip (/cart?add=trio). Shoyu card uses the CORRECT cream
    nb-shoyu-reserve-cutout-2026-06-22.webp. robots=index,follow, canonical /shop.
  ~ netlify.toml — /shop 302->shopify  =>  /shop -> /shop.html 200 (rewrite);
    /shop/* 302->myshopify/:splat  =>  /shop/* -> /shop?s=:splat 301 force.
  ~ _redirects — same two changes.
  ~ sw.js — NB_CACHE v39-metapixel -> v40-shop-20260622 (protocol cache bump).
  NETLIFY SPLAT GOTCHA: /shop/* -> /shop (no :splat) self-loops on non-empty paths
    (Netlify auto-appends splat => /shop/foo, 404). Consume splat explicitly in query
    (/shop?s=:splat) so it lands on clean branded /shop. (/shop/ empty-splat worked; deep
    paths 404'd until fixed.)

DEPLOY (live-baseline overlay): regen fresh live manifest via netlify listSiteFiles
  (326 files) -> build-pixel-deploy.mjs pins all to live sha (322 local/3 CDN/1 = netlify.toml
  404 on CDN, overridden) -> overlay 4 files -> SYNTAX GATE PASS (14 JS ok, cart-shell
  complete, sw v40) -> MANIFEST DIFF: only /sw.js + /netlify.toml changed vs live, plus NEW
  /shop.html + /_redirects (exactly intended) -> draft -> verify -> draft2 (splat fix) ->
  verify -> --prod --no-build.
  PROD DEPLOY: 6a39e24b1556fa326665ec9b   ROLLBACK: 6a39579ba080426424d9d127

VERIFY (live noodlebomb.co): /shop=200 branded (was 302 shopify); /shop/foo=301 ->/shop?s=foo;
  title/robots index,follow OK; shoyu correct cream img present, ZERO black-label leak, ZERO
  myshopify leak in body; /product/shoyu-reserve=200 correct img; sw=v40-shop-20260622;
  published=6a39e24b. Playwright render of live /shop + shoyu PDP = on-brand + correct bottle.

⚠️ SHOPIFY-ADMIN STEP FOR MIKE (NB admin tokens 401 from code): the Shoyu Reserve product
  on Shopify still carries the WRONG black-label images (featured = shoyu_reserve_label_v2_
  2026-06-07_cutout.webp; also shoyu-reserve-front-transparent.png). Customers now only reach
  Shopify at CHECKOUT, where the line-item thumb pulls from Shopify. To fully kill the black
  label: in Shopify admin > Products > Shoyu Reserve, delete/replace those two black-label
  images with the cream Pantry Series cutout (A:\Documents\Claude\NB_transparent_cutouts\
  nb-shoyu-reserve-cutout-transparent-2026-06-22.png) and set it as the featured image.

────────────────────────────────────────────────────────────────────────────
2026-06-22 — /shop off-brand handoff: FOLLOW-UP (homepage React "Shop" CTA)
PROD 6a39e3a4e3ea5931d0a4a791  | ROLLBACK 6a39e24b1556fa326665ec9b  | SW v41-shopcta-20260622
────────────────────────────────────────────────────────────────────────────
GAP FOUND after the v40/6a39e24b /shop deploy: the branded /shop page + redirect +
  correct Shoyu image were live, BUT the React homepage bundles still hard-linked the
  primary "Shop" button + cart fallback to the BARE Shopify store — i.e. Mike's exact
  "clicking Shop drops customers off NB" complaint was still half-live.
  - build/app.js  WIX_URLS.shop = myshopify/collections/all  (a styled .btn that also
    opened in a NEW TAB via target=_blank) → repointed to "/shop", target/rel removed.
  - build/components.js  NB_WIX.shop (empty-cart fallback) = same myshopify URL → "/shop".
WHAT CHANGED (3 files only, rebased byte-for-byte onto live 6a39e24b first):
  build/app.js, build/components.js (both: collections/all → /shop, now 0 myshopify shop
  links), sw.js (NB_CACHE v40→v41 so cached bundles refresh; +'/shop' +'/seasoning-line.css'
  precache). shop.html / netlify.toml / cart-shell / page-shared.js left = live (untouched).
GATES: predeploy-check PASS (14 JS parse-ok, cart-shell complete, NB_CACHE set). Manifest-diff
  vs live = exactly {build/app.js, build/components.js, sw.js}. Draft 6a39e367 verified, then
  --prod. Globe function (order-map) bundled + 200 throughout. No concurrent deploy at promote.
VERIFY (live noodlebomb.co, cache-busted): app.js/components.js shop="/shop", 0 collections/all
  in either bundle; /shop=200 branded (sku-grid, page-shared.css) w/ correct shoyu cutout;
  /shop/all=301 →/shop?s=all; /product/shoyu-reserve=200 correct img; sw=v41-shopcta-20260622;
  order-map=200; /shop robots=index,follow; home=200. published=6a39e3a4e3ea5931d0a4a791.
NOTE: Shopify-admin step from the prior entry still stands (bare Shopify product images);
  customers now only touch Shopify at checkout. GT40 untouched.

────────────────────────────────────────────────────────────────────────────
2026-06-23 — Shoyu Reserve "Reserve line" section image: VERIFY-ONLY (no deploy)
LIVE PUBLISHED 6a39e3a4e3ea5931d0a4a791 (= would-be ROLLBACK)  | SW v41-shopcta-20260622
────────────────────────────────────────────────────────────────────────────
TASK: reported that the /shop "The Reserve line / Slow-brewed depth" feature section
  still showed the OLD black-label Shoyu Reserve image; fix + ship.
FINDING: ALREADY FIXED LIVE by the earlier concurrent /shop deploy(s) 6a39e24b → 6a39e3a4.
  Nothing left to change/ship on live. No deploy performed (a no-op would only risk the
  ping-pong the brief warned about).
EVIDENCE (all against LIVE noodlebomb.co):
  - Captured rollback id BEFORE any action: 6a39e3a4e3ea5931d0a4a791 (current published).
  - /shop #reserve section rendered in real browser: Shoyu Reserve card = correct CREAM
    "Pantry Series" real-label cutout (nb-shoyu-reserve-cutout-2026-06-22.webp, 569x1200,
    loaded ok). (The black bottle beside it is SPICY SHOYU, a different SKU, still on its
    v1 label — out of scope.)
  - /product/shoyu-reserve: main img + og:image + twitter:image all = ...cutout-2026-06-22.
  - build/app.js: 4× new cutout-2026-06-22, 0× old front-cutout-v2. seasonings.html 3×new.
    sauce-for-{salmon,tuna,udon-noodles}.html, soy-sauce-for-noodles.html: 1× new each.
  - WHOLE-SITE crawl of all 58 sitemap URLs + build/app.js + build/components.js + sw.js +
    shop.html for old filenames {front-cutout-v2-2026-06-07, front-cutout-2026-06-09,
    bottle-cutout-2026-05-16, front-cutout-clean-2026-05-17, shoyu_reserve_label_v2,
    shoyu-reserve-front-transparent} → 0 hits anywhere.
  - sw.js: HTML = network-first (fresh HTML for everyone); only Shoyu Reserve asset in the
    precache list is the correct cream cutout-2026-06-22. No stale-cache path to the old img.
STRAGGLERS REMAIN ONLY IN THE WORKING TREE (behind live; never deployed naively): app.jsx,
  build/app.js, product-shoyu-reserve.html, seasonings.html, sw.js, sauce-for-{salmon,tuna,
  udon-noodles}.html, soy-sauce-for-noodles.html, data/wholesale-one-sheet-products.json
  still cite the old black-label filename. Harmless to live (overlay deploys pin to live
  bytes) but worth a source-hygiene pass so a future naive deploy can't regress. NOT done
  this session — awaiting go-ahead, since live is already correct and the brief said
  "only change the remaining old-image references" (= none on live).
Shopify-admin step from prior entries still stands (bare Shopify product still has black
  label on the checkout line-item thumb; NB admin tokens 401 from code). GT40 untouched.


================================================================================
2026-06-23 — NB STOREFRONT 5x AUDIT LOOP (Cowork) — PASS 1 of up to 5
Live baseline: 6a39e3a4e3ea5931d0a4a791 (SW v41-shopcta-20260622, created 2026-06-23T01:38Z)
STATUS: fixes BUILT + GATED + VERIFIED in staging — DEPLOY BLOCKED (netlify CLI not logged in)
PROD UNTOUCHED (still 6a39e3a4 / sw v41). GT40 untouched.
================================================================================

PASS-1 ADVERSARIAL AUDIT — every live surface (home React + all static PDPs/keyword
pages, /shop, cart + both upsell strips, seasonings, recipes, www-vs-apex, bare
Shopify, Wix, allergen/price/size, image 404s, redirects, indexability).

CODE-FIXABLE DEFECTS FOUND + FIXED IN STAGING (.nb-pass1-stage):
  1. ALLERGEN (sesame omission) — Original, Spicy Tokyo, Citrus Shoyu PDPs each list
     "sesame oil" in the ingredient list but the allergen statements said only
     "Contains: wheat, soy" (both the spec <dd> "Contains wheat, soy &middot; contains
     MSG" AND the ingredient-line "...salt. Contains: wheat, soy."). Internal
     contradiction + US FASTER-Act sesame gap. FIX: added ", sesame" to BOTH statements
     on all 3 (product-original.html / product-spicy.html / product-citrus.html).
  2. OFF-BRAND LINK (Shoyu Reserve) — footer/lineup "Shop" list: Shoyu Reserve linked to
     bare nu2vqa-ma.myshopify.com/products/shoyu-reserve while every sibling routes
     on-site; the on-site PDP /product/shoyu-reserve (200, correct cream cutout) exists.
     Also dead `cart` map -> bare myshopify/cart. FIX: WIX_URLS.shoyu (build/app.js) &
     NB_WIX.shoyu (build/components.js) -> /product/shoyu-reserve; cart -> /cart.
  3. sw.js NB_CACHE bumped v41-shopcta -> v42-allergen-shoyulink-20260622 (app.js +
     components.js are precached app-shell assets).
  Edit set = 6 files, exact 1-2 line diffs, node --check PASS on all JS, predeploy gate
  PASS (14 JS parse, cart-store.js + shopify-config.js complete, NB_CACHE set).

DEFECTS FOUND — DEFERRED THIS PASS (not fixed; reasons):
  4. RGS PDP (/product/roasted-garlic-sesame) has NO "Contains:" allergen statement
     (Fire Dust has "Contains: sesame"). RGS page structure differs (no pdp-spec-list);
     authoring a compliant panel needs the real ingredient list -> Mike/punch-list, not
     fabricated.
  5. Hero slide 404: page-shared.js SLIDE_NEW_SRC='/uploads/nb-hero-lineup-newlabels-
     2026-06-15.webp' (404). SLIDE2 (nb-hero-lineup-rotate-2026-06-15.webp)=200. Slide
     markup is JS-injected (not in any static HTML); needs render-confirmation before
     editing the precached page-shared.js. Deferred to pass 2 (render-check first).
  6. /product/{original,spicy,citrus,spicy-shoyu} -> 302 bare myshopify
     /collections/all (netlify.toml catch-all). Orphan/legacy (not canonical, not in
     sitemap) but off-brand if hit. Candidate: repoint catch-all -> /shop. Held back from
     pass 1 (redirect-precedence risk warrants its own isolated verify).
  7. sitemap.xml lists /build-your-bundle which 301->/shop (sitemap should list the
     canonical destination). Minor SEO.
  8. Newsletter: no Klaviyo script detected in storefront bundles (page-shared.js/app.js).
     Verify the footer Subscribe form actually submits (Klaviyo/Shopify).

NON-DEFECTS (verified; false-fixes avoided):
  - "Nnoodlebomb" = styled logo lockup <span nav-brand-mark>N</span><span>noodlebomb</span>
    (text-extractor flattening), NOT a typo.
  - "Shop Shoyu Reserve â†'" = web_fetch render artifact; arrows are → in the bundle
    (0 mojibake bytes). NOT a content defect.
  - Prices consistent across surfaces (11.99 sauces / 10.99 RGS+FireDust / 29.99 trio /
    39.99 premium monthly). Sizes consistent (7 fl oz sauces, 3.2 oz / 90g jars).
  - Cart upsell strips ("Power up your cart" + "You might also like") on-brand, 0
    myshopify/Wix leak in cart-store.js.
  - www->apex 301 path-preserving; /shop 200 branded; bare Shopify password-locked.
  - Image sweep: only 1 live 404 (the hero slide #5 above); no wrong-product/black-label
    images on audited surfaces.

ACCOUNT-GATED — FOR MIKE (out of repo scope):
  a. Wix shop.noodlebomb.co is LIVE + indexable (HTTP 200, full storefront title "...Bold,
     Ready-to-Pour Flavor", ~202 product refs, no noindex). Duplicate-storefront brand/SEO
     leak. Action (DNS/Wix): retire, redirect to noodlebomb.co, or password+noindex.
  b. Bare Shopify nu2vqa-ma.myshopify.com = password-locked (good); confirm the password
     page is noindex.
  c. Shopify admin: (i) Shoyu Reserve product still carries black-label images (cream
     Pantry Series cutout at A:\Documents\Claude\NB_transparent_cutouts\
     nb-shoyu-reserve-cutout-transparent-2026-06-22.png); (ii) remove forced
     subscription / Subscribe&Save selling-plans on ONE-TIME sauce bottles (keep Monthly
     Box subs); (iii) VERIFY PHYSICAL BOTTLE LABELS DECLARE "Sesame" — matches the site
     allergen fix (defect #1). If a physical label omits sesame, that is a print-side
     compliance fix.
  d. Seasonings texture/food placeholders need real photography (intentional placeholders).

DEPLOY — BLOCKED (environmental):
  netlify CLI is NOT logged in this session. `netlify status` = "Not logged in";
  getCurrentUser / listSiteFiles / `netlify deploy` all -> JSONHTTPError: Unauthorized
  (only unauth-readable getSite / listSiteDeploys succeed). Draft deploy of the staged
  fix erred pre-upload ("Unauthorized: could not retrieve project") so NOTHING shipped.
  The live-baseline overlay was still built + gated for the moment auth returns:
  .nb-pass1-stage = 312 files (git deploy-set base; 36 drifted files refreshed to live
  CDN bytes incl. site-wide GA4, RGS shopify-config, bundles, page-shared) + the 6 edits;
  syntax gate PASS. Manifest-diff gate could NOT run (listSiteFiles 401) — substitute was
  to be a draft-vs-prod URL diff, also blocked by the deploy 401.

UNBLOCK (Mike): restore NB Netlify auth, then ship the prebuilt staging.
  1) `netlify login`  (or export a valid NoodleBomb-scoped NETLIFY_AUTH_TOKEN / PAT for
     team NoodleBomb; the on-disk token is GT40-scoped and 401s on NB).
  2) Draft:  env -u NETLIFY_AUTH_TOKEN netlify deploy --site 0d8a31c3-6568-444f-ab8a-6320885b6eca --dir .nb-pass1-stage
  3) Verify draft URL (3 PDPs show "Contains: wheat, soy, sesame"; Shoyu lineup link =
     /product/shoyu-reserve; sw v42), then promote with --prod.
  ROLLBACK target if regression: 6a39e3a4e3ea5931d0a4a791.
  Passes 2–5 NOT run: re-auditing the same unchanged live prod yields the same defects
  until pass-1 can ship. Resume the loop after auth is restored.


================================================================================
2026-06-24 — SHOYU RESERVE LABEL: CREAM -> DARK (reverses the 06-22/06-23 logic)
PROD DEPLOY: 6a3bcf6d142f2e9185a8615e | ROLLBACK: 6a3aadc3b5115f30c2da2dc9 | SW v47-darkshoyu-20260624
================================================================================
CORRECTION: Earlier entries (06-22/06-23) treated the CREAM "Pantry Series" cutout
  as correct and the BLACK label as wrong. Mike confirmed that is BACKWARDS: the
  CREAM label is OLD and must be removed; BOTH Shoyu products (regular Shoyu Reserve
  AND Spicy Shoyu) use the DARK/BLACK label. Spicy was already dark; regular Reserve
  was still cream on live + Shopify.

DARK source used: A:\Documents\Claude\NoodleBomb\_shopify_fix_2026-06-21\b64\shoyu-reserve.webp
  (34100 bytes, sha1 d666e1bfa019dd9981649b5cb2128f9e4089d945) — confirmed DARK full-bottle
  regular-Reserve render (NOT spicy). Same dark design pushed to Shopify.

SHOPIFY (gid 10705604084022, nu2vqa-ma): uploaded dark cutout, set FEATURED, deleted the
  cream nb-shoyu-reserve-cutout media (48536134418742). featured now
  nb-shoyu-reserve-dark-cutout-2026-06-24.webp. Spicy untouched.

LIVE (noodlebomb.co) — DIGEST OVERLAY (no CI rebuild, no main push):
  Fresh listSiteFiles manifest (329 files) -> reused 327 live shas verbatim (incl. live
  netlify.toml/_redirects/_headers byte-for-byte) -> overrode ONLY:
    /uploads/nb-shoyu-reserve-cutout-2026-06-22.webp  1cb5500a -> d666e1bf (DARK, in-place swap)
    /sw.js  22caf9eb -> 707e209a  (NB_CACHE v46-overflow-alias -> v47-darkshoyu-20260624)
  order-map function preserved: re-bundled via zip-it-and-ship-it, sha256 8336...e05f ==
  live blob exactly (byte-identical), uploaded to satisfy required_functions.
  Draft 6a3bcf20 verified (dark img sha match, sw v47, /.netlify/functions/order-map=200,
  home globe+hero present, PDP+/shop ref cutout & index,follow, redirects intact) -> --prod.
  PROD published_deploy = 6a3bcf6d142f2e9185a8615e (ready).

VERIFY (live noodlebomb.co, cache-busted): /uploads/nb-shoyu-reserve-cutout-2026-06-22.webp
  = DARK (sha d666e1bf); /sw.js NB_CACHE v47; globe fn 200; home 200 globe+hero; PDP 200
  refs cutout; /shop 200. Rollback target if needed: 6a3aadc3b5115f30c2da2dc9.
CAVEAT: /uploads/* carries Cache-Control immutable 1yr; new visitors + SW-cache (bumped)
  get dark immediately. Browsers that already cached the cream bytes at that exact URL may
  serve cream until their cache expires/clears (inherent to in-place same-filename swap).


================================================================================
2026-06-24 (b) — SHOYU RESERVE: cache-bust dark img to NEW filename + fix "cream" copy
PROD DEPLOY: 6a3bd2c65d6362007993de34 | ROLLBACK: 6a3bcf6d142f2e9185a8615e | SW v48-darklabel-20260624
================================================================================
WHY: prior in-place swap left the dark image at the old immutable-cached filename
  (returning visitors could keep seeing cream); and PDP copy still said "cream parchment".

DIGEST OVERLAY (no CI rebuild): fresh 329-file live manifest -> added NEW file
  /uploads/nb-shoyu-reserve-dark-2026-06-24.webp (sha d666e1bf, dark, reused existing blob)
  -> repointed EVERY ref of nb-shoyu-reserve-cutout-2026-06-22.webp to the new filename in
  9 files: product-shoyu-reserve.html (12 refs incl og/twitter/JSON-LD/preload), shop.html(2),
  build/app.js(4), seasonings.html(3), soy-sauce-for-noodles/sauce-for-salmon/-tuna/
  -udon-noodles.html(1 each), sw.js(1) -> fixed 3 Shoyu PDP copy lines
  ("Cream parchment label"->"Dark premium label"; "Same cream parchment bottle family..."->
  "Same bottle family... finished in a dark reserve label"; accordion "cream parchment label"->
  "a dark premium label") -> sw.js NB_CACHE v47-darkshoyu -> v48-darklabel + precache ref new.
  order-map fn byte-identical (reused). manifest 330 (old img path kept = harmless dark).
  Left untouched (correct): seasonings brand-family "cream parchment" line (Original/Spicy/
  Citrus ARE still cream), --nb-cream/--nbg-cream CSS tokens, "screaming"/"creamy" false hits.
  Draft 6a3bd290 verified -> --prod 6a3bd2c65d6362007993de34.

VERIFY (live noodlebomb.co, cache-busted): new file = DARK (sha d666e1bf); PDP 0 old refs /
  12 new refs / no "cream parchment" / og:image=new / index,follow; /shop 2 new refs; sw v48
  refsNew only; globe fn 200; home globe+hero; salmon/seasonings repointed. published_deploy=
  6a3bd2c6. Rollback: 6a3bcf6d142f2e9185a8615e.
