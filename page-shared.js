// NoodleBomb shared page interactions — about / recipes / faq

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
      '.hero-section>div:first-child{background:#070604!important;}',
      '.hero-section .nb-live-trio-hero{position:absolute!important;inset:0!important;left:0!important;right:auto!important;top:0!important;bottom:auto!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;transform:none!important;transition:none!important;filter:none!important;image-rendering:auto!important;}',
      '#next-drop .nd-bottle-stage{position:relative!important;}',
      '#next-drop a[href*="add=shoyu"]:not(.nd-image-preorder){display:none!important;}',
      '#next-drop .nd-notify-caption{display:none!important;}',
      '#next-drop .nd-image-preorder{position:absolute!important;left:50%!important;right:auto!important;bottom:clamp(6px,1.4vw,18px)!important;top:auto!important;z-index:12!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:fit-content!important;max-width:calc(100% - 24px)!important;min-height:44px!important;margin:0!important;padding:13px 18px!important;border:1px solid rgba(255,255,255,.42)!important;border-radius:999px!important;background:#f4efe7!important;color:#0e0d0c!important;font-family:Inter,system-ui,sans-serif!important;font-size:12px!important;font-weight:800!important;letter-spacing:.13em!important;text-transform:uppercase!important;text-decoration:none!important;white-space:nowrap!important;box-shadow:0 16px 34px rgba(0,0,0,.34)!important;transform:translateX(-50%)!important;}',
      '@media (max-width:768px){.hero-section .nb-live-trio-hero{width:100%!important;height:100%!important;object-fit:cover!important;object-position:68% center!important;opacity:.96!important;}#next-drop .nd-image-preorder{bottom:6px!important;font-size:10px!important;letter-spacing:.1em!important;padding:12px 14px!important;max-width:calc(100% - 18px)!important;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function patchHomepageHero() {
    var heroImg = document.querySelector('.hero-section img.hero-product-bg') ||
      document.querySelector('.hero-section > div:first-child img');
    if (!heroImg) return false;
    heroImg.classList.add('nb-live-trio-hero');
    heroImg.src = '/uploads/nb-hero-pour.png';
    heroImg.alt = 'NoodleBomb sauce bottles beside ramen and fresh ingredients on a dark background';
    heroImg.loading = 'eager';
    heroImg.decoding = 'async';
    return true;
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
    cta.textContent = 'PREORDER FOR $9.99 \u2192';
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
    var heroDone = patchHomepageHero();
    var shoyuDone = patchShoyuPreorder();
    return heroDone && shoyuDone;
  }

  var attempts = 0;
  var timer = window.setInterval(function () {
    attempts += 1;
    if (applyHomepagePatch() || attempts > 40) window.clearInterval(timer);
  }, 250);
  window.addEventListener('resize', applyHomepagePatch);
  applyHomepagePatch();
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

  // Load the Smile UI SDK from Smile's CDN (never bundled/self-hosted).
  if (!document.getElementById('smile-ui-sdk')) {
    var s = document.createElement('script');
    s.id = 'smile-ui-sdk';
    s.async = true;
    s.src = 'https://js.smile.io/v1/smile-ui.js';
    document.head.appendChild(s);
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
  function addNavLink(container, isDrawer) {
    if (!container || container.querySelector('a[href="/rewards"]')) return;
    var link = document.createElement('a');
    link.href = '/rewards';
    link.className = 'nav-rewards';
    link.textContent = 'Rewards';
    if (location.pathname.replace(/\/$/, '') === '/rewards') link.setAttribute('aria-current', 'page');
    if (isDrawer) {
      var cta = container.querySelector('.drawer-cta');
      if (cta) container.insertBefore(link, cta); else container.appendChild(link);
    } else {
      var faq = container.querySelector('a[href="/faq"]');
      if (faq) container.insertBefore(link, faq); else container.appendChild(link);
    }
  }
  addNavLink(document.querySelector('nav .nav-links'), false);
  addNavLink(document.getElementById('nav-drawer'), true);

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
      chip.setAttribute('aria-label', 'Earn ' + points + ' NoodleBomb points on this bottle — join Rewards');
      chip.innerHTML = '<span class="pdp-points-dot" aria-hidden="true"></span>Earn <strong>' +
        points + '</strong> points &middot; <span class="pdp-points-join">join Rewards</span>';
      if (priceEl.insertAdjacentElement) priceEl.insertAdjacentElement('afterend', chip);
      else host.insertBefore(chip, priceEl.nextSibling);
    });
  }
})();
