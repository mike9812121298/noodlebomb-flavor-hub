// NoodleBomb — app composition
const { useEffect, useRef, useState } = React;
// Wix Stores deep links (added 2026-04-25 for production deploy)
const WIX_URLS = {"original": "https://mikejmarch.wixstudio.com/mysite-5/product-page/noodlebomb-original-ramen-sauce", "citrus": "https://mikejmarch.wixstudio.com/mysite-5/product-page/noodle-bomb-citrus-shoyu-ramen-sauce", "spicy": "https://mikejmarch.wixstudio.com/mysite-5/product-page/noodle-bomb-spicy-tokyo-ramen-sauce", "trio": "https://mikejmarch.wixstudio.com/mysite-5/product-page/the-noodlebomb-trio", "cart": "https://mikejmarch.wixstudio.com/mysite-5/cart-page", "shop": "https://mikejmarch.wixstudio.com/mysite-5/shop"};
const wixFor = (key) => WIX_URLS[key] || WIX_URLS.shop;


const FLAVORS = {
  original: { name: 'Original', tag: 'No.01 · Garlic & Sesame', short: 'No.01', color: '#8B1E1E', ink: '#F5F1EA',
    line1: 'The one that started it all.',
    line2: 'Roasted garlic, toasted sesame, smooth soy.',
    price: '$9.50', pack: '$25.00 / 3-pack' },
  citrus: { name: 'Citrus Shoyu', tag: 'No.02 · Citrus Shoyu', short: 'No.02', color: '#C9A227', ink: '#0B0B0B',
    line1: 'Bright, tangy, refreshing.',
    line2: 'Shoyu base with a clean citrus lift.',
    price: '$9.50', pack: '$25.00 / 3-pack' },
  spicy: { name: 'Spicy Tokyo', tag: 'No.03 · Spicy Tokyo', short: 'No.03', color: '#C2410C', ink: '#F5F1EA',
    line1: 'Umami meets fire.',
    line2: 'Dark soy, roasted chili, sesame.',
    price: '$9.50', pack: '$25.00 / 3-pack' },
  ryu: { name: 'Ryu Garlic', tag: 'No.04 · Ryu Garlic', short: 'No.04', color: '#3D2B1F', ink: '#F5C842',
    line1: 'Black garlic. Dark depth.',
    line2: 'Aged black garlic, rich umami, subtle heat.',
    price: '$9.50', pack: '$25.00 / 3-pack' }
};

const FLAVOR_IMAGES = {
  original: 'uploads/nb-original-clean.png',
  citrus: 'uploads/nb-citrus-shoyu-clean.png',
  spicy: 'uploads/nb-spicy-tokyo-clean.png',
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

// ——————————————————————————— Flavor Breakdown: sticky bottle + orbiting ingredients
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

  const ingredients = [
  { label: 'Soy + dark soy', note: 'the umami backbone', angle: -140, appearAt: 0.10 },
  { label: 'Roasted garlic', note: 'slow-roasted, fresh', angle: -55, appearAt: 0.28 },
  { label: 'Toasted sesame', note: 'nutty, smooth finish', angle: 40, appearAt: 0.46 },
  { label: 'Rice vinegar', note: 'balance + brightness', angle: 135, appearAt: 0.64 },
  { label: 'Mushroom + chili', note: 'depth and a whisper of heat', angle: 270, appearAt: 0.82 }];


  return (
    <section id="ingredients" ref={stickyRef} style={{ position: 'relative', height: '320vh', background: 'var(--paper)', scrollMarginTop: 80 }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Section header */}
        <div style={{ position: 'absolute', top: 100, left: 28, right: 28, display: 'flex', justifyContent: 'space-between' }}>
          <span className="mono" style={{ color: 'var(--muted)' }}>Index 02 — Flavor Breakdown</span>
          <span className="mono" style={{ color: 'var(--muted)' }}>pour.02 / of.05</span>
        </div>
        <h2 className="display section-h2" style={{
          position: 'absolute', top: 140, left: 28, margin: 0,
          maxWidth: '60vw',
          opacity: Math.max(0, 1 - p * 12),
          transform: `translateY(${-p * 80}px) scale(${1 - p * 0.08})`,
          transition: 'opacity .3s linear',
          pointerEvents: p > 0.08 ? 'none' : 'auto'
        }}>
          Five ingredients.<br /><span className="accent-fg">One obsession.</span>
        </h2>

        {/* Bottle center */}
        <div style={{ width: 'min(300px, 22vw)', height: 'min(580px, 58vh)', position: 'relative', zIndex: 2 }}>
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
            <div key={i} style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.7s ease, transform 0.9s cubic-bezier(.2,.7,.2,1)',
              pointerEvents: 'none'
            }}>
              <div style={{
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
        <div style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
  const [progress, setProgress] = useState(0);

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
    { key: 'citrus',   name: 'Citrus Shoyu', no: 'No.02', tag: 'BRIGHT & TANGY',   line: 'Shoyu base. Clean citrus lift.',     note: 'Yuzu, shoyu, a bright finish that cuts through fat.', bg: '#9C7613', ink: '#0B0B0B', sub: 'rgba(11,11,11,0.60)',    img: 'uploads/upload-citrus-v3.png' },
    { key: 'spicy',    name: 'Spicy Tokyo',  no: 'No.03', tag: 'UMAMI MEETS FIRE', line: 'Dark soy. Roasted chili. Sesame.',   note: 'Heat layered over depth. Not hot for hot\u2019s sake.', bg: '#B23A0C', ink: '#F5F1EA', sub: 'rgba(245,241,234,0.70)', img: 'uploads/upload-spicy-v3.png' },
    { key: 'ryu',      name: 'Ryu Garlic',   no: 'No.04', tag: 'DARK DEPTH',       line: 'Aged black garlic. Rich umami.',     note: 'Molasses-deep, with a whisper of sweet heat.',        bg: '#1A1A1A', ink: '#F5C842', sub: 'rgba(245,200,66,0.70)',  img: 'uploads/upload-ryu-v3.png' },
  ];
  const panelCount = items.length;
  // Shift by (panels-1) * 100vw
  const shift = progress * (panelCount - 1) * 100;

  // Interpolate background color across slides
  const activeIdx = Math.min(panelCount - 1, Math.round(progress * (panelCount - 1)));
  const active = items[activeIdx];

  return (
    <section id="range" ref={wrap} style={{ position: 'relative', height: `${panelCount * 100}vh`, background: active.bg, transition: 'background 0.6s cubic-bezier(.2,.7,.2,1)', color: active.ink, scrollMarginTop: 80 }}>
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
                  <img src={it.img} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.45))' }} />
                </div>
              </div>
              {/* Side copy */}
              <div style={{ flex: '1 1 46%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 40, position: 'relative', zIndex: 2 }}>
                <div className="mono" style={{ color: it.sub, opacity: 1, marginBottom: 16, letterSpacing: '0.15em' }}>{it.no} · {it.tag}</div>
                <div className="display" style={{ fontSize: 'clamp(72px, 9vw, 160px)', lineHeight: 0.92, color: it.ink }}>
                  {it.name}.
                </div>
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
    </section>);

}

// ——————————————————————————— Pour shot + Comparison
function PourAndCompare({ flavor = 'original' }) {
  return (
    <section id="pour" style={{ background: 'var(--paper)', padding: '140px 28px', scrollMarginTop: 80 }}>
      {/* Pour shot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', maxWidth: 1400, margin: '0 auto' }}>
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
              {[{ k: 'Bottle', v: '7 oz', num: true }, { k: 'Servings', v: '≈11', num: true }, { k: 'MSG', v: 'None' }].map((s) => {
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
          <div style={{ position: 'relative', height: 560, display: 'flex', justifyContent: 'center' }}>
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
      <div style={{ marginTop: 180, maxWidth: 1100, margin: '180px auto 0' }}>
        <Reveal><div className="mono" style={{ color: 'var(--muted)', marginBottom: 16 }}>Index 05 — Quiet Flex</div></Reveal>
        <Reveal delay={1}>
          <h2 className="display section-h2" style={{ margin: '0 0 56px' }}>
            Not better.<br />
            <span style={{ color: 'var(--muted)' }}>Just different.</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <div style={{ border: '1px solid var(--line)' }}>
            {[
            ['Attribute', 'NoodleBomb', 'Regular soy', 'Hot sauce'],
            ['Flavor depth', '5-note umami', 'Salt-forward', 'Heat-forward'],
            ['Finish', 'Long, rounded', 'Short', 'Lingering burn'],
            ['Versatility', 'Ramen → wings → rice', 'Asian dishes', 'Specific uses'],
            ['MSG / fillers', 'None', 'Varies', 'Varies'],
            ['Made', 'Small batch, USA', 'Industrial', 'Industrial']].
            map((row, i) =>
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
              padding: '20px 24px',
              borderTop: i ? '1px solid var(--line)' : 'none',
              background: i === 0 ? 'transparent' : 'transparent',
              alignItems: 'center'
            }}>
                {row.map((cell, j) =>
              <div key={j} style={{
                fontFamily: i === 0 ? 'JetBrains Mono' : 'Inter Tight',
                fontSize: i === 0 ? 11 : 18,
                textTransform: i === 0 ? 'uppercase' : 'none',
                letterSpacing: i === 0 ? '0.08em' : '-0.015em',
                color: i === 0 ? 'var(--muted)' : j === 1 ? 'var(--ink)' : 'var(--muted)',
                fontWeight: j === 1 && i > 0 ? 600 : 400
              }}>
                    {cell}
                    {j === 1 && i > 0 && <span className="accent-fg" style={{ marginLeft: 8 }}>●</span>}
                  </div>
              )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>);

}

// ——————————————————————————— Origin (founder story)
function Origin() {
  return (
    <section id="origin" style={{ background: 'var(--paper)', padding: 'clamp(96px, 14vw, 160px) 28px', borderTop: '1px solid var(--line)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 48 }} className="origin-grid">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(32px, 6vw, 96px)', alignItems: 'start' }}>
          {/* LEFT — founder photograph */}
          <div style={{ position: 'relative', aspectRatio: '4 / 5', background: '#14110E', overflow: 'hidden' }}>
            <img src="uploads/lifestyle-founder-origin.png" alt="The founder pouring sauce over a bowl of noodles in a low-lit kitchen"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,7,6,0) 55%, rgba(8,7,6,0.55) 100%)', pointerEvents: 'none' }} />
            <span className="mono" style={{ position: 'absolute', bottom: 20, left: 20, color: 'var(--paper)', opacity: 0.7 }}>Portland, OR · small batch</span>
          </div>

          {/* RIGHT — story */}
          <div style={{ paddingLeft: 'clamp(0px, 2vw, 80px)' }}>
            <Reveal>
              <div className="mono" style={{ color: 'var(--muted)', marginBottom: 24 }}>Index 06 — The Origin</div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="serif" style={{ fontWeight: 500, fontSize: 'clamp(36px, 5.2vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 40px', color: 'var(--ink)' }}>
                Started after one bad<br />bowl of ramen.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <div style={{ maxWidth: '52ch', color: 'var(--ink)', opacity: 0.8 }}>
                <p style={{ fontFamily: 'Inter', fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: 1.6, letterSpacing: '-0.01em', margin: '0 0 20px' }}>
                  In 2023, on a cold Tuesday in Portland, I made instant ramen from a packet and knew I could do better. Not fancier. Better. The broth was thin, the seasoning was flat, and the whole thing tasted like it had been designed by a spreadsheet.
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: 1.6, letterSpacing: '-0.01em', margin: '0 0 20px' }}>
                  So I spent the next eighteen months in my kitchen testing soy, sesame, garlic, and chili in every ratio I could think of. I kept five ingredients. I threw out forty. What came out the other side is what's in the bottle — a ramen sauce that makes a packet of noodles taste like a shop you'd fly to.
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: 1.6, letterSpacing: '-0.01em', margin: 0 }}>
                  We still make it in small batches, here in the Pacific Northwest. No MSG, no fillers, no apologies. If you find something better, I want to know about it.
                </p>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div style={{ marginTop: 40 }}>
                <div className="serif" style={{ fontStyle: 'italic', fontSize: 20, color: 'var(--ink)' }}>— the founder</div>
                <div className="mono" style={{ marginTop: 10, color: 'var(--muted)' }}>Small Batch · Portland, OR</div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>);

}

// ——————————————————————————— Testimonials (real brand voice)
function Testimonials() {
  const quotes = [
  { body: 'Noodle Bomb is a flavor explosion. The richness paired with the perfect spicy kick makes every bowl unforgettable. A total must-have for noodle lovers.', name: 'Ashley', tag: 'verified buyer' },
  { body: 'I wasn’t expecting this much punch from one sauce. Took my plain store-bought ramen and made it restaurant-worthy in seconds. I’m officially hooked.', name: 'Marcus', tag: 'verified buyer' },
  { body: 'Perfect balance of garlic, heat, and umami. It seriously upgrades any ramen.', name: 'Priya', tag: 'verified buyer' }];

  return (
    <section id="reviews" style={{ background: 'var(--paper)', padding: '140px 28px', borderTop: '1px solid var(--line)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 56 }}>
            <span className="mono" style={{ color: 'var(--muted)' }}>Index 07 — What They’re Saying</span>
            <span className="mono" style={{ color: 'var(--muted)' }}>★ ★ ★ ★ ★ · 4.9 avg</span>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {quotes.map((q, i) =>
          <Reveal key={i} delay={i + 1}>
              <div style={{ background: 'var(--paper-2)', padding: 32, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280 }}>
                <div className="accent-fg display" style={{ fontSize: 48, lineHeight: 0.6, marginBottom: 16 }}>"</div>
                <div style={{ fontFamily: 'Inter Tight', fontSize: 20, lineHeight: 1.35, letterSpacing: '-0.01em' }}>{q.body}</div>
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'Inter Tight', fontWeight: 600, fontSize: 14 }}>— {q.name}</div>
                  <div className="mono" style={{ color: 'var(--muted)' }}>{q.tag}</div>
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
  return (
    <section id="lineup" style={{ background: 'var(--paper-2)', padding: '140px clamp(24px, 5.5vw, 80px)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <Reveal><div className="mono" style={{ color: 'var(--muted)', marginBottom: 16 }}>Index 08 — The Lineup</div></Reveal>
        <Reveal delay={1}>
          <h2 className="display section-h2" style={{ margin: '0 0 60px', maxWidth: 900 }}>
            Three sauces.<br /><span style={{ color: 'var(--muted)' }}>Pick one. Or don’t.</span>
          </h2>
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
                    background: active ? 'var(--paper-2)' : 'transparent',
                    padding: 32,
                    cursor: 'pointer',
                    transition: 'transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s, background .4s',
                    transform: active ? 'translateY(-4px)' : 'none',
                    boxShadow: active ? '0 24px 60px rgba(0,0,0,0.35)' : 'none'
                  }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <span className="mono" style={{ color: 'var(--ink-40)' }}>{f.tag}</span>
                    <div style={{ width: 8, height: 8, borderRadius: 999, background: f.color, opacity: active ? 1 : 0.35, transition: 'opacity .3s' }} />
                  </div>
                  <div style={{ height: 340, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 200, height: '100%' }}>
                      <Bottle flavor={f.tag} accent={f.color} src={FLAVOR_IMAGES[k]} />
                    </div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <div className="display" style={{ fontSize: 32, letterSpacing: '-0.04em', fontWeight: 700 }}>{f.name}.</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--ink-60)', marginTop: 8, lineHeight: 1.5 }}>{f.line1} {f.line2}</div>
                  </div>
                  <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                    <div className="serif" style={{ fontSize: 22, marginBottom: 14, fontStyle: 'italic' }}>{f.price}</div>
                    <a className="tlink" href={wixFor(f.key)} target="_blank" rel="noopener" style={{ background: 'none', border: 0, padding: 0, color: 'var(--ink)', cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
                      {active ? 'Selected' : 'Add to cart'}<span className="arrow">→</span>
                    </a>
                  </div>
                </div>
              </Reveal>);

          })}
        </div>

        {/* Trio cta — editorial bundle moment */}
        <Reveal delay={4}>
          <div style={{
            marginTop: 28,
            background: 'var(--paper-2)',
            borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
            display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', alignItems: 'stretch',
            minHeight: 420
          }}>
            {/* Photo */}
            <div style={{ position: 'relative', overflow: 'hidden', background: '#14110E' }}>
              <img src="uploads/lifestyle-woman-3pack.png" alt="A woman pouring NoodleBomb Original over a bowl of noodles, three bottles on the counter"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,7,6,0) 60%, rgba(22,19,16,0.35) 100%)', pointerEvents: 'none' }} />
            </div>
            {/* Copy */}
            <div style={{ padding: 'clamp(32px, 4vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
              <span className="mono" style={{ color: 'var(--muted)' }}>bundle · save $7</span>
              <div className="display" style={{ fontSize: 'clamp(36px, 4vw, 52px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}>
                The 3-Pack Variety<br />
                <span style={{ color: 'var(--muted)' }}>— $25.</span>
              </div>
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
                    letterSpacing: '-0.005em'
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', display: 'inline-block', boxShadow: '0 0 0 2px rgba(139,30,30,0.18)' }} />
                    {label}
                  </span>
                ))}
              </div>

              {/* Microline */}
              <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.14em', marginTop: -4 }}>
                SHIPS FREE · ARRIVES IN 3–5 DAYS · 1,200+ SOLD THIS MONTH
              </div>

              <div style={{ marginTop: 8 }}>
                <button className="btn" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', padding: '16px 26px', fontWeight: 600, borderRadius: 4, cursor: 'pointer', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em', transition: 'transform .2s, filter .2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.08)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none'; }}>Add variety pack →</button>
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
      <section id="cta" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', transition: 'background .6s, color .6s', padding: '128px 28px 96px', textAlign: 'center', position: 'relative', overflow: 'hidden', scrollMarginTop: 80 }}>
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
            <div style={{ marginTop: 48, display: 'inline-flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a className="btn" href={WIX_URLS.shop} target="_blank" rel="noopener" style={{ background: 'var(--accent-ink)', color: 'var(--accent)', padding: '18px 32px', fontWeight: 600, border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'Inter', fontSize: 15, letterSpacing: '-0.005em', transition: 'transform .2s, box-shadow .2s', textDecoration: 'none', display: 'inline-block' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>Shop all — from $9.50</a>
              <a href="#" className="ask-secondary" style={{ color: 'var(--accent-ink)', fontFamily: 'Inter', fontSize: 14, fontWeight: 500, opacity: 0.85, textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: 2, transition: 'border-color .2s, opacity .2s' }} onMouseOver={(e) => { e.currentTarget.style.borderBottomColor = 'var(--accent-ink)'; e.currentTarget.style.opacity = 1; }} onMouseOut={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.opacity = 0.85; }}>Join the waitlist →</a>
            </div>
          </Reveal>

          {/* Trust line */}
          <Reveal delay={4}>
            <div className="mono" style={{ marginTop: 36, fontSize: 11, letterSpacing: '0.18em', opacity: 0.7 }}>
              NO MSG · NO FILLERS · MADE IN PORTLAND · FREE SHIPPING AT $25
            </div>
          </Reveal>
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: 28, zIndex: 1 }}>
          <span className="mono" style={{ opacity: 0.65 }}>small-batch · made in the USA</span>
        </div>
        <div style={{ position: 'absolute', bottom: 24, right: 28, zIndex: 1 }}>
          <span className="mono" style={{ opacity: 0.65 }}>pacific northwest · est. 2024</span>
        </div>
      </section>

      {/* Marquee — animated infinite scroller */}
      <div className="marq-wrap" style={{ padding: '32px 0', background: '#080706', color: 'var(--ink)', overflow: 'hidden', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', transform: 'skewY(-2deg)', margin: '0 -2vw' }}>
        <div className="marq-track">
          {Array.from({ length: 2 }).map((_, j) =>
          <React.Fragment key={j}>
              {['SMALL BATCH', '•', 'NO MSG', '•', 'NO FILLERS', '•', 'POUR IT ON EVERYTHING', '•', 'MADE IN PORTLAND', '•'].map((s, i) =>
            <span key={i} className="display" style={{ fontSize: 96, letterSpacing: '-0.05em', color: 'var(--ink)', opacity: 0.18 }}>{s}</span>
            )}
            </React.Fragment>
          )}
        </div>
      </div>

      <footer style={{ background: '#080706', color: 'var(--ink)', padding: '80px 28px 40px' }}>
        {/* Newsletter capture */}
        <div style={{ maxWidth: 1440, margin: '0 auto 48px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.05, fontWeight: 600 }}>
              Sauce drops, restock alerts, the occasional recipe.
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--ink-60)', marginTop: 10 }}>
              Once a month. Never spam.
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 0, border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden', background: '#100E0C' }}>
            <input type="email" placeholder="your@email.com" required
              style={{ flex: 1, minWidth: 0, padding: '16px 18px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em' }} />
            <button type="submit" className="btn" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', padding: '0 28px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em', transition: 'filter .2s' }} onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.08)'} onMouseOut={(e) => e.currentTarget.style.filter = 'none'}>Subscribe</button>
          </form>
        </div>
        <div style={{ borderTop: '1px solid var(--line)', maxWidth: 1440, margin: '0 auto 56px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 64, maxWidth: 1440, margin: '0 auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-ink)', fontFamily: 'Inter Tight', fontWeight: 800, fontSize: 12 }}>N</div>
              <span className="display" style={{ fontSize: 18, letterSpacing: '-0.04em', fontWeight: 700 }}>noodlebomb</span>
            </div>
            <p style={{ maxWidth: 320, color: 'var(--ink-60)', fontSize: 13, lineHeight: 1.6 }}>
              Bold ramen sauce crafted in the Pacific Northwest. Small-batch bottled with real ingredients — no MSG, no fillers, no apologies.
            </p>
          </div>
          {[
          ['Shop', [['Original', '#lineup'], ['Citrus Shoyu', '#lineup'], ['Spicy Tokyo', '#lineup'], ['Variety 3-pack', '#lineup'], ['Monthly Box', '#monthly'], ['The Next Drop →', '#next-drop']]],
          ['Learn', [['Ingredients', '#ingredients'], ['The Range', '#range'], ['The Pour', '#pour'], ['Origin', '#origin'], ['Monthly Box', '#monthly']]],
          ['Company', [['About', '#origin'], ['Reviews', '#reviews'], ['Wholesale', '#cta'], ['Contact', '#cta']]]].
          map(([h, items]) =>
          <div key={h}>
              <div className="mono" style={{ marginBottom: 20 }}>{h}</div>
              {items.map(([label, href]) => (
                <a key={label} href={href}
                   onClick={(e) => { e.preventDefault(); const el = document.querySelector(href); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                   style={{ display: 'block', fontSize: 13, padding: '6px 0', color: 'var(--ink)', opacity: 0.85, cursor: 'pointer', transition: 'opacity .2s, transform .2s', textDecoration: 'none' }}
                   onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateX(3px)'; }}
                   onMouseOut={(e) => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.transform = 'translateX(0)'; }}>{label}</a>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 80, paddingTop: 28, borderTop: '1px solid var(--line)', maxWidth: 1440, marginLeft: 'auto', marginRight: 'auto', gap: 24, flexWrap: 'wrap' }}>
          <span className="mono">© 2026 noodlebomb co. all rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <span className="mono">pour responsibly.</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mono" style={{ background: 'none', border: 'none', color: 'var(--ink)', opacity: 0.7, cursor: 'pointer', padding: 0, transition: 'opacity .2s', display: 'inline-flex', alignItems: 'center', gap: 6 }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}>
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
  const set = (patch) => {
    setState((s) => {
      const next = { ...s, ...patch };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
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

  // Edit mode messaging
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const headline = (state.headline || '').replace(/\\n/g, '\n');

  return (
    <>
      {state.spam && <div className="spam-banner">⚡ LIMITED TIME!!! 50% OFF — HURRY — ONLY 3 LEFT!!! ⚡</div>}
      <Nav flavor={state.flavor} setFlavor={(k) => set({ flavor: k })} flavors={FLAVORS} />
      <Hero headline={headline} bottleSrc={FLAVOR_IMAGES[state.flavor]} />
      <FlavorBreakdown flavor={state.flavor} />
      <UseItOn />
      <PourAndCompare flavor={state.flavor} />
      <Origin />
      <Testimonials />
      <FlavorPicker flavor={state.flavor} setFlavor={(k) => set({ flavor: k })} />
      <NextDrop />
      <MonthlyDrop />
      <FinalCTA />
      <Tweaks state={state} set={set} open={tweaksOpen} setOpen={setTweaksOpen} />
    </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);