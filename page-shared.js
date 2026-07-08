// NoodleBomb shared page interactions - about / recipes / faq

// -- Traffic-source attribution capture (first-touch) ------------------------
// Loads the standalone attribution.js module on every page that includes this
// shared script (home, product, SEO landing pages - the ad destinations) so
// first-touch click IDs + UTMs are captured the moment a shopper lands.
// cart.html / checkout.html load attribution.js directly. Captured values are
// attached to the Shopify cart at checkout (see shopify-checkout.js). Kept as a
// separate module so this file owns no attribution logic of its own.
(function () {
  if (typeof window === 'undefined') return;
  if (window.NB_ATTRIBUTION || document.getElementById('nb-attribution-js')) return;
  var s = document.createElement('script');
  s.id = 'nb-attribution-js';
  s.src = '/attribution.js';
  (document.head || document.documentElement).appendChild(s);
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
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  if (!document.querySelector('link[rel="manifest"]')) {
    var manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.webmanifest';
    document.head.appendChild(manifestLink);
  }

  // Homepage production patch: keeps the current live build aligned with the
  // latest launch direction while the source bundle deploy is pending.
  var patchStylesId = 'nb-live-homepage-patch';
  function ensureHomepagePatchStyles() {
    if (document.getElementById(patchStylesId)) return;
    var style = document.createElement('style');
    style.id = patchStylesId;
    style.textContent = [
      '#next-drop .nd-bottle-stage{position:relative!important;}',
      '#next-drop a[href*="add=shoyu"]:not(.nd-image-preorder){display:none!important;}',
      '#next-drop .nd-notify-caption{display:none!important;}',
      '#next-drop .nd-image-preorder{position:absolute!important;left:50%!important;right:auto!important;bottom:clamp(6px,1.4vw,18px)!important;top:auto!important;z-index:12!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:fit-content!important;max-width:calc(100% - 24px)!important;min-height:44px!important;margin:0!important;padding:13px 18px!important;border:1px solid rgba(255,255,255,.42)!important;border-radius:999px!important;background:#f4efe7!important;color:#0e0d0c!important;font-family:Inter,system-ui,sans-serif!important;font-size:12px!important;font-weight:800!important;letter-spacing:.13em!important;text-transform:uppercase!important;text-decoration:none!important;white-space:nowrap!important;box-shadow:0 16px 34px rgba(0,0,0,.34)!important;transform:translateX(-50%)!important;}',
      '@media (max-width:768px){#next-drop .nd-image-preorder{bottom:6px!important;font-size:10px!important;letter-spacing:.1em!important;padding:12px 14px!important;max-width:calc(100% - 18px)!important;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function patchShoyuPreorder() {
    var stage = document.querySelector('#next-drop .nd-bottle-stage');
    if (!stage) return false;

    var cta = document.querySelector('#next-drop .nd-image-preorder') || stage.querySelector('.nd-stage-tag');
    if (!cta) return false;

    if (cta.tagName.toLowerCase() !== 'a') {
      var replacement = document.createElement('a');
      replacement.className = cta.className;
      cta.parentNode.replaceChild(replacement, cta);
      cta = replacement;
    }

    cta.classList.add('nd-stage-tag', 'nd-image-preorder');
    cta.href = '/cart?add=shoyu&qty=1';
    cta.textContent = 'PREORDER FOR $9.99 ';
    cta.removeAttribute('aria-hidden');
    cta.removeAttribute('tabindex');

    if (cta.parentNode !== stage) {
      stage.appendChild(cta);
    }

    document.querySelectorAll('#next-drop a[href*="add=shoyu"]').forEach(function (link) {
      if (link === cta || link.classList.contains('nd-image-preorder')) return;
      link.setAttribute('aria-hidden', 'true');
      link.setAttribute('tabindex', '-1');
    });
    return true;
  }

  function applyHomepagePatch() {
    ensureHomepagePatchStyles();
    var shoyuDone = patchShoyuPreorder();
    return shoyuDone;
  }

  if (document.querySelector('.hero-section') || document.getElementById('next-drop')) {
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      if (applyHomepagePatch() || attempts > 40) window.clearInterval(timer);
    }, 250);
    window.addEventListener('resize', applyHomepagePatch);
    applyHomepagePatch();
  }
})();

// -- Smile.io rewards launcher (headless Smile UI) ---------------------------
// NoodleBomb's live site is a static/custom storefront that only uses Shopify at
// checkout, so the Shopify theme-app-embed Smile launcher never loads for real
// customers. This mounts Smile's official headless SDK instead.
//
// Verified against dev.smile.io (May 2026): the launcher loads from
// https://js.smile.io/v1/smile-ui.js and is started with
// SmileUI.initialize({ publishableKey }). The publishable key (pub_...) is a
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

// -- NoodleBomb Rewards promotion layer --------------------------------------
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
  // the dropdown - keeping their hrefs + aria-current - and a Rewards link is
  // appended. Desktop = hover/click flyout; mobile drawer = tap-to-expand.
  function buildMoreMenu(container, isDrawer) {
    if (!container || container.querySelector('.nav-more, .drawer-more')) return;
    var grouped = [
      container.querySelector('a[href="/about"]'),
      container.querySelector('a[href="/faq"]'),
      container.querySelector('a[href="#open-contact"], a[href^="mailto:"]')
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
      (isDrawer ? '' : 'v') + '</span>';
    var menu = document.createElement('div');
    menu.className = isDrawer ? 'drawer-more-menu' : 'nav-more-menu';

    // Drop the wrapper into place (end of the desktop links / above the drawer
    // CTA), then relocate the existing anchors - preserving their listeners and
    // attributes - into the menu and append Rewards.
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
        points + '</strong> points - <span class="pdp-points-join">join Rewards</span>';
      if (priceEl.insertAdjacentElement) priceEl.insertAdjacentElement('afterend', chip);
      else host.insertBefore(chip, priceEl.nextSibling);
    });
  }
})();

/* --------- Hero crossfade slideshow (safe additive DOM overlay, 2026-06-15) ---------
   Rotates the homepage hero between the existing studio background and the new
   full-lineup shot. Pure overlay - does NOT touch the React bundle. A second <img>
   is injected directly above the base hero image but BELOW the gradient scrims, so
   the headline/CTA copy panel and gradients stay on top and legible on BOTH slides.
   Auto-crossfade ~5s, pause on hover / hidden tab, fully disabled under
   prefers-reduced-motion (original hero only). Idempotent + observer-guarded. */
(function () {
  var SLIDE2_SRC = '/uploads/nb-hero-lineup-rotate-2026-06-15.webp';
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

    var slide2 = document.createElement('img');
    slide2.className = 'hero-product-bg nb-hero-slide2';
    slide2.src = SLIDE2_SRC;
    slide2.alt = 'NoodleBomb sauce and seasoning lineup';
    slide2.setAttribute('decoding', 'async');
    slide2.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;transform:none;opacity:0;transition:opacity ' + FADE + 'ms ease;will-change:opacity;pointer-events:none;';
    base.insertAdjacentElement('afterend', slide2);

    if (reduce) return true;

    var showing2 = false, timer = null;
    function flip() { showing2 = !showing2; slide2.style.opacity = showing2 ? '1' : '0'; }
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
