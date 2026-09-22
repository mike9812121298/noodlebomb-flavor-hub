/* NoodleBomb readable phone lineup — one-tap add to cart for [data-nbx-add].
 *
 * Adds through the site's canonical cart (window.NB_CART from cart-store.js),
 * so Meta Pixel + GA4 AddToCart fire exactly as they do on every other button.
 * Without NB_CART the link's own href (/cart?add=<slug>&qty=1) does the add on
 * the cart page. After an add the button reads "Added ✓ · View cart" and a
 * second tap follows its href to /cart. Uses its own data attribute so it can
 * never double-add with page-shared.js's [data-quick-add] handler.
 */
(function () {
  'use strict';
  if (window.__nbxLineup) return;
  window.__nbxLineup = true;

  function announce(btn, message) {
    var section = btn.closest('.nbx');
    var live = section && section.querySelector('[data-nbx-status]');
    if (!live) return;
    live.textContent = '';
    window.setTimeout(function () { live.textContent = message; }, 40);
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    var btn = target && target.closest ? target.closest('[data-nbx-add]') : null;
    if (!btn || btn.classList.contains('is-added')) return;
    var cart = window.NB_CART;
    if (!cart || typeof cart.add !== 'function') return;
    event.preventDefault();
    var name = btn.getAttribute('data-name') || '';
    cart.add({
      slug: btn.getAttribute('data-slug'),
      name: name,
      price: parseFloat(btn.getAttribute('data-price')),
      qty: 1
    });
    btn.classList.add('is-added');
    btn.setAttribute('href', '/cart');
    (btn.querySelector('[data-nbx-label]') || btn).textContent = 'Added ✓ · View cart';
    announce(btn, name + ' added to cart.');
  });
})();
