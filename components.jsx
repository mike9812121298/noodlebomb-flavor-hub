// Wix Stores deep links (added 2026-04-25)
// Kept for the mobile drawer "Shop the Range" browse link — purchases now flow
// through the local cart (cart.html → checkout.html → Wix payment handoff).
const NB_WIX = {"original": "https://shop.noodlebomb.co/ramensauce", "citrus": "https://shop.noodlebomb.co/ramensauce-1", "spicy": "https://shop.noodlebomb.co/ramensauce-2", "trio": "https://shop.noodlebomb.co/product-page/the-noodlebomb-trio", "cart": "https://shop.noodlebomb.co/cart-page", "shop": "https://shop.noodlebomb.co/category/all-products"};

// Single-bottle and trio prices (must match app.jsx FLAVORS).
const NB_BOTTLE_PRICE = 11.99;
const NB_TRIO = { slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 29.99 };

// Add to local NB_CART; buy buttons navigate via href="/cart.html".
const nbAddToCart = (item) => { if (window.NB_CART) window.NB_CART.add(item); };

// NoodleBomb — shared components
const { useEffect, useRef, useState, useMemo, useLayoutEffect } = React;

// ———————————————————————————————————————————— Reveal on scroll
function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const d = ['', 'd1', 'd2', 'd3', 'd4', 'd5', 'd5'][delay] || 'd5';
  return <Tag ref={ref} className={`reveal ${d} ${className}`} style={style}>{children}</Tag>;
}

// ———————————————————————————————————————————— Bottle (real photo or SVG fallback)
function Bottle({ label = 'NOODLEBOMB', flavor = 'ORIGINAL No.01', accent = 'var(--accent)', tilt = 0, dripping = false, src = null }) {
  if (src) {
    return (
      <div className="bottle" style={{ transform: `rotate(${tilt}deg)`, transition: 'transform 0.8s cubic-bezier(.2,.7,.2,1)', width: '100%', height: '100%' }}>
        <img src={src} alt={`NoodleBomb ${flavor} ramen sauce bottle`} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </div>
    );
  }
  return (
    <div className="bottle" style={{ transform: `rotate(${tilt}deg)`, transition: 'transform 0.8s cubic-bezier(.2,.7,.2,1)' }}>
      <svg viewBox="0 0 200 420" preserveAspectRatio="xMidYMid meet">
        {/* cap */}
        <rect x="78" y="10" width="44" height="42" rx="3" fill="#141414" />
        <rect x="78" y="10" width="44" height="8" rx="3" fill="#2a2a2a" />
        {/* neck */}
        <rect x="86" y="52" width="28" height="22" fill="#141414" />
        {/* shoulder curve */}
        <path d="M70 74 Q100 74 130 74 L158 112 Q170 130 170 156 L170 372 Q170 398 146 402 L54 402 Q30 398 30 372 L30 156 Q30 130 42 112 Z" fill={accent} />
        {/* label */}
        <rect x="44" y="170" width="112" height="176" fill="#F5F1EA" />
        <rect x="44" y="170" width="112" height="22" fill="#0B0B0B" />
        <text x="100" y="186" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#F5F1EA" letterSpacing="2">{flavor}</text>
        <text x="100" y="240" textAnchor="middle" fontFamily="Inter Tight" fontWeight="900" fontSize="26" fill="#0B0B0B" letterSpacing="-1.2">{label.split('').slice(0,6).join('')}</text>
        <text x="100" y="262" textAnchor="middle" fontFamily="Inter Tight" fontWeight="900" fontSize="26" fill="#0B0B0B" letterSpacing="-1.2">{label.split('').slice(6).join('')}</text>
        <line x1="60" y1="282" x2="140" y2="282" stroke="#0B0B0B" strokeWidth="1" />
        <text x="100" y="302" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="#6B6258" letterSpacing="1.5">SMALL BATCH · 150ML</text>
        <text x="100" y="318" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="#6B6258" letterSpacing="1.5">BREWED · AGED · BOTTLED</text>
        <circle cx="100" cy="340" r="7" fill="none" stroke="#0B0B0B" strokeWidth="1" />
        <text x="100" y="344" textAnchor="middle" fontFamily="Inter Tight" fontWeight="800" fontSize="9" fill="#0B0B0B">01</text>
        {/* highlight */}
        <rect x="42" y="160" width="14" height="200" fill="rgba(255,255,255,0.18)" />
        <rect x="150" y="160" width="6" height="220" fill="rgba(0,0,0,0.18)" />
        {/* shine sweep */}
        <defs>
          <clipPath id="btl">
            <path d="M70 74 Q100 74 130 74 L158 112 Q170 130 170 156 L170 372 Q170 398 146 402 L54 402 Q30 398 30 372 L30 156 Q30 130 42 112 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#btl)">
          <rect className="shine" x="-60" y="0" width="40" height="420" fill="rgba(255,255,255,0.22)" transform="skewX(-12)" />
        </g>
        {dripping && (
          <>
            <ellipse className="drip" cx="100" cy="60" rx="5" ry="8" fill={accent} />
            <ellipse className="drip d2" cx="100" cy="60" rx="4" ry="7" fill={accent} />
          </>
        )}
      </svg>
    </div>
  );
}

// ———————————————————————————————————————————— Placeholder food/product shot
function FoodShot({ src, alt = '', style }) {
  if (src) return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
  return null;
}

// ———————————————————————————————————————————— Placeholder food/product shot (legacy)
function Shot({ label, aspect = '4/5', tag, style, children }) {
  return (
    <div className="shot" style={{ aspectRatio: aspect, width: '100%', ...style }}>
      {children}
      {tag && <div className="corner">{tag}</div>}
      <div className="cap">[ {label} ]</div>
    </div>
  );
}

// ———————————————————————————————————————————— Navbar
function Nav({ flavor, setFlavor, flavors }) {
  const [solid, setSolid] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => (window.NB_CART ? window.NB_CART.getItemCount() : 0));
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', on, { passive: true }); on();
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!window.NB_CART) return;
    setCartCount(window.NB_CART.getItemCount());
    return window.NB_CART.onChange(() => setCartCount(window.NB_CART.getItemCount()));
  }, []);
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [drawerOpen]);
  // Close drawer on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const navLinks = [
    ['Sauces', '#lineup'],
    ['The Range', '#range'],
    ['Ingredients', '#ingredients'],
    ['Origin', '#origin'],
    ['Monthly Box', '#monthly'],
  ];

  const goToHash = (href) => {
    setDrawerOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <nav className={`nav ${solid ? 'scrolled' : ''}`} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(24px, 5.5vw, 80px)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 4,
          background: 'var(--accent)', transition: 'background .6s',
          display:'flex', alignItems:'center', justifyContent:'center',
          color: 'var(--accent-ink)', fontFamily:'Inter Tight', fontWeight: 800, fontSize: 11
        }}>N</div>
        <span className="display" style={{ fontSize: 16, letterSpacing: '-0.04em', fontWeight: 700 }}>noodlebomb</span>
      </div>
      <div className="nav-links" style={{ display:'flex', gap: 32 }}>
        {navLinks.map(([label, href]) => (
          <a key={label} href={href} onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}>{label}</a>
        ))}
      </div>
      <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
        <a
          href="/cart.html"
          aria-label={`Cart — ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 4,
            color: 'var(--ink)',
            textDecoration: 'none',
            transition: 'background .2s, color .2s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(240,235,227,0.06)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: 2,
              right: 2,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              borderRadius: 999,
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              fontWeight: 700,
              lineHeight: '16px',
              textAlign: 'center',
              transition: 'background .6s',
            }}>{cartCount > 9 ? '9+' : cartCount}</span>
          )}
        </a>
        <a className="btn btn-ghost nav-shop-cta" href={NB_WIX.shop} target="_blank" rel="noopener" style={{ padding: '8px 18px', fontSize: 12, textDecoration: 'none', display: 'inline-block' }}>Shop</a>
        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(!drawerOpen)}
          style={{
            display: 'none',
            width: 44,
            height: 44,
            background: 'transparent',
            border: 0,
            color: 'var(--ink)',
            cursor: 'pointer',
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            {drawerOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="13" x2="21" y2="13" />
                <line x1="3" y1="19" x2="21" y2="19" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <div
        className="nav-drawer"
        aria-hidden={!drawerOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(8,7,6,0.97)',
          backdropFilter: 'blur(8px)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity .3s cubic-bezier(.2,.7,.2,1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '88px 32px 32px',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}>
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={(e) => { e.preventDefault(); goToHash(href); }}
              className="display"
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                textDecoration: 'none',
                paddingBlock: 8,
                borderBottom: '1px solid rgba(240,235,227,0.08)',
                transform: drawerOpen ? 'translateY(0)' : 'translateY(8px)',
                opacity: drawerOpen ? 1 : 0,
                transition: 'transform .35s cubic-bezier(.2,.7,.2,1), opacity .35s',
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href={NB_WIX.shop}
          target="_blank"
          rel="noopener"
          onClick={() => setDrawerOpen(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '18px 24px',
            borderRadius: 999,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            marginTop: 24,
          }}
        >
          Shop the Range
          <span style={{ fontSize: 16 }}>→</span>
        </a>
      </div>
    </nav>
  );
}

// ———————————————————————————————————————————— Hero with parallax
function Hero({ headline, bottleSrc, flavorKey = 'original', flavorMeta = null }) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const parY = y * 0.25;
  const scale = 1 + Math.min(y, 600) / 2400;

  return (
    <section style={{ position: 'relative', minHeight: '100vh', paddingTop: 80, overflow: 'hidden' }}>
      {/* top meta strip */}
      <div className="hero-meta-strip" style={{ display: 'flex', justifyContent: 'flex-start', padding: '0 28px', marginTop: 8 }}>
        <span className="mono" style={{ color: 'var(--muted)' }}>Vol.01 · 2026 Edition</span>
      </div>

      {/* Big headline — backdrop wash behind bottle */}
      <div style={{ padding: '8px 28px 0', position: 'relative', zIndex: 1 }}>
        <h1 className="display hero-h1" style={{ margin: 0, transform: `translateY(${-parY * 0.3}px)`, color: 'rgba(245,241,234,0.32)', letterSpacing: '-0.045em' }}>
          {headline.split('\n').map((line, i) => (
            <div key={i} style={{ opacity: i === 1 ? 0.55 : 1 }}>{line}</div>
          ))}
        </h1>
      </div>

      {/* Bottle center — outer positions, inner animates (so transforms don't collide) */}
      <div className="hero-bottle-positioner" style={{
        position: 'absolute',
        left: 'calc(50% - 40px)', top: '58%',
        transform: 'translate(-50%, -50%)',
        width: 'min(454px, 34.5vw)', height: 'min(778px, 77.7vh)',
        pointerEvents: 'none',
        zIndex: 3,
      }}>
        {/* Radial vignette behind bottle */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 600, height: 600, transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 35%, rgba(0,0,0,0) 65%)',
          pointerEvents: 'none', zIndex: -1
        }} />
        <div className="hero-bottle-wrap" style={{ width:'100%', height:'100%' }}>
          <div className="bottle-float" style={{ width: '100%', height: '100%', transform: `translateY(${-parY * 0.5}px)` }}>
            <Bottle src={bottleSrc} />
          </div>
        </div>
      </div>

      {/* bottom subline + CTA */}
      <div className="container hero-bottom-row" style={{
        position: 'absolute', left: 0, right: 0, bottom: 64,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        animation: 'fadeIn 1.2s cubic-bezier(.16,1,.3,1) 0.7s both', zIndex: 4,
      }}>
        <div>
          <div className="mono" style={{ marginBottom: 12 }}>Index 01 — The Hero</div>
          <div style={{ fontFamily:'Inter Tight', fontWeight: 500, fontSize: 20, letterSpacing: '-0.02em', maxWidth: 380, lineHeight: 1.35, marginBottom: -12 }}>
            Bold ramen sauce. Small batch.<br/>
            <span style={{ color: 'var(--ink-60)' }}>Turns any noodles into shop-level ramen in seconds.</span>
          </div>
        </div>
        <div className="hero-cta-row" style={{ display:'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="/cart.html"
            onClick={() => nbAddToCart({
              slug: flavorKey,
              name: flavorMeta?.name || flavorKey,
              price: NB_BOTTLE_PRICE,
            })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 22px',
              borderRadius: 999,
              border: `1px solid ${flavorMeta?.color || 'var(--accent)'}`,
              background: flavorMeta?.color || 'var(--accent)',
              color: flavorMeta?.ink || 'var(--accent-ink)',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'transform .28s cubic-bezier(.2,.7,.2,1), box-shadow .35s, opacity .25s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 16px 36px ${flavorMeta?.color || 'var(--accent)'}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Add {flavorMeta?.name || 'to Cart'} — $11.99
            <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
          </a>
          <a
            className="btn btn-ghost"
            href="/cart.html"
            onClick={() => nbAddToCart({ slug: NB_TRIO.slug, name: NB_TRIO.name, price: NB_TRIO.priceUsd })}
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Try the 3-pack — $29.99
          </a>
        </div>
      </div>

      {/* refined scroll hint — centered under bottle */}
      <div className="scroll-hint hero-scroll-hint" style={{ left: 'calc(50% - 40px)', bottom: 12, transform: 'translateX(-50%)', zIndex: 4 }}>
        <div className="label">Scroll</div>
        <div className="line"></div>
      </div>
    </section>
  );
}

// ———————————————————————————————————————————— Inquiry modal (Wholesale + Contact)
function InquiryModal({ open, kind, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { if (!open) setSubmitted(false); }, [open]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  if (!open) return null;

  const isWholesale = kind === 'wholesale';
  const title = isWholesale ? 'Wholesale Inquiry' : 'Get in Touch';
  const intro = isWholesale
    ? "Tell us about your shop. We'll be in touch with wholesale terms."
    : "Questions, press, partnerships — drop us a line.";
  const subject = isWholesale ? 'NoodleBomb Wholesale Inquiry' : 'NoodleBomb Contact';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8,7,6,0.78)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--paper-2)',
          border: '1px solid var(--line-strong)',
          borderRadius: 6,
          width: '100%', maxWidth: 520,
          maxHeight: '90vh', overflowY: 'auto',
          padding: 'clamp(28px, 4vw, 40px)',
          color: 'var(--ink)',
          position: 'relative',
        }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 36, height: 36,
            background: 'transparent', border: 0, color: 'var(--ink)',
            opacity: 0.65, cursor: 'pointer', padding: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.18em', marginBottom: 12 }}>
          {isWholesale ? 'Stockists & Retail' : 'Hello@noodlebomb.co'}
        </div>
        <h2 className="display" style={{ margin: '0 0 12px', fontSize: 28, letterSpacing: '-0.03em', fontWeight: 700 }}>
          {title}
        </h2>
        <p style={{ margin: '0 0 24px', color: 'var(--ink-60)', fontSize: 14, lineHeight: 1.5 }}>
          {intro}
        </p>

        {submitted ? (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Inter Tight', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Thanks — we got it.</div>
            <div style={{ color: 'var(--ink-60)', fontSize: 14 }}>We'll reply within 1–2 business days.</div>
            <button
              onClick={onClose}
              style={{
                marginTop: 24, padding: '12px 24px', borderRadius: 999,
                background: 'var(--ink)', color: 'var(--paper)',
                border: 0, fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <form
            action="https://formsubmit.co/hello@noodlebomb.co"
            method="POST"
            onSubmit={() => setSubmitted(true)}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <input type="hidden" name="_subject" value={subject} />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: 'none' }} />

            <input
              type="text" name="name" placeholder="Your name *" required
              style={inputStyle}
            />
            <input
              type="email" name="email" placeholder="Email *" required
              style={inputStyle}
            />
            {isWholesale && (
              <>
                <input type="text" name="business" placeholder="Business name *" required style={inputStyle} />
                <input type="text" name="location" placeholder="Location (city, state) *" required style={inputStyle} />
                <input type="text" name="volume" placeholder="Estimated monthly volume" style={inputStyle} />
              </>
            )}
            <textarea
              name="message"
              placeholder={isWholesale ? "Anything else we should know?" : "Your message *"}
              required={!isWholesale}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: '14px 24px',
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: 0, borderRadius: 4,
                fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'filter .2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
              onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
            >
              Send Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: '#100E0C',
  border: '1px solid var(--line)',
  borderRadius: 4,
  color: 'var(--ink)',
  fontFamily: 'Inter',
  fontSize: 14,
  outline: 'none',
};

Object.assign(window, { Reveal, Bottle, Shot, FoodShot, Nav, Hero, InquiryModal });
