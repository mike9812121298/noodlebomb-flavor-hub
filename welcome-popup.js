/* NoodleBomb welcome offer popup — email capture with optional first-order code.
   SHIPPED DISABLED. To turn on:
     1. Create the discount code in Shopify (e.g. WELCOME10, 10% off first order).
     2. Set enabled: true and code/offer below.
     3. (Later) swap formAction to the Klaviyo subscribe endpoint once the
        public API key + list ID exist; formsubmit.co is the interim inbox.
   Behavior: shows once per visitor (localStorage, 180 days), after 9s or 35%
   scroll, never on /cart or /checkout, Escape/backdrop closes. */
(function () {
  var CFG = {
    enabled: false,
    headline: 'Get 10% off your first order',
    sub: 'Join the Flavor Club list. One or two emails a month — drops, recipes, nothing else.',
    offer: '10% off your first order',
    code: 'WELCOME10',
    formAction: 'https://formsubmit.co/hello@noodlebomb.co',
    delayMs: 9000,
    scrollPct: 35
  };
  if (!CFG.enabled) return;
  if (/^\/(cart|checkout)/.test(window.location.pathname)) return;
  var KEY = 'nb_welcome_seen_v1';
  try {
    var seen = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (seen && Date.now() - seen < 180 * 24 * 3600 * 1000) return;
  } catch (e) { /* storage unavailable: show at most this session */ }

  var shown = false;
  function markSeen() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }

  function show() {
    if (shown) return;
    shown = true;
    markSeen();
    var wrap = document.createElement('div');
    wrap.className = 'nb-welcome';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', CFG.headline);
    wrap.innerHTML =
      '<div class="nb-welcome-backdrop"></div>' +
      '<div class="nb-welcome-card">' +
        '<button type="button" class="nb-welcome-x" aria-label="Close">×</button>' +
        '<div class="nb-welcome-kicker">NOODLEBOMB · FLAVOR CLUB</div>' +
        '<h2 class="nb-welcome-h">' + CFG.headline + '</h2>' +
        '<p class="nb-welcome-sub">' + CFG.sub + '</p>' +
        '<form class="nb-welcome-form" action="' + CFG.formAction + '" method="POST">' +
          '<input type="hidden" name="_subject" value="Flavor Club signup (welcome popup)">' +
          '<input type="hidden" name="_captcha" value="false">' +
          '<input type="email" name="email" required placeholder="you@email.com" aria-label="Email address">' +
          '<button type="submit">Get my code →</button>' +
        '</form>' +
        '<button type="button" class="nb-welcome-skip">No thanks, full price is fine</button>' +
      '</div>';
    var css = document.createElement('style');
    css.textContent =
      '.nb-welcome{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;}' +
      '.nb-welcome-backdrop{position:absolute;inset:0;background:rgba(8,7,6,0.72);}' +
      '.nb-welcome-card{position:relative;max-width:420px;width:100%;background:#141210;border:1px solid rgba(240,235,227,0.14);border-radius:16px;padding:34px 30px 26px;color:#F0EBE3;box-shadow:0 30px 80px rgba(0,0,0,0.6);}' +
      '.nb-welcome-x{position:absolute;top:10px;right:12px;background:none;border:0;color:rgba(240,235,227,0.6);font-size:26px;cursor:pointer;line-height:1;padding:6px;}' +
      '.nb-welcome-kicker{font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:0.18em;color:#D4A24A;margin-bottom:12px;}' +
      '.nb-welcome-h{font-family:\'Inter Tight\',sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.02em;margin:0 0 8px;}' +
      '.nb-welcome-sub{font-family:Inter,sans-serif;font-size:14px;line-height:1.55;color:rgba(240,235,227,0.72);margin:0 0 18px;}' +
      '.nb-welcome-form{display:flex;gap:8px;}' +
      '.nb-welcome-form input[type=email]{flex:1;min-width:0;height:48px;border-radius:999px;border:1px solid rgba(240,235,227,0.18);background:rgba(245,241,234,0.06);color:#F0EBE3;padding:0 16px;font:400 14px Inter,sans-serif;}' +
      '.nb-welcome-form button{height:48px;padding:0 20px;border-radius:999px;border:0;background:#D4A24A;color:#0E0D0C;font:700 13px \'Inter Tight\',sans-serif;cursor:pointer;white-space:nowrap;}' +
      '.nb-welcome-skip{display:block;margin:14px auto 0;background:none;border:0;color:rgba(240,235,227,0.5);font:400 12px Inter,sans-serif;cursor:pointer;text-decoration:underline;}';
    document.head.appendChild(css);
    document.body.appendChild(wrap);
    function close() { wrap.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    wrap.querySelector('.nb-welcome-backdrop').addEventListener('click', close);
    wrap.querySelector('.nb-welcome-x').addEventListener('click', close);
    wrap.querySelector('.nb-welcome-skip').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    wrap.querySelector('.nb-welcome-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Saving…';
      var ajaxAction = CFG.formAction.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      fetch(ajaxAction, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .catch(function () { /* inbox delivery best-effort; still show the code */ })
        .then(function () {
          wrap.querySelector('.nb-welcome-card').innerHTML =
            '<button type="button" class="nb-welcome-x" aria-label="Close">×</button>' +
            '<div class="nb-welcome-kicker">YOU’RE IN</div>' +
            '<h2 class="nb-welcome-h">' + (CFG.code ? 'Use code ' + CFG.code : 'Welcome to the club') + '</h2>' +
            '<p class="nb-welcome-sub">' + (CFG.code ? CFG.offer + ' — applied at checkout with the code above.' : 'Watch your inbox for drops and recipes.') + '</p>';
          wrap.querySelector('.nb-welcome-x').addEventListener('click', close);
        });
    });
    wrap.querySelector('input[type=email]').focus();
  }

  window.setTimeout(show, CFG.delayMs);
  window.addEventListener('scroll', function onScroll() {
    var doc = document.documentElement;
    var pct = (window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight)) * 100;
    if (pct >= CFG.scrollPct) { window.removeEventListener('scroll', onScroll); show(); }
  }, { passive: true });
})();
