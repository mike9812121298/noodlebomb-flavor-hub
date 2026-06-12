// THE NEXT DROP - Index 09
// Shoyu Reserve preorder section.

function NextDrop() {
  const shoyuCartUrl = '/cart?add=shoyu&qty=1';

  const cards = [
    {
      key: 'shoyu',
      bigNum: '04',
      accent: '#ebe7dd',
      rim: '#e8f0ff',
      status: 'In stock now - ships in 1-2 days',
      eyebrow: 'VOL. 04 / NOW AVAILABLE',
      name: 'Shoyu Reserve',
      oneliner: 'A bold, glossy shoyu-style sauce with deep soy richness, savory umami, and a long clean finish. Built for rice bowls, ramen, wings, grilled meat, vegetables, and late-night leftovers.',
      pills: ['Darker', 'Glossy', 'Savory', 'Long Finish'],
      progress: 2,
      img: 'uploads/nb-shoyu-reserve-front-cutout-v2-2026-06-07.webp',
      altOverride: 'NoodleBomb Shoyu Reserve soy sauce bottle - in stock now',
    },
  ];

  const stages = ['Recipe', 'Sourcing', 'Sampling', 'Packaging'];

  // Repeated enough that one copy is wider than the vertical rail.
  const railSeg = 'IN STOCK / SLOW-BREWED / POUR BOLD / ';
  const railText = railSeg.repeat(20);

  return (
    <section id="next-drop">
      <div className="nd-grain" aria-hidden="true" />

      <div className="nd-rail" aria-hidden="true">
        <div className="nd-rail-track">{railText}{railText}</div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div className="nd-eyebrow-row">
            <span>WHAT'S NEXT</span>
          </div>
        </Reveal>
        <div className="nd-divider" />

        <div style={{ marginTop: 80 }}>
          <Reveal delay={1}>
            <h2 className="nd-headline serif" style={{ fontFamily: 'Fraunces, "Cormorant Garamond", serif', fontWeight: 400, fontStyle: 'normal', letterSpacing: '-0.025em' }}>
              Shoyu Reserve is here.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="nd-sub">
              A darker, deeper soy-based finish sauce made for rice, noodles, wings, vegetables, and late-night leftovers.
            </p>
          </Reveal>
          <Reveal delay={2.5}>
            <div className="nd-hero-form nd-buy-row" role="group" aria-label="Shoyu Reserve preorder status">
              <span className="nd-buy-note">In stock now. Ships from Bonney Lake, WA in 1-2 days.</span>
            </div>
            <p className="nd-preorder-note">Small-batch soy sauce. $11.99 per 7 fl oz bottle.</p>
          </Reveal>
        </div>

        <div className="nd-cards">
          {cards.map((c, idx) => (
            <Reveal key={c.key} delay={idx + 2}>
              <div
                className="nd-card nd-reserve-card"
                style={{ '--nd-accent': c.accent, '--nd-rim': c.rim }}
              >
                <div className="nd-bignum" aria-hidden="true">{c.bigNum}</div>

                <div className="nd-status">
                  <span className="dot" />
                  {c.status}
                </div>

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
                  <a className="nd-stage-tag nd-image-preorder" href={shoyuCartUrl}>ADD TO CART · $11.99 &rarr;</a>
                </div>

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

                  <div className="nd-progress">
                    <div className="nd-progress-head">
                      <span>SMALL BATCH</span>
                      <span>7 FL OZ · $11.99</span>
                    </div>
                  </div>

                  <div className="nd-notify-caption">In stock now.</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

window.NextDrop = NextDrop;
