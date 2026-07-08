import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { ArrowRight, Check, Gift, ShoppingCart, Sparkles, Truck } from "lucide-react";
import nbLogo from "@/assets/nb-logo.png";
import nbOriginal from "@/assets/nb-original-front-cutout-2026-05-09.webp";
import nbSpicyTokyo from "@/assets/nb-spicy-front-cutout-2026-05-09.webp";
import nbCitrusShoyu from "@/assets/nb-citrus-front-cutout-2026-05-09.webp";
import heroSceneTrioCounter from "@/assets/nb-hero-scene-trio-counter.webp";
import trioFlatlayChopsticks from "@/assets/nb-scene-trio-flatlay-chopsticks.jpg";
import sceneOriginalSteamingBowl from "@/assets/nb-scene-original-steaming-bowl.webp";
import sceneSpicyWokAction from "@/assets/nb-scene-spicy-wok-action.webp";
import atmosphereRamenOverhead from "@/assets/nb-atmosphere-ramen-overhead.webp";
import PressBar from "@/components/PressBar";

const TRIO_PRICE = 29.99;
const SINGLES_TOTAL = 35.97;
const TRIO_SAVINGS = SINGLES_TOTAL - TRIO_PRICE;

const flavors = [
  {
    name: "Original",
    slug: "original-ramen",
    image: nbOriginal,
    descriptor: "Savory garlic and sesame depth",
    useCases: "Ramen, rice bowls, eggs",
    heat: "Mild",
    color: "border-amber-400/35 bg-amber-400/10",
  },
  {
    name: "Spicy Tokyo",
    slug: "spicy-tokyo",
    image: nbSpicyTokyo,
    descriptor: "Bold heat. Deep umami.",
    useCases: "Noodles, wings, steak",
    heat: "Hot",
    color: "border-red-500/35 bg-red-500/10",
  },
  {
    name: "Citrus Shoyu",
    slug: "citrus-shoyu",
    image: nbCitrusShoyu,
    descriptor: "Bright lift. Bold finish.",
    useCases: "Seafood, cold noodles, dumplings",
    heat: "Mild",
    color: "border-lime-400/35 bg-lime-400/10",
  },
];

const TrioFlavorComparison = () => {
  const [activeFlavor, setActiveFlavor] = useState(flavors[0].name);

  return (
    <section className="py-24 border-y border-border/40 bg-card/20">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 block font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/70">
            Flavor Comparison
          </span>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">
            Pick a favorite, or get all 3.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/60">
            New buyers do best with the Trio: Original for savory depth, Spicy Tokyo for heat, and Citrus Shoyu for bright lift.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {flavors.map((flavor) => {
            const selected = activeFlavor === flavor.name;
            return (
              <button
                key={flavor.name}
                type="button"
                onClick={() => setActiveFlavor(flavor.name)}
                className={`rounded-2xl border p-5 text-left transition-all ${selected ? `${flavor.color} shadow-[0_0_32px_hsl(var(--primary)/0.16)]` : "border-border bg-background/60 hover:border-primary/30"}`}
              >
                <div className="mb-5 flex h-48 items-end justify-center rounded-xl bg-secondary/40 p-5">
                  <img src={flavor.image} alt={flavor.name} loading="lazy" decoding="async" className="h-full w-auto object-contain" />
                </div>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-bold text-foreground">{flavor.name}</h3>
                  {selected && (
                    <span className="rounded-full bg-primary px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-foreground/80">{flavor.descriptor}</p>
                <div className="mt-5 space-y-2 text-xs text-foreground/60">
                  <p><span className="font-display font-bold uppercase tracking-wider text-foreground/45">Best on:</span> {flavor.useCases}</p>
                  <p><span className="font-display font-bold uppercase tracking-wider text-foreground/45">Heat:</span> {flavor.heat}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-primary/25 bg-primary/5 p-6 md:flex-row">
          <div>
            <p className="font-display text-xl font-bold text-foreground">Get all 3 for $29.99.</p>
            <p className="mt-1 text-sm text-foreground/60">Singles total $35.97. The Trio saves ${TRIO_SAVINGS.toFixed(2)} and makes the first order easy.</p>
          </div>
          <Link
            to="/product/variety-pack"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-fire px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-fire transition-transform hover:scale-[1.02]"
          >
            Get all 3 for $29.99 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[200] h-[3px] origin-left"
        style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, hsl(var(--flame)), hsl(var(--primary)), hsl(40 100% 55%))" }}
      />

      <section className="relative min-h-screen overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img src={heroSceneTrioCounter} alt="NoodleBomb Trio lineup" className="h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/55" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 grid min-h-[calc(100vh-6rem)] grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[1fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              <Gift className="h-3.5 w-3.5" /> Best for new buyers
            </span>
            <h1 className="font-display text-[3.3rem] font-bold leading-[0.98] tracking-[-0.03em] text-foreground md:text-[5.7rem]">
              Try All 3 Flavors.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/70 md:text-xl">
              Start with the Trio: Original, Spicy Tokyo, and Citrus Shoyu in one gift-ready box for $29.99.
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Trio price", value: "$29.99" },
                { label: "Singles total", value: "$35.97" },
                { label: "You save", value: `$${TRIO_SAVINGS.toFixed(2)}` },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/60 bg-background/70 p-4 backdrop-blur">
                  <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/45">{item.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-primary">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/product/variety-pack"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-fire px-10 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_0_40px_hsl(var(--flame)/0.45)] transition-transform hover:scale-[1.02]"
              >
                <ShoppingCart className="h-4 w-4" /> Get the Trio
              </Link>
              <Link
                to="#build-your-own"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 px-8 py-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:border-primary/45 hover:text-primary"
              >
                Build your own <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-display font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Free US shipping on orders $29.99+</span>
              <span className="inline-flex items-center gap-1.5"><Gift className="h-3.5 w-3.5" /> Perfect for the ramen lover in your life</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65, delay: 0.12 }} className="relative">
            <div className="rounded-3xl border border-primary/25 bg-card/80 p-5 shadow-[0_0_70px_hsl(var(--primary)/0.16)] backdrop-blur">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/30">
                <img src={heroSceneTrioCounter} alt="NoodleBomb Trio bundle" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">NoodleBomb Trio</p>
                  <p className="text-sm text-foreground/55">Best for first orders and gifting.</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-display text-3xl font-bold text-primary">$29.99</p>
                  <p className="text-xs text-foreground/45 line-through">$35.97 singles</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="border-y border-border/40 py-4">
        <div className="container flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground md:gap-10">
          {["Small batch crafted in USA", "Gift-ready Trio", "Fast checkout", "Free US shipping on orders $29.99+"].map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-primary" /> {item}
            </span>
          ))}
        </div>
      </div>

      <PressBar />

      <section id="build-your-own" className="py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-3 block font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/70">
              Build your own
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">
              Singles if you already know your flavor.
            </h2>
            <p className="mt-4 text-sm text-foreground/60">
              New to NoodleBomb? The Trio is still the easiest start and saves $5.98.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {flavors.map((flavor) => (
              <motion.div
                key={flavor.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="mb-5 flex h-56 items-end justify-center rounded-xl bg-secondary/40 p-5">
                  <img src={flavor.image} alt={flavor.name} loading="lazy" decoding="async" className="h-full w-auto object-contain" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{flavor.name}</h3>
                <p className="mt-2 text-sm text-foreground/60">{flavor.descriptor}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-display text-2xl font-bold text-primary">$11.99</span>
                  <Link to={`/product/${flavor.slug}`} className="rounded-full border border-border px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-foreground/70 transition-colors hover:border-primary/45 hover:text-primary">
                    View single
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrioFlavorComparison />

      <section className="py-24">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { img: atmosphereRamenOverhead, label: "Ramen night", caption: "Set out all three and let everyone choose their bowl." },
              { img: sceneOriginalSteamingBowl, label: "Weeknight bowls", caption: "Original carries the savory center." },
              { img: sceneSpicyWokAction, label: "Heat lovers", caption: "Spicy Tokyo brings the bold option to the table." },
            ].map((item) => (
              <div key={item.label} className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card">
                <img src={item.img} alt={item.label} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-xl font-bold text-white">{item.label}</p>
                  <p className="mt-1 text-sm leading-snug text-white/75">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-3xl border border-primary/25 bg-gradient-to-br from-card to-card/60 p-10 text-center md:p-14">
            <img src={nbLogo} alt="NoodleBomb" className="mx-auto mb-7 h-14 w-auto" />
            <Sparkles className="mx-auto mb-4 h-6 w-6 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">
              Start with the Trio.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/60">
              It is the best first order, the easiest gift, and the cleanest way to find your favorite flavor.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/product/variety-pack" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-fire px-10 py-4 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-fire transition-transform hover:scale-[1.02]">
                Buy the Trio - $29.99
              </Link>
              <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-4 font-display text-xs font-bold uppercase tracking-wider text-foreground/70 hover:border-primary/45 hover:text-primary">
                See all products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <Link to="/product/variety-pack" className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-fire px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_30px_hsl(var(--flame)/0.35)]">
          <ShoppingCart className="h-4 w-4" /> Get the Trio
        </Link>
      </div>
    </div>
  );
};

export default Index;
