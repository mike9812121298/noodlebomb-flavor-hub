import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import { useScrollReveal, useScrollRevealChildren } from "@/hooks/use-scroll-reveal";
import { ArrowRight, Zap, ChefHat, Star, ShoppingCart, Truck, RotateCcw, Leaf, MapPin } from "lucide-react";
import nbLogo from "@/assets/nb-logo.png";
import nbOriginal from "@/assets/nb-original-clean.png";
import nbSpicyTokyo from "@/assets/nb-spicy-tokyo-clean.png";
import nbCitrusShoyu from "@/assets/nb-citrus-shoyu-clean.png";
import nbRyuGarlic from "@/assets/nb-ryu-garlic-clean.png";
import PressBar from "@/components/PressBar";
import TestimonialSection from "@/components/TestimonialSection";
import BundleBuilder from "@/components/BundleBuilder";
import SpiceLevel from "@/components/SpiceLevel";
import EmberParticles from "@/components/EmberParticles";


const sauceImages: Record<string, string> = {
  "Original": nbOriginal,
  "Spicy Tokyo": nbSpicyTokyo,
  "Citrus Shoyu": nbCitrusShoyu,
  "Ryu Garlic": nbRyuGarlic,
};

const sauces = [
  { name: "Original", tagline: "Umami, Perfected", spice: 1, price: "$11.99", desc: "Deep umami, garlic, ginger, and sesame — medium heat. Balanced and versatile enough to go with everything.", bestFor: "Ramen, rice bowls, grilled proteins", badge: null, buyUrl: "/product/original-ramen", ctaLabel: "Shop Original", comingSoon: false, proTip: "Stir a tablespoon into your fried rice at the very last second for that perfect caramelized finish." },
  { name: "Spicy Tokyo", tagline: "The Street Heat Legend", spice: 3, price: "$11.99", desc: "Fiery, chili-forward heat layered over dark roasted soy and sesame. Hot — turns up the intensity without killing the umami.", bestFor: "Ramen, wings, spicy noodles", badge: "🔥 Most Popular", buyUrl: "/product/spicy-tokyo", ctaLabel: "Shop Spicy Tokyo", comingSoon: false, proTip: "Use it as a 10-minute marinade for flank steak. The chili-oil infusion penetrates deep for a serious kick." },
  { name: "Citrus Shoyu", tagline: "The Bright Side of Bold", spice: 1, price: "$11.99", desc: "Bright citrus lifts a clean soy base into something tangy and fresh. Mild heat — the light, bright counterpart to the deeper sauces.", bestFor: "Light ramen, sushi, fish, citrus-forward dishes", badge: null, buyUrl: "/product/citrus-shoyu", ctaLabel: "Shop Citrus Shoyu", comingSoon: false, proTip: "Drizzle over grilled shrimp or a fresh cucumber salad. The citrus notes pop best with cold dishes." },
  { name: "Ryu Garlic", tagline: "The Dragon's Breath", spice: 2, price: "$11.99", desc: "Roasted garlic-forward with a smoky depth and subtle heat. An umami bomb built for garlic lovers who don't do things halfway.", bestFor: "Noodles, dumplings, stir-fry, roasted veggies", badge: null, buyUrl: null, ctaLabel: "Notify Me", comingSoon: true, proTip: null },
];

const heroSauces = [
  { name: "Original", tagline: "Umami, Perfected", image: nbOriginal, spice: 1, desc: "Deep umami, garlic, ginger, and sesame — medium heat. The one that goes with everything." },
  { name: "Spicy Tokyo", tagline: "The Street Heat Legend", image: nbSpicyTokyo, spice: 3, desc: "Fiery, chili-forward heat over dark roasted soy. Hot — turn up the heat without losing the flavor." },
  { name: "Citrus Shoyu", tagline: "The Bright Side of Bold", image: nbCitrusShoyu, spice: 1, desc: "Bright citrus over a clean soy base — mild heat. Clean, bright, and surprisingly addictive." },
] as const;

// Stagger container for hero content
const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Stagger for CTA buttons (tighter, 50ms apart)
const ctaContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.6,
    },
  },
};

const ctaItemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: pageScrollProgress } = useScroll();

  const bottleY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const sauceHeaderRef = useScrollReveal();
  const sauceGridRef = useScrollRevealChildren({ staggerMs: 80 });
  const featuresHeaderRef = useScrollReveal();
  const featuresGridRef = useScrollRevealChildren({ staggerMs: 100 });
  const ctaRef = useScrollReveal();

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroSauces.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);


  return (
    <div className="min-h-screen bg-background">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[200] origin-left"
        style={{ scaleX: pageScrollProgress, background: "linear-gradient(90deg, hsl(var(--flame)), hsl(var(--primary)), hsl(40 100% 55%))" }}
      />
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div className="absolute inset-0 bg-gradient-dark" style={{ scale: bgScale }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_65%_50%,hsl(4_85%_50%/0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_100%,hsl(0_0%_0%/0.6),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'.5\'/%3E%3C/svg%3E")' }} />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center pt-28 pb-20 lg:pt-32 lg:pb-24">  {/* Hero left — stagger all content on load */}
          <motion.div
            className="max-w-xl"
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={heroItemVariants}
              className="font-display text-[3.5rem] md:text-[5.5rem] font-bold tracking-[-0.04em] mb-5 leading-[1.02]"
            >
              <span className="text-foreground">The Sauce That</span><br />
              <span className="text-gradient-fire animate-text-glow drop-shadow-[0_0_40px_hsl(var(--flame)/0.3)]">Builds the Bowl.</span>
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="text-lg md:text-xl text-foreground/70 max-w-md mb-6 leading-relaxed"
            >
              Pacific Northwest-crafted ramen sauce. Bold. Clean. No shortcuts.
            </motion.p>

            <motion.p
              variants={heroItemVariants}
              className="text-sm md:text-base text-foreground/50 max-w-md mb-6 leading-relaxed"
            >
              NoodleBomb isn't just a condiment; it's the secret weapon for the 15-minute masterpiece. Whether it's the roar of the wok or the quiet drizzle over a midnight bowl of ramen, we bring the soul of the kitchen to your table.
            </motion.p>

            <motion.div variants={heroItemVariants} className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500 drop-shadow-[0_0_4px_hsl(40_100%_50%/0.4)]" />
                  ))}
                </div>
                <span className="text-xs text-foreground/50 font-display font-semibold uppercase tracking-wider">4.9 Stars</span>
              </div>
              <div className="h-3 w-px bg-border/60" />
              <span className="text-xs text-foreground/50 font-display font-semibold uppercase tracking-[0.15em]">7 fl oz • From $11.99</span>
            </motion.div>

            {/* CTA buttons — stagger 50ms apart */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-3 mb-8"
              variants={ctaContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.a
                variants={ctaItemVariants}
                href="/shop"
                className="group bg-gradient-fire px-10 py-4 rounded-full font-display text-base font-bold uppercase tracking-[0.12em] text-primary-foreground transition-all hover:shadow-[0_0_55px_hsl(var(--flame)/0.65)] hover:scale-105 active:scale-[0.98] flex items-center gap-2.5 shadow-[0_0_40px_hsl(var(--flame)/0.45)] animate-pulse-glow"
              >
                Shop the Collection
              </motion.a>
              <motion.div variants={ctaItemVariants}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border border-border/60 px-7 py-4 rounded-full font-display text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60 transition-all hover:border-primary/50 hover:text-primary/80 hover:bg-primary/5"
                >
                  Learn Our Story <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={heroItemVariants} className="flex items-center gap-1.5 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500 drop-shadow-[0_0_4px_hsl(40_100%_50%/0.4)]" />
                ))}
              </div>
              <span className="text-xs font-display font-semibold text-foreground/50 tracking-wide">4.9 Stars (500+ Reviews)</span>
            </motion.div>

            <motion.div variants={heroItemVariants} className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 animate-scarcity-pulse">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-display font-semibold text-primary tracking-wide">Only 142 bottles left in this batch</span>
              </span>
            </motion.div>

            <motion.div variants={heroItemVariants} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {["Free Shipping $40+", "Small Batch Drops", "Premium Ingredients"].map((item, i) => (
                <span key={item} className="flex items-center gap-1.5 text-[10px] text-foreground/35 font-display uppercase tracking-[0.2em]">
                  {i > 0 && <span className="text-primary/30 mr-1.5">✦</span>}
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: bottleY }}
            className="relative flex flex-col items-center lg:items-end"
          >
            <EmberParticles count={14} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,hsl(4_85%_50%/0.14)_0%,hsl(25_100%_50%/0.07)_30%,transparent_70%)] blur-2xl" />
            </div>

            {/* Carousel */}
            <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
              <div className="relative h-[400px] w-[280px] mx-auto flex items-center justify-center overflow-hidden rounded-3xl border border-border bg-card shadow-lg animate-float">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSlide}
                    src={heroSauces[activeSlide].image}
                    alt={heroSauces[activeSlide].name}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                    initial={{ opacity: 0, scale: 0.85, x: 60 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.85, x: -60 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </AnimatePresence>
              </div>

              {/* Sauce info */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="text-center mt-4"
                >
                  <h3 className="font-display text-2xl font-bold text-foreground">{heroSauces[activeSlide].name}</h3>
                  <p className="text-xs font-display font-bold uppercase tracking-[0.15em] text-primary/80 mt-1">{heroSauces[activeSlide].tagline}</p>
                  
                  <div className="mt-2"><SpiceLevel level={heroSauces[activeSlide].spice} /></div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="flex items-center gap-2.5 mt-6">
                {heroSauces.map((sauce, i) => (
                  <motion.button
                    key={sauce.name}
                    onClick={() => setActiveSlide(i)}
                    whileTap={{ scale: 0.7 }}
                    whileHover={{ scale: 1.4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeSlide ? "w-8 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]" : "w-2 bg-foreground/20 hover:bg-foreground/40"}`}
                    aria-label={`View ${sauce.name}`}
                  />
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Trust Bar */}
      <div className="border-y border-border/40 py-4">
        <motion.div
          className="container flex flex-wrap items-center justify-center gap-6 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
        >
          {[
            { Icon: Star, label: "4.9 Stars · 500+ Reviews", iconClass: "text-amber-500" },
            { Icon: Truck, label: "Free Shipping Over $45", iconClass: "" },
            { Icon: RotateCcw, label: "30-Day Guarantee", iconClass: "" },
            { Icon: Leaf, label: "Real Ingredients", iconClass: "" },
            { Icon: MapPin, label: "Crafted in the PNW", iconClass: "" },
          ].map(({ Icon, label, iconClass }) => (
            <motion.span
              key={label}
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground cursor-default"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
            >
              <Icon className={`h-3.5 w-3.5 ${iconClass}`} />{label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="section-divider-animated" />
      <PressBar />

      {/* Sauce Lineup */}
      <section id="products" className="py-32">
        <div className="section-divider-animated mb-32" />
        <div className="container">
          <div ref={sauceHeaderRef} className="scroll-reveal text-center mb-20">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">Our Sauces</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Our Sauces. Your New Obsession.</h2>
            <p className="text-foreground/50 mt-3 text-sm max-w-md mx-auto">Small-batch crafted. Premium ingredients. Bold, unforgettable flavor.</p>
          </div>
          <div ref={sauceGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {sauces.map((sauce) => (
              <motion.div
                key={sauce.name}
                data-reveal
                whileHover={{ y: -10, boxShadow: "0 0 50px hsl(var(--primary)/0.18), 0 24px 60px rgba(0,0,0,0.35)" }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="scroll-reveal group card-premium rounded-2xl overflow-hidden"
                style={{ willChange: "transform" }}
              >
                <div className="relative aspect-[4/5] overflow-hidden flex items-center justify-center bg-card rounded-t-2xl px-4 pt-6">
                  <img
                    src={sauceImages[sauce.name] ?? ""}
                    alt={sauce.name}
                    className={`h-full w-auto object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.05] ${sauce.comingSoon ? "opacity-60" : ""}`}
                    style={{ willChange: "transform" }}
                  />
                  {sauce.comingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-6 py-2.5 rounded-full bg-background/90 border border-border text-foreground font-display text-xs font-bold uppercase tracking-[0.2em]">Coming Soon</span>
                    </div>
                  )}
                  {sauce.badge && (
                    <motion.div
                      className="absolute top-3 left-3"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span className="px-3 py-1.5 rounded-full bg-gradient-fire text-primary-foreground text-[10px] font-display font-bold uppercase tracking-wider shadow-fire">{sauce.badge}</span>
                    </motion.div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1 tracking-tight transition-colors duration-300 group-hover:text-primary/90">{sauce.name}</h3>
                  <p className="text-[10px] font-display font-bold uppercase tracking-[0.15em] text-primary/80 mb-1.5">{sauce.tagline}</p>
                  {sauce.price && (
                    <p className="font-display text-2xl font-bold text-primary mb-2">{sauce.price}</p>
                  )}
                  <p className="text-xs text-foreground/50 mb-3">{sauce.desc}</p>
                  <div className="mb-4"><SpiceLevel level={sauce.spice} /></div>
                  <p className="text-[10px] font-display uppercase tracking-[0.15em] text-foreground/40 mb-3">Best for: {sauce.bestFor}</p>
                  {sauce.proTip && (
                    <div className="mb-4 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-[11px] text-foreground/60 leading-relaxed">
                        <span className="font-display font-bold text-primary uppercase tracking-wider text-[10px]">Pro Tip: </span>
                        {sauce.proTip}
                      </p>
                    </div>
                  )}
                  {sauce.comingSoon ? (
                    <div className="w-full text-center">
                      <button disabled className="w-full flex items-center justify-center gap-2 bg-secondary/60 px-4 py-3 rounded-full text-sm font-display font-bold uppercase tracking-wider text-foreground/30 cursor-not-allowed">
                        Notify Me
                      </button>
                      <p className="text-[11px] font-display text-muted-foreground mt-2 tracking-wide">Coming Soon</p>
                    </div>
                  ) : (
                    <div className="w-full text-center">
                      <Link to={sauce.buyUrl!} className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-4 py-3 rounded-full text-sm font-display font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(var(--flame)/0.4)] hover:scale-[1.02]">
                        <ShoppingCart className="h-4 w-4" /> {sauce.ctaLabel}
                      </Link>
                      <p className="text-[11px] font-display text-muted-foreground mt-2 tracking-wide">Ships May 2026</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why NoodleBomb */}
      <section className="py-32">
        <div className="section-divider-animated mb-32" />
        <div className="container">
          <div ref={featuresHeaderRef} className="scroll-reveal text-center mb-20">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">Why NoodleBomb</span>
          </div>
          <div ref={featuresGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { icon: Zap, title: "Instant Flavor", desc: "Just a drizzle transforms any dish into restaurant-level flavor." },
              { icon: ChefHat, title: "Chef Crafted", desc: "Small-batch recipes developed with premium, all-natural ingredients." },
              { icon: Star, title: "Versatile", desc: "Ramen, rice, grilled meats, dumplings, eggs — it goes on everything." },
            ].map((f) => (
              <div
                key={f.title}
                data-reveal
                className="scroll-reveal-scale text-center group hover-lift"
              >
                <motion.div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 border border-border border-glow group-hover:border-primary/30 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)] transition-all duration-500"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                >
                  <f.icon className="h-7 w-7 text-foreground/50 icon-glow" />
                </motion.div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BundleBuilder />

      <TestimonialSection />

      {/* Subscription */}
      <section className="py-28 border-t border-white/5">
        <div className="container max-w-3xl text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-amber-400/80 mb-4">Monthly Subscription</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">The Monthly Ramen Box.<br/><span className="text-zinc-400 text-3xl font-normal">$29.99/month.</span></h2>
          <p className="text-zinc-300 text-lg mb-8">Cancel anytime. Free shipping. 5+ exclusive ramen flavors monthly.</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs tracking-widest uppercase text-zinc-500 mb-10">
            {["No Contracts", "Skip Anytime", "Free Shipping", "Members-Only Flavors"].map(f => (
              <span key={f}>{f}</span>
            ))}
          </div>
          <a href="/ramen-box" className="inline-flex items-center gap-2 bg-gradient-fire px-10 py-4 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_55px_hsl(var(--flame)/0.6)] hover:scale-105 shadow-[0_0_38px_hsl(var(--flame)/0.4)] animate-pulse-glow">
            Start Your Subscription
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="section-divider-animated mb-32" />
        <div className="container text-center">
          <div
            ref={ctaRef}
            className="scroll-reveal-scale max-w-2xl mx-auto card-premium rounded-3xl p-16"
          >
            <motion.img
              src={nbLogo}
              alt="NoodleBomb"
              className="h-14 w-auto mx-auto mb-8 drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Blow Up Your Meals?</h2>
            <p className="text-foreground/50 mb-10 text-sm">Join thousands upgrading their cooking in seconds.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-fire px-12 py-5 rounded-full font-display text-base font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_55px_hsl(var(--flame)/0.6)] hover:scale-105 shadow-[0_0_38px_hsl(var(--flame)/0.4)] animate-pulse-glow">
                Try the Variety Pack
              </Link>
              <Link to="/sauce-selector" className="inline-flex items-center gap-2 border border-border/60 px-8 py-5 rounded-full font-display text-sm font-semibold uppercase tracking-[0.15em] text-foreground/50 hover:border-primary/40 hover:text-primary/70 transition-all">
                Find Your Sauce <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur border-t border-border p-3">
        <Link to="/shop" className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-6 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_30px_hsl(var(--flame)/0.35)]">
          <ShoppingCart className="h-4 w-4" /> Shop the Collection
        </Link>
      </div>
    </div>
  );
};

export default Index;
