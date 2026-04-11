import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useScrollReveal, useScrollRevealChildren } from "@/hooks/use-scroll-reveal";
import { ArrowRight, Zap, ChefHat, Star, ShoppingCart } from "lucide-react";
import nbLogo from "@/assets/nb-logo.png";
import nbOriginal from "@/assets/nb-original-clean.png";
import nbSpicyTokyo from "@/assets/nb-spicy-tokyo-clean.png";
import nbCitrusShoyu from "@/assets/nb-citrus-shoyu-clean.png";
import nbRyuGarlic from "@/assets/nb-ryu-garlic-clean.png";
import PressBar from "@/components/PressBar";
import TestimonialSection from "@/components/TestimonialSection";
import FounderStory from "@/components/FounderStory";
import BundleBuilder from "@/components/BundleBuilder";
import HowToUse from "@/components/HowToUse";
import HowItWorks from "@/components/HowItWorks";
import EmailCaptureSection from "@/components/EmailCaptureSection";
import SocialProof from "@/components/SocialProof";
import SpiceLevel from "@/components/SpiceLevel";
import EmberParticles from "@/components/EmberParticles";


const sauceImages: Record<string, string> = {
  "Original": nbOriginal,
  "Spicy Tokyo": nbSpicyTokyo,
  "Citrus Shoyu": nbCitrusShoyu,
  "Ryu Garlic": nbRyuGarlic,
};

const sauces = [
  { name: "Original", tagline: "Umami, Perfected", spice: 1, price: "$11.99", desc: "Soy, garlic, ginger, and a hint of sweetness.", bestFor: "Ramen, rice bowls, stir fry", badge: null, buyUrl: "https://www.noodlebomb.co/product-page/noodlebomb-original-ramen-sauce", proTip: "Stir a tablespoon into your fried rice at the very last second for that perfect caramelized finish." },
  { name: "Spicy Tokyo", tagline: "The Street Heat Legend", spice: 3, price: "$11.99", desc: "Bold dark soy, roasted chili, and sesame.", bestFor: "Wings, fried rice, steak", badge: "🔥 Most Popular", buyUrl: "https://www.noodlebomb.co/product-page/noodle-bomb-spicy-tokyo-ramen-sauce", proTip: "Use it as a 10-minute marinade for flank steak. The chili-oil infusion penetrates deep for a serious kick." },
  { name: "Ryu Garlic", tagline: "Fire-Breathing Umami King", spice: 2, desc: "Roasted black garlic, chili oil, and toasted sesame.", bestFor: "Steak, burgers, grilled meats", badge: null, comingSoon: true },
  { name: "Citrus Shoyu", tagline: "The Bright Side of Bold", spice: 1, price: "$11.99", desc: "Lemon, orange, and yuzu-style citrus.", bestFor: "Seafood, shrimp, salads", badge: null, buyUrl: "https://www.noodlebomb.co/product-page/noodle-bomb-citrus-shoyu-ramen-sauce", proTip: "Drizzle over grilled shrimp or a fresh cucumber salad. The Yuzu notes pop best with cold dishes." },
];

const heroSauces = [
  { name: "Original", tagline: "Umami, Perfected", image: nbOriginal, spice: 1, desc: "Soy, garlic, ginger, and a hint of sweetness." },
  { name: "Spicy Tokyo", tagline: "The Street Heat Legend", image: nbSpicyTokyo, spice: 3, desc: "Bold dark soy, roasted chili, and sesame." },
  { name: "Ryu Garlic", tagline: "Fire-Breathing Umami King", image: nbRyuGarlic, spice: 2, desc: "Roasted black garlic, chili oil, and toasted sesame." },
  { name: "Citrus Shoyu", tagline: "The Bright Side of Bold", image: nbCitrusShoyu, spice: 1, desc: "Lemon, orange, and yuzu-style citrus." },
] as const;

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  
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
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div className="absolute inset-0 bg-gradient-dark" style={{ scale: bgScale }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_65%_50%,hsl(4_85%_50%/0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_100%,hsl(0_0%_0%/0.6),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'.5\'/%3E%3C/svg%3E")' }} />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center pt-28 pb-20 lg:pt-32 lg:pb-24">
          <div className="max-w-xl">
            <h1 className="font-display text-[3.5rem] md:text-[5.5rem] font-bold tracking-[-0.04em] mb-5 leading-[1.02] animate-hero-enter">
              <span className="text-foreground">The Sauce That</span><br />
              <span className="text-gradient-fire animate-text-glow drop-shadow-[0_0_40px_hsl(var(--flame)/0.3)]">Builds the Bowl.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-md mb-6 leading-relaxed animate-hero-enter-delayed">
              Pacific Northwest-crafted ramen sauce. Bold. Clean. No shortcuts.
            </p>
            <p className="text-sm md:text-base text-foreground/50 max-w-md mb-6 leading-relaxed animate-hero-enter-delayed">
              Noodle Bomb isn't just a condiment; it's the secret weapon for the 15-minute masterpiece. Whether it's the roar of the wok or the quiet drizzle over a midnight bowl of ramen, we bring the soul of the kitchen to your table.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 animate-hero-enter-delayed-2">
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
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-8 animate-hero-enter-delayed-2">
              <a href="#products" className="group bg-gradient-fire px-10 py-4 rounded-full font-display text-base font-bold uppercase tracking-[0.12em] text-primary-foreground transition-all hover:shadow-[0_0_55px_hsl(var(--flame)/0.65)] hover:scale-105 active:scale-[0.98] flex items-center gap-2.5 shadow-[0_0_40px_hsl(var(--flame)/0.45)] animate-pulse-glow">
                Shop Now <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link to="/about" className="border border-border/60 px-7 py-4 rounded-full font-display text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60 transition-all hover:border-primary/50 hover:text-primary/80 hover:bg-primary/5">
                Learn Our Story
              </Link>
            </div>
            <div className="flex items-center gap-1.5 mb-6 animate-hero-enter-delayed-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500 drop-shadow-[0_0_4px_hsl(40_100%_50%/0.4)]" />
                ))}
              </div>
              <span className="text-xs font-display font-semibold text-foreground/50 tracking-wide">4.9 Stars (500+ Reviews)</span>
            </div>
            <div className="flex items-center gap-2 mb-4 animate-hero-enter-delayed-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 animate-scarcity-pulse">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-display font-semibold text-primary tracking-wide">Only 142 bottles left in this batch</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 animate-hero-enter-delayed-3">
              {["Free Shipping $40+", "Small Batch Drops", "Premium Ingredients"].map((item, i) => (
                <span key={item} className="flex items-center gap-1.5 text-[10px] text-foreground/35 font-display uppercase tracking-[0.2em]">
                  {i > 0 && <span className="text-primary/30 mr-1.5">✦</span>}
                  {item}
                </span>
              ))}
            </div>
          </div>

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
                  <p className="text-sm text-foreground/50 mt-2 max-w-xs mx-auto">{heroSauces[activeSlide].desc}</p>
                  <div className="mt-2"><SpiceLevel level={heroSauces[activeSlide].spice} /></div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="flex items-center gap-2.5 mt-6">
                {heroSauces.map((sauce, i) => (
                  <button
                    key={sauce.name}
                    onClick={() => setActiveSlide(i)}
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

      <div className="section-divider-animated" />
      <PressBar />

      {/* Sauce Lineup */}
      <section className="py-32">
        <div className="section-divider-animated mb-32" />
        <div className="container">
          <div ref={sauceHeaderRef} className="scroll-reveal text-center mb-20">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">Our Sauces</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Meet the Lineup</h2>
            <p className="text-foreground/50 mt-3 text-sm max-w-md mx-auto">Small-batch crafted. Premium ingredients. Bold, unforgettable flavor.</p>
          </div>
          <div ref={sauceGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sauces.map((sauce) => (
              <div
                key={sauce.name}
                data-reveal
                className="scroll-reveal group card-premium rounded-2xl overflow-hidden hover-lift"
              >
                <div className="relative aspect-[4/5] overflow-hidden flex items-center justify-center bg-card rounded-t-2xl px-4 pt-6">
                  <img src={sauceImages[sauce.name]} alt={sauce.name} className={`h-full w-auto object-contain object-bottom transition-transform duration-500 group-hover:scale-105 ${sauce.comingSoon ? "opacity-60" : ""}`} />
                  {sauce.comingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-6 py-2.5 rounded-full bg-background/90 border border-border text-foreground font-display text-xs font-bold uppercase tracking-[0.2em]">Coming Soon</span>
                    </div>
                  )}
                  {sauce.badge && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 rounded-full bg-gradient-fire text-primary-foreground text-[10px] font-display font-bold uppercase tracking-wider shadow-fire">{sauce.badge}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1 tracking-tight">{sauce.name}</h3>
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
                  {!sauce.comingSoon && (
                    <div className="w-full text-center">
                      <a href={sauce.buyUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 px-4 py-3 rounded-full text-sm font-display font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-[1.02]">
                        <ShoppingCart className="h-4 w-4" /> Pre-Order
                      </a>
                      <p className="text-[11px] font-display text-muted-foreground mt-2 tracking-wide">Ships week of May 5, 2026</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailCaptureSection />
      <HowToUse />
      <BundleBuilder />
      <HowItWorks />


      <TestimonialSection />

      {/* Features */}
      <section className="py-32">
        <div className="section-divider-animated mb-32" />
        <div className="container">
          <div ref={featuresHeaderRef} className="scroll-reveal text-center mb-20">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">Why Noodle Bomb</span>
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
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 border border-border border-glow group-hover:border-primary/30 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)] transition-all duration-500">
                  <f.icon className="h-7 w-7 text-foreground/50 icon-glow" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FounderStory />
      <SocialProof />

      {/* CTA */}
      <section className="py-32">
        <div className="section-divider-animated mb-32" />
        <div className="container text-center">
          <div
            ref={ctaRef}
            className="scroll-reveal-scale max-w-2xl mx-auto card-premium rounded-3xl p-16"
          >
            <img src={nbLogo} alt="Noodle Bomb" className="h-14 w-auto mx-auto mb-8 drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Blow Up Your Meals?</h2>
            <p className="text-foreground/50 mb-10 text-sm">Join thousands upgrading their cooking in seconds.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-fire px-12 py-5 rounded-full font-display text-base font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_55px_hsl(var(--flame)/0.6)] hover:scale-105 shadow-[0_0_38px_hsl(var(--flame)/0.4)] animate-pulse-glow">
                Shop Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/sauce-selector" className="inline-flex items-center gap-2 border border-border/60 px-8 py-5 rounded-full font-display text-sm font-semibold uppercase tracking-[0.15em] text-foreground/50 hover:border-primary/40 hover:text-primary/70 transition-all">
                Find Your Sauce
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur border-t border-border p-3">
        <Link to="/shop" className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-6 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_30px_hsl(var(--flame)/0.35)]">
          <ShoppingCart className="h-4 w-4" /> Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Index;

