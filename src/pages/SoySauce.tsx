import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShoppingCart, Mail, Shield, Package, RotateCcw } from "lucide-react";

const GOLD = "#c8a24a";
const BLACK = "#000000";
const CREAM = "#f5f0e8";

const flavorProfile = [
  { label: "Umami", score: 4 },
  { label: "Saltiness", score: 3 },
  { label: "Sweetness", score: 2 },
  { label: "Acidity", score: 1 },
];

const recipes = [
  { title: "Sashimi Dip", desc: "Pour direct. Let the fish speak. No dilution needed.", emoji: "🐟" },
  { title: "Dumpling Sauce", desc: "1 part soy, 1 part rice vinegar, chili oil to taste.", emoji: "🥟" },
  { title: "Soy-Glazed Salmon", desc: "Brush on skin side. Sear 4 minutes. Done.", emoji: "🍣" },
  { title: "Fried Rice", desc: "High heat. Two tablespoons. Toss fast. Don't steam it.", emoji: "🍳" },
  { title: "Teriyaki Base", desc: "3 tbsp soy + 2 tbsp mirin + 1 tbsp sugar. Reduce.", emoji: "🍖" },
  { title: "Finishing Drizzle", desc: "Over ramen, soft-boiled eggs, avocado toast. Last second.", emoji: "🍜" },
];

const pairings = [
  { item: "Sashimi", note: "No dilution — serve cold, pour direct. Cuts cleanly without masking the fish." },
  { item: "Dumplings", note: "Mix 1:1 with rice vinegar. Add chili oil if you want heat. Ginger optional." },
  { item: "Stir-fry", note: "Add in the last 60 seconds. High heat concentrates the umami — don't add too early." },
  { item: "Marinades", note: "1 part soy, 1 part sake or mirin, 1 clove garlic. Minimum 2 hours, overnight is better." },
  { item: "Glazes", note: "Reduce 3:1 with sugar over medium heat until syrupy. Brush on proteins last 5 min of cook." },
  { item: "Finishing Drizzle", note: "A few drops over ramen, roasted vegetables, or eggs. No cooking needed — raw flavor at full strength." },
];

const BUY_URL = "https://noodlebomb.co/product/soy-sauce";

const SoySauce = () => {
  const [openPairing, setOpenPairing] = useState<number | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // SEO + Google Font
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "NoodleBomb Soy Sauce — Naturally Fermented, Small-Batch | NoodleBomb";

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap";
    document.head.appendChild(fontLink);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const createdCanonical = !canonical;
    if (createdCanonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical!.href = "https://noodlebomb.co/soy-sauce";

    const jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.id = "soy-sauce-schema";
    jsonLd.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "NoodleBomb Soy Sauce",
      description: "Naturally fermented, small-batch soy sauce. 35% less sodium. 500mL. The sauce behind the sauce.",
      brand: { "@type": "Brand", name: "NoodleBomb" },
      image: "https://noodlebomb.co/soy-sauce-bottle.jpg",
      offers: {
        "@type": "Offer",
        price: "12.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: BUY_URL,
      },
    });
    document.head.appendChild(jsonLd);

    return () => {
      document.title = prevTitle;
      document.head.removeChild(fontLink);
      document.head.removeChild(jsonLd);
      if (createdCanonical && canonical && canonical.parentNode) {
        document.head.removeChild(canonical);
      }
    };
  }, []);

  // Sticky bar — appears when hero scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Tag source for segmentation
    const params = new URLSearchParams({ email, source: "soy-sauce-qr" });
    fetch(`https://noodlebomb.co/api/subscribe?${params.toString()}`, { method: "POST" }).catch(() => {});
    setEmailSubmitted(true);
  };

  const serif = "'Playfair Display', Georgia, serif";

  return (
    <div style={{ background: BLACK, color: CREAM, fontFamily: "'Inter', sans-serif" }} className="min-h-screen">

      {/* ── 1. HERO ── */}
      <section
        ref={heroRef}
        style={{ background: BLACK, minHeight: "100vh", position: "relative" }}
        className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20"
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse at 50% 40%, ${GOLD}08 0%, transparent 65%)`, pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 max-w-2xl mx-auto w-full"
        >
          <p style={{ color: GOLD, fontFamily: serif, letterSpacing: "0.35em", fontSize: "0.7rem" }} className="uppercase mb-8 tracking-[0.35em]">
            NoodleBomb
          </p>

          <h1 style={{ fontFamily: serif, color: "#ffffff", lineHeight: 1.0, letterSpacing: "0.05em" }} className="text-6xl md:text-8xl font-black mb-3">
            SOY SAUCE
          </h1>

          <p style={{ fontFamily: serif, color: GOLD, fontSize: "1.15rem" }} className="italic mb-10">
            The Sauce Behind The Sauce.
          </p>

          {/* Bottle silhouette */}
          <div className="flex justify-center my-10">
            <div
              style={{
                width: 90, height: 220,
                background: `linear-gradient(160deg, #1c1c1c 0%, #080808 100%)`,
                border: `1px solid ${GOLD}40`,
                borderRadius: "4px 4px 8px 8px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <div style={{ width: 30, height: 20, background: "#111", border: `1px solid ${GOLD}30`, borderRadius: 2 }} />
              <div style={{ width: 2, height: 16, background: `${GOLD}50` }} />
              <p style={{ color: `${GOLD}80`, fontSize: "0.45rem", letterSpacing: "0.25em", textAlign: "center", lineHeight: 1.6 }} className="uppercase px-2">
                NOODLE<br />BOMB<br />SOY<br />SAUCE
              </p>
            </div>
          </div>

          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: GOLD, color: BLACK, fontFamily: serif, display: "inline-flex", alignItems: "center", gap: 10, padding: "1rem 2.5rem", fontSize: "0.85rem", letterSpacing: "0.2em", fontWeight: 700 }}
            className="uppercase hover:opacity-90 transition-opacity"
          >
            <ShoppingCart size={15} />
            BUY 500mL — $12.99
          </a>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {["Naturally Fermented", "35% Less Sodium", "Small-Batch"].map((label) => (
              <span key={label} style={{ color: `${GOLD}90`, fontSize: "0.65rem", letterSpacing: "0.25em" }} className="uppercase">{label}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 2. WHY THIS SAUCE ── */}
      <section style={{ background: "#080808", borderTop: `1px solid ${GOLD}20` }} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontFamily: serif, color: "#fff" }}
            className="text-3xl md:text-4xl font-bold text-center mb-20"
          >
            Why This Sauce
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Naturally Fermented",
                body: "No shortcuts. Traditional koji fermentation — the same process used for over a century in Guangdong. You can taste the difference.",
              },
              {
                title: "Whole Soybeans",
                body: "Not defatted soy meal. Whole soybeans. The proteins ferment differently. The flavor depth is immediate — you'll notice on the first drop.",
              },
              {
                title: "Small-Batch",
                body: "Every bottle comes from a controlled production run. Not mass-market volume. Quality stays consistent because scale stays intentional.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ borderTop: `2px solid ${GOLD}` }}
                className="pt-8"
              >
                <h3 style={{ fontFamily: serif, color: GOLD, fontSize: "1.1rem" }} className="font-bold mb-4">{item.title}</h3>
                <p style={{ color: "rgba(245,240,232,0.65)", lineHeight: 1.8 }} className="text-sm">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. TASTING NOTES ── */}
      <section style={{ background: BLACK }} className="py-24 px-6">
        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 style={{ fontFamily: serif, color: "#fff" }} className="text-3xl md:text-4xl font-bold mb-3">Tasting Notes</h2>
            <p style={{ color: "rgba(245,240,232,0.35)", fontStyle: "italic" }} className="text-sm">Evaluated against standard Superior Light benchmark</p>
          </motion.div>
          <div className="space-y-7">
            {flavorProfile.map(({ label, score }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-5"
              >
                <span style={{ color: CREAM, width: 85, textAlign: "right", fontSize: "0.8rem", letterSpacing: "0.12em", flexShrink: 0 }} className="uppercase">
                  {label}
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      style={{
                        width: 13, height: 13,
                        borderRadius: "50%",
                        background: dot <= score ? GOLD : "transparent",
                        border: `1.5px solid ${dot <= score ? GOLD : GOLD + "50"}`,
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: "rgba(245,240,232,0.25)", fontSize: "0.7rem" }}>{score}/5</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. RECIPE CARDS ── */}
      <section style={{ background: "#080808", borderTop: `1px solid ${GOLD}20` }} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontFamily: serif, color: "#fff" }}
            className="text-3xl md:text-4xl font-bold text-center mb-20"
          >
            Six Ways to Use It
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{
                  background: "#0e0e0e",
                  border: `1px solid ${GOLD}20`,
                  padding: "1.75rem",
                  cursor: "default",
                  transition: "border-color 0.3s",
                }}
                whileHover={{ borderColor: GOLD + "70" } as never}
              >
                <div className="text-3xl mb-5">{r.emoji}</div>
                <h3 style={{ fontFamily: serif, color: GOLD, fontSize: "1rem" }} className="font-bold mb-2">{r.title}</h3>
                <p style={{ color: "rgba(245,240,232,0.55)", lineHeight: 1.7 }} className="text-sm">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ORIGIN STORY ── */}
      <section style={{ background: BLACK }} className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p style={{ color: GOLD, letterSpacing: "0.35em", fontSize: "0.65rem" }} className="uppercase mb-8">Origin</p>
            <h2 style={{ fontFamily: serif, color: "#fff", lineHeight: 1.15, fontSize: "clamp(2rem, 6vw, 3.5rem)" }} className="font-black mb-8">
              Guangdong, China<br />
              <span style={{ color: GOLD }}>→</span><br />
              Bonney Lake, WA
            </h2>
            <div style={{ width: 36, height: 2, background: GOLD, margin: "0 auto 2rem" }} />
            <p style={{ color: "rgba(245,240,232,0.68)", lineHeight: 1.95, fontSize: "0.95rem" }}>
              Our soy sauce is rooted in Guangdong, China — one of the world's great fermentation traditions,
              where craft has been honed for generations. We source a naturally brewed Superior Lite —
              whole soybean, 35% less sodium than regular — and bring it to your table under the NoodleBomb label.
            </p>
            <p style={{ color: "rgba(245,240,232,0.68)", lineHeight: 1.95, fontSize: "0.95rem", marginTop: "1.5rem" }}>
              No reformulation. No dilution. The same sauce that's been in professional kitchens for
              generations — bottled for the home cook who refuses to settle for the supermarket shelf.
            </p>
            <p style={{ fontFamily: serif, color: GOLD, fontSize: "1.2rem", marginTop: "2.5rem" }} className="italic">
              "Two countries. One bottle. No shortcuts."
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 6. PAIRING GUIDE ── */}
      <section style={{ background: "#080808", borderTop: `1px solid ${GOLD}20` }} className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 style={{ fontFamily: serif, color: "#fff" }} className="text-3xl md:text-4xl font-bold mb-3">Pairing Guide</h2>
            <p style={{ color: "rgba(245,240,232,0.35)", fontSize: "0.8rem" }}>Tap to expand</p>
          </motion.div>
          <div>
            {pairings.map((p, i) => (
              <motion.div
                key={p.item}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                style={{ borderBottom: `1px solid ${GOLD}18` }}
              >
                <button
                  onClick={() => setOpenPairing(openPairing === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                  style={{ cursor: "pointer" }}
                >
                  <span style={{
                    fontFamily: serif,
                    color: openPairing === i ? GOLD : CREAM,
                    fontSize: "1rem",
                    fontWeight: 600,
                    transition: "color 0.2s",
                  }}>
                    {p.item}
                  </span>
                  <motion.div animate={{ rotate: openPairing === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={15} style={{ color: GOLD }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openPairing === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{ color: "rgba(245,240,232,0.6)", lineHeight: 1.75, fontSize: "0.88rem", paddingBottom: "1.25rem" }}>{p.note}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. EMAIL CAPTURE ── */}
      <section style={{ background: GOLD }} className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Mail size={28} style={{ color: BLACK, margin: "0 auto 1.25rem" }} />
            <h2 style={{ fontFamily: serif, color: BLACK, lineHeight: 1.15 }} className="text-3xl font-bold mb-3">
              Get the Full Sauce Bible
            </h2>
            <p style={{ color: "rgba(0,0,0,0.6)", lineHeight: 1.75, marginBottom: "2rem" }} className="text-sm">
              30 recipes, ratio charts, fermentation notes, and pairing guides.
              Free when you join the list.
            </p>
            {emailSubmitted ? (
              <div>
                <p style={{ fontFamily: serif, color: BLACK, fontSize: "1.15rem" }} className="font-bold">✓ You're in. Check your inbox.</p>
                <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "0.75rem", marginTop: "0.5rem" }}>Welcome to the NoodleBomb list.</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }} className="sm:flex-row sm:flex-nowrap">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.25)",
                    color: BLACK,
                    padding: "0.8rem 1rem",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  className="placeholder-black/40"
                />
                <button
                  type="submit"
                  style={{
                    background: BLACK, color: GOLD,
                    padding: "0.8rem 1.75rem",
                    fontFamily: serif,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  className="uppercase hover:opacity-90 transition-opacity"
                >
                  Send It
                </button>
              </form>
            )}
            <p style={{ color: "rgba(0,0,0,0.35)", fontSize: "0.65rem", marginTop: "1rem", letterSpacing: "0.15em" }} className="uppercase">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8. BUY NOW ── */}
      <section style={{ background: BLACK, borderTop: `1px solid ${GOLD}20` }} className="py-24 px-6 pb-36 md:pb-24">
        <div className="max-w-sm mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p style={{ color: `${GOLD}80`, letterSpacing: "0.35em", fontSize: "0.65rem" }} className="uppercase mb-8">Ready When You Are</p>
            <h2 style={{ fontFamily: serif, color: "#fff", letterSpacing: "0.05em" }} className="text-4xl font-black mb-1">
              SOY SAUCE
            </h2>
            <p style={{ color: "rgba(245,240,232,0.35)", fontSize: "0.75rem", letterSpacing: "0.25em" }} className="uppercase mb-10">
              500mL / $12.99
            </p>

            {/* Bottle */}
            <div className="flex justify-center mb-10">
              <div
                style={{
                  width: 80, height: 190,
                  background: "linear-gradient(160deg, #181818 0%, #060606 100%)",
                  border: `1px solid ${GOLD}35`,
                  borderRadius: "3px 3px 7px 7px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <div style={{ width: 24, height: 16, background: "#0f0f0f", border: `1px solid ${GOLD}25`, borderRadius: 2 }} />
                <div style={{ width: 1.5, height: 12, background: `${GOLD}40` }} />
                <p style={{ color: `${GOLD}60`, fontSize: "0.4rem", letterSpacing: "0.2em", textAlign: "center", lineHeight: 1.8 }} className="uppercase px-2">
                  NOODLE<br />BOMB
                </p>
              </div>
            </div>

            <a
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: GOLD, color: BLACK,
                fontFamily: serif,
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "1rem 2.75rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
              }}
              className="uppercase hover:opacity-90 transition-opacity"
            >
              <ShoppingCart size={15} />
              Add to Cart
            </a>

            {/* Trust row */}
            <div className="flex justify-center gap-10 mt-12">
              {[
                { Icon: Shield, label: "Secure Checkout" },
                { Icon: Package, label: "Ships in 2-3 Days" },
                { Icon: RotateCcw, label: "100% Satisfaction" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon size={16} style={{ color: `${GOLD}60` }} />
                  <span style={{ color: "rgba(245,240,232,0.3)", fontSize: "0.6rem", letterSpacing: "0.12em" }} className="uppercase text-center">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE STICKY BUY BAR ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 72 }} animate={{ y: 0 }} exit={{ y: 72 }} transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
              background: "#0a0a0a",
              borderTop: `1px solid ${GOLD}40`,
              height: 64,
            }}
            className="flex items-center justify-between px-5 md:hidden"
          >
            <div>
              <p style={{ color: "#fff", fontFamily: serif, fontSize: "0.88rem", fontWeight: 700 }}>NoodleBomb Soy Sauce</p>
              <p style={{ color: GOLD, fontSize: "0.72rem", marginTop: 1 }}>500mL — $12.99</p>
            </div>
            <a
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: GOLD, color: BLACK,
                fontFamily: serif,
                padding: "0.55rem 1.4rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
              className="uppercase hover:opacity-90 transition-opacity"
            >
              Buy Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoySauce;
