// ——————————————————————————— Monthly Drop — limited-edition box subscription
function MonthlyDrop() {
  return (
    <section id="monthly" style={{
      background: '#0E0B09',
      color: 'var(--ink)',
      padding: 'clamp(96px, 12vw, 160px) clamp(28px, 5.5vw, 80px)',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      scrollMarginTop: 80
    }}>
      {/* Warm spotlight */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '90%', height: '120%',
        background: 'radial-gradient(ellipse at center top, rgba(217,164,90,0.10) 0%, rgba(139,30,30,0.04) 35%, transparent 65%)',
        pointerEvents: 'none'
      }} />
      {/* Film grain */}
      <div className="md-grain" aria-hidden="true" />

      {/* Giant italic 04 watermark */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '-3vw', bottom: '-8vw',
        fontFamily: 'Fraunces, "Cormorant Garamond", serif',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 'clamp(360px, 42vw, 720px)',
        lineHeight: 1,
        color: 'rgba(245,241,234,0.035)',
        letterSpacing: '-0.05em',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>04</div>

      {/* Vertical side rail */}
      <div aria-hidden="true" className="mono" style={{
        position: 'absolute',
        left: 18, top: '50%',
        transform: 'rotate(-90deg) translateX(50%)',
        transformOrigin: 'left center',
        whiteSpace: 'nowrap',
        fontSize: 10,
        letterSpacing: '0.3em',
        color: 'var(--muted)',
        opacity: 0.55,
        pointerEvents: 'none'
      }}>
        SUBSCRIBE · SHIP · SLURP · REPEAT · SUBSCRIBE · SHIP · SLURP · REPEAT
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(48px, 6vw, 96px)', alignItems: 'center' }} className="md-grid">
          {/* LEFT — the box */}
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--muted)', marginBottom: 32, letterSpacing: '0.18em', fontSize: 11 }}>
                VOL.04 — MAY 2026 DROP
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="md-stage">
                <div className="md-box-shadow" />
                <div className="md-box">
                  {/* Box top face */}
                  <div className="md-box-top">
                    {/* Kraft texture noise */}
                    <div className="md-kraft" />
                    {/* Folded flap divider */}
                    <div className="md-flap-line" />
                    {/* Wax seal */}
                    <div className="md-seal">
                      <div className="md-seal-inner">
                        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 28, color: '#F5C842', letterSpacing: '-0.04em', transform: 'translateY(-1px)' }}>N</span>
                      </div>
                      <svg className="md-seal-drips" viewBox="0 0 100 100" aria-hidden="true">
                        <path d="M 22 28 Q 18 38 24 46 Q 28 38 22 28 Z" fill="#7A1A1A" />
                        <path d="M 78 70 Q 84 78 80 88 Q 74 80 78 70 Z" fill="#7A1A1A" />
                        <path d="M 88 30 Q 94 36 90 44 Q 84 38 88 30 Z" fill="#7A1A1A" />
                      </svg>
                    </div>
                    {/* Embossed wordmark */}
                    <div className="md-wordmark">noodlebomb</div>
                    <div className="md-wordmark-sub">— monthly · vol.04 —</div>
                  </div>
                  {/* Box front face (depth) */}
                  <div className="md-box-front" />
                  {/* Box right face (depth) */}
                  <div className="md-box-right" />
                </div>
              </div>
            </Reveal>

            {/* What's inside thumbnails */}
            <Reveal delay={2}>
              <div className="mono" style={{ color: 'var(--muted)', marginTop: 32, marginBottom: 18, letterSpacing: '0.18em', fontSize: 11 }}>
                WHAT'S INSIDE
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="md-inside-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
                {[
                  {
                    label: 'Spicy Tokyo', sub: 'sauce',
                    bg: 'radial-gradient(circle at 32% 28%, #D14B2E 0%, #8B1E1E 55%, #4A0F0F 100%)',
                    pattern: null,
                    icon: (
                      <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="rgba(255,220,200,0.85)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 6c2 1 3 3 3 5c4 1 8 4 9 9c0 4-3 6-7 6c-5 0-9-3-10-7c-1-3 0-7 3-9c1-1 1-3 2-4Z" fill="rgba(255,210,180,0.18)" />
                        <path d="M11 6c1-1 1-2 2-3" />
                      </svg>
                    )
                  },
                  {
                    label: 'Hakata noodles', sub: 'pack',
                    bg: 'radial-gradient(circle at 30% 30%, #F0E2C2 0%, #C9B284 60%, #9C8559 100%)',
                    pattern: (
                      <svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="none" style={{ position:'absolute', inset:0, opacity: 0.55, mixBlendMode: 'multiply' }}>
                        <path d="M2 18 Q 16 10, 32 18 T 62 18" fill="none" stroke="rgba(80,55,30,0.55)" strokeWidth="0.9" />
                        <path d="M2 28 Q 16 20, 32 28 T 62 28" fill="none" stroke="rgba(80,55,30,0.45)" strokeWidth="0.9" />
                        <path d="M2 38 Q 16 30, 32 38 T 62 38" fill="none" stroke="rgba(80,55,30,0.55)" strokeWidth="0.9" />
                        <path d="M2 48 Q 16 40, 32 48 T 62 48" fill="none" stroke="rgba(80,55,30,0.4)" strokeWidth="0.9" />
                      </svg>
                    ),
                    icon: null
                  },
                  {
                    label: 'Chili crisp', sub: 'topping',
                    bg: 'radial-gradient(circle at 30% 30%, #E2641A 0%, #A8390C 55%, #4A1A0A 100%)',
                    pattern: (
                      <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
                        {[[14,16],[42,12],[24,30],[48,36],[18,46],[36,52],[52,22],[10,32],[30,42],[44,48],[22,20],[38,26]].map(([x,y],i)=>(
                          <circle key={i} cx={x} cy={y} r={1.1+(i%3)*0.4} fill="rgba(40,15,5,0.65)" />
                        ))}
                        {[[20,24],[34,18],[46,40],[14,40],[40,32]].map(([x,y],i)=>(
                          <circle key={'g'+i} cx={x} cy={y} r="0.8" fill="rgba(255,210,140,0.7)" />
                        ))}
                      </svg>
                    ),
                    icon: null
                  },
                  {
                    label: 'Recipe zine', sub: 'card',
                    bg: 'linear-gradient(135deg, #F5EBD3 0%, #E2D0A8 100%)',
                    pattern: (
                      <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
                        {/* Folded corner */}
                        <path d="M 48 14 L 56 14 L 56 22 Z" fill="rgba(180,150,100,0.55)" />
                        <path d="M 48 14 L 56 22" stroke="rgba(80,55,30,0.5)" strokeWidth="0.8" fill="none" />
                        {/* Text lines */}
                        <line x1="14" y1="28" x2="44" y2="28" stroke="rgba(80,55,30,0.45)" strokeWidth="0.8" />
                        <line x1="14" y1="34" x2="50" y2="34" stroke="rgba(80,55,30,0.45)" strokeWidth="0.8" />
                        <line x1="14" y1="40" x2="38" y2="40" stroke="rgba(80,55,30,0.45)" strokeWidth="0.8" />
                        <line x1="14" y1="46" x2="46" y2="46" stroke="rgba(80,55,30,0.45)" strokeWidth="0.8" />
                      </svg>
                    ),
                    icon: null
                  }
                ].map((item, i) => (
                  <div key={i} className="md-thumb-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div className="md-thumb" style={{
                      width: 64, height: 64, borderRadius: 999,
                      background: item.bg,
                      border: '1px solid rgba(245,241,234,0.12)',
                      boxShadow: 'inset 0 -8px 16px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', overflow: 'hidden',
                      transition: 'transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s'
                    }}>
                      {item.pattern}
                      {item.icon && <div style={{ position:'relative', zIndex:1, display:'flex' }}>{item.icon}</div>}
                    </div>
                    <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.005em' }}>{item.label}</div>
                      <div className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.18em', marginTop: 2 }}>{item.sub.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — the pitch */}
          <div>
            <Reveal>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
                <span className="mono" style={{ color: 'var(--muted)', letterSpacing: '0.18em', fontSize: 11 }}>INDEX 10 — THE MONTHLY DROP</span>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h2 className="display" style={{
                fontFamily: 'Fraunces, "Cormorant Garamond", serif',
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: 'clamp(44px, 5.4vw, 84px)',
                lineHeight: 1.0,
                letterSpacing: '-0.025em',
                margin: '0 0 28px',
                color: 'var(--ink)'
              }}>
                A new ramen ritual.<br />
                <span style={{ color: 'var(--muted)' }}>Every month.</span>
              </h2>
            </Reveal>

            <Reveal delay={2}>
              <p style={{
                fontFamily: 'Inter',
                fontSize: 'clamp(15px, 1.05vw, 17px)',
                lineHeight: 1.65,
                color: 'var(--ink-60)',
                letterSpacing: '-0.005em',
                maxWidth: '52ch',
                margin: '0 0 32px'
              }}>
                One curated box. One sauce of the month, two noodle styles, a seasonal topping, and a recipe zine — designed by the founder, shipped on the first Friday of every month. Cancel any time.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Limited to 500 boxes per drop',
                  'New flavor pairing every month',
                  'Free shipping in the US'
                ].map((line, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Inter', fontSize: 14, color: 'var(--ink)', letterSpacing: '-0.005em' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--accent)', flexShrink: 0, boxShadow: '0 0 0 3px rgba(139,30,30,0.22)' }} />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Pricing block */}
            <Reveal delay={4}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 28, flexWrap: 'wrap' }}>
                <span className="display" style={{ fontSize: 'clamp(48px, 5vw, 72px)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--ink)' }}>
                  $29.99<span style={{ fontSize: '0.45em', color: 'var(--muted)', fontWeight: 400, marginLeft: 4 }}>/ mo</span>
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'var(--accent)', color: 'var(--accent-ink)',
                  padding: '5px 11px', borderRadius: 999,
                  fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.18em'
                }}>FREE SHIPPING</span>
              </div>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={5}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 32, flexWrap: 'wrap' }}>
                <button className="btn" style={{
                  background: 'var(--accent)', color: 'var(--accent-ink)',
                  border: 'none', padding: '16px 26px',
                  fontWeight: 600, borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em',
                  transition: 'transform .2s, filter .2s, box-shadow .2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(139,30,30,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  Subscribe — ships May 15
                </button>
              </div>
            </Reveal>

            {/* Counter + progress */}
            <Reveal delay={6}>
              <div style={{ maxWidth: 380 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span>JOINED THIS MONTH: 312 / 500</span>
                  <span style={{ color: 'var(--accent)' }}>GOING FAST</span>
                </div>
                <div style={{ width: '100%', height: 3, background: 'rgba(245,241,234,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '62.4%', height: '100%', background: 'linear-gradient(90deg, var(--accent) 0%, #C8362E 100%)', borderRadius: 999, boxShadow: '0 0 12px rgba(139,30,30,0.6)' }} />
                </div>
              </div>
            </Reveal>

            {/* Past drops row */}
            <Reveal delay={6}>
              <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(245,241,234,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {[
                    { vol: '01', month: 'Dec' },
                    { vol: '02', month: 'Jan' },
                    { vol: '03', month: 'Feb' }
                  ].map((d, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div className="md-past-card" style={{
                        width: 40, height: 40, borderRadius: 4,
                        background: 'linear-gradient(135deg, #B8956A 0%, #8C6A48 100%)',
                        border: '1px solid rgba(0,0,0,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.4)',
                        cursor: 'pointer'
                      }}>
                        {/* Tiny seal */}
                        <div style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 7, height: 7, borderRadius: 999,
                          background: 'radial-gradient(circle at 30% 30%, #C8362E 0%, #7A1A1A 100%)',
                          boxShadow: '0 1px 1px rgba(0,0,0,0.5)'
                        }} />
                        <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 500, fontSize: 16, color: 'rgba(60,40,28,0.7)', letterSpacing: '-0.04em' }}>
                          {d.vol}
                        </div>
                      </div>
                      <div className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.14em' }}>
                        VOL.{d.vol} · {d.month.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { MonthlyDrop });
