// NoodleBomb shared page interactions — about / recipes / faq

/* ── Meta Pixel bootstrap (added 2026-06-22, ad-audit fix) ─────────────────
 * The noodlebomb.co storefront shipped with NO Meta Pixel — only the Shopify
 * checkout domain had one. So AddToCart + PageView never fired on the brand
 * domain: Meta saw AddToCart(6) < InitiateCheckout(21) (funnel inversion) and
 * almost no Landing-Page Views (168 clicks -> 26 LPV). This installs the SAME
 * pixel id Shopify already uses (976149235141968) so on-site browser events
 * consolidate with the Shopify CAPI stream into ONE pixel. Idempotent — safe
 * to load from both page-shared.js and cart-store.js (single fbq init, single
 * PageView per page). Exposes window.NB_PIXEL.track(event, params). */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var PIXEL_ID = '976149235141968';
  function ensureFbq() {
    if (window.fbq) return;                 // canonical single init — no double-load
    var n = window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    var t = document.createElement('script');
    t.async = true; t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    var s = document.getElementsByTagName('script')[0];
    if (s && s.parentNode) s.parentNode.insertBefore(t, s);
    else document.head.appendChild(t);
    window.fbq('init', PIXEL_ID);
  }
  function track(event, params) {
    try {
      ensureFbq();
      if (params && Object.keys(params).length) window.fbq('track', event, params);
      else window.fbq('track', event);
    } catch (e) {}
  }
  ensureFbq();
  if (!window.__nbPixelPageViewFired) {       // PageView exactly once per page load
    window.__nbPixelPageViewFired = true;
    track('PageView');
  }
  window.NB_PIXEL = window.NB_PIXEL || { track: track, PIXEL_ID: PIXEL_ID };
})();

(function () {
  // Mobile drawer toggle
  var burger = document.getElementById('nav-burger');
  var drawer = document.getElementById('nav-drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    // Close on nav link click
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // FAQ accordion: clicking a button toggles its <details> wrapper. Native
  // <details>/<summary> is used in markup so JS-disabled clients still work.
  // No-op here; semantic HTML handles it.

  // Buy-click feedback: give shoppers immediate confirmation before the
  // browser hands off to Shopify cart URLs.
  document.querySelectorAll('.pdp-cta[href*="/cart/add"], .mobile-pdp-bar a[href*="/cart/add"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
      var href = link.href;
      event.preventDefault();
      link.classList.add('is-buying');
      link.setAttribute('aria-busy', 'true');
      link.dataset.originalText = link.dataset.originalText || link.textContent;
      link.textContent = 'Opening cart...';
      window.setTimeout(function () { window.location.href = href; }, 180);
    });
  });

  if ('serviceWorker' in navigator) {
    var registerServiceWorker = function () {
      // Never reload an active shopping session when a new worker takes
      // control. The former controllerchange reload cancelled lazy images,
      // map requests, and in-progress scrolling on Safari.
      navigator.serviceWorker.register('/sw.js?v=20260712-stability', { scope: '/', updateViaCache: 'none' })
        .then(function (registration) { return registration.update(); })
        .catch(function () {});
    };
    if (document.readyState === 'complete') registerServiceWorker();
    else window.addEventListener('load', registerServiceWorker, { once: true });
  }

  if (!document.querySelector('link[rel="manifest"]')) {
    var manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.webmanifest';
    document.head.appendChild(manifestLink);
  }

})();

// ── Smile.io rewards launcher (headless Smile UI) ───────────────────────────
// NoodleBomb's live site is a static/custom storefront that only uses Shopify at
// checkout, so the Shopify theme-app-embed Smile launcher never loads for real
// customers. This mounts Smile's official headless SDK instead.
//
// Verified against dev.smile.io (May 2026): the launcher loads from
// https://js.smile.io/v1/smile-ui.js and is started with
// SmileUI.initialize({ publishableKey }). The publishable key (pub_…) is a
// DIFFERENT credential from the Shopify channel_ key and is the only identifier
// initialize() accepts; the legacy channel-key path (Storefront.js) was retired
// 2025-12-31. The pub_ key is "safe to expose publicly" per Smile.
//
// No on-site customer login exists, so Smile runs in GUEST mode (no
// customerToken). Points still attribute when the shopper completes the Shopify
// checkout with their email. This same block is inlined on cart.html and
// checkout.html, which do not load page-shared.js.
(function () {
  if (window.__nbSmileLauncherLoaded) return;
  window.__nbSmileLauncherLoaded = true;

  var KEY = 'pub_2d27941cfeaca289';
  if (!KEY || KEY.indexOf('pub_') !== 0) return;

  function initSmile() {
    if (window.SmileUI && typeof window.SmileUI.initialize === 'function') {
      window.SmileUI.initialize({ publishableKey: KEY });
    }
  }

  function loadSmileSdk() {
    if (document.getElementById('smile-ui-sdk')) return;
    var s = document.createElement('script');
    s.id = 'smile-ui-sdk';
    s.async = true;
    s.src = 'https://js.smile.io/v1/smile-ui.js';
    document.head.appendChild(s);
  }

  // Load the Smile UI SDK from Smile's CDN (never bundled/self-hosted). Lean SEO
  // pages and the homepage delay the launcher until after first paint or
  // interaction. Rewards CTAs still force-load the panel through
  // window.NBLoadSmileLauncher below.
  var queued = false;
  var queueSmile = function () {
    if (queued) return;
    queued = true;
    loadSmileSdk();
  };
  window.NBLoadSmileLauncher = queueSmile;

  var path = location.pathname.replace(/\/$/, '') || '/';
  var shouldDelaySmile = path !== '/rewards';
  if (shouldDelaySmile) {
    window.addEventListener('pointerdown', queueSmile, { once: true, passive: true });
    window.addEventListener('keydown', queueSmile, { once: true });
    window.addEventListener('load', function () {
      window.setTimeout(queueSmile, path === '/' ? 15000 : 12000);
    }, { once: true });
  } else {
    loadSmileSdk();
  }

  if (window.SmileUI && window.SmileUI.initialize) {
    initSmile();
  } else {
    document.addEventListener('smile-ui-loaded', initSmile, { once: true });
  }
})();

// ── NoodleBomb Rewards promotion layer ──────────────────────────────────────
// Promotes the (already-embedded) Smile program across the site: a "Rewards"
// nav link, the Join CTAs, and computed "Earn X points" labels on product
// pages. Every CTA opens the same Smile panel the floating launcher opens, via
// Smile's public SmileUI.openPanel() API. All point values are read from the
// single source of truth in /rewards-config.js (window.NB_REWARDS); this file
// contains no hard-coded rewards numbers.
(function () {
  if (window.__nbRewardsPromoLoaded) return;
  window.__nbRewardsPromoLoaded = true;

  // Open the Smile rewards panel (same panel as the floating launcher). The
  // Smile SDK boots asynchronously, so retry briefly until SmileUI is ready.
  function openRewards(deepLink) {
    var tries = 0;
    if (typeof window.NBLoadSmileLauncher === 'function') window.NBLoadSmileLauncher();
    (function attempt() {
      var ui = window.SmileUI;
      if (ui && typeof ui.openPanel === 'function') {
        try {
          if (deepLink && typeof ui.intent === 'function') ui.intent(deepLink);
          else ui.openPanel();
          return;
        } catch (e) { /* fall through to retry */ }
      }
      if (tries++ < 30) window.setTimeout(attempt, 200);
    })();
  }
  window.nbOpenRewards = openRewards;

  // Any element marked data-nb-open-rewards (or .nb-rewards-cta) opens the panel.
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-nb-open-rewards], .nb-rewards-cta');
    if (!trigger) return;
    event.preventDefault();
    openRewards(trigger.getAttribute('data-nb-deep-link') || undefined);
  });

  // Inject the "Rewards" nav link into the shared header + mobile drawer. The
  // static pages each carry their own copy of the nav markup, so adding it once
  // here keeps the link consistent everywhere without editing every file.
  // Inject a "Seasonings" link into the static-page nav (desktop + drawer) so
  // the dry-blend toppers catalog (/seasonings) is reachable from the nav on
  // EVERY entry point — mirrors how addWhereToBuyLink keeps one nav link
  // consistent across the hand-written static-page nav markup without editing
  // every file. The React homepage nav carries this link in navLinks directly.
  function addSeasoningsLink(container, isDrawer) {
    if (!container || container.querySelector('a[href="/seasonings"]')) return;
    var link = document.createElement('a');
    link.href = '/seasonings';
    link.className = 'nav-seasonings';
    link.textContent = 'Seasonings';
    var shop = container.querySelector('a[href="/shop"]');
    if (shop && shop.nextSibling) container.insertBefore(link, shop.nextSibling);
    else if (shop) container.appendChild(link);
    else container.appendChild(link);
  }

  function addWhereToBuyLink(container, isDrawer) {
    if (!container || container.querySelector('a[href="/#stores"]')) return;
    var link = document.createElement('a');
    link.href = '/#stores';
    link.className = 'nav-where-to-buy';
    link.textContent = 'Where to Buy';
    if (isDrawer) {
      var about = container.querySelector('a[href="/about"]');
      if (about && about.nextSibling) container.insertBefore(link, about.nextSibling);
      else container.appendChild(link);
    } else {
      var aboutDesk = container.querySelector('a[href="/about"]');
      if (aboutDesk && aboutDesk.nextSibling) container.insertBefore(link, aboutDesk.nextSibling);
      else container.appendChild(link);
    }
  }

  // Close the mobile nav drawer (mirrors the close-on-nav wired for the static
  // links when the drawer toggle script ran). Used by the "More" menu links the
  // promo layer injects after that listener was attached.
  function closeNavDrawer() {
    var d = document.getElementById('nav-drawer');
    var b = document.getElementById('nav-burger');
    if (d) { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); }
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  // Group About / FAQ / Contact / Rewards under a single "More" dropdown so the
  // top-level nav stays lean. About/FAQ/Contact already ship as flat anchors in
  // the static markup (so they work with JS disabled); here they're MOVED into
  // the dropdown — keeping their hrefs + aria-current — and a Rewards link is
  // appended. Desktop = hover/click flyout; mobile drawer = tap-to-expand.
  function buildMoreMenu(container, isDrawer) {
    if (!container || container.querySelector('.nav-more, .drawer-more')) return;
    var grouped = [
      container.querySelector('a[href="/about"]'),
      container.querySelector('a[href="/faq"]'),
      container.querySelector('a[href="/contact"], a[href="#open-contact"], a[href^="mailto:"]')
    ].filter(Boolean);
    if (!grouped.length) return; // page carries none of these to group

    var rewards = document.createElement('a');
    rewards.href = '/rewards';
    rewards.className = 'nav-rewards';
    rewards.textContent = 'Rewards';
    if (location.pathname.replace(/\/$/, '') === '/rewards') rewards.setAttribute('aria-current', 'page');

    var wrap = document.createElement('div');
    wrap.className = isDrawer ? 'drawer-more' : 'nav-more';
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = isDrawer ? 'drawer-more-trigger' : 'nav-more-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.innerHTML = 'More <span class="nav-more-caret" aria-hidden="true">' +
      (isDrawer ? '›' : '▾') + '</span>';
    var menu = document.createElement('div');
    menu.className = isDrawer ? 'drawer-more-menu' : 'nav-more-menu';

    // Drop the wrapper into place (end of the desktop links / above the drawer
    // CTA), then relocate the existing anchors — preserving their listeners and
    // attributes — into the menu and append Rewards.
    var ctaRef = isDrawer ? container.querySelector('.drawer-cta') : null;
    if (ctaRef) container.insertBefore(wrap, ctaRef); else container.appendChild(wrap);
    grouped.forEach(function (a) { menu.appendChild(a); });
    menu.appendChild(rewards);
    wrap.appendChild(trigger);
    wrap.appendChild(menu);

    // Highlight the trigger when the current page lives inside the menu.
    if (menu.querySelector('a[aria-current="page"]')) wrap.classList.add('is-current');

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      var open = wrap.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    if (isDrawer) {
      // Tapping any grouped link closes the whole drawer.
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeNavDrawer);
      });
    } else {
      // Desktop: dismiss the flyout on outside-click or Escape (hover is CSS).
      document.addEventListener('click', function (event) {
        if (!wrap.contains(event.target)) {
          wrap.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          wrap.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  addWhereToBuyLink(document.querySelector('nav .nav-links'), false);
  addWhereToBuyLink(document.getElementById('nav-drawer'), true);
  addSeasoningsLink(document.querySelector('nav .nav-links'), false);
  addSeasoningsLink(document.getElementById('nav-drawer'), true);
  buildMoreMenu(document.querySelector('nav .nav-links'), false);
  buildMoreMenu(document.getElementById('nav-drawer'), true);

  document.querySelectorAll('.footer-policy').forEach(function (footerPolicy) {
    if (footerPolicy.querySelector('a[href="/#stores"]')) return;
    var sep = document.createElement('span');
    sep.setAttribute('aria-hidden', 'true');
    sep.style.opacity = '0.85';
    sep.textContent = '|';
    var link = document.createElement('a');
    link.href = '/#stores';
    link.textContent = 'Where to Buy';
    link.style.color = 'var(--ink)';
    link.style.opacity = '0.8';
    link.style.textDecoration = 'none';
    link.style.padding = '12px 8px';
    link.style.display = 'inline-block';
    footerPolicy.insertBefore(sep, footerPolicy.firstChild);
    footerPolicy.insertBefore(link, sep);
  });

  var R = window.NB_REWARDS;

  // Fill any [data-nb] node with its verified value so on-page copy stays locked
  // to /rewards-config.js. The static markup already holds the same numbers as a
  // no-JS fallback; this just guarantees they can never drift from the source.
  if (R) {
    var values = {
      earnRate: R.earnRate,
      signup: R.earn.signup.points,
      facebook: R.earn.facebook.points,
      birthday: R.earn.birthday.points,
      redeemPer: R.redeem.pointsPerDollar,
      redeemMin: R.redeem.minPoints,
      referral: R.referral.friendReward,
      referralMin: R.referral.friendMinOrder
    };
    document.querySelectorAll('[data-nb]').forEach(function (el) {
      var v = values[el.getAttribute('data-nb')];
      if (v != null) el.textContent = String(v);
    });
  }

  // Product pages: show "Earn N points" near the price, computed from the actual
  // displayed price x the configured earn rate. Clicking it opens the panel.
  // Two price markups exist across the PDPs: .pdp-price (with .amt) on the main
  // sauce pages, and .pdp-price-line (with <strong>) on the jar/reserve pages.
  if (R && typeof R.pointsForPrice === 'function') {
    document.querySelectorAll('.pdp-price, .pdp-price-line').forEach(function (priceEl) {
      var host = priceEl.parentNode;
      if (!host || host.querySelector('.pdp-points')) return;
      var valueNode = priceEl.querySelector('.amt') || priceEl.querySelector('strong');
      var points = R.pointsForPrice(valueNode ? valueNode.textContent : priceEl.textContent);
      if (!points) return;
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'pdp-points nb-rewards-cta';
      chip.innerHTML = '<span class="pdp-points-dot" aria-hidden="true"></span>Earn <strong>' +
        points + '</strong> Bomb Points &middot; <span class="pdp-points-join">join Flavor Club</span>';
      if (priceEl.insertAdjacentElement) priceEl.insertAdjacentElement('afterend', chip);
      else host.insertBefore(chip, priceEl.nextSibling);
    });
  }
})();

/* ───────── Hero crossfade slideshow (safe additive DOM overlay, 2026-06-15) ─────────
   Rotates the homepage hero across THREE slides. Pure overlay — does NOT touch the
   React bundle. Two <img>s are injected directly above the base hero image but BELOW
   the gradient scrims (no positive z-index, so paint order = DOM order and the scrims
   + headline/CTA copy panel stay on top and legible on ALL slides):
     base (React, dark studio) → oRotate (full lineup) → oNew (CURRENT labels, topmost)
   oNew carries the current packaging and is the LEAD slide: it starts visible so the
   FIRST PAINT shows the current labels, then the cycle rotates new → base → rotate → new.
   Auto-crossfade ~5s, pause on hover / hidden tab. Under prefers-reduced-motion the
   rotation is disabled and oNew stays as the static current-labels lead.
   Idempotent + observer-guarded. */
(function () {
  var SLIDE_NEW_SRC = '/uploads/nb-hero-pour-page.webp?v=20260712-stability'; // current/new labels — LEAD
  var SLIDE2_SRC = '/uploads/nb-hero-pour-page.webp?v=20260712-stability';
  var INTERVAL = 5000;
  var FADE = 1200;

  function initHeroRotator() {
    var media = document.querySelector('.hero-section .hero-bg-media');
    if (!media) return false;
    if (media.getAttribute('data-nb-rotator') === '1') return true;
    var base = media.querySelector('.hero-product-bg');
    if (!base) return false;
    media.setAttribute('data-nb-rotator', '1');

    var reduce = false;
    try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

    var OVERLAY_CSS = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;transform:none;opacity:0;transition:opacity ' + FADE + 'ms ease;will-change:opacity;pointer-events:none;';
    function mkSlide(src, cls) {
      var img = document.createElement('img');
      img.className = 'hero-product-bg ' + cls;
      img.src = src;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.setAttribute('decoding', 'async');
      img.style.cssText = OVERLAY_CSS;
      return img;
    }

    // DOM order within .hero-bg-media, all BELOW the gradient scrims:
    //   base (bottom) → oRotate (middle) → oNew (topmost overlay).
    var oRotate = mkSlide(SLIDE2_SRC, 'nb-hero-slide2');
    var oNew = mkSlide(SLIDE_NEW_SRC, 'nb-hero-slide3');
    // LEAD overlay loads eagerly + high priority so the current-labels shot wins the
    // FIRST PAINT even on a cold visit (before it decodes the base would briefly show).
    oNew.setAttribute('loading', 'eager');
    try { oNew.fetchPriority = 'high'; } catch (e) {}
    oNew.setAttribute('fetchpriority', 'high');
    base.insertAdjacentElement('afterend', oRotate);
    oRotate.insertAdjacentElement('afterend', oNew);

    // LEAD: current-labels shot on top, visible on first paint.
    oNew.style.opacity = '1';

    if (reduce) return true; // static current-labels lead, no rotation

    // 3-slide cycle: 0 = new (oNew, topmost), 1 = base (dark studio), 2 = rotate (oRotate).
    var state = 0, timer = null, resetT = null;
    function apply() {
      if (resetT) { clearTimeout(resetT); resetT = null; }
      if (state === 0) {              // crossfade up to the new-labels lead (over oRotate)
        oNew.style.opacity = '1';
        resetT = setTimeout(function () { oRotate.style.opacity = '0'; }, FADE + 60);
      } else if (state === 1) {       // fade overlays out to reveal the base studio shot
        oNew.style.opacity = '0';
        oRotate.style.opacity = '0';
      } else {                        // crossfade the full-lineup shot in over the base
        oRotate.style.opacity = '1';
        oNew.style.opacity = '0';
      }
    }
    function flip() { state = (state + 1) % 3; apply(); }
    function start() { if (!timer) timer = setInterval(flip, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    var section = media.closest('.hero-section') || media.parentNode;
    if (section) {
      section.addEventListener('mouseenter', stop);
      section.addEventListener('mouseleave', start);
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    start();
    return true;
  }

  function boot() {
    if (!document.getElementById('root') && !document.querySelector('.hero-section')) return;
    if (initHeroRotator()) return;
    var tries = 0;
    var poll = setInterval(function () { if (initHeroRotator() || ++tries > 80) clearInterval(poll); }, 150);
    var root = document.getElementById('root') || document.body;
    if (window.MutationObserver && root) {
      var mo = new MutationObserver(function () { if (initHeroRotator()) { mo.disconnect(); clearInterval(poll); } });
      mo.observe(root, { childList: true, subtree: true });
      setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 15000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* ───────── PDP finishing-spice cross-sell (core sauce PDPs, 2026-06-16) ─────────
   The core sauce PDPs (Original / Spicy Tokyo / Citrus Shoyu) cross-sell only the
   sibling sauces in their ".pdp-cross" block ("Three flavors. One mission."). The
   dry-blend toppers belong on that pairings surface too. This appends a compact
   "Finish your bowl" strip (Fire Dust + Roasted Garlic Sesame, $10.99) right after
   the sauce cross-sell. One-tap add via the canonical NB_CART (cart-store.js) —
   mirrors the proven product-roasted-garlic-sesame.html data-add wiring. Additive
   DOM overlay: idempotent, scoped to pages that actually have a .pdp-cross. */
(function () {
  function initSpiceCross() {
    var cross = document.querySelector('.pdp-cross');
    if (!cross) return false;
    if (document.querySelector('.pdp-spice-cross')) return true;
    var SPICES = [
      { slug: 'firedust', name: 'NoodleBomb Fire Dust', label: 'Fire Dust', price: 10.99, tag: 'Korean chili crunch · 3.2 oz', img: '/uploads/nb-fire-dust-approved-front-20260710-normalized.webp', href: '/fire-dust' },
      { slug: 'rgs', name: 'NoodleBomb Roasted Garlic Sesame', label: 'Roasted Garlic Sesame', price: 10.99, tag: 'Toasted garlic · sesame · 3.2 oz', img: '/uploads/nb-rgs-approved-front-20260710-normalized.webp', href: '/roasted-garlic-sesame' }
    ];
    var cards = SPICES.map(function (s) {
      return '<a class="pdp-spice-card" href="' + s.href + '" style="display:flex;gap:18px;align-items:center;text-decoration:none;color:inherit;border:1px solid rgba(240,235,227,0.12);border-radius:14px;padding:20px;background:rgba(245,241,234,0.03);">' +
        '<span class="pdp-spice-thumb" style="width:clamp(140px,30vw,176px);height:clamp(140px,30vw,176px);flex:0 0 auto;display:flex;align-items:center;justify-content:center;background:rgba(14,13,12,0.4);border:1px solid rgba(240,235,227,0.10);border-radius:12px;padding:6px;"><img src="' + s.img + '" alt="NoodleBomb ' + s.label + ' seasoning topper" loading="lazy" style="max-width:100%;max-height:100%;object-fit:contain;"></span>' +
        '<span style="flex:1;min-width:0;">' +
          '<span style="display:block;font-family:\'Inter Tight\',sans-serif;font-weight:700;font-size:18px;">' + s.label + '</span>' +
          '<span style="display:block;font-size:13px;color:rgba(240,235,227,0.62);margin-top:2px;">' + s.tag + '</span>' +
          '<span style="display:block;font-family:\'Inter Tight\',sans-serif;font-weight:700;font-size:17px;color:var(--accent,#D4A24A);margin-top:3px;">$' + s.price.toFixed(2) + '</span>' +
        '</span>' +
        '<button type="button" class="pdp-spice-add" data-slug="' + s.slug + '" data-name="' + s.name + '" data-price="' + s.price + '" aria-label="Add NoodleBomb ' + s.label + ' to cart" style="flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 26px;border-radius:999px;background:var(--accent,#D4A24A);color:var(--accent-ink,#0E0D0C);border:0;cursor:pointer;font-family:\'Inter Tight\',sans-serif;font-size:15px;font-weight:700;line-height:1;">Add</button>' +
      '</a>';
    }).join('');
    var sec = document.createElement('section');
    sec.className = 'pdp-spice-cross';
    sec.style.cssText = 'padding:0 0 72px;';
    sec.innerHTML = '<div class="container" style="max-width:1100px;margin:0 auto;padding-left:clamp(24px,5.5vw,80px);padding-right:clamp(24px,5.5vw,80px);">' +
      '<div class="eyebrow" style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.7;margin-bottom:10px;">Finish your bowl</div>' +
      '<h2 class="serif" style="margin:0 0 20px;">Shake on a topper.</h2>' +
      '<div class="pdp-spice-grid" style="display:grid;gap:18px;">' + cards + '</div>' +
    '</div>';
    cross.parentNode.insertBefore(sec, cross.nextSibling);
    sec.querySelectorAll('.pdp-spice-add').forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (window.NB_CART && typeof window.NB_CART.add === 'function') {
          window.NB_CART.add({ slug: btn.getAttribute('data-slug'), name: btn.getAttribute('data-name'), price: parseFloat(btn.getAttribute('data-price')), qty: 1 });
          var original = btn.textContent;
          btn.textContent = 'Added ✓';
          window.setTimeout(function () { btn.textContent = original; }, 1400);
        } else {
          var slug = btn.getAttribute('data-slug') || '';
          window.location.href = '/cart?add=' + encodeURIComponent(slug) + '&qty=1';
        }
      });
    });
    return true;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSpiceCross);
  else initSpiceCross();
})();

/* ───────── Shop quick-add (2026-07-02) ─────────
   One-tap add for [data-quick-add] buttons (shop.html sku cards). Adds via
   the canonical NB_CART with a catalog-priced payload; falls back to the
   /cart?add= permalink when cart-store.js is absent. Buttons live inside
   card anchors, so the handler prevents navigation. */
(function () {
  function init() {
    var buttons = document.querySelectorAll('[data-quick-add]');
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var slug = btn.getAttribute('data-slug') || '';
        if (btn.classList.contains('is-added')) {
          window.location.href = '/cart';
          return;
        }
        if (window.NB_CART && typeof window.NB_CART.add === 'function') {
          window.NB_CART.add({ slug: slug, name: btn.getAttribute('data-name'), price: parseFloat(btn.getAttribute('data-price')), qty: 1 });
          btn.classList.add('is-added');
          btn.textContent = 'Added \u2713 \u00b7 View cart';
        } else {
          window.location.href = '/cart?add=' + encodeURIComponent(slug) + '&qty=1';
        }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();



/* Monthly Box waitlist tracking; no selling-plan handoff while enrollment is paused. */
(function () {
  function sourceFromPage(el) {
    var params = new URLSearchParams(window.location.search || '');
    return params.get('source') || (el && el.getAttribute('data-source')) || 'site';
  }
  function track(source, surface) {
    var detail = { source: source, surface: surface || 'site', code: 'FIRSTBOX50', offer: 'first_ramen_night_box' };
    try { window.fbq && window.fbq('trackCustom', 'FirstBox50Click', detail); } catch (_) {}
    try { window.dataLayer && window.dataLayer.push(Object.assign({ event: 'first_box_50_click' }, detail)); } catch (_) {}
  }
  function init() {
    document.querySelectorAll('[data-first-box-direct]').forEach(function (el) {
      var source = sourceFromPage(el);
      el.setAttribute('href', '/monthly-box#waitlist');
      el.setAttribute('data-source', source);
    });
    document.addEventListener('click', function (event) {
      var el = event.target.closest && event.target.closest('[data-first-box-cta]');
      if (!el) return;
      track(sourceFromPage(el), el.getAttribute('data-surface') || (el.hasAttribute('data-first-box-direct') ? 'landing' : 'pdp'));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* Conversion events that remain on the brand domain. Shopify owns the final
   purchase event, but lead submissions must be visible in GA4 before the
   browser hands off to the form processor. Beacon transport avoids delaying
   or breaking the real form submission. */
(function () {
  if (typeof document === 'undefined') return;
  function trackLead(form) {
    var kind = form.getAttribute('data-lead-form') || 'site';
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          lead_type: kind,
          form_location: window.location.pathname,
          transport_type: 'beacon'
        });
      }
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'nb_lead_submit',
          lead_type: kind,
          form_location: window.location.pathname
        });
      }
    } catch (_) { /* analytics never blocks a form */ }
  }
  function initLeadTracking() {
    document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
      if (form.dataset.nbLeadTracked === '1') return;
      form.dataset.nbLeadTracked = '1';
      form.addEventListener('submit', function () { trackLead(form); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLeadTracking);
  else initLeadTracking();
})();

/* \u2500\u2500\u2500\u2500\u2500 Klaviyo-ready email capture (2026-07-02) \u2500\u2500\u2500\u2500\u2500
   TO GO LIVE: set companyId (Klaviyo public API key, 6-7 chars) and listId
   below. While either is empty this is a NO-OP and every footer/email form
   keeps posting to its existing formsubmit.co action. Once set, submissions
   from any form with an email input are intercepted and sent to Klaviyo's
   client subscribe API instead (double-opt-in per list settings), with
   formsubmit kept as the failure fallback. One flip point, every page. */
(function () {
  var NB_KLAVIYO = { companyId: '', listId: '' };
  if (!NB_KLAVIYO.companyId || !NB_KLAVIYO.listId) return;
  function subscribe(email) {
    return fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + encodeURIComponent(NB_KLAVIYO.companyId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', revision: '2024-10-15' },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: { profile: { data: { type: 'profile', attributes: { email: email } } } },
          relationships: { list: { data: { type: 'list', id: NB_KLAVIYO.listId } } }
        }
      })
    }).then(function (res) { if (!res.ok) throw new Error('Klaviyo HTTP ' + res.status); });
  }
  function init() {
    document.querySelectorAll('form[action*="formsubmit.co"]').forEach(function (form) {
      var emailInput = form.querySelector('input[type=email]');
      if (!emailInput) return;
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var email = String(emailInput.value || '').trim();
        if (!email) return;
        var btn = form.querySelector('button[type=submit], input[type=submit]');
        if (btn) btn.disabled = true;
        subscribe(email).then(function () {
          form.innerHTML = '<p style="font:600 14px \'Inter Tight\',sans-serif;color:#D4A24A;margin:0;">You\u2019re in. Watch your inbox.</p>';
        }).catch(function () {
          if (btn) btn.disabled = false;
          form.submit(); // native submit skips listeners; falls back to formsubmit
        });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
