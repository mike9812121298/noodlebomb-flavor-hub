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

        fontFamily: '"Inter Tight", system-ui, sans-serif',

        fontStyle: 'normal',

        fontWeight: 900,

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

                RAMEN NIGHT CLUB

              </div>

            </Reveal>



            <Reveal delay={1}>

              <a className="md-photo-card" href="/monthly-box" aria-label="Subscribe to the Monthly Ramen Box" style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>

                <img

                  src="uploads/monthly-noodle-club-2026-05-08-web.webp"

                  alt="NoodleBomb Monthly Ramen Box with noodles, sauce, and ramen-night extras"

                  loading="lazy"

                />

                <div className="md-photo-badge">Monthly Ramen Box</div>

                <div className="md-photo-glow" aria-hidden="true" />

              </a>

            </Reveal>



          </div>



          {/* RIGHT — the pitch */}

          <div>

            <Reveal>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>

                <span className="mono" style={{ color: 'var(--muted)', letterSpacing: '0.18em', fontSize: 11 }}>RAMEN NIGHT CLUB</span>

              </div>

            </Reveal>



            <Reveal delay={1}>

              <h2 className="display" style={{

                fontFamily: '"Inter Tight", system-ui, sans-serif',

                fontWeight: 800,

                fontStyle: 'normal',

                fontSize: 'clamp(48px, 6vw, 90px)',

                lineHeight: 0.94,

                letterSpacing: '-0.055em',

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

                A ramen-night club built around NoodleBomb sauce: premium instant ramen, surprise extras, quick recipe ideas, and a free full bottle of sauce every month.

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

              <div className="mono" style={{ color: 'var(--accent)', fontSize: 11, letterSpacing: '0.22em', fontWeight: 600, marginBottom: 12 }}>RAMEN NIGHT CLUB</div>

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

              <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--ink-40)', marginTop: 6, marginBottom: 28 }}>Paid monthly subscription. Every club box includes a free full bottle of sauce.</div>

            </Reveal>



            {/* Monthly Ramen Box subscription links; Ramen Night Club is the theme. */}

            <Reveal delay={5}>

              <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, flexWrap: 'wrap', marginBottom: 32, maxWidth: 620 }}>

                <a

                  href="https://nu2vqa-ma.myshopify.com/cart/add?id=54099648545078&quantity=1&selling_plan=8721727798"

                  target="_blank"

                  rel="noopener"

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

                  href="https://nu2vqa-ma.myshopify.com/cart/add?id=54099648577846&quantity=1&selling_plan=8721695030"

                  target="_blank"

                  rel="noopener"

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



          </div>

        </div>

      </div>

    </section>

  );

}



Object.assign(window, { MonthlyDrop });
