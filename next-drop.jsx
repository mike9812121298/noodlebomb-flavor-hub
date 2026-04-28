// ——————————————————————————— THE NEXT DROP — Index 09
// Two upcoming flavors, presented as numbered, almost-here objects.
// Restraint over hype. Apple keynote × SNKRS drop × A24 release poster.

function NextDrop() {
  const cards = [
    {
      key: 'ryu',
      bigNum: '04',
      accent: '#d4a24a',           // amber
      rim: '#f4d089',
      status: 'COMING SOON · SUMMER 2026',
      eyebrow: 'VOL.04 · EST. SUMMER 2026',
      name: 'Ryu Garlic',
      oneliner: 'Aged black garlic, molasses-deep, slow burn.',
      pills: ['Umami', 'Smoky', 'Sweet finish'],
      progress: 3, // out of 4
      img: 'uploads/nb-ryu-garlic-clean.png',
    },
    {
      key: 'shoyu',
      bigNum: '05',
      accent: '#ebe7dd',           // parchment
      rim: '#e8f0ff',              // cool cyan-white rim
      status: 'COMING SOON · FALL 2026',
      eyebrow: 'VOL.05 · EST. FALL 2026',
      name: 'Shoyu Reserve',
      oneliner: 'Single-origin shoyu. Barrel-aged. Quietly devastating.',
      pills: ['Saline', 'Round', 'Long finish'],
      progress: 2,
      img: 'uploads/nb-original-clean.png', // placeholder silhouette — applied via CSS filter (frosted/desaturated) so it doesn't read as Original. Real Shoyu Reserve render TBD.
      placeholderFilter: 'grayscale(0.95) brightness(0.5) contrast(1.2) blur(0.6px)',
      placeholderOpacity: 0.65,
      altOverride: 'Shoyu Reserve — Coming Fall 2026',
    },
  ];

  const stages = ['Recipe', 'Sourcing', 'Sampling', 'Packaging'];

  // Build the rail text — repeated enough that one copy is wider than the rail
  const railSeg = 'DEVELOPMENT · SAMPLING · SOON · ';
  const railText = railSeg.repeat(20);

  return (
    <section id="next-drop">
      <div className="nd-grain" aria-hidden="true" />

      {/* Vertical rail (left margin) */}
      <div className="nd-rail" aria-hidden="true">
        <div className="nd-rail-track">{railText}{railText}</div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        {/* Eyebrow row */}
        <Reveal>
          <div className="nd-eyebrow-row">
            <span>INDEX 09 — THE NEXT DROP</span>
            <span>2 / IN DEVELOPMENT</span>
          </div>
        </Reveal>
        <div className="nd-divider" />

        {/* Headline */}
        <div style={{ marginTop: 80 }}>
          <Reveal delay={1}>
            <h2 className="nd-headline serif" style={{ fontFamily: 'Fraunces, "Cormorant Garamond", serif', fontWeight: 400, fontStyle: 'normal', letterSpacing: '-0.025em' }}>
              Two more on the way.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="nd-sub">
              We don’t ship until it’s right. These two are close. Drop your email and you’ll be first when they land.
            </p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="nd-cards">
          {cards.map((c, idx) => (
            <Reveal key={c.key} delay={idx + 2}>
              <div
                className="nd-card"
                style={{ '--nd-accent': c.accent, '--nd-rim': c.rim }}
              >
                {/* Giant outlined numeral behind */}
                <div className="nd-bignum" aria-hidden="true">{c.bigNum}</div>

                {/* Status pill */}
                <div className="nd-status">
                  <span className="dot" />
                  {c.status}
                </div>

                {/* Bottle silhouette */}
                <div className="nd-bottle-stage">
                  <div className="nd-bottle-wrap">
                    <img
                      src={c.img}
                      alt={c.altOverride || `NoodleBomb ${c.name} ramen sauce bottle preview`}
                      loading="lazy"
                      style={c.placeholderFilter ? { filter: c.placeholderFilter, opacity: c.placeholderOpacity ?? 1 } : undefined}
                    />
                    <div className="nd-rim" aria-hidden="true" />
                  </div>
                </div>

                {/* Copy */}
                <div className="nd-eyebrow">{c.eyebrow}</div>
                <h3 className="nd-name">{c.name}</h3>
                <p className="nd-oneliner">{c.oneliner}</p>
                <div className="nd-pills">
                  {c.pills.map((p) => (
                    <span key={p} className="nd-pill">
                      <span className="pdot" />
                      {p}
                    </span>
                  ))}
                </div>

                {/* Progress strip */}
                <div className="nd-progress">
                  <div className="nd-progress-head">
                    <span>DEVELOPMENT</span>
                    <span>{c.progress} / 4</span>
                  </div>
                  <div className="nd-progress-bars">
                    {stages.map((_, i) => (
                      <div key={i} className={`nd-bar ${i < c.progress ? 'on' : ''}`} />
                    ))}
                  </div>
                  <div className="nd-progress-labels">
                    {stages.map((s, i) => (
                      <span key={s} className={i < c.progress ? 'on' : ''}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className="nd-notify-caption">Notify me when this drops →</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Notify bar */}
        <Reveal delay={4}>
          <div className="nd-notify">
            <div className="nd-notify-label">
              <span className="nd-pulse" />
              BE FIRST IN LINE
            </div>
            <form className="nd-form" action="https://formsubmit.co/hello@noodlebomb.co" method="POST">
              <input type="hidden" name="_subject" value="NoodleBomb — Notify Me (Next Drop)" />
              <input type="hidden" name="_template" value="table" />
              <input
                className="nd-input"
                type="email"
                name="email"
                placeholder="your@email.com"
                aria-label="Email address"
                required
              />
              <button type="submit" className="nd-submit">Notify me →</button>
            </form>
            <div className="nd-microcopy">~600 people on the list. No spam. One email when they ship.</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Expose globally so app.jsx can render <NextDrop />
window.NextDrop = NextDrop;
