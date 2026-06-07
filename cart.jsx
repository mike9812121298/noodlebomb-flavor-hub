// NoodleBomb cart page — editorial palette, vanilla React (CDN UMD).
// Reads from window.NB_CART (cart-store.js).
const { useEffect, useState, useMemo } = React;

const NB_SITE_URLS = {
  original: 'https://noodlebomb.co/original-ramen-sauce',
  citrus: 'https://noodlebomb.co/citrus-shoyu-ramen-sauce',
  spicy: 'https://noodlebomb.co/spicy-tokyo-ramen-sauce',
  shoyu: 'https://nu2vqa-ma.myshopify.com/products/shoyu-reserve',
  trio: 'https://noodlebomb.co/#lineup',
  cart: 'https://noodlebomb.co/cart.html',
  shop: 'https://noodlebomb.co/#lineup'
};
const SHOPIFY_VARIANT_IDS = {
  original: '53998041596214',
  citrus: '53998041071926',
  spicy: '53998042120502',
  trio: '53998042644790',
  shoyu: '54006619636022'
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

// Trio bundle — single source of truth for slug/name/price within this file.
// Mirrors app.jsx TRIO and components.jsx NB_TRIO. Keep all three in sync.
const TRIO = { slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 29.99 };

const PRODUCT_IMAGES = {
  original: 'uploads/nb-original-cart-thumb-2026-06-06.webp',
  spicy:    'uploads/nb-spicy-cart-thumb-2026-06-06.webp',
  citrus:   'uploads/nb-citrus-cart-thumb-2026-06-06.webp',
  trio:     'uploads/noodlebomb-trio.png',
  shoyu:    'uploads/shoyu-reserve-cart-thumb-2026-06-06.webp'
};

const PRODUCT_LABELS = {
  original: { tag: 'No.01', tagline: 'Garlic & Sesame' },
  spicy:    { tag: 'No.03', tagline: 'Spicy Tokyo' },
  citrus:   { tag: 'No.02', tagline: 'Citrus Shoyu' },
  trio:     { tag: '3-Pack', tagline: 'The Trio' },
  shoyu:    { tag: 'No.04', tagline: 'Shoyu Reserve preorder' }
};

const RECS = [
  { slug: 'original', name: 'Original', tag: 'No.01 · Garlic & Sesame', price: 11.99 },
  { slug: 'spicy',    name: 'Spicy Tokyo', tag: 'No.03 · Spicy Tokyo', price: 11.99 },
  { slug: 'citrus',   name: 'Citrus Shoyu', tag: 'No.02 · Citrus Shoyu', price: 11.99 }
];

const fmtUSD = (n) => '$' + (Number(n) || 0).toFixed(2);
const isoDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const lineKey = (item, index) => `${item.slug}-${index}-${JSON.stringify(item.attributes || [])}`;
const bottleMix = (item) => (item.attributes || []).find((attr) => attr.key === 'Bottle mix')?.value;

// ── Reusable icons ──
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
  const freeShipping = hasTrio || subtotal >= FREE_SHIPPING;
  const remaining = freeShipping ? 0 : Math.max(FREE_SHIPPING - subtotal, 0);
  const progress = freeShipping ? 100 : Math.min((subtotal / FREE_SHIPPING) * 100, 100);

  const delivery = useMemo(() => {
    const a = new Date(); a.setDate(a.getDate() + 5);
    const b = new Date(); b.setDate(b.getDate() + 7);
    return isoDate(a) + ' – ' + isoDate(b);
  }, []);

  const recsToShow = RECS.filter((r) => !items.some((i) => i.slug === r.slug)).slice(0, 3);

  const setQty = (item, qty) => window.NB_CART && window.NB_CART.setQty(item.slug, qty, item.attributes);
  const remove = (item) => window.NB_CART && window.NB_CART.remove(item.slug, item.attributes);
  const addRec = (rec) => window.NB_CART && window.NB_CART.add({ slug: rec.slug, name: rec.name, price: rec.price });

  // ── Empty state ──
  if (itemCount === 0) {
    return (
      <div className="empty">
        <a className="crumb" href="/">← Back to site</a>
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
          {/* One-click Trio shortcut — same pattern as the drawer empty state.
              Lets a returning visitor with empty localStorage land in a populated
              cart in one tap. */}
          <button
            onClick={() => {
              if (window.NB_CART) window.NB_CART.add({ slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd });
            }}
            className="btn"
            style={{ width: 'auto', display: 'inline-flex', padding: '14px 32px', cursor: 'pointer', border: 0 }}
          >
            Add the Trio — {fmtUSD(TRIO.priceUsd)}
          </button>
          <a className="btn btn-secondary" href="/#lineup" style={{ width: 'auto', display: 'inline-flex', padding: '14px 32px' }}>
            Shop the lineup →
          </a>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-40)', fontFamily: 'JetBrains Mono', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          All 3 flavors · save $5.98
        </div>

        <div className="recommendations">
          {RECS.map((r) => (
            <a key={r.slug} className="rec-card" href={'/?flavor=' + r.slug + '#lineup'}>
              <div className="img-wrap">
                <img src={PRODUCT_IMAGES[r.slug]} alt={'NoodleBomb ' + r.name + ' ramen sauce'} />
              </div>
              <h3>{r.name}</h3>
              <div className="tag">{r.tag}</div>
              <div className="price-row">
                <span className="price">{fmtUSD(r.price)}</span>
                <span className="arrow">View →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // ── Filled cart ──
  return (
    <>
      <a className="crumb" href="/#lineup">← Continue shopping</a>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        <h1 className="page-title">Your <span style={{ color: 'var(--accent)', fontFamily: 'Inter Tight', fontStyle: 'normal', fontWeight: 800 }}>cart.</span></h1>
      </div>
      <p className="page-meta">{itemCount} {itemCount === 1 ? 'item' : 'items'} · secure checkout opens on Shopify</p>

      <div className="layout">
        {/* Left column */}
        <div>
          {/* Free shipping bar */}
          {freeShipping ? (
            <div className="card ship-bar unlocked">
              <div className="icon"><Truck /></div>
              <div>
                <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>✓ FREE shipping unlocked</div>
                <div style={{ color: 'var(--ink-40)', fontSize: 12, marginTop: 2 }}>US orders at $29.99+ subtotal ship on us.</div>
              </div>
            </div>
          ) : (
            <div className="card ship-bar">
              <div className="row">
                <span style={{ color: 'var(--ink-60)' }}>You're <span className="accent">{fmtUSD(remaining)}</span> away from <span style={{ color: 'var(--ink)' }}>FREE US shipping</span></span>
                <Truck />
              </div>
              <div className="track"><div className="fill" style={{ width: progress + '%' }} /></div>
            </div>
          )}

          {/* Smart Trio upsell — only when cart has items, no trio yet, and user
              hasn't crossed the free-shipping line. Adding the trio flips the
              order over $35 (assuming any starting subtotal > $5) and saves
              the user $5.98 vs buying 3 bottles as singles. */}
          {(() => {
            const hasTrio = items.some((i) => i.slug === 'trio');
            const singleSlugs = ['original', 'spicy', 'citrus'];
            const singleCount = items
              .filter((i) => singleSlugs.includes(i.slug))
              .reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
            const showTrioUpsell = !hasTrio && singleCount >= 1 && singleCount <= 2;
            if (!showTrioUpsell) return null;
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
                      {(PRODUCT_LABELS[item.slug] && PRODUCT_LABELS[item.slug].tagline) || ''} · {fmtUSD(item.price)} each
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
                    <button onClick={() => setQty(item, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease">−</button>
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

        {/* Right column — summary */}
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
            >{checkoutLoading ? 'Opening checkout…' : `Secure checkout — ${fmtUSD(subtotal)}`}</a>
            {items.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', justifyContent: 'center', paddingTop: 2 }}>
                {items.map((it) => NB_SITE_URLS[it.slug] && (
                  <a key={it.slug} href={NB_SITE_URLS[it.slug]} style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.13em', color: 'var(--ink-40)', textDecoration: 'underline', textUnderlineOffset: 3, textTransform: 'uppercase' }}>
                    {it.name} →
                  </a>
                ))}
              </div>
            )}
            <a className="btn btn-secondary" href="/#lineup" style={{ display: 'inline-flex' }}>Continue shopping</a>
          </div>

          <div className="trust">
            <div className="trust-row"><Shield /> Secure SSL checkout</div>
            <div className="trust-row"><Truck /> FREE US shipping at $29.99+ subtotal</div>
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
        >{checkoutLoading ? 'Opening…' : 'Checkout →'}</a>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('cart-root')).render(<CartPage />);
