(function () {
  'use strict';

  var currency = 'USD';
  var products = {
    original: { slug: 'original', name: 'Original', price: 11.99, paths: ['product-original.html', 'original-ramen-sauce'] },
    spicy: { slug: 'spicy', name: 'Spicy Tokyo', price: 11.99, paths: ['product-spicy.html', 'spicy-tokyo-ramen-sauce'] },
    citrus: { slug: 'citrus', name: 'Citrus Shoyu', price: 11.99, paths: ['product-citrus.html', 'citrus-shoyu-ramen-sauce'] },
    shoyu: { slug: 'shoyu', name: 'Shoyu Reserve', price: 11.99, paths: ['product-shoyu-reserve.html', 'shoyu-reserve'] },
    trio: { slug: 'trio', name: 'The NoodleBomb Trio', price: 29.99, paths: ['the-noodlebomb-trio', 'variety-pack'] }
  };

  function fbqTrack(eventName, payload) {
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', eventName, payload || {});
      }
    } catch (e) {
      /* ignore analytics errors */
    }
  }

  function normalizeItem(item) {
    item = item || {};
    return {
      slug: item.slug || item.id || '',
      name: item.name || item.title || item.slug || '',
      price: Number(item.price || item.item_price || 0) || 0,
      qty: Math.max(1, Math.floor(Number(item.qty || item.quantity || 1) || 1))
    };
  }

  function trackViewContent(item) {
    var next = normalizeItem(item);
    if (!next.slug) return;
    fbqTrack('ViewContent', {
      content_ids: [next.slug],
      content_name: next.name,
      content_category: 'Sauce',
      content_type: 'product',
      value: Number(next.price.toFixed(2)),
      currency: currency
    });
  }

  function trackAddToCart(item) {
    var next = normalizeItem(item);
    if (!next.slug) return;
    fbqTrack('AddToCart', {
      content_ids: [next.slug],
      content_name: next.name,
      content_category: 'Sauce',
      content_type: 'product',
      contents: [{ id: next.slug, quantity: next.qty, item_price: next.price }],
      value: Number((next.price * next.qty).toFixed(2)),
      currency: currency
    });
  }

  function trackInitiateCheckout(items, value) {
    var list = (items || []).map(normalizeItem).filter(function (item) { return item.slug; });
    fbqTrack('InitiateCheckout', {
      content_ids: list.map(function (item) { return item.slug; }),
      content_type: 'product',
      contents: list.map(function (item) {
        return { id: item.slug, quantity: item.qty, item_price: item.price };
      }),
      num_items: list.reduce(function (total, item) { return total + item.qty; }, 0),
      value: Number((Number(value) || list.reduce(function (total, item) { return total + item.price * item.qty; }, 0)).toFixed(2)),
      currency: currency
    });
  }

  function productForPath(pathname) {
    var path = String(pathname || '').toLowerCase();
    return Object.keys(products)
      .map(function (key) { return products[key]; })
      .find(function (product) {
        return product.paths.some(function (part) { return path.indexOf(part) !== -1; });
      });
  }

  window.NB_META_PIXEL = {
    trackViewContent: trackViewContent,
    trackAddToCart: trackAddToCart,
    trackInitiateCheckout: trackInitiateCheckout
  };

  var pageProduct = productForPath(window.location.pathname);
  if (pageProduct) trackViewContent(pageProduct);
})();
