// NoodleBomb shared page interactions â€” about / recipes / faq

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

  // Homepage production patch: keeps the current live build aligned with the
  // latest launch direction while the source bundle deploy is pending.
  var patchStylesId = 'nb-live-homepage-patch';
  function ensureHomepagePatchStyles() {
    if (document.getElementById(patchStylesId)) return;
    var style = document.createElement('style');
    style.id = patchStylesId;
    style.textContent = [
      '.hero-section>div:first-child{background:#070604!important;}',
      '.hero-section .nb-live-trio-hero{position:absolute!important;inset:0!important;left:0!important;right:auto!important;top:0!important;bottom:auto!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;transform:none!important;transition:none!important;filter:none!important;}',
      '#next-drop .nd-bottle-stage{position:relative!important;}',
      '#next-drop a[href*="add=shoyu"]:not(.nd-image-preorder){display:none!important;}',
      '#next-drop .nd-notify-caption{display:none!important;}',
      '#next-drop .nd-image-preorder{position:absolute!important;left:50%!important;right:auto!important;bottom:clamp(10px,2vw,18px)!important;top:auto!important;z-index:12!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;max-width:calc(100% - 24px)!important;min-height:44px!important;padding:13px 18px!important;border:1px solid rgba(255,255,255,.42)!important;border-radius:999px!important;background:#f4efe7!important;color:#0e0d0c!important;font-family:Inter,system-ui,sans-serif!important;font-size:12px!important;font-weight:800!important;letter-spacing:.13em!important;text-transform:uppercase!important;text-decoration:none!important;white-space:nowrap!important;box-shadow:0 16px 34px rgba(0,0,0,.34)!important;transform:translateX(-50%)!important;}',
      '@media (max-width:768px){.hero-section .nb-live-trio-hero{width:100%!important;height:100%!important;object-fit:cover!important;object-position:66% center!important;opacity:.92!important;}#next-drop .nd-image-preorder{bottom:8px!important;font-size:10px!important;letter-spacing:.1em!important;padding:12px 14px!important;max-width:calc(100% - 18px)!important;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function patchHomepageHero() {
    var heroImg = document.querySelector('.hero-section img.hero-product-bg') ||
      document.querySelector('.hero-section > div:first-child img');
    if (!heroImg) return false;
    heroImg.classList.add('nb-live-trio-hero');
    heroImg.src = '/uploads/nb-front-hero-user-2026-05-09.svg';
    heroImg.alt = 'NoodleBomb trio bottles with citrus, garlic, mushrooms, and chiles on a black background';
    heroImg.loading = 'eager';
    heroImg.decoding = 'async';
    return true;
  }

  function patchShoyuPreorder() {
    var stage = document.querySelector('#next-drop .nd-bottle-stage');
    if (!stage) return false;

    var cta = stage.querySelector('.nd-image-preorder');
    var tag = cta || stage.querySelector('.nd-stage-tag');
    if (!tag) return false;

    if (tag.tagName.toLowerCase() !== 'a') {
      cta = document.createElement('a');
      cta.className = tag.className;
      tag.parentNode.replaceChild(cta, tag);
    } else {
      cta = tag;
    }

    cta.classList.add('nd-stage-tag', 'nd-image-preorder');
    cta.href = '/cart?add=shoyu&qty=1';
    cta.textContent = 'PREORDER FOR $9.99 \u2192';
    cta.removeAttribute('aria-hidden');
    cta.removeAttribute('tabindex');

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
