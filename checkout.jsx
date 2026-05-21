// NoodleBomb checkout - editorial palette, Shopify handoff.
const { useEffect, useState, useMemo } = React;

const FREE_SHIPPING = (window.NB_CART && window.NB_CART.FREE_SHIPPING_THRESHOLD) || 35;
const hasFreeShippingTrio = (items) => (items || []).some((i) => i.slug === 'trio' && (Number(i.qty) || 0) > 0);
const EMAIL_KEY = 'nb_checkout_email';

const NB_SITE_URLS = {
  original: 'https://noodlebomb.co/product/original-ramen',
  citrus: 'https://noodlebomb.co/product/citrus-shoyu',
  spicy: 'https://noodlebomb.co/product/spicy-tokyo',
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

const PRODUCT_IMAGES = {
  original: 'uploads/nb-original-production-front-2026-05.jpeg',
  citrus:   'uploads/nb-citrus-production-front-2026-05.jpeg',
  spicy:    'uploads/nb-spicy-production-front-2026-05.jpeg',
  shoyu:    'uploads/shoyu-reserve-preview-2026-05-08.png',
  trio:     'uploads/nb-production-trio-hero-2026-05.jpg'
};

const PRODUCT_TAGS = {
  original: 'Garlic & Sesame',
  spicy:    'Spicy Tokyo',
  citrus:   'Citrus Shoyu',
  trio:     '3-pack bundle',
  shoyu:    'Shoyu Reserve preorder'
};

const fmtUSD = (n) => '$' + (Number(n) || 0).toFixed(2);
const isoDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Icons
const Mail = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const Truck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const Shield = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Repeat = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
const Lock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Check = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

function CheckoutPage() {
  const [items, setItems] = useState(() => window.NB_CART ? window.NB_CART.getItems() : []);
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  // Restore email
  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMAIL_KEY);
      if (stored) setEmail(stored);
    } catch (e) { /* ignore */ }
  }, []);

  // Subscribe to cart changes (in case items change in another tab)
  useEffect(() => {
    if (!window.NB_CART) return;
    return window.NB_CART.onChange(() => setItems(window.NB_CART.getItems()));
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const hasTrio = hasFreeShippingTrio(items);
  const freeShipping = hasTrio || subtotal >= FREE_SHIPPING;
  const remaining = freeShipping ? 0 : Math.max(FREE_SHIPPING - subtotal, 0);

  // Empty cart redirect
  useEffect(() => {
    if (itemCount === 0 && !redirecting) {
      window.location.replace('/cart.html');
    }
  }, [itemCount, redirecting]);

  const delivery = useMemo(() => {
    const a = new Date(); a.setDate(a.getDate() + 5);
    const b = new Date(); b.setDate(b.getDate() + 7);
    return isoDate(a) + ' – ' + isoDate(b);
  }, []);

  const fallbackLinks = items.map((it) => ({
    slug: it.slug,
    name: it.name,
    qty: it.qty,
    url: NB_SITE_URLS[it.slug] || NB_SITE_URLS.shop,
  }));
  const fallbackUrl = getShopifyCartPermalink(items);
  const emailValid = validEmail(email);

  const onEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    if (validEmail(v)) {
      try { localStorage.setItem(EMAIL_KEY, v); } catch (_) { /* ignore */ }
    }
  };

  const proceed = () => {
    if (!emailValid) { setEmailTouched(true); return; }
    setRedirecting(true);
    if (window.NB_SHOPIFY_CHECKOUT && window.NB_SHOPIFY_CHECKOUT.isEnabled()) {
      window.NB_SHOPIFY_CHECKOUT.createCheckoutUrl(items)
        .then((url) => { window.location.href = url; })
        .catch(() => { window.location.href = fallbackUrl; });
      return;
    }
    window.location.href = fallbackUrl;
  };

  if (itemCount === 0) {
    return null; // useEffect redirects to /cart
  }

  return (
    <>
      <a className="crumb" href="/cart.html">← Back to cart</a>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        <h1 className="page-title"><em>Checkout.</em></h1>
        <div className="steps">
          <span className="dot done"></span>
          <span style={{ color: 'var(--ink-40)' }}>Cart</span>
          <span className="sep"></span>
          <span className="dot active"></span>
          <span style={{ color: 'var(--accent)' }}>Review</span>
          <span className="sep"></span>
          <span className="dot"></span>
          <span>Pay</span>
        </div>
      </div>
      <p className="page-meta">Tax + shipping calculated on the next step.</p>

      <div className="layout">
        {/* Left column */}
        <div>
          {/* Email */}
          <div className="card">
            <div className="section-h">
              <span className="icon"><Mail /></span>
              <span className="label">Contact</span>
            </div>
            <label className="field-label">Email</label>
            <input
              className={'field' + (emailTouched && !emailValid ? ' error' : '')}
              type="email"
              value={email}
              onChange={onEmailChange}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
            {emailTouched && !emailValid && (
              <div className="field-error">Please enter a valid email address.</div>
            )}
            <label className="checkbox-row">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
              <span>Email me product drops, recipes, and the occasional discount. Unsubscribe anytime.</span>
            </label>
          </div>

          {/* Order review */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-h" style={{ margin: 0 }}>
                <span className="label">Your order ({itemCount})</span>
              </div>
              <a href="/cart.html" className="mono" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Edit</a>
            </div>
            <div>
              {items.map((item) => (
                <div key={item.slug} className="review-row">
                  <div className="img">
                    <img src={PRODUCT_IMAGES[item.slug] || PRODUCT_IMAGES.original} alt={item.name} />
                    <span className="qty-bubble">{item.qty}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="name">{item.name}</p>
                    <div className="meta">{PRODUCT_TAGS[item.slug] || ''} · {fmtUSD(item.price)} each</div>
                  </div>
                  <div className="price">{fmtUSD(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout handoff explainer */}
          <div className="handoff">
            <div className="ico"><Shield /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3>You'll finish on our secure store.</h3>
              <p>
                Payment, shipping, and tax are handled through secure checkout.
                If checkout needs a backup, we'll keep you on a NoodleBomb product page.
              </p>
            </div>
          </div>
        </div>

        {/* Right column — summary */}
        <div className="card summary">
          <h2>Total</h2>
          <p className="lede">Tax + shipping at next step</p>

          <div className="row-line"><span>Subtotal ({itemCount})</span><span className="v">{fmtUSD(subtotal)}</span></div>
          <div className="row-line"><span>Shipping</span><span className="v" style={freeShipping ? { color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 } : { color: 'var(--ink-40)', fontSize: 12 }}>{freeShipping ? (hasTrio ? 'Trio ships free' : 'Free') : 'At checkout'}</span></div>
          <div className="row-line"><span>Estimated tax</span><span className="v" style={{ color: 'var(--ink-40)', fontSize: 12 }}>At checkout</span></div>
          <div className="divider"></div>
          <div className="row-line total"><span className="label">Subtotal</span><span className="v">{fmtUSD(subtotal)}</span></div>

          {!freeShipping && remaining > 0 && (
            <div style={{ marginTop: 14, padding: '10px 12px', border: '1px solid var(--line)', fontSize: 11, color: 'var(--ink-40)', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Add {fmtUSD(remaining)} for free shipping · <a href="/cart.html" style={{ color: 'var(--accent)' }}>edit cart →</a>
            </div>
          )}

          <div className="delivery">
            <Truck />
            <span style={{ flex: 1 }}>Estimated delivery</span>
            <span style={{ color: 'var(--ink)', fontFamily: 'Inter Tight', fontWeight: 600 }}>{delivery}</span>
          </div>

          <div style={{ marginTop: 22 }}>
            <button className="btn" onClick={proceed} disabled={!emailValid || redirecting}>
              {redirecting ? <>Opening secure checkout…</> : <><Lock /> Pay {fmtUSD(subtotal)} →</>}
            </button>
          </div>

          {redirecting && (
            <div className="redirect-confirm">
              <strong>Opening secure checkout.</strong>
              If nothing happened, you can{' '}
              <a href={fallbackUrl}>return to the NoodleBomb lineup</a> and keep shopping.
              <button onClick={() => { window.NB_CART && window.NB_CART.clear(); window.location.href = '/'; }}>
                I finished my order — clear my cart
              </button>
            </div>
          )}

          <div className="trust">
            <div className="trust-row"><Shield /> Secure SSL · PCI-compliant payment</div>
            <div className="trust-row"><Truck /> Trio ships free · singles ship free over $35</div>
            <div className="trust-row"><Repeat /> 30-day satisfaction guarantee</div>
          </div>

          <div className="payment">
            <div className="lbl">We accept</div>
            <div className="row">
              {['Visa', 'Mastercard', 'Amex', 'Discover', 'Apple Pay', 'Google Pay'].map((m) => (
                <span key={m} className="pill">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky-mobile">
        <div className="total"><small>Subtotal</small><strong>{fmtUSD(subtotal)}</strong></div>
        <button className="btn" onClick={proceed} disabled={!emailValid || redirecting}>
          <Lock /> Pay
        </button>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('checkout-root')).render(<CheckoutPage />);
