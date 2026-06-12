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
        right: 0, bottom: '-8vw',
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
        CURATE - SAUCE - SLURP - REPEAT - CURATE - SAUCE - SLURP - REPEAT
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(48px, 6vw, 96px)', alignItems: 'center' }} className="md-grid">
          {/* LEFT — the box */}
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--muted)', marginBottom: 32, letterSpacing: '0.18em', fontSize: 11 }}>
                MONTHLY BOX - SUBSCRIPTION
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="md-photo-card">
                <img
                  src="uploads/monthly-noodle-club-2026-05-08.png"
                  alt="NoodleBomb Monthly Noodle Club box with noodles, sauces, and surprise extras"
                  loading="lazy"
                />
                <div className="md-photo-badge">Monthly Noodle Club</div>
                <div className="md-photo-glow" aria-hidden="true" />
              </div>
            </Reveal>

            {/* What's inside thumbnails */}
            <Reveal delay={2}>
              <div className="mono" style={{ color: 'var(--muted)', marginTop: 32, marginBottom: 18, letterSpacing: '0.18em', fontSize: 11 }}>
                BUILT LIKE A REAL RAMEN NIGHT
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="md-inside-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
                {[
                  {
                    label: 'NoodleBomb sauce', sub: 'free full bottle',
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
                    label: 'Instant noodles', sub: 'curated',
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
                    label: 'Surprise extras', sub: 'snacks + toppings',
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
                    label: 'Recipe card', sub: 'fast ideas',
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
                <span className="mono" style={{ color: 'var(--muted)', letterSpacing: '0.18em', fontSize: 11 }}>INDEX 10 - MONTHLY RAMEN BOX</span>
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
                A better ramen night,<br />
                <span style={{ color: 'var(--muted)' }}>every month.</span>
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
                A monthly box built around NoodleBomb sauce: premium instant ramen, surprise extras, quick recipe ideas, and a free full bottle of sauce every month.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Choose Monthly for $29.99 or Premium for $39.99',
                  'Built for ramen, rice bowls, wings, eggs, dumplings, and leftovers',
                  'Every box includes a free full 7 oz bottle of sauce',
                  'Billed monthly with skip or cancel anytime'
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
              <div className="mono" style={{ color: 'var(--accent)', fontSize: 11, letterSpacing: '0.22em', fontWeight: 600, marginBottom: 12 }}>MONTHLY RAMEN BOX</div>
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
                }}>PREMIUM $39.99</span>
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--ink-40)', marginTop: 6, marginBottom: 28 }}>Paid monthly subscription. Every box includes a free full bottle of sauce.</div>
            </Reveal>

            {/* Monthly Box subscription links. */}
            <Reveal delay={5}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, flexWrap: 'wrap', marginBottom: 32, maxWidth: 620 }}>
                <a
                  href="/monthly-box"
                  className="btn"
                  style={{
                    background: 'var(--accent)', color: 'var(--accent-ink)',
                    border: 'none', padding: '16px 24px',
                    fontWeight: 600, borderRadius: 4,
                    fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em',
                    textDecoration: 'none',
                    flex: '1 1 220px',
                    textAlign: 'center'
                  }}
                >
                  Subscribe - $29.99/mo
                </a>
                <a
                  href="/monthly-box"
                  className="btn"
                  style={{
                    background: 'rgba(245,241,234,0.04)', color: 'var(--ink)',
                    border: '1px solid rgba(245,241,234,0.18)', padding: '16px 24px',
                    fontWeight: 600, borderRadius: 4,
                    fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em',
                    textDecoration: 'none',
                    flex: '1 1 220px',
                    textAlign: 'center'
                  }}
                >
                  Premium - $39.99/mo
                </a>
                <div className="mono" style={{ flexBasis: '100%', marginTop: 2, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em' }}>
                  PAID MONTHLY - FREE FULL SAUCE BOTTLE INCLUDED
                </div>
              </div>
            </Reveal>

            <Reveal delay={6}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, maxWidth: 520 }}>
                {['$29.99 monthly', '$39.99 premium', 'Free full bottle', 'Cancel anytime'].map((line) => (
                  <span key={line} className="mono" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 34, padding: '0 12px', border: '1px solid rgba(245,241,234,0.14)', borderRadius: 999, color: 'var(--ink)', fontSize: 10, letterSpacing: '0.14em' }}>
                    {line}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Drop timeline — full history with current drop highlighted */}
            <Reveal delay={6}>
              <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(245,241,234,0.08)' }}>
                <div className="mono" style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '0.18em', marginBottom: 14 }}>
                  HOW IT WORKS
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  {[
                    { vol: '01', month: 'PICK', current: false },
                    { vol: '02', month: 'BILL', current: false },
                    { vol: '03', month: 'SHIP', current: false },
                    { vol: '04', month: 'COOK', current: false },
                  ].map((d) => (
                    <div key={d.vol} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 64 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 6,
                        background: d.current
                          ? 'linear-gradient(135deg, var(--accent) 0%, #6F1818 100%)'
                          : 'linear-gradient(135deg, #B8956A 0%, #8C6A48 100%)',
                        border: '1px solid rgba(0,0,0,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: d.current
                          ? '0 0 0 2px rgba(139,30,30,0.35), 0 4px 14px rgba(139,30,30,0.45)'
                          : 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.4)',
                        opacity: d.current ? 1 : 0.85,
                      }}>
                        {d.current && (
                          <span style={{
                            position: 'absolute', top: 5, right: 5,
                            width: 7, height: 7, borderRadius: 999,
                            background: '#F5C842',
                            boxShadow: '0 0 8px rgba(245,200,66,0.85)',
                          }} />
                        )}
                        {!d.current && (
                          <span style={{
                            position: 'absolute', top: 4, right: 4,
                            width: 7, height: 7, borderRadius: 999,
                            background: 'radial-gradient(circle at 30% 30%, #C8362E 0%, #7A1A1A 100%)',
                            boxShadow: '0 1px 1px rgba(0,0,0,0.5)',
                          }} />
                        )}
                        <div style={{
                          fontFamily: 'Fraunces, serif',
                          fontStyle: 'italic',
                          fontWeight: d.current ? 600 : 500,
                          fontSize: d.current ? 18 : 16,
                          color: d.current ? 'var(--accent-ink)' : 'rgba(60,40,28,0.7)',
                          letterSpacing: '-0.04em',
                        }}>
                          {d.vol}
                        </div>
                      </div>
                      <div
                        className={`mono${d.current ? ' accent-fg' : ''}`}
                        style={{ fontSize: 9, letterSpacing: '0.14em', fontWeight: d.current ? 600 : 400, color: d.current ? undefined : 'var(--muted)' }}
                      >
                        VOL.{d.vol} · {d.month}
                      </div>
                      {d.current && (
                        <div className="mono" style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '0.14em' }}>
                          FREE SAUCE INSIDE
                        </div>
                      )}
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
