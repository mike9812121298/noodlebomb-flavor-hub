// NoodleBomb cart page - editorial palette, vanilla React (CDN UMD).
// Reads from window.NB_CART (cart-store.js).
const { useEffect, useState, useMemo } = React;

const NB_SITE_URLS = {
  original: 'https://noodlebomb.co/original-ramen-sauce',
  citrus: 'https://noodlebomb.co/citrus-shoyu-ramen-sauce',
  spicy: 'https://noodlebomb.co/spicy-tokyo-ramen-sauce',
  shoyu: 'https://nu2vqa-ma.myshopify.com/products/shoyu-reserve',
  shoyuspicy: 'https://noodlebomb.co/spicy-shoyu-ramen-sauce',
  rgs: 'https://noodlebomb.co/product/roasted-garlic-sesame',
  trio: 'https://noodlebomb.co/shop',
  firedust: 'https://noodlebomb.co/product/fire-dust',
  cart: 'https://noodlebomb.co/cart.html',
  shop: 'https://noodlebomb.co/shop'
};
const SHOPIFY_VARIANT_IDS = {
  original: '53998041596214',
  citrus: '53998041071926',
  spicy: '53998042120502',
  trio: '53998042644790',
  shoyu: '54006619636022',
  shoyuspicy: '54097354686774',
  firedust: '54111262146870',
  rgs: '54125810614582'
};
const getShopifyCartPermalink = (items) => {
  const lines = (items || [])
    .map((it) => {
      const id = SHOPIFY_VARIANT_IDS[it.slug];
      const qty = Math.max(1, Math.floor(it.qty || 1));
      return id ? `${id}:${qty}` : null;
    })
    .filter(Boolean);
  return lines.length
    ? `https://nu2vqa-ma.myshopify.com/cart/${lines.join(',')}`
    : NB_SITE_URLS.shop;
};
const getCheckoutUrl = (items) => {
  if (!items || items.length === 0) return NB_SITE_URLS.shop;
  return getShopifyCartPermalink(items);
};

const FREE_SHIPPING = (window.NB_CART && window.NB_CART.FREE_SHIPPING_THRESHOLD) || 29.99;
const hasFreeShippingTrio = (items) => (items || []).some((i) => i.slug === 'trio' && (Number(i.qty) || 0) > 0);
const getBottleCount = (items) => (items || []).reduce((n, i) => n + ((i.slug === 'trio' ? 3 : 1) * (Number(i.qty) || 0)), 0);
const FLAT_SHIPPING = 3.50;

// Trio bundle - single source of truth for slug/name/price within this file.
// Mirrors app.jsx TRIO and components.jsx NB_TRIO. Keep all three in sync.
const TRIO = { slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 29.99 };

// Fire Dust seasoning topper - the "Power up your cart" one-tap upsell. Pairs
// with every sauce, so it's offered as its own row rather than a sauce rec.
// slug/variant are already wired into SHOPIFY_VARIANT_IDS + NB_SITE_URLS above.
const FIRE_DUST = { slug: 'firedust', name: 'NoodleBomb Fire Dust', label: 'Fire Dust', price: 10.99, tag: 'Korean chili crunch - 3.2 oz topper' };

// Ramen Ritual Kit - the higher-AOV bundle: the Trio (all 3 sauces) + the Fire
// Dust topper. Presented as one card; "Add the Kit" drops BOTH components into
// the existing NB cart as separate line items (no Shopify bundle SKU yet - the
// on-site total therefore equals what Shopify charges, $40.98, so we never
// promise a discount the checkout won't honor). To turn this into a true
// discounted bundle, configure a bundle SKU or an automatic discount in Shopify
// (see DEPLOY notes) and wire its variant id / discount code here.
const RITUAL_KIT = {
  name: 'Ramen Ritual Kit',
  tag: 'The full set - all 3 sauces + Fire Dust topper',
  components: [
    { slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd },
    { slug: FIRE_DUST.slug, name: FIRE_DUST.name, price: FIRE_DUST.price },
  ],
};
const RITUAL_KIT_TOTAL = RITUAL_KIT.components.reduce((s, c) => s + c.price, 0); // 40.98

const STACK_OFFERS = [
  {
    key: 'umami-stack',
    name: 'Umami Stack',
    tag: 'Original + Roasted Garlic Sesame',
    note: 'Pour. Shake. Stack. Built for rice, eggs, ramen, and leftovers.',
    components: [
      { slug: 'original', name: 'Original', price: 11.99 },
      { slug: 'rgs', name: 'Roasted Garlic Sesame', price: 10.99 },
    ],
  },
  {
    key: 'heat-stack',
    name: 'Heat Stack',
    tag: 'Spicy Tokyo + Fire Dust',
    note: 'Chili-forward sauce plus crunchy heat for noodles, wings, and dumplings.',
    components: [
      { slug: 'spicy', name: 'Spicy Tokyo', price: 11.99 },
      { slug: 'firedust', name: 'Fire Dust', price: 10.99 },
    ],
  },
  {
    key: 'bright-stack',
    name: 'Bright Stack',
    tag: 'Citrus Shoyu + Roasted Garlic Sesame',
    note: 'Bright shoyu plus toasted garlic and sesame for bowls and greens.',
    components: [
      { slug: 'citrus', name: 'Citrus Shoyu', price: 11.99 },
      { slug: 'rgs', name: 'Roasted Garlic Sesame', price: 10.99 },
    ],
  },
  {
    key: 'reserve-heat-stack',
    name: 'Reserve Heat Stack',
    tag: 'Spicy Shoyu + Fire Dust',
    note: 'Deep shoyu heat with a shake-on crunchy finish.',
    components: [
      { slug: 'shoyuspicy', name: 'Spicy Shoyu', price: 11.99 },
      { slug: 'firedust', name: 'Fire Dust', price: 10.99 },
    ],
  },
  {
    key: 'reserve-duo',
    name: 'Shoyu Reserve Duo',
    tag: 'Shoyu Reserve + Spicy Shoyu',
    note: 'One deep, one spicy. Built for ramen, rice, eggs, dumplings, and dipping.',
    components: [
      { slug: 'shoyu', name: 'Shoyu Reserve', price: 11.99 },
      { slug: 'shoyuspicy', name: 'Spicy Shoyu', price: 11.99 },
    ],
  },
];

const PRODUCT_IMAGES = {
  original: 'uploads/nb-original-cart-thumb-2026-06-06.webp',
  spicy:    'uploads/nb-spicy-cart-thumb-2026-06-06.webp',
  citrus:   'uploads/nb-citrus-cart-thumb-2026-06-06.webp',
  trio:     'uploads/noodlebomb-trio.png',
  shoyu:    'uploads/shoyu-reserve-cart-thumb-2026-06-06.webp',
  shoyuspicy: 'uploads/nb-shoyu-spicy-front-cutout-2026-06-09.webp',
  firedust: 'uploads/nb-fire-dust-front-cutout-2026-06-10-thumb.webp',
  rgs:      'uploads/nb-roasted-garlic-sesame-cutout-2026-06-22.webp'
};

const PRODUCT_LABELS = {
  original: { tag: 'No.01', tagline: 'Garlic & Sesame' },
  spicy:    { tag: 'No.03', tagline: 'Spicy Tokyo' },
  citrus:   { tag: 'No.02', tagline: 'Citrus Shoyu' },
  trio:     { tag: '3-Pack', tagline: 'The Trio' },
  shoyu:    { tag: 'Reserve', tagline: 'Shoyu Reserve' },
  shoyuspicy: { tag: 'Reserve', tagline: 'Spicy Shoyu' },
  firedust: { tag: 'Shake-On', tagline: 'Fire Dust' },
  rgs:      { tag: 'Shake-On', tagline: 'Roasted Garlic Sesame' }
};

const RECS = [
  { slug: 'original', name: 'Original', tag: 'No.01 - Garlic & Sesame', price: 11.99 },
  { slug: 'spicy',    name: 'Spicy Tokyo', tag: 'No.03 - Spicy Tokyo', price: 11.99 },
  { slug: 'citrus',   name: 'Citrus Shoyu', tag: 'No.02 - Citrus Shoyu', price: 11.99 }
];

const fmtUSD = (n) => '$' + (Number(n) || 0).toFixed(2);
const isoDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const lineKey = (item, index) => `${item.slug}-${index}-${JSON.stringify(item.attributes || [])}`;
const bottleMix = (item) => (item.attributes || []).find((attr) => attr.key === 'Bottle mix')?.value;

// -- Reusable icons --
const Truck = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const Trash = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);
const Shield = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const Repeat = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);
const Check = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>
);

// -- Ramen Ritual Kit bundle card --
// Reused in both the empty state (variant="feature") and the filled cart
// (variant="inline"). One tap adds the Trio + Fire Dust as separate line items.
// Layout note: the price and the CTA live in their OWN bottom row (flex,
// space-between, wrap) - never absolutely positioned over each other - so the
// add button can't overlap the price on narrow screens (the earlier mobile bug).
function RitualKitCard({ items, variant }) {
  const inCart = (slug) => (items || []).some((i) => i.slug === slug);
  const missing = RITUAL_KIT.components.filter((c) => !inCart(c.slug));
  // Hide once the full kit is already in the cart.
  if (missing.length === 0) return null;

  const addKit = () => {
    if (!window.NB_CART) return;
    // Add only the components not already present, so we never silently bump an
    // existing line's quantity.
    missing.forEach((c) => window.NB_CART.add({ slug: c.slug, name: c.name, price: c.price }));
    const detail = { components: missing.map((c) => c.slug), total: RITUAL_KIT_TOTAL };
    try { window.dispatchEvent(new CustomEvent('nb_add_ritual_kit', { detail })); } catch (_) {}
    try { window.fbq && window.fbq('trackCustom', 'AddRamenRitualKit', detail); } catch (_) {}
    try { window.dataLayer && window.dataLayer.push({ event: 'add_ritual_kit', ...detail }); } catch (_) {}
  };

  const isFeature = variant === 'feature';
  const cta = missing.length === RITUAL_KIT.components.length ? 'Add the Kit' : 'Complete the Kit';

  return (
    <div className="card cart-ritual-kit" style={{
      marginTop: isFeature ? 28 : 0,
      marginBottom: isFeature ? 0 : 24,
      textAlign: 'left',
      border: '1px solid var(--accent)',
      background: 'linear-gradient(180deg, rgba(232,74,58,0.10) 0%, rgba(232,74,58,0.03) 100%)',
      padding: 20,
    }}>
      <div className="mono" style={{ color: 'var(--accent)', fontSize: 10, letterSpacing: '0.18em', fontWeight: 700, marginBottom: 12 }}>
        COMPLETE THE SET - BEST VALUE
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {/* Stacked thumbs: trio + fire dust */}
        <div style={{ display: 'flex', flexShrink: 0 }}>
          <div style={{ width: 54, height: 54, background: 'var(--paper-3)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
            <img src={PRODUCT_IMAGES.trio} alt="The NoodleBomb Trio" loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ width: 54, height: 54, background: 'var(--paper-3)', border: '1px solid var(--line)', borderLeft: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
            <img src={PRODUCT_IMAGES.firedust} alt="NoodleBomb Fire Dust seasoning topper" loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Inter Tight', fontWeight: 800, fontSize: 18, color: 'var(--ink)', lineHeight: 1.15 }}>{RITUAL_KIT.name}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'var(--ink-60)', lineHeight: 1.5, marginTop: 3 }}>{RITUAL_KIT.tag}</div>
        </div>
      </div>

      {/* Bottom row: price + CTA - own row, space-between, wraps cleanly */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
          <span style={{ fontFamily: 'Inter Tight', fontWeight: 800, fontSize: 22, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(RITUAL_KIT_TOTAL)}</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.13em', color: 'var(--ink-40)', textTransform: 'uppercase' }}>3 sauces + topper</span>
        </div>
        <button onClick={addKit} aria-label={'Add the Ramen Ritual Kit to cart for ' + fmtUSD(RITUAL_KIT_TOTAL)} style={{
          flexShrink: 0,
          padding: '13px 26px',
          borderRadius: 999,
          background: 'var(--accent)',
          color: 'var(--accent-ink)',
          border: 0,
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          transition: 'transform .2s, box-shadow .2s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(232,74,58,0.28)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
        >{cta} </button>
      </div>
    </div>
  );
}

function StackOfferCard({ offer, items }) {
  const inCart = (slug) => (items || []).some((i) => i.slug === slug);
  const missing = offer.components.filter((c) => !inCart(c.slug));
  if (missing.length === 0) return null;

  const total = offer.components.reduce((s, c) => s + c.price, 0);
  const addStack = () => {
    if (!window.NB_CART) return;
    missing.forEach((c) => window.NB_CART.add({ slug: c.slug, name: c.name, price: c.price }));
    const detail = { stack: offer.key, components: missing.map((c) => c.slug), total };
    try { window.dispatchEvent(new CustomEvent('nb_add_flavor_stack', { detail })); } catch (_) {}
    try { window.fbq && window.fbq('trackCustom', 'AddFlavorStack', detail); } catch (_) {}
    try { window.dataLayer && window.dataLayer.push({ event: 'add_flavor_stack', ...detail }); } catch (_) {}
  };

  return (
    <div className="card cart-rec-card" style={{ padding: 14, display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {offer.components.slice(0, 2).map((component, index) => (
            <div key={component.slug} style={{ width: 48, height: 48, marginLeft: index ? -8 : 0, background: 'var(--paper-3)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
              <img src={PRODUCT_IMAGES[component.slug] || PRODUCT_IMAGES.original} alt={component.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Inter Tight', fontWeight: 800, fontSize: 15, color: 'var(--ink)', lineHeight: 1.1 }}>{offer.name}</div>
          <div style={{ color: 'var(--ink-40)', fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{offer.tag}</div>
        </div>
      </div>
      <div style={{ color: 'var(--ink-60)', fontSize: 12, lineHeight: 1.45 }}>{offer.note}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--accent)', fontFamily: 'Inter Tight', fontWeight: 800, fontSize: 16 }}>{fmtUSD(total)}</span>
        <button className="cart-rec-add" onClick={addStack} aria-label={'Add ' + offer.name + ' to cart'} style={{
          padding: '10px 16px', borderRadius: 999, background: 'var(--accent)', color: 'var(--accent-ink)',
          border: 0, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Inter Tight, sans-serif',
          lineHeight: 1, flexShrink: 0, transition: 'transform .2s'
        }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = ''}
        >{missing.length === offer.components.length ? 'Add stack' : 'Complete stack'}</button>
      </div>
    </div>
  );
}

function CartPage() {
  const [items, setItems] = useState(() => window.NB_CART ? window.NB_CART.getItems() : []);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const onCheckoutClick = (e) => {
    if (checkoutLoading) { e.preventDefault(); return; }
    if (window.NB_SHOPIFY_CHECKOUT && window.NB_SHOPIFY_CHECKOUT.isEnabled()) {
      setCheckoutLoading(true);
      window.NB_SHOPIFY_CHECKOUT.handleCheckoutClick(items, e, getCheckoutUrl(items))
        .finally(() => setCheckoutLoading(false));
    }
  };

  useEffect(() => {
    if (!window.NB_CART) return;
    return window.NB_CART.onChange(() => setItems(window.NB_CART.getItems()));
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const hasTrio = hasFreeShippingTrio(items);
  const bottleCount = getBottleCount(items);
  const freeShipping = subtotal >= FREE_SHIPPING;
  const remaining = freeShipping ? 0 : Math.max(FREE_SHIPPING - subtotal, 0);
  const progress = freeShipping ? 100 : Math.min((subtotal / FREE_SHIPPING) * 100, 100);

  const delivery = useMemo(() => {
    const a = new Date(); a.setDate(a.getDate() + 5);
    const b = new Date(); b.setDate(b.getDate() + 7);
    return isoDate(a) + ' - ' + isoDate(b);
  }, []);

  const recsToShow = RECS.filter((r) => !items.some((i) => i.slug === r.slug)).slice(0, 3);

  const setQty = (item, qty) => window.NB_CART && window.NB_CART.setQty(item.slug, qty, item.attributes);
  const remove = (item) => window.NB_CART && window.NB_CART.remove(item.slug, item.attributes);
  const addRec = (rec) => window.NB_CART && window.NB_CART.add({ slug: rec.slug, name: rec.name, price: rec.price });

  // -- Upsell hierarchy (compute once; keeps the three CTAs from stacking) --
  // Trio swap: targeted "you're one bottle away" nudge (1-2 singles, no trio).
  // Ritual Kit: the go-big bundle - only when there's no trio AND no Fire Dust
  //   AND we're not already showing the narrower trio-swap nudge.
  // Fire Dust upsell: the small single add-on - hidden when the Kit is showing
  //   (the Kit already includes Fire Dust).
  const hasTrioInCart = items.some((i) => i.slug === 'trio');
  const hasFireDustInCart = items.some((i) => i.slug === FIRE_DUST.slug);
  const trioSingleSlugs = ['original', 'spicy', 'citrus'];
  const trioSingleCount = items
    .filter((i) => trioSingleSlugs.includes(i.slug))
    .reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
  const showTrioUpsell = !hasTrioInCart && trioSingleCount >= 1 && trioSingleCount <= 2;
  const showRitualKit = !hasTrioInCart && !hasFireDustInCart && !showTrioUpsell;
  const showFireDustUpsell = !hasFireDustInCart && !showRitualKit;
  const stacksToShow = STACK_OFFERS
    .filter((offer) => offer.components.some((c) => !items.some((i) => i.slug === c.slug)))
    .slice(0, 3);

  // -- Empty state --
  if (itemCount === 0) {
    return (
      <div className="empty">
        <a className="crumb" href="/"> Back to site</a>
        <div className="empty-mark">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h1>Your cart is <em>empty.</em></h1>
        <p>Start with one bottle, or grab the Trio and taste the full range.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* One-click Trio shortcut - same pattern as the drawer empty state.
              Lets a returning visitor with empty localStorage land in a populated
              cart in one tap. */}
          <button
            onClick={() => {
              if (window.NB_CART) window.NB_CART.add({ slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd });
            }}
            className="btn"
            style={{ width: 'auto', display: 'inline-flex', padding: '14px 32px', cursor: 'pointer', border: 0 }}
          >
            Add the Trio - {fmtUSD(TRIO.priceUsd)}
          </button>
          <a className="btn btn-secondary" href="/shop" style={{ width: 'auto', display: 'inline-flex', padding: '14px 32px' }}>
            Shop sauces</a>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-40)', fontFamily: 'JetBrains Mono', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          All 3 flavors - save $5.98
        </div>

        {/* Go-big bundle: the Ramen Ritual Kit (Trio + Fire Dust) as the
            higher-AOV starting point from an empty cart. */}
        <div style={{ maxWidth: 520, margin: '28px auto 0' }}>
          <RitualKitCard items={items} variant="feature" />
        </div>

        <div className="recommendations">
          {RECS.map((r) => (
            <a key={r.slug} className="rec-card" href="/shop">
              <div className="img-wrap">
                <img src={PRODUCT_IMAGES[r.slug]} alt={'NoodleBomb ' + r.name + ' ramen sauce'} />
              </div>
              <h3>{r.name}</h3>
              <div className="tag">{r.tag}</div>
              <div className="price-row">
                <span className="price">{fmtUSD(r.price)}</span>
                <span className="arrow">View </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // -- Filled cart --
  return (
    <>
      <a className="crumb" href="/shop"> Continue shopping</a>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        <h1 className="page-title">Your <span style={{ color: 'var(--accent)', fontFamily: 'Inter Tight', fontStyle: 'normal', fontWeight: 800 }}>cart.</span></h1>
      </div>
      <p className="page-meta">{itemCount} {itemCount === 1 ? 'item' : 'items'} - secure checkout opens on Shopify</p>

      <div className="layout">
        {/* Left column */}
        <div>
          {/* Free shipping bar */}
          {freeShipping ? (
            <div className="card ship-bar unlocked">
              <div className="icon"><Truck /></div>
              <div>
                <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}> FREE US shipping unlocked</div>
                <div style={{ color: 'var(--ink-40)', fontSize: 12, marginTop: 2 }}>Your cart crossed the $29.99 free-shipping line.</div>
              </div>
            </div>
          ) : (
            <div className="card ship-bar">
              <div className="row">
                <span style={{ color: 'var(--ink-60)' }}>Add <span className="accent">{fmtUSD(remaining)}</span> for <span style={{ color: 'var(--ink)' }}>FREE US shipping</span> - else $3.50 flat</span>
                <Truck />
              </div>
              <div className="track"><div className="fill" style={{ width: progress + '%' }} /></div>
            </div>
          )}

          {/* Ramen Ritual Kit - the go-big bundle (Trio + Fire Dust). Sits at the
              top of the column when the cart isn't already trio/fire-dust-bound
              and the narrower trio-swap nudge isn't showing. */}
          {showRitualKit && <RitualKitCard items={items} variant="inline" />}

          {/* Smart Trio upsell - only when cart has items, no trio yet, and user
              hasn't crossed the free-shipping line. Adding the trio clears the
              real $29.99 free-shipping threshold and saves the user $5.98 vs
              buying 3 bottles as singles. */}
          {(() => {
            if (!showTrioUpsell) return null;
            const singleSlugs = trioSingleSlugs;
            const singleCount = trioSingleCount;
            const swapToTrio = () => {
              if (window.NB_CART) {
                singleSlugs.forEach((slug) => window.NB_CART.remove(slug));
                window.NB_CART.add({ slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd });
              }
              const detail = { fromSingleCount: singleCount, savings: 5.98, destination: 'trio' };
              try { window.dispatchEvent(new CustomEvent('nb_cart_upgrade_to_trio', { detail })); } catch (_) {}
              try { window.fbq && window.fbq('trackCustom', 'UpgradeToTrioPrompt', detail); } catch (_) {}
              try { window.dataLayer && window.dataLayer.push({ event: 'upgrade_to_trio_prompt', ...detail }); } catch (_) {}
            };
            return (
              <div className="card" style={{
                border: '1px solid var(--accent)',
                background: 'linear-gradient(180deg, rgba(232,74,58,0.12) 0%, rgba(232,74,58,0.04) 100%)',
                padding: 22,
                display: 'flex',
                gap: 18,
                alignItems: 'center',
              }}>
                <div style={{
                  width: 56, height: 56, flexShrink: 0,
                  background: 'var(--paper-3)', border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 4,
                }}>
                  <img src="uploads/noodlebomb-trio.png" alt="The NoodleBomb Trio" loading="lazy"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ color: 'var(--accent)', fontSize: 10, letterSpacing: '0.18em', fontWeight: 700, marginBottom: 4 }}>
                    CART SLOT 1: TRIO
                  </div>
                  <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>
                    Add bottle 3 + unlock Trio savings
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-60)', lineHeight: 1.5 }}>
                    Any 3 bottles qualify for the $29.99 Trio price.
                  </div>
                </div>
                <button onClick={swapToTrio} aria-label="Swap singles for the Trio bundle" style={{
                  flexShrink: 0,
                  padding: '12px 20px',
                  borderRadius: 999,
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  border: 0,
                  fontFamily: 'Inter',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'transform .2s, box-shadow .2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(232,74,58,0.28)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Swap to Trio
                </button>
              </div>
            );
          })()}

          {/* Items */}
          {items.map((item, index) => (
            <div key={lineKey(item, index)} className="card line-item">
              <div className="line-item-img">
                <img src={PRODUCT_IMAGES[item.slug] || PRODUCT_IMAGES.original} alt={item.name} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <h3 className="line-item-name">{item.name}</h3>
                    <div className="line-item-meta">
                      {(PRODUCT_LABELS[item.slug] && PRODUCT_LABELS[item.slug].tagline) || ''} - {fmtUSD(item.price)} each
                    </div>
                    {bottleMix(item) && (
                      <div className="line-item-meta" style={{ marginTop: 4, color: 'var(--accent)' }}>
                        Mix: {bottleMix(item)}
                      </div>
                    )}
                  </div>
                  <button className="icon-btn" onClick={() => remove(item)} aria-label={'Remove ' + item.name}><Trash /></button>
                </div>
                <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="qty">
                    <button onClick={() => setQty(item, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease">-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => setQty(item, item.qty + 1)} aria-label="Increase">+</button>
                  </div>
                  <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 22, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtUSD(item.price * item.qty)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Power up your cart - Fire Dust one-tap upsell (hidden when the
              Ritual Kit card is showing, since the Kit already includes it). */}
          {showFireDustUpsell && (
            <div className="cart-powerup" style={{ marginTop: 28 }}>
              <div className="mono" style={{ color: 'var(--ink-40)', marginBottom: 14 }}>Power up your cart</div>
              <div className="card cart-rec-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 56, height: 56, background: 'var(--paper-3)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0 }}>
                  <img src={PRODUCT_IMAGES.firedust} alt="NoodleBomb Fire Dust seasoning topper" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{FIRE_DUST.label}</div>
                  <div style={{ color: 'var(--ink-60)', fontSize: 12, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{FIRE_DUST.tag}</div>
                  <div style={{ color: 'var(--accent)', fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 14, marginTop: 3 }}>{fmtUSD(FIRE_DUST.price)}</div>
                </div>
                <button className="cart-rec-add" onClick={() => addRec(FIRE_DUST)} aria-label="Add NoodleBomb Fire Dust to cart" style={{
                  padding: '11px 20px', borderRadius: 999, background: 'var(--accent)', color: 'var(--accent-ink)',
                  border: 0, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Inter Tight, sans-serif',
                  lineHeight: 1, flexShrink: 0, transition: 'transform .2s'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                >Add</button>
              </div>
            </div>
          )}

          {stacksToShow.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div className="mono" style={{ color: 'var(--ink-40)', marginBottom: 14 }}>Build your flavor stack</div>
              <div className="cart-recs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(' + stacksToShow.length + ', minmax(0, 1fr))', gap: 10 }}>
                {stacksToShow.map((offer) => <StackOfferCard key={offer.key} offer={offer} items={items} />)}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recsToShow.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div className="mono" style={{ color: 'var(--ink-40)', marginBottom: 14 }}>You might also like</div>
              <div className="cart-recs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(' + recsToShow.length + ', minmax(0, 1fr))', gap: 10 }}>
                {recsToShow.map((r) => (
                  <div key={r.slug} className="card cart-rec-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, background: 'var(--paper-3)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0 }}>
                      <img src={PRODUCT_IMAGES[r.slug]} alt={r.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 14, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      <div style={{ color: 'var(--accent)', fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 14, marginTop: 2 }}>{fmtUSD(r.price)}</div>
                    </div>
                    <button className="cart-rec-add" onClick={() => addRec(r)} aria-label={'Add ' + r.name + ' to cart'} style={{
                      width: 32, height: 32, borderRadius: 999, background: 'var(--accent)', color: 'var(--accent-ink)',
                      border: 0, cursor: 'pointer', fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform .2s', flexShrink: 0
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.12)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                    >+</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - summary */}
        <div className="card summary">
          <h2>Order summary</h2>
          <p className="lede">Secure checkout handoff</p>

          <div className="row-line"><span>Subtotal ({itemCount})</span><span className="v">{fmtUSD(subtotal)}</span></div>
          <div className="row-line"><span>Shipping</span><span className="v" style={freeShipping ? { color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 } : { color: 'var(--ink-40)', fontSize: 12 }}>{freeShipping ? 'Free (US)' : 'At checkout'}</span></div>
          <div className="row-line"><span>Estimated tax</span><span className="v" style={{ color: 'var(--ink-40)', fontSize: 12 }}>At checkout</span></div>
          <div className="divider"></div>
          <div className="row-line total"><span className="label">Subtotal</span><span className="v">{fmtUSD(subtotal)}</span></div>

          <div style={{ marginTop: 18, padding: '12px 14px', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--ink-60)' }}>
            <Truck />
            <span style={{ flex: 1 }}>Estimated delivery</span>
            <span style={{ color: 'var(--ink)', fontFamily: 'Inter Tight', fontWeight: 600 }}>{delivery}</span>
          </div>

          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              className="btn"
              href={getCheckoutUrl(items)}
              onClick={onCheckoutClick}
              aria-busy={checkoutLoading}
              aria-disabled={checkoutLoading}
              style={{ opacity: checkoutLoading ? 0.7 : 1, pointerEvents: checkoutLoading ? 'none' : 'auto' }}
            >{checkoutLoading ? 'Opening checkout...' : `Secure checkout - ${fmtUSD(subtotal)}`}</a>
            {items.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', justifyContent: 'center', paddingTop: 2 }}>
                {items.map((it) => NB_SITE_URLS[it.slug] && (
                  <a key={it.slug} href={NB_SITE_URLS[it.slug]} style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.13em', color: 'var(--ink-40)', textDecoration: 'underline', textUnderlineOffset: 3, textTransform: 'uppercase' }}>
                    {it.name}                  </a>
                ))}
              </div>
            )}
            <a className="btn btn-secondary" href="/shop" style={{ display: 'inline-flex' }}>Continue shopping</a>
          </div>

          <div className="trust">
            <div className="trust-row"><Check /> Sauces $11.99 - spices $10.99</div>
            <div className="trust-row"><Check /> Pour. Shake. Stack.</div>
            <div className="trust-row"><Shield /> Secure SSL checkout</div>
            <div className="trust-row"><Truck /> $3.50 flat US shipping - FREE on $29.99+ US orders</div>
            <div className="trust-row"><Repeat /> 30-day satisfaction guarantee</div>
            <div className="trust-row"><Check /> Ships from Bonney Lake, WA</div>
          </div>
        </div>
      </div>

      {/* Mobile sticky */}
      <div className="sticky-mobile">
        <div className="total">
          <small>Subtotal</small>
          <strong>{fmtUSD(subtotal)}</strong>
        </div>
        <a
          className="btn"
          href={getCheckoutUrl(items)}
          onClick={onCheckoutClick}
          aria-busy={checkoutLoading}
          aria-disabled={checkoutLoading}
          style={{ opacity: checkoutLoading ? 0.7 : 1, pointerEvents: checkoutLoading ? 'none' : 'auto' }}
        >{checkoutLoading ? 'Opening...' : 'Checkout '}</a>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('cart-root')).render(<CartPage />);
