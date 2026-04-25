// Wix Stores deep links (added 2026-04-25)
const NB_WIX = {"original": "https://mikejmarch.wixstudio.com/mysite-5/product-page/noodlebomb-original-ramen-sauce", "citrus": "https://mikejmarch.wixstudio.com/mysite-5/product-page/noodle-bomb-citrus-shoyu-ramen-sauce", "spicy": "https://mikejmarch.wixstudio.com/mysite-5/product-page/noodle-bomb-spicy-tokyo-ramen-sauce", "trio": "https://mikejmarch.wixstudio.com/mysite-5/product-page/the-noodlebomb-trio", "cart": "https://mikejmarch.wixstudio.com/mysite-5/cart-page", "shop": "https://mikejmarch.wixstudio.com/mysite-5/shop"};

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
        <img src={src} alt={flavor} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
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
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', on, { passive: true }); on();
    return () => window.removeEventListener('scroll', on);
  }, []);
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
      <div style={{ display:'flex', gap: 32 }}>
        {[
          ['Sauces', '#lineup'],
          ['The Range', '#range'],
          ['Ingredients', '#ingredients'],
          ['Monthly Box', '#monthly'],
          ['Origin', '#origin']
        ].map(([label, href]) => (
          <a key={label} href={href} onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}>{label}</a>
        ))}
      </div>
      <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
        <a className="btn btn-ghost" href={NB_WIX.shop} target="_blank" rel="noopener" style={{ padding: '8px 18px', fontSize: 12, textDecoration: 'none', display: 'inline-block' }}>Shop</a>
      </div>
    </nav>
  );
}

// ———————————————————————————————————————————— Hero with parallax
function Hero({ headline, bottleSrc }) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 28px', marginTop: 8 }}>
        <span className="mono" style={{ color: 'var(--muted)' }}>Vol.01 · 2026 Edition</span>
        <span className="mono" style={{ color: 'var(--muted)' }}>Batch 0247 / 1000</span>
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
      <div style={{
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
      <div className="container" style={{
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
        <div style={{ display:'flex', gap: 10 }}>
          <button className="btn btn-ghost">Watch the film</button>
          <a className="btn btn-primary" href={NB_WIX.trio} target="_blank" rel="noopener" style={{ textDecoration: 'none', display: 'inline-block' }}>Try the 3-pack — $25</a>
        </div>
      </div>

      {/* refined scroll hint — centered under bottle */}
      <div className="scroll-hint" style={{ left: 'calc(50% - 40px)', bottom: 12, transform: 'translateX(-50%)', zIndex: 4 }}>
        <div className="label">Scroll</div>
        <div className="line"></div>
      </div>
    </section>
  );
}

Object.assign(window, { Reveal, Bottle, Shot, FoodShot, Nav, Hero });
