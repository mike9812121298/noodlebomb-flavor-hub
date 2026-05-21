// NoodleBomb shared page interactions — about / recipes / faq

(function () {
  var META_PIXEL_ID = '3750419675236656';
  var KLAVIYO_ACCOUNT_ID = 'XSwJ9H';

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) return;
    var script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  if (!window.fbq) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
  }
  if (window.fbq && !window.__nbMetaPageViewed) {
    window.fbq('track', 'PageView');
    window.__nbMetaPageViewed = true;
  }
  loadScriptOnce('nb-klaviyo-onsite', 'https://static.klaviyo.com/onsite/js/' + KLAVIYO_ACCOUNT_ID + '/klaviyo.js');

  var path = window.location.pathname;
  var productMatch = path.match(/^\/product\/([^/]+)/);
  if (window.fbq && productMatch) {
    window.fbq('track', 'ViewContent', {
      content_name: document.title.replace(/\s*\|\s*NoodleBomb.*$/, ''),
      content_ids: [productMatch[1]],
      content_type: 'product',
      currency: 'USD'
    });
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest('a[href*="/cart?add="]') : null;
    if (!link || !window.fbq) return;
    var addMatch = link.href.match(/[?&]add=([^&]+)/);
    var slug = addMatch ? decodeURIComponent(addMatch[1]) : 'product';
    window.fbq('track', 'AddToCart', {
      content_name: link.textContent.trim(),
      content_ids: [slug],
      content_type: 'product',
      currency: 'USD'
    });
  }, true);

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
    cta.textContent = 'SHOP SHOYU - $11.99 \u2192';
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
