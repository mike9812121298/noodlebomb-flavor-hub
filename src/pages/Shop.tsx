import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import nbOriginal from "@/assets/nb-original-clean.png";
import nbSpicyTokyo from "@/assets/nb-spicy-tokyo-clean.png";
import nbCitrusShoyu from "@/assets/nb-citrus-shoyu-clean.png";
import nbRyuGarlic from "@/assets/nb-ryu-garlic-clean.png";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Lock, Flame, Check } from "lucide-react";

const products = [
  {
    name: "Original",
    tagline: "Umami, Perfected. Soy, garlic, ginger, hint of sweetness.",
    price: "$11.99",
    image: nbOriginal,
    spiceLevel: 1,
    color: "bg-primary text-primary-foreground",
    pairsWellWith: ["Ramen", "Rice Bowls", "Stir Fry"],
    subscribePrice: "$9.59/mo",
    flavorHook: "Bold. Balanced. Essential.",
    badge: "⭐ Best Seller",
    buyUrl: "https://www.noodlebomb.co/product/original-ramen",
  },
  {
    name: "Spicy Tokyo",
    tagline: "Street Heat Legend. Bold dark soy, roasted chili, sesame.",
    price: "$11.99",
    image: nbSpicyTokyo,
    spiceLevel: 3,
    color: "bg-flame text-flame-foreground",
    pairsWellWith: ["Wings", "Fried Rice", "Steak"],
    subscribePrice: "$9.59/mo",
    flavorHook: "Heat That Hooks You.",
    badge: "🔥 Most Popular Heat",
    buyUrl: "https://www.noodlebomb.co/product/spicy-tokyo",
  },
  {
    name: "Ryu Garlic",
    tagline: "Fire-Breathing Umami King. Roasted black garlic & chili oil.",
    price: "$11.99",
    image: nbRyuGarlic,
    spiceLevel: 2,
    color: "bg-secondary text-secondary-foreground",
    pairsWellWith: ["Steak", "Burgers", "Grilled Meats"],
    flavorHook: "Dark. Garlicky. Addictive.",
    comingSoon: true,
  },
  {
    name: "Citrus Shoyu",
    tagline: "Bright Side of Bold. Lemon, orange, yuzu-style citrus.",
    price: "$11.99",
    image: nbCitrusShoyu,
    spiceLevel: 1,
    color: "bg-accent text-accent-foreground",
    pairsWellWith: ["Seafood", "Shrimp", "Salads"],
    subscribePrice: "$9.59/mo",
    flavorHook: "Bright. Tangy. Fresh.",
    buyUrl: "https://www.noodlebomb.co/product/yuzu-citrus",
  },
];

const bundles = [
  {
    name: "The Trio Pack",
    tagline: "All three flavors in one clean lineup. Free shipping included.",
    price: "$24.99",
    originalPrice: "$29.97",
    spiceLevel: 3,
    color: "bg-primary text-primary-foreground",
  },
];

const Shop = () => (
  <div className="min-h-screen bg-background pt-24 pb-20 md:pb-0">
    <div className="container py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4 block">Shop</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">The Flavor Line</h1>
        <p className="text-foreground/70 mt-3 text-lg">
          Small-batch ramen sauces crafted for bold, restaurant-level flavor at home.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">Free shipping on orders $40+ — limited small-batch inventory.</p>
      </motion.div>

      <div className="h-px bg-border mb-14" />

      <div className="mb-24">
        <h2 className="font-display text-xl font-bold text-foreground mb-10 uppercase tracking-wider">Individual Bottles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <ProductCard {...p} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-card rounded-2xl border border-border p-10"
        >
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-2 block">Level Up Your Order</span>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">Frequently Bought Together</h3>
          <p className="text-sm text-muted-foreground mb-8">Original + Spicy Tokyo — the best-selling combo for instant depth and heat.</p>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-end gap-3 sm:gap-5">
              <div className="rounded-2xl border border-border bg-card p-2">
                <img src={nbOriginal} alt="Original" className="h-24 w-auto object-contain" />
              </div>
              <span className="text-2xl text-muted-foreground font-light">+</span>
              <div className="rounded-2xl border border-border bg-card p-2">
                <img src={nbSpicyTokyo} alt="Spicy Tokyo" className="h-24 w-auto object-contain" />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="text-base text-foreground font-display font-bold">Original + Spicy Tokyo</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground line-through">$19.98</span>
                <span className="font-display text-2xl font-bold text-primary">$17.98</span>
              </div>
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-display font-bold uppercase tracking-wider">
                Save 15% — $2.00 Off
              </span>
            </div>
            <a
              href="https://www.noodlebomb.co/product/variety-pack"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-fire px-8 py-3 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_35px_hsl(var(--flame)/0.45)] hover:scale-105 transition-all"
            >
              Add Both
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mb-24">
        <h2 className="font-display text-xl font-bold text-foreground mb-10 uppercase tracking-wider">Bundles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {bundles.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-gradient-card rounded-2xl border border-primary shadow-[0_0_45px_hsl(var(--primary)/0.2)] overflow-hidden"
            >
              <div className="aspect-[16/10] overflow-hidden bg-card px-5 pt-6 md:px-8 md:pt-8">
                <div className="relative mx-auto h-full max-w-[28rem] flex items-center justify-center">
                  <div className="flex items-end gap-2 md:gap-4">
                    <img src={nbSpicyTokyo} alt="Spicy Tokyo" className="h-24 object-contain translate-y-3 -rotate-6" />
                    <img src={nbOriginal} alt="Original" className="h-28 object-contain z-10" />
                    <img src={nbCitrusShoyu} alt="Citrus Shoyu" className="h-24 object-contain translate-y-3 rotate-6" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h3 className="font-display text-2xl font-bold text-foreground">{b.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-gradient-fire text-primary-foreground text-[10px] font-display font-bold uppercase tracking-wider">Best Value</span>
                </div>
                <p className="text-sm text-foreground/70 mb-2">{b.tagline}</p>
                <p className="text-xs text-primary font-display font-semibold mb-4">Try all 3 flavors in one premium sampler bundle.</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-base text-muted-foreground line-through">{b.originalPrice}</span>
                  <span className="font-display text-3xl font-bold text-primary">{b.price}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-display font-bold uppercase tracking-wider">Save $4.98</span>
                </div>
                <div className="flex items-center gap-1.5 mb-6">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-xs text-foreground/60 font-display font-semibold uppercase tracking-wider">Free Shipping Included</span>
                </div>
                <a
                  href="https://www.noodlebomb.co/product/variety-pack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-6 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--flame)/0.5)] hover:scale-[1.02] transition-all animate-pulse-glow"
                >
                  Add Bundle to Cart
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-card rounded-3xl border border-border p-14 text-center"
      >
        <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4 block">Membership</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Monthly Ramen Box</h2>
        <p className="text-foreground/70 mb-8 max-w-lg mx-auto">
          Exclusive small-batch drops, chef recipes, and limited flavors — delivered monthly.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground/80 mb-4">
          {["Limited Monthly Flavor Drop", "Members-Only Sauces", "Cancel or Skip Anytime", "Free Shipping"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {item}
            </span>
          ))}
        </div>
        <p className="text-xs text-primary/70 font-display font-semibold uppercase tracking-wider mb-8 flex items-center justify-center gap-1.5">
          <Lock className="h-3 w-3" />
          Production capped each month.
        </p>
        <Link
          to="/ramen-box"
          className="inline-flex items-center gap-2 bg-gradient-fire px-10 py-4 rounded-full font-display text-base font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_45px_hsl(var(--flame)/0.55)] hover:scale-105 transition-all animate-pulse-glow"
        >
          Explore Membership Plans <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </div>

    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-xl border-t border-border p-3">
      <a
        href="https://www.noodlebomb.co/product/original-ramen"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-6 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-fire"
      >
        <Flame className="h-4 w-4" />
        Shop Now
      </a>
    </div>
  </div>
);

export default Shop;
