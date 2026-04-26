import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Truck,
  ShieldCheck,
  Repeat,
  Sparkles,
  Tag,
  Lock,
  Flame,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import EmberParticles from "@/components/EmberParticles";
import nbOriginal from "@/assets/nb-original-clean.png";
import nbSpicyTokyo from "@/assets/nb-spicy-tokyo-clean.png";
import nbCitrusShoyu from "@/assets/nb-citrus-shoyu-clean.png";
import nbLineupTrio from "@/assets/nb-lineup-trio-clean.png";

const PRODUCT_IMAGES: Record<string, string> = {
  "original-ramen": nbOriginal,
  "spicy-tokyo": nbSpicyTokyo,
  "citrus-shoyu": nbCitrusShoyu,
  "variety-pack": nbLineupTrio,
  "trio": nbLineupTrio,
  "sampler": nbLineupTrio,
};

const FREE_SHIPPING_THRESHOLD = 45;

const RECOMMENDATIONS = [
  {
    slug: "original-ramen",
    name: "Original",
    tagline: "Umami, Perfected",
    price: 11.99,
    image: nbOriginal,
  },
  {
    slug: "spicy-tokyo",
    name: "Spicy Tokyo",
    tagline: "The Street Heat Legend",
    price: 11.99,
    image: nbSpicyTokyo,
  },
  {
    slug: "citrus-shoyu",
    name: "Citrus Shoyu",
    tagline: "Bright. Snappy. Citrus-forward.",
    price: 11.99,
    image: nbCitrusShoyu,
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, addItem, subtotal, itemCount, freeShipping } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const estimatedDelivery = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + 5);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  }, []);

  const handleDiscount = () => {
    if (!discountCode.trim()) return;
    setDiscountApplied(true);
  };

  const recsToShow = RECOMMENDATIONS.filter(
    (r) => !items.some((i) => i.slug === r.slug)
  ).slice(0, 3);

  // ── Empty state ───────────────────────────────────────────────────────────
  if (itemCount === 0) {
    return (
      <div className="relative min-h-screen bg-background pt-24 pb-20 overflow-hidden">
        <EmberParticles count={10} />

        <div className="container relative z-10 py-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>

          <div className="max-w-2xl mx-auto text-center mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-24 h-24 mx-auto mb-8"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-fire blur-2xl opacity-30" />
              <div className="relative w-full h-full rounded-full bg-gradient-card border border-border/60 flex items-center justify-center shadow-fire">
                <ShoppingCart className="h-10 w-10 text-foreground/60" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight"
            >
              Your cart is <span className="text-gradient-fire">empty.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground mb-8 text-lg"
            >
              Pick a sauce. Build the bowl.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-fire px-10 py-4 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_38px_hsl(var(--flame)/0.4)] hover:scale-105 transition-all btn-shimmer"
              >
                <Flame className="h-4 w-4" /> Shop the Collection
              </Link>
            </motion.div>
          </div>

          {/* Recommendations */}
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-foreground/50 text-center mb-6">
              Best Sellers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {RECOMMENDATIONS.map((rec, i) => (
                <motion.div
                  key={rec.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                >
                  <Link
                    to={`/product/${rec.slug}`}
                    className="group block card-premium rounded-2xl p-6 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-secondary/40 rounded-xl mb-4 flex items-center justify-center p-4">
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                      {rec.name}
                    </h3>
                    <p className="text-[10px] font-display font-bold uppercase tracking-[0.15em] text-primary/80 mt-1">
                      {rec.tagline}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-display text-lg font-bold text-primary">
                        ${rec.price.toFixed(2)}
                      </span>
                      <span className="text-xs font-display font-semibold uppercase tracking-wider text-foreground/50 group-hover:text-primary transition-colors">
                        Shop →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Filled cart ───────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-background pt-24 pb-32 md:pb-20 overflow-hidden">
      <EmberParticles count={6} />

      <div className="container relative z-10 py-10 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Your <span className="text-gradient-fire">Cart</span>
              <span className="ml-3 text-base text-muted-foreground font-normal">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            </h1>
            <span className="text-xs font-display uppercase tracking-[0.2em] text-foreground/40">
              Step 1 of 2 — Review
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping bar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium rounded-2xl p-4 md:p-5"
            >
              {freeShipping ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-fire flex items-center justify-center shadow-fire">
                    <Truck className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-foreground text-sm">
                      Free shipping unlocked
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Your order ships on us.
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <span className="text-foreground/80 font-display">
                      Add{" "}
                      <span className="text-primary font-bold">
                        ${amountToFreeShipping.toFixed(2)}
                      </span>{" "}
                      more for{" "}
                      <span className="text-foreground font-semibold">free shipping</span>
                    </span>
                    <Truck className="h-4 w-4 text-muted-foreground/70" />
                  </div>
                  <div className="h-2 bg-secondary/60 rounded-full overflow-hidden border border-border/40">
                    <motion.div
                      className="h-full bg-gradient-fire rounded-full shadow-[0_0_12px_hsl(var(--flame)/0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Cart items */}
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;
                const isSubscription = item.purchaseType === "subscribe";

                return (
                  <motion.div
                    key={`${item.slug}-${item.purchaseType}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="card-premium rounded-2xl p-4 md:p-5 flex gap-4"
                  >
                    <Link
                      to={`/product/${item.slug}`}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-secondary/40 border border-border/60 flex items-center justify-center flex-shrink-0 p-2 group"
                    >
                      <img
                        src={PRODUCT_IMAGES[item.slug] || PRODUCT_IMAGES["original-ramen"]}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.slug}`}
                            className="font-display font-bold text-foreground hover:text-primary transition-colors text-base md:text-lg leading-tight block"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {isSubscription ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-display font-bold uppercase tracking-wider text-primary">
                                <Repeat className="h-2.5 w-2.5" />
                                Subscription · Save 15%
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border/60 text-[10px] font-display font-semibold uppercase tracking-wider text-foreground/55">
                                One-time
                              </span>
                            )}
                            <span className="text-[10px] font-display uppercase tracking-wider text-foreground/40">
                              ${item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.slug, item.purchaseType)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1.5 -mr-1 -mt-1 rounded-lg hover:bg-destructive/5 flex-shrink-0"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-secondary/40 border border-border/60 rounded-full p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.slug, item.purchaseType, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full flex items-center justify-center text-foreground/60 hover:bg-background hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-display font-bold text-foreground w-7 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.slug, item.purchaseType, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full flex items-center justify-center text-foreground/60 hover:bg-background hover:text-primary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-display font-bold text-primary text-lg md:text-xl">
                          ${lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* You might also like */}
            {recsToShow.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary/70" />
                  <h2 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-foreground/60">
                    You Might Also Like
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recsToShow.map((rec) => (
                    <div
                      key={rec.slug}
                      className="card-premium rounded-2xl p-3 flex items-center gap-3"
                    >
                      <div className="w-14 h-14 rounded-lg bg-secondary/40 border border-border/60 flex items-center justify-center p-1.5 flex-shrink-0">
                        <img
                          src={rec.image}
                          alt={rec.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-foreground text-sm leading-tight truncate">
                          {rec.name}
                        </p>
                        <p className="font-display text-sm font-bold text-primary mt-0.5">
                          ${rec.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          addItem({
                            slug: rec.slug,
                            name: rec.name,
                            price: rec.price,
                            purchaseType: "one-time",
                            quantity: 1,
                          })
                        }
                        className="w-8 h-8 rounded-full bg-gradient-fire flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform shadow-fire"
                        aria-label={`Add ${rec.name} to cart`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card-premium rounded-2xl p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-bold text-foreground mb-1">
                Order Summary
              </h2>
              <p className="text-xs text-muted-foreground/80 mb-5">
                Final total calculated at checkout
              </p>

              {/* Discount code */}
              <div className="mb-5">
                <label className="text-[11px] font-display font-bold uppercase tracking-[0.15em] text-foreground/55 mb-2 block">
                  Promo Code
                </label>
                {discountApplied ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/30">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-display font-semibold text-foreground flex-1 truncate">
                      {discountCode.toUpperCase()}
                    </span>
                    <button
                      onClick={() => {
                        setDiscountApplied(false);
                        setDiscountCode("");
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2.5 rounded-lg bg-secondary/40 border border-border/60 text-sm font-display text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                      onClick={handleDiscount}
                      disabled={!discountCode.trim()}
                      className="px-4 py-2.5 rounded-lg border border-border bg-secondary/40 text-xs font-display font-bold uppercase tracking-wider text-foreground/70 hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {discountApplied && (
                  <p className="text-[11px] text-foreground/55 mt-1.5">
                    Code will be validated and applied at checkout.
                  </p>
                )}
              </div>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span
                    className={
                      freeShipping
                        ? "text-primary font-display font-bold uppercase text-xs tracking-wider"
                        : "text-foreground/55"
                    }
                  >
                    {freeShipping ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated tax</span>
                  <span className="text-foreground/55">Calculated at checkout</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="font-display font-bold text-foreground">Subtotal</span>
                  <span className="font-display font-bold text-primary text-2xl tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Estimated delivery */}
              <div className="mb-5 px-4 py-3 rounded-xl bg-secondary/30 border border-border/40">
                <div className="flex items-center gap-2 text-xs">
                  <Truck className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
                  <span className="text-foreground/55 font-display">
                    Estimated delivery:
                  </span>
                  <span className="text-foreground font-display font-semibold ml-auto">
                    {estimatedDelivery}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-6 py-4 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--flame)/0.45)] hover:scale-[1.02] transition-all btn-shimmer animate-pulse-glow"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Secure Checkout — ${subtotal.toFixed(2)}
                </button>
                <Link
                  to="/shop"
                  className="hidden lg:flex w-full items-center justify-center gap-2 border border-border/60 px-6 py-3 rounded-full font-display text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60 hover:border-primary/40 hover:text-primary/80 transition-all"
                >
                  Continue Shopping <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-5 pt-5 border-t border-border/40 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-foreground/55">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                  <span>Secure 256-bit SSL checkout</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-foreground/55">
                  <Truck className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                  <span>Free shipping on orders $45+ · Ships from Pacific NW</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-foreground/55">
                  <Repeat className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                  <span>30-day satisfaction guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
        <div className="container flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-display uppercase tracking-wider text-foreground/50">
              Subtotal
            </p>
            <p className="font-display font-bold text-primary text-lg tabular-nums">
              ${subtotal.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-fire px-5 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_30px_hsl(var(--flame)/0.4)]"
          >
            <Lock className="h-3.5 w-3.5" />
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
