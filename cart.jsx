// NoodleBomb cart page — editorial palette, vanilla React (CDN UMD).
// Reads from window.NB_CART (cart-store.js).
const { useEffect, useState, useMemo } = React;

const FREE_SHIPPING = (window.NB_CART && window.NB_CART.FREE_SHIPPING_THRESHOLD) || 40;

// Trio bundle — single source of truth for slug/name/price within this file.
// Mirrors app.jsx TRIO and components.jsx NB_TRIO. Keep all three in sync.
const TRIO = { slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 29.99 };

const PRODUCT_IMAGES = {
  original: 'uploads/nb-original-clean.png',
  citrus:   'uploads/nb-citrus-shoyu-clean.png',
  spicy:    'uploads/nb-spicy-tokyo-clean.png',
  trio:     'uploads/noodlebomb-trio.png'
};

const PRODUCT_LABELS = {
  original: { tag: 'No.01', tagline: 'Garlic & Sesame' },
  citrus:   { tag: 'No.02', tagline: 'Citrus Shoyu' },
  spicy:    { tag: 'No.03', tagline: 'Spicy Tokyo' },
  trio:     { tag: '3-Pack', tagline: 'The Trio' }
};

const RECS = [
  { slug: 'original', name: 'Original', tag: 'No.01 · Garlic & Sesame', price: 11.99 },
  { slug: 'spicy',    name: 'Spicy Tokyo', tag: 'No.03 · Spicy Tokyo', price: 11.99 },
  { slug: 'citrus',   name: 'Citrus Shoyu', tag: 'No.02 · Citrus Shoyu', price: 11.99 }
];

const fmtUSD = (n) => '$' + (Number(n) || 0).toFixed(2);
const isoDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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

  useEffect(() => {
    if (!window.NB_CART) return;
    return window.NB_CART.onChange(() => setItems(window.NB_CART.getItems()));
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const freeShipping = subtotal >= FREE_SHIPPING;
  const remaining = Math.max(FREE_SHIPPING - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING) * 100, 100);

  const delivery = useMemo(() => {
    const a = new Date(); a.setDate(a.getDate() + 5);
    const b = new Date(); b.setDate(b.getDate() + 7);
    return isoDate(a) + ' – ' + isoDate(b);
  }, []);

  const recsToShow = RECS.filter((r) => !items.some((i) => i.slug === r.slug)).slice(0, 3);

  const setQty = (slug, qty) => window.NB_CART && window.NB_CART.setQty(slug, qty);
  const remove = (slug) => window.NB_CART && window.NB_CART.remove(slug);
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
        <p>Pick a sauce. Build the bowl.</p>
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
        <h1 className="page-title">Your <span style={{ color: 'var(--accent)', fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 400 }}>cart.</span></h1>
        <div className="steps">
          <span className="dot active"></span>
          <span style={{ color: 'var(--accent)' }}>Cart</span>
          <span className="sep"></span>
          <span className="dot"></span>
          <span>Review</span>
          <span className="sep"></span>
          <span className="dot"></span>
          <span>Pay</span>
        </div>
      </div>
      <p className="page-meta">{itemCount} {itemCount === 1 ? 'item' : 'items'} · final total at checkout</p>

      <div className="layout">
        {/* Left column */}
        <div>
          {/* Free shipping bar */}
          {freeShipping ? (
            <div className="card ship-bar unlocked">
              <div className="icon"><Truck /></div>
              <div>
                <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Free shipping unlocked</div>
                <div style={{ color: 'var(--ink-40)', fontSize: 12, marginTop: 2 }}>Your order ships on us.</div>
              </div>
            </div>
          ) : (
            <div className="card ship-bar">
              <div className="row">
                <span style={{ color: 'var(--ink-60)' }}>Add <span className="accent">{fmtUSD(remaining)}</span> more for <span style={{ color: 'var(--ink)' }}>free shipping</span></span>
                <Truck />
              </div>
              <div className="track"><div className="fill" style={{ width: progress + '%' }} /></div>
            </div>
          )}

          {/* Smart Trio upsell — only when cart has items, no trio yet, and user
              hasn't crossed the free-shipping line. Adding the trio flips the
              order over $40 (assuming any starting subtotal > $10) and saves
              the user $5.98 vs buying the same 3 flavors as singles. */}
          {(() => {
            const hasTrio = items.some((i) => i.slug === 'trio');
            const showTrioUpsell = !hasTrio && itemCount > 0 && !freeShipping;
            if (!showTrioUpsell) return null;
            const addTrio = () => {
              if (window.NB_CART) {
                window.NB_CART.add({ slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd });
              }
            };
            return (
              <div className="card" style={{
                border: '1px solid var(--accent)',
                background: 'linear-gradient(180deg, rgba(139,30,30,0.10) 0%, rgba(139,30,30,0.04) 100%)',
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
                    BUNDLE · SAVE $5.98
                  </div>
                  <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>
                    Make it a Trio — get all 3 flavors
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-60)', lineHeight: 1.5 }}>
                    Add the bundle for $29.99 — unlocks free shipping and saves $5.98 vs. three singles.
                  </div>
                </div>
                <button onClick={addTrio} aria-label="Add the Trio bundle to cart" style={{
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
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(139,30,30,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Add Trio →
                </button>
              </div>
            );
          })()}

          {/* Items */}
          {items.map((item) => (
            <div key={item.slug} className="card line-item">
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
                  </div>
                  <button className="icon-btn" onClick={() => remove(item.slug)} aria-label={'Remove ' + item.name}><Trash /></button>
                </div>
                <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="qty">
                    <button onClick={() => setQty(item.slug, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => setQty(item.slug, item.qty + 1)} aria-label="Increase">+</button>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + recsToShow.length + ', minmax(0, 1fr))', gap: 10 }}>
                {recsToShow.map((r) => (
                  <div key={r.slug} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, background: 'var(--paper-3)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0 }}>
                      <img src={PRODUCT_IMAGES[r.slug]} alt={r.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 14, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      <div style={{ color: 'var(--accent)', fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 14, marginTop: 2 }}>{fmtUSD(r.price)}</div>
                    </div>
                    <button onClick={() => addRec(r)} aria-label={'Add ' + r.name + ' to cart'} style={{
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
          <p className="lede">Final total at checkout</p>

          <div className="row-line"><span>Subtotal ({itemCount})</span><span className="v">{fmtUSD(subtotal)}</span></div>
          <div className="row-line"><span>Shipping</span><span className="v" style={freeShipping ? { color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 } : { color: 'var(--ink-40)', fontSize: 12 }}>{freeShipping ? 'Free' : 'At checkout'}</span></div>
          <div className="row-line"><span>Estimated tax</span><span className="v" style={{ color: 'var(--ink-40)', fontSize: 12 }}>At checkout</span></div>
          <div className="divider"></div>
          <div className="row-line total"><span className="label">Subtotal</span><span className="v">{fmtUSD(subtotal)}</span></div>

          <div style={{ marginTop: 18, padding: '12px 14px', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--ink-60)' }}>
            <Truck />
            <span style={{ flex: 1 }}>Estimated delivery</span>
            <span style={{ color: 'var(--ink)', fontFamily: 'Inter Tight', fontWeight: 600 }}>{delivery}</span>
          </div>

          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a className="btn" href="/checkout.html">Secure checkout — {fmtUSD(subtotal)}</a>
            <a className="btn btn-secondary" href="/#lineup" style={{ display: 'inline-flex' }}>Continue shopping</a>
          </div>

          <div className="trust">
            <div className="trust-row"><Shield /> Secure SSL checkout</div>
            <div className="trust-row"><Truck /> Free shipping at $40+</div>
            <div className="trust-row"><Repeat /> 30-day satisfaction guarantee</div>
          </div>
        </div>
      </div>

      {/* Mobile sticky */}
      <div className="sticky-mobile">
        <div className="total">
          <small>Subtotal</small>
          <strong>{fmtUSD(subtotal)}</strong>
        </div>
        <a className="btn" href="/checkout.html">Checkout →</a>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('cart-root')).render(<CartPage />);
