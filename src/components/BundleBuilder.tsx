import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart, Flame } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import nbOriginal from "@/assets/nb-original-clean.png";
import nbSpicyTokyo from "@/assets/nb-spicy-tokyo-clean.png";
import nbCitrusShoyu from "@/assets/nb-citrus-shoyu-clean.png";

const sauces = [
  { id: "original", slug: "original-ramen", name: "Original", price: 11.99, image: nbOriginal },
  { id: "spicy", slug: "spicy-tokyo", name: "Spicy Tokyo", price: 11.99, image: nbSpicyTokyo },
  { id: "citrus", slug: "citrus-shoyu", name: "Citrus Shoyu", price: 11.99, image: nbCitrusShoyu },
];

function getDiscount(count: number) {
  if (count >= 4) return { pct: 20, label: "20%" };
  if (count >= 3) return { pct: 15, label: "15%" };
  if (count >= 2) return { pct: 10, label: "10%" };
  return { pct: 0, label: "" };
}

const BundleBuilder = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [isInView, setIsInView] = useState(false);
  const [bottlesRevealed, setBottlesRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && !bottlesRevealed) {
          setBottlesRevealed(true);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [bottlesRevealed]);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(6, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(quantities).reduce(
    (sum, [, qty]) => sum + qty * 11.99,
    0
  );
  const discount = getDiscount(totalItems);
  const saved = subtotal * (discount.pct / 100);
  const total = subtotal - saved;

  const handleAddToCart = useCallback(() => {
    sauces.forEach((sauce) => {
      const qty = quantities[sauce.id] || 0;
      if (qty > 0) {
        addItem({ slug: sauce.slug, name: sauce.name, price: sauce.price, quantity: qty, purchaseType: "one-time" });
      }
    });
    navigate("/cart");
  }, [quantities, addItem, navigate]);

  const nextTier = totalItems < 2 ? { need: 2 - totalItems, pct: "10%" }
    : totalItems < 3 ? { need: 3 - totalItems, pct: "15%" }
    : totalItems < 4 ? { need: 4 - totalItems, pct: "20%" }
    : null;

  const stickyMessage = totalItems === 0
    ? null
    : nextTier
    ? `🛒 ${totalItems} bottle${totalItems !== 1 ? "s" : ""} added — Add ${nextTier.need} more for ${nextTier.pct} off!`
    : `🛒 ${totalItems} bottles added — 🔥 Max discount unlocked!`;

  return (
    <>
    <section ref={sectionRef} className="py-28 border-t border-white/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-4"
        >
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-foreground/50 mb-4 block">
            Bundle & Save
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Build Your Bundle. Save Up to 20%.</h2>
          <p className="text-muted-foreground/90 mt-4 max-w-md mx-auto">
            Mix and match any combination of flavors.
          </p>
          <p className="text-xs text-foreground/40 font-display mt-2">Most customers choose 3 bottles.</p>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground font-display uppercase tracking-wider mb-12">
          Free shipping automatically applied.
        </p>

        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex justify-center gap-3 md:gap-4 mb-14">
          {[
            { min: 2, label: "The Dynamic Duo", sublabel: "2+ Bottles", pct: "10%", tagline: "Perfect for the weekend warrior." },
            { min: 3, label: "The Triple Threat", sublabel: "3+ Bottles", pct: "15% + FREE SHIPPING", featured: true, tagline: "The Fan Favorite. Covers all your bases from Mild to Wild." },
            { min: 4, label: "The Kitchen Hero", sublabel: "4+ Bottles", pct: "20%", tagline: "Stock the pantry. Never have a boring meal again." },
          ].map((tier) => {
            const active = totalItems >= tier.min;
            const isFeatured = tier.featured;
            return (
              <motion.div
                key={tier.min}
                animate={active ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`relative px-5 py-3 rounded-xl text-center transition-all ${
                  isFeatured ? "scale-105" : ""
                } ${
                  active
                    ? "bg-gradient-fire shadow-fire"
                    : isFeatured
                    ? "border-2 border-primary shadow-glow bg-gradient-card"
                    : "border border-border bg-gradient-card"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Flame className={`h-4 w-4 ${active ? "text-primary-foreground fill-primary-foreground" : "text-muted-foreground"}`} />
                  <span className={`font-display text-sm font-bold ${active ? "text-primary-foreground" : "text-foreground"}`}>
                    SAVE {tier.pct}
                  </span>
                </div>
                <span className={`text-sm font-display font-bold uppercase tracking-wider ${active ? "text-primary-foreground" : "text-foreground"}`}>
                  {tier.label}
                </span>
                <span className={`text-[10px] font-display uppercase tracking-wider mt-0.5 block ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {tier.sublabel}
                </span>
                <span className={`text-[10px] font-display mt-1 block leading-tight ${active ? "text-primary-foreground/60" : "text-muted-foreground/70"}`}>
                  {tier.tagline}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <p className="text-sm font-display font-semibold text-foreground">
              You've selected: <span className="text-primary">{totalItems} bottle{totalItems !== 1 ? "s" : ""}</span>
            </p>
            {nextTier ? (
              <p className="text-sm font-display font-semibold text-primary mt-1">
                Add {nextTier.need} more to save {nextTier.pct}!
              </p>
            ) : (
              <p className="text-sm font-display font-semibold text-primary mt-1">
                🔥 Max discount unlocked!
              </p>
            )}
            {discount.pct > 0 && (
              <p className="text-sm font-display font-bold text-primary mt-1.5">
                🎉 You've unlocked {discount.label} off + Free Shipping!
              </p>
            )}
          </motion.div>
        )}

        <motion.div initial={{ x: 40 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }} className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          {sauces.map((sauce, i) => {
            const qty = quantities[sauce.id] || 0;
            return (
              <motion.div
                key={sauce.id}
                initial={{ opacity: 0, y: 32, scale: 0.95 }}
                animate={bottlesRevealed ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{ y: -4 }}
                className={`bg-gradient-card rounded-2xl border overflow-hidden transition-all ${
                  qty > 0 ? "border-primary shadow-glow" : "border-border"
                }`}
                style={{ willChange: "transform" }}
              >
                <div className="aspect-[4/5] overflow-hidden bg-card rounded-t-2xl flex items-center justify-center px-4 pt-5">
                  <img
                    src={sauce.image}
                    alt={sauce.name}
                    className="h-full w-auto object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-display text-sm font-bold text-foreground mb-3">{sauce.name}</h4>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateQty(sauce.id, -1)}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-display text-lg font-bold text-foreground w-6 text-center">{qty}</span>
                    <button
                      onClick={() => updateQty(sauce.id, 1)}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-sm mx-auto bg-gradient-card rounded-2xl border p-6 text-center ${discount.pct >= 15 ? "border-primary shadow-glow" : "border-border"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{totalItems} bottle{totalItems !== 1 ? "s" : ""}</span>
              {discount.pct > 0 && (
                <span className="px-3 py-1 rounded-full bg-gradient-fire text-primary-foreground text-xs font-display font-bold uppercase tracking-wider">
                  🔥 SAVE {discount.label}
                </span>
              )}
            </div>
            {discount.pct > 0 && (
              <div className="mb-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">${subtotal.toFixed(2)}</span>
                  <span className="font-display text-2xl font-bold text-foreground">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-primary font-display font-semibold mt-1">
                  You save ${saved.toFixed(2)} vs buying individually
                </p>
              </div>
            )}
            {discount.pct === 0 && (
              <span className="font-display text-2xl font-bold text-foreground block mb-2">${subtotal.toFixed(2)}</span>
            )}
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">🚚 Free Shipping Included</span>
            </div>
            <motion.button
              onClick={handleAddToCart}
              animate={{
                boxShadow: [
                  "0 0 20px hsl(4 85% 50% / 0.3)",
                  "0 0 40px hsl(4 85% 50% / 0.6)",
                  "0 0 20px hsl(4 85% 50% / 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-6 py-3 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground hover:scale-[1.02] transition-transform"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>

    <AnimatePresence>
      {totalItems > 0 && isInView && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <p className="text-center text-sm font-display font-semibold text-foreground">
              {stickyMessage}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default BundleBuilder;
