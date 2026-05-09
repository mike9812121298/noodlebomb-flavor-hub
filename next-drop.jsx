// ——————————————————————————— THE NEXT DROP — Index 09
// Two upcoming flavors, presented as numbered, almost-here objects.
// Restraint over hype. Apple keynote × SNKRS drop × A24 release poster.

function NextDrop() {
  const shoyuCartUrl = '/cart?add=shoyu&qty=1';

  const cards = [
    {
      key: 'shoyu',
      bigNum: '04',
      accent: '#ebe7dd',           // parchment
      rim: '#e8f0ff',              // cool cyan-white rim
      status: 'Paid preorder open — Summer 2026',
      eyebrow: 'VOL. 04 / LIMITED PREORDER',
      name: 'Shoyu Reserve',
      oneliner: 'A bold, glossy shoyu-style sauce with deep soy richness, savory umami, and a long clean finish. Built for rice bowls, ramen, wings, grilled meat, vegetables, and late-night leftovers.',
      pills: ['Darker', 'Glossy', 'Savory', 'Long Finish'],
      progress: 2,
      img: 'uploads/shoyu-reserve-preview-2026-05-08.png',
      altOverride: 'NoodleBomb Shoyu Reserve preview bottle — Coming Summer 2026',
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
            <span>WHAT’S NEXT</span>
            <a className="nd-top-preorder" href={shoyuCartUrl}>PREORDER — $9.99</a>
          </div>
        </Reveal>
        <div className="nd-divider" />

        {/* Headline */}
        <div style={{ marginTop: 80 }}>
          <Reveal delay={1}>
            <h2 className="nd-headline serif" style={{ fontFamily: 'Fraunces, "Cormorant Garamond", serif', fontWeight: 400, fontStyle: 'normal', letterSpacing: '-0.025em' }}>
              Shoyu Reserve is next.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="nd-sub">
              A darker, deeper soy-based finish sauce made for rice, noodles, wings, vegetables, and late-night leftovers.
            </p>
          </Reveal>
          <Reveal delay={2.5}>
            <div className="nd-hero-form nd-buy-row" role="group" aria-label="Shoyu Reserve preorder actions">
              <a className="nd-buy-link" href={shoyuCartUrl}>Preorder for $9.99 &rarr;</a>
              <a className="nd-buy-secondary" href="#shoyu-reserve-details">See flavor details</a>
              <span className="nd-buy-note">Paid preorder open now. Ships Summer 2026.</span>
            </div>
            <p className="nd-preorder-note">You&rsquo;ll be charged today. Your bottle ships when Shoyu Reserve launches in Summer 2026.</p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="nd-cards">
          {cards.map((c, idx) => (
            <Reveal key={c.key} delay={idx + 2}>
              <div
                className="nd-card nd-reserve-card"
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
                  <div className="nd-stage-lines" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="nd-bottle-wrap">
                    <img
                      src={c.img}
                      alt={c.altOverride || `NoodleBomb ${c.name} ramen sauce bottle preview`}
                      loading="lazy"
                      style={c.placeholderFilter ? { filter: c.placeholderFilter, opacity: c.placeholderOpacity ?? 1 } : undefined}
                    />
                    <div className="nd-rim" aria-hidden="true" />
                  </div>
                  <div className="nd-stage-tag">Paid preorder open</div>
                </div>

                {/* Copy */}
                <div className="nd-copy">
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

                <div className="nd-inline-form nd-buy-row" role="group" aria-label="Shoyu Reserve preorder actions">
                  <a className="nd-buy-link" href={shoyuCartUrl}>Preorder for $9.99 &rarr;</a>
                  <a className="nd-buy-secondary" href="#shoyu-reserve-details">What&rsquo;s inside?</a>
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

                <div className="nd-notify-caption">Preorder the first run &rarr;</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={3}>
          <section id="shoyu-reserve-details" className="nd-details" aria-labelledby="shoyu-reserve-details-title">
            <div className="nd-details-kicker">Flavor details</div>
            <h3 id="shoyu-reserve-details-title">What is Shoyu Reserve?</h3>
            <p>
              Shoyu Reserve is NoodleBomb&rsquo;s darker, deeper soy-forward sauce. It&rsquo;s thicker, richer, and more savory than a basic soy sauce, with a glossy finish that clings to food instead of disappearing into the bowl.
            </p>
            <p>
              Use it as a finishing sauce, dipping sauce, marinade boost, or quick flavor upgrade when dinner needs more depth.
            </p>
            <dl className="nd-detail-list">
              <div>
                <dt>Best on:</dt>
                <dd>Rice bowls, ramen, noodles, wings, grilled chicken, steak, vegetables, eggs, dumplings, and leftovers.</dd>
              </div>
              <div>
                <dt>Flavor profile:</dt>
                <dd>Deep soy, roasted umami, mild sweetness, glossy finish, savory depth.</dd>
              </div>
              <div>
                <dt>Preorder notice:</dt>
                <dd>This is a paid preorder. Your card will be charged today. Shoyu Reserve is expected to ship Summer 2026. If the launch date changes, we&rsquo;ll email preorder customers first.</dd>
              </div>
            </dl>
            <a className="nd-buy-link nd-details-cta" href={shoyuCartUrl}>Preorder for $9.99 &rarr;</a>
          </section>
        </Reveal>

      </div>
    </section>
  );
}

// Expose globally so app.jsx can render <NextDrop />
window.NextDrop = NextDrop;
