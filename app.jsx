// NoodleBomb — app composition
const { useEffect, useRef, useState } = React;
// Wix Stores deep links (added 2026-04-25 for production deploy)
// Kept for the Footer "Shop all" browse links — purchases now flow through
// the local cart (cart.html → checkout.html → Wix payment handoff).
const WIX_URLS = {"original": "https://shop.noodlebomb.co/ramensauce", "citrus": "https://shop.noodlebomb.co/ramensauce-1", "spicy": "https://shop.noodlebomb.co/ramensauce-2", "trio": "https://shop.noodlebomb.co/product-page/the-noodlebomb-trio", "cart": "https://shop.noodlebomb.co/cart-page", "shop": "https://shop.noodlebomb.co/category/all-products"};

// Trio bundle price — used by the bundle CTAs.
const TRIO = { slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 29.99 };

// Add an item to the local NB_CART. Buy buttons set href="/cart.html",
// so the browser handles navigation; this just writes localStorage first.
const addToCart = (item) => { if (window.NB_CART) window.NB_CART.add(item); };

const FLAVORS = {
  original: { name: 'Original', tag: 'No.01 · Garlic & Sesame', short: 'No.01', color: '#8B1E1E', ink: '#F5F1EA',
    line1: 'The one that started it all.',
    line2: 'Roasted garlic, toasted sesame, smooth soy.',
    price: '$11.99', priceUsd: 11.99, pack: '$29.99 / 3-pack' },
  citrus: { name: 'Citrus Shoyu', tag: 'No.02 · Citrus Shoyu', short: 'No.02', color: '#C9A227', ink: '#0B0B0B',
    line1: 'Bright, tangy, refreshing.',
    line2: 'Shoyu base with a clean citrus lift.',
    price: '$11.99', priceUsd: 11.99, pack: '$29.99 / 3-pack' },
  spicy: { name: 'Spicy Tokyo', tag: 'No.03 · Spicy Tokyo', short: 'No.03', color: '#C2410C', ink: '#F5F1EA',
    line1: 'Umami meets fire.',
    line2: 'Dark soy, roasted chili, sesame.',
    price: '$11.99', priceUsd: 11.99, pack: '$29.99 / 3-pack' },
  ryu: { name: 'Ryu Garlic', tag: 'No.04 · Ryu Garlic', short: 'No.04', color: '#3D2B1F', ink: '#F5C842',
    line1: 'Black garlic. Dark depth.',
    line2: 'Aged black garlic, rich umami, subtle heat.',
    price: '$11.99', priceUsd: 11.99, pack: '$29.99 / 3-pack' }
};

const FLAVOR_IMAGES = {
  original: 'uploads/nb-original-clean.png',
  citrus: 'uploads/nb-citrus-shoyu-clean.png',
  spicy: 'uploads/upload-spicy-v3.png',
  ryu: 'uploads/nb-ryu-garlic-clean.png'
};

const FOOD_IMAGES = {
  ramen: 'uploads/ramen-pour-hero.png',
  stirfry: 'uploads/nb-recipe-stirfry.jpeg',
  // Editorial wings — glossy, saucy, close crop
  wings: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=1600&q=80&auto=format&fit=crop',
  // Editorial pulled pork — shredded on a bun, close crop (replaced slow-cooker shot)
  pulledpork: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=1600&q=80&auto=format&fit=crop'
};

// ——————————————————————————— Flavor Profile: sticky bottle + orbiting flavor dimensions
function FlavorBreakdown({ flavor }) {
  const stickyRef = useRef(null);
  const [p, setP] = useState(0); // 0..1 progress

  useEffect(() => {
    const on = () => {
      const el = stickyRef.current;if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setP(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', on, { passive: true });on();
    return () => window.removeEventListener('scroll', on);
  }, []);

  // appearAt evenly spans 0.05 → 0.95 so the last ingredient lands just
  // before the section ends — eliminates the ~40vh trailing dead zone
  // that existed when the last appearAt was 0.82.
  const ingredients = [
  { label: 'Umami', note: 'the backbone', angle: -140, appearAt: 0.05 },
  { label: 'Roasted depth', note: 'the warmth', angle: -55, appearAt: 0.275 },
  { label: 'Brightness', note: 'the lift', angle: 40, appearAt: 0.50 },
  { label: 'Richness', note: 'the coat', angle: 135, appearAt: 0.725 },
  { label: 'Heat', note: 'the whisper', angle: 270, appearAt: 0.95 }];


  return (
    <section id="ingredients" className="fb-section" ref={stickyRef} style={{ position: 'relative', background: 'var(--paper)', scrollMarginTop: 80 }}>
      {/* MOBILE: stacked layout (≤768px) */}
      <div className="fb-mobile" style={{ display: 'none', padding: '80px 24px 96px' }}>
        <div className="mono" style={{ color: 'var(--muted)', marginBottom: 24, letterSpacing: '0.18em' }}>
          Index 02 — Flavor Profile
        </div>
        <h2 className="display" style={{ margin: '0 0 48px', fontSize: 'clamp(40px, 11vw, 56px)', letterSpacing: '-0.04em', lineHeight: 0.95, fontWeight: 700 }}>
          Five flavors.<br /><span className="accent-fg">One obsession.</span>
        </h2>
        {/* Stacked ingredient rows */}
        <div style={{ borderTop: '1px solid var(--line)', marginBottom: 48 }}>
          {ingredients.map((ing, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'baseline', padding: '20px 0', borderBottom: '1px solid var(--line)' }}>
              <div className="display accent-fg" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, flexShrink: 0, width: 56 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 4 }}>
                  {ing.label}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.4 }}>
                  {ing.note}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Bottle below */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '70vw', maxWidth: 320, aspectRatio: '0.55 / 1' }}>
            <Bottle flavor={FLAVORS[flavor].tag} src={FLAVOR_IMAGES[flavor]} />
          </div>
        </div>
      </div>

      {/* DESKTOP: sticky scroll mechanic (>768px) */}
      {/* Height: 240vh = 140vh of sticky pin (for ingredients to fade in) +
          100vh of natural sticky exit. Was 320vh — extra 80vh was pure dead
          scroll past the last ingredient. */}
      <div className="fb-desktop" style={{ height: '240vh' }}>
      <div className="fb-sticky" style={{
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Section header */}
        <div className="fb-section-header" style={{ position: 'absolute', top: 100, left: 28, right: 28, display: 'flex', justifyContent: 'space-between' }}>
          <span className="mono" style={{ color: 'var(--muted)' }}>Index 02 — Flavor Profile</span>
          <span className="mono" style={{ color: 'var(--muted)' }}>pour.02 / of.05</span>
        </div>
        <h2 className="display section-h2 fb-headline" style={{
          position: 'absolute', top: 140, left: 28, margin: 0,
          maxWidth: '60vw',
          opacity: Math.max(0, 1 - p * 12),
          transform: `translateY(${-p * 80}px) scale(${1 - p * 0.08})`,
          transition: 'opacity .3s linear',
          pointerEvents: p > 0.08 ? 'none' : 'auto'
        }}>
          Five flavors.<br /><span className="accent-fg">One obsession.</span>
        </h2>

        {/* Bottle center */}
        <div className="fb-bottle" style={{ width: 'min(300px, 22vw)', height: 'min(580px, 58vh)', position: 'relative', zIndex: 2 }}>
          <div className="bottle-float">
            <Bottle flavor={FLAVORS[flavor].tag} tilt={p * 6} src={FLAVOR_IMAGES[flavor]} />
          </div>
        </div>

        {/* Ingredients orbit */}
        {ingredients.map((ing, i) => {
          const active = p >= ing.appearAt;
          const rad = 260;
          const ang = ing.angle * Math.PI / 180;
          const x = Math.cos(ang) * rad;
          const y = Math.sin(ang) * rad;
          return (
            <div key={i} className="ingredient-orbit" style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.7s ease, transform 0.9s cubic-bezier(.2,.7,.2,1)',
              pointerEvents: 'none'
            }}>
              <div className="ingredient-orbit-inner" style={{
                transform: active ? 'translateY(0)' : 'translateY(16px)',
                transition: 'transform 0.9s cubic-bezier(.2,.7,.2,1)',
                textAlign: ang > 0 || Math.abs(ang) > Math.PI / 2 ? 'left' : 'right',
                minWidth: 200
              }}>
                <div className="mono accent-fg" style={{ marginBottom: 4 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em' }}>{ing.label}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--muted)' }}>{ing.note}</div>
              </div>
            </div>);

        })}

        {/* progress dots */}
        <div className="fb-progress-dots" style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ingredients.map((ing, i) =>
          <div key={i} style={{
            width: p >= ing.appearAt ? 10 : 8, height: p >= ing.appearAt ? 10 : 8, borderRadius: 999,
            background: p >= ing.appearAt ? 'var(--accent)' : 'rgba(240,235,227,0.28)',
            transition: 'background .4s, width .4s, height .4s',
            boxShadow: p >= ing.appearAt ? '0 0 0 4px rgba(139,30,30,0.18)' : 'none'
          }} />
          )}
        </div>
      </div>
      </div> {/* /.fb-desktop */}
    </section>);

}

// ——————————————————————————— Flavor scene atmospheres
function FlavorScene({ kind }) {
  // Stable random positions via key-based arrays
  if (kind === 'original') {
    const seeds = [[8,20],[18,70],[28,15],[42,85],[58,30],[72,65],[86,12],[94,55],[15,45],[65,80],[38,58],[80,38]];
    return (
      <div className="scene scene-original scene-grain">
        <div className="glow2" />
        <div className="glow" />
        {seeds.map(([l,t],i) => (
          <span key={i} className="sesame" style={{ left:`${l}%`, top:`${t}%`, animationDelay:`${(i*1.2)%14}s`, animationDuration:`${12+(i%5)*1.2}s` }} />
        ))}
      </div>
    );
  }
  if (kind === 'citrus') {
    const pith = [[12,25],[28,18],[40,75],[55,35],[70,62],[18,82],[48,12],[62,88],[32,50],[78,28]];
    return (
      <div className="scene scene-citrus scene-grain">
        <div className="sun" />
        <div className="sun-core" />
        {pith.map(([l,t],i) => (
          <span key={i} className="pith" style={{ left:`${l}%`, top:`${t}%`, animationDelay:`${(i*1.8)%18}s`, transform:`rotate(${i*37}deg)` }} />
        ))}
      </div>
    );
  }
  if (kind === 'spicy') {
    const embers = [[6,0],[14,0],[22,0],[30,0],[38,0],[46,0],[54,0],[62,0],[70,0],[78,0],[86,0],[94,0],[10,0],[34,0],[58,0],[82,0]];
    return (
      <div className="scene scene-spicy scene-grain">
        <div className="smear" />
        <div className="vignette" />
        {embers.map(([l],i) => (
          <span key={i} className="ember" style={{ left:`${l}%`, animationDelay:`${(i*0.45)%6}s`, animationDuration:`${5+(i%4)}s`, width:`${3+(i%3)}px`, height:`${3+(i%3)}px` }} />
        ))}
      </div>
    );
  }
  if (kind === 'ryu') {
    const specks = [[10,20],[22,65],[35,30],[48,80],[62,20],[75,55],[88,75],[15,85],[45,15],[70,40],[82,18],[28,45]];
    return (
      <div className="scene scene-ryu scene-grain">
        <div className="ink" />
        <div className="shimmer" />
        {specks.map(([l,t],i) => (
          <span key={i} className="gold-speck" style={{ left:`${l}%`, top:`${t}%`, animationDelay:`${(i*0.4)%5}s` }} />
        ))}
      </div>
    );
  }
  return null;
}

// ——————————————————————————— Horizontal scroll "Use it on..."
function UseItOn() {
  const wrap = useRef(null);
  const track = useRef(null);
  const mobileScroller = useRef(null);
  const [progress, setProgress] = useState(0);
  const [mobileIdx, setMobileIdx] = useState(0);

  useEffect(() => {
    const on = () => {
      const el = wrap.current;if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', on, { passive: true });on();
    return () => window.removeEventListener('scroll', on);
  }, []);

  const items = [
    { key: 'original', name: 'Original',     no: 'No.01', tag: 'GARLIC & SESAME', line: 'The one that started it all.',      note: 'Roasted garlic. Toasted sesame. Smooth soy.',       bg: '#7A2626', ink: '#F5F1EA', sub: 'rgba(245,241,234,0.65)', img: 'uploads/upload-original-v3.png' },
    { key: 'citrus',   name: 'Citrus Shoyu', no: 'No.02', tag: 'BRIGHT & TANGY',   line: 'Shoyu base. Clean citrus lift.',     note: 'Bright citrus over clean shoyu. Cuts through richness.', bg: '#9C7613', ink: '#0B0B0B', sub: 'rgba(11,11,11,0.60)',    img: 'uploads/upload-citrus-v3.png' },
    { key: 'spicy',    name: 'Spicy Tokyo',  no: 'No.03', tag: 'UMAMI MEETS FIRE', line: 'Dark soy. Roasted chili. Sesame.',   note: 'Heat layered over depth. Not hot for hot\u2019s sake.', bg: '#B23A0C', ink: '#F5F1EA', sub: 'rgba(245,241,234,0.70)', img: 'uploads/upload-spicy-v3.png' },
    { key: 'ryu',      name: 'Ryu Garlic',   no: 'No.04', tag: 'DARK DEPTH',       line: 'Aged black garlic. Rich umami.',     note: 'Molasses-deep, with a whisper of sweet heat.',        bg: '#1A1A1A', ink: '#F5C842', sub: 'rgba(245,200,66,0.70)',  img: 'uploads/upload-ryu-v3.png', comingSoon: 'COMING SOON · SUMMER 2026' },
  ];
  const panelCount = items.length;

  // Mobile carousel: track which panel is centered
  useEffect(() => {
    const el = mobileScroller.current;
    if (!el) return;
    const on = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / w);
      setMobileIdx(Math.max(0, Math.min(panelCount - 1, i)));
    };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [panelCount]);

  const mobileActive = items[mobileIdx];
  // Shift by (panels-1) * 100vw
  const shift = progress * (panelCount - 1) * 100;

  // Interpolate background color across slides
  const activeIdx = Math.min(panelCount - 1, Math.round(progress * (panelCount - 1)));
  const active = items[activeIdx];

  return (
    <section id="range" ref={wrap} className="range-section" style={{ position: 'relative', background: mobileActive.bg, transition: 'background 0.6s cubic-bezier(.2,.7,.2,1)', color: mobileActive.ink, scrollMarginTop: 80 }}>
      {/* MOBILE: native scroll-snap carousel with dots */}
      <div className="range-mobile" style={{ display: 'none', padding: '64px 0 28px', background: mobileActive.bg, transition: 'background .5s cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <span className="mono" style={{ color: mobileActive.sub }}>Index 03 — The Range</span>
          <span className="mono" style={{ color: mobileActive.sub }}>{String(mobileIdx + 1).padStart(2, '0')} / {String(panelCount).padStart(2, '0')}</span>
        </div>
        <div
          ref={mobileScroller}
          className="range-mobile-scroller"
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingInline: '4vw',
            gap: 16,
          }}
        >
          {items.map((it, i) => (
            <div key={i} style={{
              flex: '0 0 88vw',
              scrollSnapAlign: 'center',
              padding: '16px 12px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minHeight: 520,
            }}>
              <div style={{ position: 'relative', width: '100%', height: 320, marginBottom: 24 }}>
                <img src={it.img} alt={`NoodleBomb ${it.no} ${it.name}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: it.comingSoon ? 'drop-shadow(0 24px 40px rgba(0,0,0,0.45)) grayscale(0.3)' : 'drop-shadow(0 24px 40px rgba(0,0,0,0.45))', opacity: it.comingSoon ? 0.85 : 1 }} />
                {it.comingSoon && (
                  <div style={{
                    position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                    padding: '6px 12px', background: 'rgba(11,11,11,0.78)',
                    border: `1px solid ${it.ink}`, color: it.ink,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>{it.comingSoon}</div>
                )}
              </div>
              <div className="mono" style={{ color: it.sub, marginBottom: 12, letterSpacing: '0.15em', fontSize: 11 }}>{it.no} · {it.tag}</div>
              <h3 className="display" style={{ fontSize: 'clamp(40px, 11vw, 64px)', lineHeight: 0.92, color: it.ink, margin: '0 0 16px', fontWeight: 700, letterSpacing: '-0.04em', overflowWrap: 'break-word', maxWidth: '100%' }}>
                {it.name}.
              </h3>
              <div className="serif" style={{ fontStyle: 'italic', fontSize: 20, color: it.ink, opacity: 0.88, letterSpacing: '-0.01em', marginBottom: 10 }}>
                {it.line}
              </div>
              <div style={{ fontFamily: 'Inter Tight', fontSize: 14, color: it.sub, lineHeight: 1.5 }}>
                {it.note}
              </div>
            </div>
          ))}
        </div>
        {/* Dots — visible 8/24px pill, but each button is 44x44 tap target */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}>
          {items.map((it, i) => (
            <button
              key={i}
              aria-label={`Go to ${it.name}`}
              onClick={() => {
                const el = mobileScroller.current;
                if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
              }}
              style={{
                width: 44,
                height: 44,
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span aria-hidden="true" style={{
                display: 'block',
                width: i === mobileIdx ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: '#ffffff',
                opacity: i === mobileIdx ? 1 : 0.4,
                transition: 'width .3s, opacity .3s',
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP: original sticky horizontal scroll */}
      <div className="range-desktop" style={{ height: `${panelCount * 100}vh`, background: active.bg, transition: 'background 0.6s cubic-bezier(.2,.7,.2,1)', color: active.ink }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* header */}
        <div style={{ position: 'absolute', top: 28, left: 28, right: 28, zIndex: 5, display: 'flex', justifyContent: 'space-between' }}>
          <span className="mono" style={{ color: active.sub, opacity: 1 }}>Index 03 — The Range</span>
          <span className="mono" style={{ color: active.sub, opacity: 1 }}>{String(Math.min(panelCount, Math.floor(progress * panelCount) + 1)).padStart(2, '0')} / {String(panelCount).padStart(2, '0')}</span>
        </div>

        <div ref={track} style={{
          display: 'flex',
          height: '100%',
          transform: `translateX(-${shift}vw)`,
          transition: 'transform 0.08s linear',
          willChange: 'transform'
        }}>
          {items.map((it, i) =>
          <div key={i} className="hpanel" style={{ width: '100vw', height: '100%', flexShrink: 0, padding: 'clamp(80px, 10vw, 120px) clamp(28px, 6vw, 96px) 80px', display: 'flex', gap: 'clamp(24px, 4vw, 72px)', alignItems: 'stretch', position: 'relative', overflow: 'hidden' }}>
              {/* Atmospheric scene */}
              <FlavorScene kind={it.key} />
              {/* Huge watermark numeral */}
              <div className="flavor-numeral serif" style={{ left: '2vw', bottom: '-6vh', color: it.ink }}>
                {String(i + 1).padStart(2,'0')}
              </div>
              {/* Bottle image */}
              <div style={{ flex: '1 1 46%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <div className="clip-reveal flavor-bottle-bob" style={{ width: '100%', height: '100%', maxWidth: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <img src={it.img} alt={`NoodleBomb ${it.no} ${it.name} ramen sauce bottle`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: it.comingSoon ? 'drop-shadow(0 40px 60px rgba(0,0,0,0.45)) grayscale(0.3)' : 'drop-shadow(0 40px 60px rgba(0,0,0,0.45))', opacity: it.comingSoon ? 0.85 : 1 }} />
                  {it.comingSoon && (
                    <div style={{
                      position: 'absolute',
                      top: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '8px 16px',
                      background: 'rgba(11,11,11,0.78)',
                      border: `1px solid ${it.ink}`,
                      color: it.ink,
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      zIndex: 3,
                    }}>
                      {it.comingSoon}
                    </div>
                  )}
                </div>
              </div>
              {/* Side copy */}
              <div style={{ flex: '1 1 46%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 40, position: 'relative', zIndex: 2 }}>
                <div className="mono" style={{ color: it.sub, opacity: 1, marginBottom: 16, letterSpacing: '0.15em' }}>{it.no} · {it.tag}</div>
                <h3 className="display range-flavor-name" style={{ fontSize: 'clamp(48px, 9vw, 160px)', lineHeight: 0.92, color: it.ink, margin: 0, fontWeight: 700, letterSpacing: '-0.05em', overflowWrap: 'break-word' }}>
                  {it.name}.
                </h3>
                <div className="serif" style={{ fontStyle: 'italic', fontSize: 'clamp(22px, 2.2vw, 30px)', marginTop: 20, color: it.ink, opacity: 0.88, letterSpacing: '-0.01em', maxWidth: 480 }}>
                  {it.line}
                </div>
                <div style={{ fontFamily: 'Inter Tight', fontSize: 'clamp(16px, 1.2vw, 18px)', marginTop: 14, color: it.sub, maxWidth: 440, lineHeight: 1.5 }}>
                  {it.note}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* progress bar */}
        <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
          <div style={{ height: 1, background: active.sub, opacity: 0.25, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: active.ink }} />
          </div>
        </div>
      </div>
      </div> {/* /.range-desktop */}
    </section>);

}

// ——————————————————————————— Pour shot + Comparison
function PourAndCompare({ flavor = 'original' }) {
  return (
    <section id="pour" style={{ background: 'var(--paper)', padding: '140px clamp(24px, 5.5vw, 80px)', scrollMarginTop: 80 }}>
      {/* Pour shot */}
      <div className="pour-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', maxWidth: 1400, margin: '0 auto' }}>
        <div>
          <Reveal><div className="mono" style={{ color: 'var(--muted)', marginBottom: 16 }}>Index 04 — The Pour</div></Reveal>
          <Reveal delay={1}>
            <h2 className="display section-h2" style={{ margin: 0 }}>
              Slow drip.<br />
              <span style={{ color: 'var(--muted)' }}>No rush.</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p style={{ fontFamily: 'Inter Tight', fontSize: 22, maxWidth: 460, lineHeight: 1.3, marginTop: 32, color: 'var(--ink)' }}>
              Carefully crafted to balance rich flavors without being salty. Coats a spoon. Clings to a noodle. Finishes a dumpling.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div style={{ marginTop: 32, display: 'flex', gap: 24 }}>
              {[{ k: 'Bottle', v: '7 oz', num: true }, { k: 'Servings', v: '≈11', num: true }, { k: 'Fillers', v: 'None' }].map((s) => {
                const [popped, setPopped] = useState(false);
                useEffect(() => {setPopped(true);const t = setTimeout(() => setPopped(false), 400);return () => clearTimeout(t);}, [s.v]);
                return (
                  <div key={s.k}>
                    <div className="mono" style={{ color: 'var(--ink)', fontWeight: 600, fontSize: 12, letterSpacing: '0.18em', opacity: 0.9, marginBottom: 6 }}>{s.k.toUpperCase()}</div>
                    <div className={`display ${popped ? 'stat-pop' : ''}`} style={{ fontSize: 38, letterSpacing: '-0.03em' }}>{s.v}</div>
                  </div>);

              })}
            </div>
          </Reveal>
        </div>
        <Reveal delay={2}>
          <div className="pour-bottle-stage" style={{ position: 'relative', height: 560, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 260, height: '100%' }}>
              <div className="bottle-float">
                <Bottle tilt={-14} dripping src={FLAVOR_IMAGES[flavor]} />
              </div>
            </div>
            {/* landing surface */}
            <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: 320, height: 1, background: 'var(--line)' }} />
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 180, height: 20, borderRadius: '50%', background: 'var(--accent)', opacity: 0.35, filter: 'blur(14px)' }} />
          </div>
        </Reveal>
      </div>

      {/* Comparison */}
      <div style={{ maxWidth: 1100, margin: '120px auto 0' }}>
        <Reveal><div className="mono" style={{ color: 'var(--muted)', marginBottom: 16 }}>Index 05 — Where it sits</div></Reveal>
        <Reveal delay={1}>
          <h2 className="display section-h2" style={{ margin: '0 0 32px' }}>
            Where it<br />
            <span style={{ color: 'var(--muted)' }}>sits.</span>
          </h2>
        </Reveal>
        <Reveal delay={1.5}>
          <p style={{ fontFamily: 'Inter Tight', fontSize: 'clamp(18px, 2.2vw, 22px)', lineHeight: 1.5, color: 'var(--muted)', maxWidth: 720, margin: '0 0 56px', letterSpacing: '-0.01em' }}>
            Soy sauce seasons. Chili crisp adds heat. <span style={{ color: 'var(--ink)', fontWeight: 600 }}>NoodleBomb finishes</span> — the last splash that pulls a bowl together.
          </p>
        </Reveal>
        <Reveal delay={2}>
          {(() => {
            const rows = [
              ['Taste', 'Layered, 5 dimensions', 'Salt-forward', 'Heat-forward'],
              ['Versatility', 'Ramen → wings → rice', 'Asian dishes', 'Specific uses'],
              ['Fillers', 'None', 'Some', 'Some'],
              ['Made', 'Small batch, USA', 'Industrial', 'Industrial'],
            ];
            const colHeaders = ['NoodleBomb', 'Regular soy', 'Chili crisp'];
            return (
              <>
                {/* DESKTOP table — NoodleBomb column dominant per #26 */}
                <div className="compare-desktop compare-table-wrap" style={{ border: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
                  {/* Faint red NoodleBomb-column highlight bar (sits behind cells) */}
                  <div aria-hidden="true" style={{
                    position: 'absolute',
                    top: 0, bottom: 0,
                    left: 'calc(28% / 1.2 * 100% / 100)', /* approx — falls inside NoodleBomb column */
                    pointerEvents: 'none',
                  }} />
                  {[['Attribute', ...colHeaders], ...rows].map((row, i) =>
                    <div key={i} className="compare-row" style={{
                      display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr 1fr',
                      padding: '24px 28px',
                      borderTop: i ? '1px solid var(--line)' : 'none',
                      alignItems: 'center',
                      position: 'relative',
                    }}>
                      {/* NoodleBomb column highlight bar — only behind that column */}
                      {i === 0 && (
                        <div aria-hidden="true" style={{
                          position: 'absolute',
                          top: 0,
                          bottom: `calc(-${rows.length} * 100%)`,
                          left: 'calc(1.2 / 5.2 * 100%)',
                          width: 'calc(2 / 5.2 * 100%)',
                          background: 'rgba(139,30,30,0.08)',
                          pointerEvents: 'none',
                          zIndex: 0,
                        }} />
                      )}
                      {row.map((cell, j) =>
                        <div key={j} style={{
                          position: 'relative',
                          zIndex: 1,
                          fontFamily: i === 0 ? 'JetBrains Mono' : 'Inter Tight',
                          fontSize: i === 0 ? 11 : (j === 1 ? 22 : 16),
                          textTransform: i === 0 ? 'uppercase' : 'none',
                          letterSpacing: i === 0 ? '0.08em' : '-0.015em',
                          color: i === 0 ? (j === 1 ? 'var(--accent)' : 'var(--muted)') : j === 1 ? 'var(--ink)' : 'var(--muted)',
                          fontWeight: j === 1 && i > 0 ? 700 : (j === 1 && i === 0 ? 700 : 400),
                          opacity: j === 1 ? 1 : (i === 0 ? 0.85 : 0.6),
                        }}>
                          {cell}
                          {j === 1 && i > 0 && <span className="accent-fg" style={{ marginLeft: 10, fontSize: 10 }}>●</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* MOBILE stacked attribute cards */}
                <div className="compare-mobile" style={{ display: 'none', flexDirection: 'column', gap: 16 }}>
                  {rows.map(([attr, nb, soy, hot], i) => (
                    <div key={i} style={{ border: '1px solid var(--line)', padding: '20px 20px 16px' }}>
                      <div className="mono" style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '0.18em', marginBottom: 16, textTransform: 'uppercase' }}>
                        {attr}
                      </div>
                      {/* NoodleBomb — dominant */}
                      <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(240,235,227,0.06)' }}>
                        <div className="mono accent-fg" style={{ fontSize: 10, letterSpacing: '0.18em', marginBottom: 4 }}>
                          NoodleBomb
                        </div>
                        <div style={{ fontFamily: 'Inter Tight', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.2 }}>
                          {nb}
                        </div>
                      </div>
                      {/* Competitors — muted */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.5 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase', flexShrink: 0 }}>Regular soy</span>
                          <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--ink)', textAlign: 'right' }}>{soy}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase', flexShrink: 0 }}>Chili crisp</span>
                          <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--ink)', textAlign: 'right' }}>{hot}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </Reveal>
        <Reveal delay={3}>
          <div style={{ marginTop: 56, textAlign: 'center' }}>
            <a href="#lineup" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: 6, display: 'inline-block' }}>
              Try the lineup →
            </a>
          </div>
        </Reveal>
      </div>
    </section>);

}

// ——————————————————————————— Origin (editorial, stats-driven, conversion-aware)
function Origin() {
  const stats = [
    { num: '18', label: 'months in development' },
    { num: '5', label: 'flavors kept' },
    { num: '40+', label: 'thrown out' },
    { num: '1', label: 'kitchen in Bonney Lake' },
  ];
  return (
    <section
      id="origin"
      style={{
        background: 'var(--paper-2)',
        padding: 'clamp(96px, 12vw, 140px) clamp(24px, 5.5vw, 80px)',
        borderTop: '1px solid var(--line)',
        scrollMarginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div className="mono" style={{ color: 'var(--muted)', marginBottom: 28, letterSpacing: '0.18em' }}>
            Index 06 — Made by hand
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h2
            className="display"
            style={{
              margin: '0 0 56px',
              fontSize: 'clamp(40px, 5.5vw, 76px)',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              fontWeight: 700,
              maxWidth: '14ch',
            }}
          >
            Five flavors.<br />
            <span style={{ color: 'var(--muted)' }}>Forty rejected.</span>
          </h2>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={2}>
          <div
            className="origin-stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 24,
              padding: '40px 0',
              borderTop: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
              marginBottom: 56,
            }}
          >
            {stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  className="display"
                  style={{
                    fontSize: 'clamp(48px, 6vw, 80px)',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    lineHeight: 0.9,
                    color: 'var(--ink)',
                  }}
                >
                  {s.num}
                </div>
                <div
                  className="mono"
                  style={{
                    color: 'var(--muted)',
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    maxWidth: '18ch',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Single editorial line — no long story */}
        <Reveal delay={3}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: 'clamp(32px, 5vw, 80px)',
              alignItems: 'end',
            }}
            className="origin-quote-row"
          >
            <p
              className="serif"
              style={{
                fontSize: 'clamp(22px, 2.4vw, 32px)',
                lineHeight: 1.35,
                letterSpacing: '-0.015em',
                fontStyle: 'italic',
                color: 'var(--ink)',
                margin: 0,
                maxWidth: '36ch',
              }}
            >
              "If you find a ramen sauce better than this one, I want to know about it."
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                style={{
                  fontFamily: 'Inter Tight',
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: '-0.01em',
                }}
              >
                — Ashley March
              </div>
              <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.16em' }}>
                Founder · Bonney Lake, WA
              </div>
            </div>
          </div>
        </Reveal>

        {/* Conversion CTA — turn the section into a buy moment, not a dead end */}
        <Reveal delay={4}>
          <div
            style={{
              marginTop: 64,
              paddingTop: 40,
              borderTop: '1px solid var(--line)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.16em' }}>
              Small batch · est. 2024
            </div>
            <a
              href="/cart.html"
              onClick={() => addToCart({ slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 28px',
                borderRadius: 999,
                background: 'var(--ink)',
                color: 'var(--paper)',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'transform .28s, box-shadow .35s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Try the Trio — $29.99 · Save $6
              <span style={{ fontSize: 16 }}>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ——————————————————————————— Testimonials (real brand voice)
function Testimonials() {
  const quotes = [
  { body: 'NoodleBomb is a flavor explosion. The richness paired with the perfect spicy kick makes every bowl unforgettable. A total must-have for noodle lovers.', name: 'Ashley R.', tag: 'verified buyer' },
  { body: 'I wasn’t expecting this much punch from one sauce. Took my plain store-bought ramen and made it restaurant-worthy in seconds. I’m officially hooked.', name: 'Marcus', tag: 'verified buyer' },
  { body: 'Perfect balance of garlic, heat, and umami. It seriously upgrades any ramen.', name: 'Priya', tag: 'verified buyer' }];

  return (
    <section id="reviews" style={{ background: 'var(--paper)', padding: '140px clamp(24px, 5.5vw, 80px)', borderTop: '1px solid var(--line)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 56 }}>
            <span className="mono" style={{ color: 'var(--muted)' }}>Index 07 — What They’re Saying</span>
            <span className="mono" style={{ color: 'var(--muted)' }}>From 18 months of recipe testing</span>
          </div>
        </Reveal>
        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {quotes.map((q, i) =>
          <Reveal key={i} delay={i + 1}>
              <div style={{ background: 'var(--paper-2)', padding: 32, height: '100%', display: 'flex', flexDirection: 'column', gap: 20, minHeight: 280, overflow: 'visible' }}>
                <div className="accent-fg display" style={{ fontSize: 48, lineHeight: 1, marginBottom: 0, flexShrink: 0 }}>"</div>
                <div style={{ fontFamily: 'Inter Tight', fontSize: 18, lineHeight: 1.45, letterSpacing: '-0.01em', flex: 1, overflow: 'visible' }}>{q.body}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexShrink: 0, paddingTop: 4, borderTop: '1px solid rgba(240,235,227,0.06)' }}>
                  <div style={{ fontFamily: 'Inter Tight', fontWeight: 600, fontSize: 14 }}>— {q.name}</div>
                  <div className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>{q.tag}</div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

// ——————————————————————————— Flavor picker (changes accent color)
function FlavorPicker({ flavor, setFlavor }) {
  // Only currently-shipping flavors in the lineup. Ryu lives in The Range + The Next Drop.
  const keys = Object.keys(FLAVORS).filter((k) => k !== 'ryu');
  // Per-flavor card background tints (subtle warm tones layered over paper-2)
  const cardBg = {
    original: 'linear-gradient(170deg, rgba(139,30,30,0.10) 0%, rgba(139,30,30,0.04) 100%)',
    citrus:   'linear-gradient(170deg, rgba(201,162,39,0.10) 0%, rgba(201,162,39,0.04) 100%)',
    spicy:    'linear-gradient(170deg, rgba(194,65,12,0.12) 0%, rgba(194,65,12,0.04) 100%)',
  };
  const cardBorder = {
    original: 'rgba(139,30,30,0.22)',
    citrus:   'rgba(201,162,39,0.22)',
    spicy:    'rgba(194,65,12,0.25)',
  };
  return (
    <section id="lineup" style={{ background: 'var(--paper-2)', padding: '140px clamp(24px, 5.5vw, 80px)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <Reveal><div className="mono" style={{ color: 'var(--muted)', marginBottom: 16 }}>Index 08 — The Lineup</div></Reveal>
        <Reveal delay={1}>
          <h2 className="display section-h2" style={{ margin: '0 0 32px', maxWidth: 900 }}>
            Three sauces.<br /><span style={{ color: 'var(--muted)' }}>Pick one. Or all three.</span>
          </h2>
        </Reveal>

        <Reveal delay={2}>
          <figure className="trio-composite" style={{ margin: '0 0 56px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--paper)', padding: '40px clamp(16px, 3vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(16px, 3vw, 40px)', alignItems: 'end', justifyItems: 'center' }}>
            {/* width/height = native PNG dimensions — reserves aspect ratio
                so the browser doesn't reflow when lazy images settle. */}
            {[
              { src: 'uploads/nb-original-clean.png',     w: 606, h: 1449, alt: 'NoodleBomb Original ramen sauce bottle' },
              { src: 'uploads/nb-citrus-shoyu-clean.png', w: 612, h: 1433, alt: 'NoodleBomb Citrus Shoyu ramen sauce bottle' },
              { src: 'uploads/nb-spicy-tokyo-clean.png',  w: 848, h: 1264, alt: 'NoodleBomb Spicy Tokyo ramen sauce bottle' },
            ].map((b) => (
              <img key={b.src} src={b.src} alt={b.alt} width={b.w} height={b.h} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 440, objectFit: 'contain', filter: 'drop-shadow(0 24px 32px rgba(0,0,0,0.45))' }} />
            ))}
          </figure>
        </Reveal>

        <div className="lineup-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
          {keys.map((k, i) => {
            const f = FLAVORS[k];
            const active = flavor === k;
            const handleMouseMove = (e) => {
              const el = e.currentTarget;
              const rect = el.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(${active ? -6 : 0}px) scale(1.02)`;
            };
            const handleMouseLeave = (e) => {
              e.currentTarget.style.transform = active ? 'translateY(-6px)' : '';
            };
            return (
              <Reveal key={k} delay={i + 1}>
                <div
                  className="tilt-card"
                  onClick={() => setFlavor(k)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    background: cardBg[k] || 'transparent',
                    border: `1px solid ${cardBorder[k] || 'var(--line)'}`,
                    padding: 32,
                    cursor: 'pointer',
                    transition: 'transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s, background .4s, border-color .4s',
                    transform: active ? 'translateY(-4px)' : 'none',
                    boxShadow: active ? `0 24px 60px ${f.color}30` : 'none'
                  }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 8 }}>
                    <span className="mono" style={{ color: 'var(--ink-40)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>{f.tag}</span>
                    <div style={{ width: 8, height: 8, borderRadius: 999, background: f.color, opacity: active ? 1 : 0.35, transition: 'opacity .3s', flexShrink: 0 }} />
                  </div>
                  <div style={{ height: 340, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 200, height: '100%' }}>
                      <Bottle flavor={f.tag} accent={f.color} src={FLAVOR_IMAGES[k]} />
                    </div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <h3 className="display" style={{ fontSize: 'clamp(24px, 3.4vw, 32px)', letterSpacing: '-0.04em', fontWeight: 700, margin: 0, lineHeight: 0.95, wordBreak: 'keep-all', overflowWrap: 'normal', hyphens: 'none' }}>{f.name}.</h3>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--ink-60)', marginTop: 8, lineHeight: 1.5 }}>{f.line1} {f.line2}</div>
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-60)' }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)' }}>Launching May 8</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div className="serif" style={{ fontSize: 22, fontStyle: 'italic' }}>{f.price}</div>
                      <span className="mono" style={{ color: 'var(--ink-40)', fontSize: 10 }}>7 fl oz</span>
                    </div>
                    <a
                      href="/cart.html"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ slug: k, name: f.name, price: f.priceUsd });
                      }}
                      className="lineup-buy-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        width: '100%',
                        minHeight: 48,
                        padding: '14px 20px',
                        borderRadius: 999,
                        background: '#0B0A09',
                        border: '1px solid #0B0A09',
                        color: '#F5F1EA',
                        fontFamily: 'Inter',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.35s cubic-bezier(.2,.7,.2,1), color 0.35s, transform 0.28s, box-shadow 0.35s, border-color 0.35s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = f.color;
                        e.currentTarget.style.borderColor = f.color;
                        e.currentTarget.style.color = f.ink;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 12px 28px ${f.color}55`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0B0A09';
                        e.currentTarget.style.borderColor = '#0B0A09';
                        e.currentTarget.style.color = '#F5F1EA';
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Add to Cart
                      <span style={{ fontSize: 14, lineHeight: 1, transition: 'transform 0.28s' }}>→</span>
                    </a>
                  </div>
                </div>
              </Reveal>);

          })}
        </div>

        {/* Trio cta — editorial bundle moment */}
        <Reveal delay={4}>
          <div className="trio-bundle-grid" style={{
            marginTop: 28,
            background: 'var(--paper-2)',
            borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
            display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', alignItems: 'stretch',
            minHeight: 420
          }}>
            {/* Photo — composite three individual clean-bottle PNGs side by side
                (replaces broken composite image where Citrus Shoyu label wrapped as "CITRU SSHOYU") */}
            <div className="trio-bundle-photo" style={{ position: 'relative', overflow: 'hidden', background: '#14110E', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(8px, 2vw, 20px)', alignItems: 'end', padding: 'clamp(16px, 3vw, 32px)', minWidth: 0, maxWidth: '100%' }}>
              {[
                { src: 'uploads/nb-original-clean.png',     w: 606, h: 1449, alt: 'NoodleBomb Original ramen sauce bottle' },
                { src: 'uploads/nb-citrus-shoyu-clean.png', w: 612, h: 1433, alt: 'NoodleBomb Citrus Shoyu ramen sauce bottle' },
                { src: 'uploads/nb-spicy-tokyo-clean.png',  w: 848, h: 1264, alt: 'NoodleBomb Spicy Tokyo ramen sauce bottle' },
              ].map((b) => (
                <img key={b.src} src={b.src} alt={b.alt} width={b.w} height={b.h} loading="lazy" style={{ display: 'block', width: '100%', maxWidth: '100%', height: 'auto', maxHeight: 360, objectFit: 'contain', filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.5))' }} />
              ))}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 55%, rgba(8,7,6,0.45) 100%)', pointerEvents: 'none' }} />
            </div>
            {/* Copy */}
            <div className="trio-bundle-copy" style={{ padding: 'clamp(32px, 4vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
              <span className="mono" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em' }}>BUNDLE · SAVE $5.98</span>
              <h3 className="display" style={{ fontSize: 'clamp(36px, 4vw, 52px)', letterSpacing: '-0.03em', lineHeight: 1.02, margin: 0, fontWeight: 700 }}>
                The 3-Pack Variety<br />
                <span style={{ color: 'var(--muted)' }}>— $29.99.</span>
              </h3>
              <div style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--ink-60)', lineHeight: 1.55, maxWidth: '42ch' }}>
                One of each: Original, Citrus Shoyu, Spicy Tokyo. Enough to find your favorite — and a backup.
              </div>

              {/* Included chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {['Original', 'Citrus Shoyu', 'Spicy Tokyo'].map((label) => (
                  <span key={label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px 6px 10px',
                    border: '1px solid rgba(11,11,11,0.18)',
                    borderRadius: 999,
                    fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                    color: 'var(--ink)', background: 'rgba(245,241,234,0.6)',
                    letterSpacing: '-0.005em',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', display: 'inline-block', boxShadow: '0 0 0 2px rgba(139,30,30,0.18)' }} />
                    {label}
                  </span>
                ))}
              </div>

              {/* Microline — "SHIPS FREE" claim removed pending Wix backend
                  verification (trio is $29.99, below the $40 free-ship line
                  the local cart enforces; if Wix has a special trio rule
                  Mike can confirm, restore the claim). */}
              <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.14em', marginTop: -4 }}>
                MOST POPULAR · ARRIVES IN 3–5 DAYS · 1,200+ SOLD THIS MONTH
              </div>

              <div style={{ marginTop: 8 }}>
                <a
                  className="btn trio-bundle-cta"
                  href="/cart.html"
                  onClick={() => addToCart({ slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    background: '#8B1E1E',
                    color: '#F5F1EA',
                    border: 'none',
                    padding: '18px 32px',
                    minHeight: 56,
                    fontWeight: 600,
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontFamily: 'Inter',
                    fontSize: 14,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    transition: 'transform .25s cubic-bezier(.2,.7,.2,1), box-shadow .35s, background .35s',
                    textDecoration: 'none',
                    boxShadow: '0 12px 28px rgba(139,30,30,0.30)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 18px 40px rgba(139,30,30,0.45)';
                    e.currentTarget.style.background = '#A02525';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(139,30,30,0.30)';
                    e.currentTarget.style.background = '#8B1E1E';
                  }}
                >
                  Buy the Trio — $29.99 · Save $6
                  <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>);

}

// ——————————————————————————— Final CTA + Footer
function FinalCTA() {
  return (
    <>
      <section id="cta" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', transition: 'background .6s, color .6s', padding: '128px clamp(24px, 5.5vw, 80px) 96px', textAlign: 'center', position: 'relative', overflow: 'hidden', scrollMarginTop: 80 }}>
        <div className="ask-grain"></div>
        {/* Dotted texture overlay */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(245,241,234,0.5) 1px, transparent 1px)',
          backgroundSize: '7px 7px',
          opacity: 0.07,
          pointerEvents: 'none',
          mixBlendMode: 'overlay'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal><div className="mono" style={{ marginBottom: 24, opacity: 0.7 }}>Index 11 — The Ask</div></Reveal>
          <Reveal delay={1}>
            <h2 className="display" style={{ fontSize: 'clamp(60px, 12vw, 220px)', margin: 0, lineHeight: 0.9, fontWeight: 700 }}>
              Pour it<br />on everything.
            </h2>
          </Reveal>

          {/* "Everything" icon row */}
          <Reveal delay={2}>
            <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center', gap: 'clamp(28px, 5vw, 72px)', flexWrap: 'wrap' }}>
              {[
                { glyph: '🍜', label: 'ramen', svg: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h22a10 10 0 0 1-22 0Z"/><path d="M9 14c0-3 2-5 4-5M16 14c0-4 3-7 5-7M22 14c0-2 1-3 3-3"/><path d="M3 22h26"/></svg> },
                { label: 'wings', svg: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22c4-2 8-3 12-3s7 1 9 3"/><path d="M9 19c1-3 4-6 8-7s7 0 9 2"/><path d="M13 14c2-2 5-3 8-3"/><circle cx="22" cy="24" r="1.4"/></svg> },
                { label: 'rice', svg: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 14h20l-2 12H8Z"/><path d="M9 14c0-4 3-7 7-7s7 3 7 7"/><path d="M11 18l1 4M16 18v4M21 18l-1 4"/></svg> },
                { label: 'dumplings', svg: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 20c0-5 5-9 11-9s11 4 11 9c0 1-1 2-2 2H7c-1 0-2-1-2-2Z"/><path d="M9 20c1-2 2-3 3-3M14 20c1-2 2-3 3-3M19 20c1-2 2-3 3-3"/></svg> }
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--accent-ink)', opacity: 0.85 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 999, border: '1px solid rgba(245,241,234,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {it.svg}
                  </div>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.85 }}>{it.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={3}>
            <div className="finalcta-row" style={{ marginTop: 48, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
              <a className="btn" href={WIX_URLS.shop} target="_blank" rel="noopener" style={{ background: 'var(--accent-ink)', color: 'var(--accent)', padding: '18px 32px', fontWeight: 600, border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'Inter', fontSize: 15, letterSpacing: '-0.005em', transition: 'transform .2s, box-shadow .2s', textDecoration: 'none', display: 'inline-block', flexShrink: 0 }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>Shop all — from $11.99</a>
              <form className="finalcta-waitlist" action="https://formsubmit.co/hello@noodlebomb.co" method="POST" style={{ display: 'flex', flex: 1, minWidth: 280, gap: 0, border: '1px solid rgba(245,241,234,0.35)', borderRadius: 4, overflow: 'hidden', background: 'rgba(0,0,0,0.18)' }}>
                <input type="hidden" name="_subject" value="NoodleBomb Waitlist Signup" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value="https://noodlebomb.co/?subscribed=1" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="email" name="email" placeholder="Join the waitlist · your@email.com" required
                  style={{ flex: 1, minWidth: 0, padding: '14px 16px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--accent-ink)', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em' }} />
                <button type="submit" style={{ background: 'transparent', color: 'var(--accent-ink)', border: 'none', borderLeft: '1px solid rgba(245,241,234,0.25)', padding: '0 20px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background .2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(245,241,234,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>Notify me →</button>
              </form>
            </div>
          </Reveal>

          {/* Trust line — desktop: static one-liner. Mobile: scrolling marquee (text doesn't fit on one line, so animate it). */}
          <Reveal delay={4}>
            <div className="trust-line-wrap" style={{ marginTop: 36, overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)' }}>
              <div className="trust-line-track mono" style={{ display: 'inline-flex', whiteSpace: 'nowrap', fontSize: 11, letterSpacing: '0.18em', opacity: 0.7, willChange: 'transform' }}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <span key={j} style={{ paddingRight: 32 }}>
                    PREMIUM INGREDIENTS · NO FILLERS · MADE IN BONNEY LAKE, WA · FREE SHIPPING AT $40 ·
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        <div className="finalcta-corner finalcta-corner-left" style={{ position: 'absolute', bottom: 24, left: 28, zIndex: 1 }}>
          <span className="mono" style={{ opacity: 0.65 }}>small-batch · made in the USA</span>
        </div>
        <div className="finalcta-corner finalcta-corner-right" style={{ position: 'absolute', bottom: 24, right: 28, zIndex: 1 }}>
          <span className="mono" style={{ opacity: 0.65 }}>pacific northwest · est. 2024</span>
        </div>
      </section>

      {/* Marquee — animated infinite scroller */}
      <div className="marq-wrap" style={{ padding: '32px 0', background: '#080706', color: 'var(--ink)', overflow: 'hidden', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', transform: 'skewY(-2deg)', margin: '0 -2vw' }}>
        <div className="marq-track">
          {Array.from({ length: 2 }).map((_, j) =>
          <React.Fragment key={j}>
              {['SMALL BATCH', '•', 'PREMIUM INGREDIENTS', '•', 'NO FILLERS', '•', 'POUR IT ON EVERYTHING', '•', 'MADE IN BONNEY LAKE WA', '•'].map((s, i) =>
            <span key={i} className="display" style={{ fontSize: 96, letterSpacing: '-0.05em', color: 'var(--ink)', opacity: 0.18 }}>{s}</span>
            )}
            </React.Fragment>
          )}
        </div>
      </div>

      <footer style={{ background: '#080706', color: 'var(--ink)', padding: '80px 28px 40px' }}>
        {/* Newsletter capture */}
        <div className="footer-newsletter" style={{ maxWidth: 1440, margin: '0 auto 48px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.05, fontWeight: 600 }}>
              Sauce drops, restock alerts, the occasional recipe.
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--ink-60)', marginTop: 10 }}>
              Once a month. Never spam.
            </div>
          </div>
          <form className="footer-newsletter-form" action="https://formsubmit.co/hello@noodlebomb.co" method="POST" style={{ display: 'flex', gap: 0, border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden', background: '#100E0C' }}>
            <input type="hidden" name="_subject" value="NoodleBomb Newsletter Signup" />
            <input type="hidden" name="_template" value="table" />
            <input type="email" name="email" placeholder="your@email.com" required
              style={{ flex: 1, minWidth: 0, padding: '16px 18px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em' }} />
            <button type="submit" className="btn" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', padding: '0 28px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em', transition: 'filter .2s' }} onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.08)'} onMouseOut={(e) => e.currentTarget.style.filter = 'none'}>Subscribe</button>
          </form>
        </div>
        <div style={{ borderTop: '1px solid var(--line)', maxWidth: 1440, margin: '0 auto 56px' }} />

        <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 64, maxWidth: 1440, margin: '0 auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-ink)', fontFamily: 'Inter Tight', fontWeight: 800, fontSize: 12 }}>N</div>
              <span className="display" style={{ fontSize: 18, letterSpacing: '-0.04em', fontWeight: 700 }}>noodlebomb</span>
            </div>
            <p style={{ maxWidth: 320, color: 'var(--ink-60)', fontSize: 13, lineHeight: 1.6 }}>
              Bold ramen sauce crafted in the Pacific Northwest. Small-batch bottled with real ingredients. Premium ingredients, no fillers, no apologies.
            </p>
          </div>
          {[
          ['Shop', [['Original', WIX_URLS.original], ['Citrus Shoyu', WIX_URLS.citrus], ['Spicy Tokyo', WIX_URLS.spicy], ['The NoodleBomb Trio', WIX_URLS.trio], ['Monthly Box', '#monthly'], ['The Next Drop →', '#next-drop']]],
          ['Learn', [['Ingredients', '#ingredients'], ['The Range', '#range'], ['The Pour', '#pour'], ['Origin', '#origin'], ['Monthly Box', '#monthly']]],
          ['Company', [['About', '#origin'], ['Reviews', '#reviews'], ['Wholesale (MOQ 12)', 'mailto:hello@noodlebomb.co?subject=Wholesale%20Inquiry%20-%20NoodleBomb'], ['Contact', 'mailto:hello@noodlebomb.co?subject=NoodleBomb%20Inquiry']]]].
          map(([h, items]) =>
          <div key={h}>
              <div className="mono" style={{ marginBottom: 20 }}>{h}</div>
              {items.map(([label, href]) => {
                const external = href.startsWith('http');
                const isHash = href.startsWith('#') && !href.startsWith('#open-');
                const sentinel = href.startsWith('#open-');
                return (
                  <a key={label} href={sentinel ? '#' : href}
                     className="footer-link"
                     target={external ? '_blank' : undefined}
                     rel={external ? 'noopener' : undefined}
                     onClick={(e) => {
                       if (sentinel) {
                         e.preventDefault();
                         const kind = href.replace('#open-', '');
                         if (window.NB_OPEN_INQUIRY) window.NB_OPEN_INQUIRY(kind);
                       } else if (isHash) {
                         e.preventDefault();
                         const el = document.querySelector(href);
                         if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                       }
                       // mailto: and http(s): links fall through to default behavior
                     }}
                     style={{ display: 'block', fontSize: 13, padding: '6px 0', color: 'var(--ink)', opacity: 0.85, cursor: 'pointer', transition: 'opacity .2s, transform .2s', textDecoration: 'none' }}
                     onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateX(3px)'; }}
                     onMouseOut={(e) => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.transform = 'translateX(0)'; }}>{label}</a>
                );
              })}
            </div>
          )}
        </div>
        {/* Social row — Instagram + TikTok */}
        <div className="footer-social-row" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, maxWidth: 1440, marginLeft: 'auto', marginRight: 'auto', marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
          <a
            href="https://instagram.com/noodlebomb"
            target="_blank"
            rel="noopener"
            aria-label="NoodleBomb on Instagram"
            style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', opacity: 0.65, transition: 'opacity .2s, transform .2s', textDecoration: 'none' }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = 0.65; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a
            href="https://tiktok.com/@noodlebomb"
            target="_blank"
            rel="noopener"
            aria-label="NoodleBomb on TikTok"
            style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', opacity: 0.65, transition: 'opacity .2s, transform .2s', textDecoration: 'none' }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = 0.65; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
            </svg>
          </a>
        </div>

        <div className="footer-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 28, borderTop: '1px solid var(--line)', maxWidth: 1440, marginLeft: 'auto', marginRight: 'auto', gap: 24, flexWrap: 'wrap' }}>
          <span className="mono">© 2026 noodlebomb co. all rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <span className="mono">pour responsibly.</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mono" style={{ background: 'none', border: 'none', color: 'var(--ink)', opacity: 0.7, cursor: 'pointer', padding: '15px 0', minHeight: 44, transition: 'opacity .2s', display: 'inline-flex', alignItems: 'center', gap: 6 }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}>
              <span>↑</span> back to top
            </button>
          </div>
        </div>
      </footer>
    </>);

}

// ——————————————————————————— Tweaks panel
function Tweaks({ state, set, open, setOpen }) {
  if (!open) return null;
  return (
    <div className="tweaks">
      <h4>
        <span>Tweaks</span>
        <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setOpen(false)}>✕</span>
      </h4>
      <div className="row">
        <span>Flavor</span>
        <div className="swatches">
          {Object.entries(FLAVORS).map(([k, f]) =>
          <div key={k}
          className={`sw ${state.flavor === k ? 'active' : ''}`}
          style={{ background: f.color }}
          onClick={() => set({ flavor: k })}
          title={f.name} />

          )}
        </div>
      </div>
      <div className="row">
        <span>Grain texture</span>
        <div className={`toggle ${state.grain ? 'on' : ''}`} onClick={() => set({ grain: !state.grain })} />
      </div>
      <div className="row">
        <span>Anti-pattern mode</span>
        <div className={`toggle ${state.spam ? 'on' : ''}`} onClick={() => set({ spam: !state.spam })} />
      </div>
      <div className="row" style={{ display: 'block' }}>
        <div style={{ marginBottom: 6 }}>Headline</div>
        <input type="text" value={state.headline} onChange={(e) => set({ headline: e.target.value })} />
        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>use \n for line break</div>
      </div>
    </div>);

}

// ——————————————————————————— App
function App() {
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "flavor": "original",
    "grain": true,
    "spam": false,
    "headline": "POUR IT ON\nEVERYTHING"
  } /*EDITMODE-END*/;

  const [state, setState] = useState(DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [inquiry, setInquiry] = useState(null); // null | 'wholesale' | 'contact'

  // Dev-mode gate: only enable Tweaks panel + spam banner + parent postMessage hooks
  // when running on localhost or with ?dev=1 in URL. Keeps these out of production traffic.
  const IS_DEV_MODE = (() => {
    if (typeof window === 'undefined') return false;
    if (window.location.search.includes('dev=1')) return true;
    const h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.lovable.dev') || h.endsWith('.lovable.app');
  })();

  // Expose modal opener globally so footer/anchor clicks can trigger it
  useEffect(() => {
    window.NB_OPEN_INQUIRY = (kind) => setInquiry(kind);
    return () => { delete window.NB_OPEN_INQUIRY; };
  }, []);

  // Honor ?flavor=X on initial load — used by the empty-cart recommendations
  // (cart.jsx links to "/?flavor=spicy#lineup") so the homepage reflects the
  // flavor the user clicked through to instead of defaulting to original.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('flavor');
    if (requested && FLAVORS[requested]) {
      setState((s) => ({ ...s, flavor: requested }));
    }
  }, []);
  const set = (patch) => {
    setState((s) => {
      const next = { ...s, ...patch };
      if (IS_DEV_MODE) {
        try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*'); } catch (_) {}
      }
      return next;
    });
  };

  // Lenis smooth scroll
  useEffect(() => {
    if (!window.Lenis) return;
    const lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (t) => {lenis.raf(t);requestAnimationFrame(raf);};
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Accent color swap
  useEffect(() => {
    const f = FLAVORS[state.flavor];
    document.documentElement.style.setProperty('--accent', f.color);
    document.documentElement.style.setProperty('--accent-ink', f.ink);
  }, [state.flavor]);

  // Grain
  useEffect(() => {
    document.body.classList.toggle('grain', state.grain);
  }, [state.grain]);

  // Edit mode messaging — DEV ONLY (gated by IS_DEV_MODE so prod traffic gets no postMessage hooks)
  useEffect(() => {
    if (!IS_DEV_MODE) return;
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (_) {}
    return () => window.removeEventListener('message', onMsg);
  }, [IS_DEV_MODE]);

  const headline = (state.headline || '').replace(/\\n/g, '\n');

  return (
    <>
      {IS_DEV_MODE && state.spam && <div className="spam-banner">⚡ LIMITED TIME!!! 50% OFF — HURRY — ONLY 3 LEFT!!! ⚡</div>}
      <Nav flavor={state.flavor} setFlavor={(k) => set({ flavor: k })} flavors={FLAVORS} />
      <Hero headline={headline} bottleSrc={FLAVOR_IMAGES[state.flavor]} flavorKey={state.flavor} flavorMeta={FLAVORS[state.flavor]} />
      <FlavorBreakdown flavor={state.flavor} />
      <UseItOn />
      <PourAndCompare flavor={state.flavor} />
      <Origin />
      <Testimonials />
      <FlavorPicker flavor={state.flavor} setFlavor={(k) => set({ flavor: k })} />
      <NextDrop />
      <MonthlyDrop />
      <FinalCTA />
      {IS_DEV_MODE && <Tweaks state={state} set={set} open={tweaksOpen} setOpen={setTweaksOpen} />}
      <InquiryModal open={!!inquiry} kind={inquiry} onClose={() => setInquiry(null)} />
    </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);