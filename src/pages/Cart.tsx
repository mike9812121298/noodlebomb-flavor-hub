import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import nbOriginal from "@/assets/nb-original-clean.png";
import nbSpicyTokyo from "@/assets/nb-spicy-tokyo-clean.png";
import nbCitrusShoyu from "@/assets/nb-citrus-shoyu-clean.png";
import nbLineupTrio from "@/assets/nb-lineup-trio-clean.png";

const PRODUCT_IMAGES: Record<string, string> = {
  "original-ramen": nbOriginal,
  "spicy-tokyo": nbSpicyTokyo,
  "citrus-shoyu": nbCitrusShoyu,
  "variety-pack": nbLineupTrio,
};

const FREE_SHIPPING_THRESHOLD = 40;

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, itemCount, freeShipping } =
    useCart();

  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-secondary/80 border border-border flex items-center justify-center mx-auto">
              <ShoppingCart className="h-9 w-9 text-muted-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground">
                Add some sauces to get started.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gradient-fire px-8 py-3 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground hover:shadow-fire hover:scale-105 transition-all"
            >
              <ShoppingCart className="h-4 w-4" />
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 md:pb-0">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Your Cart
            <span className="ml-3 text-lg text-muted-foreground font-normal">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping bar */}
            <div className="bg-gradient-card rounded-2xl border border-border p-4">
              {freeShipping ? (
                <div className="flex items-center gap-2 text-sm text-green-400 font-display font-semibold">
                  <Truck className="h-4 w-4" />
                  You unlocked free shipping!
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-foreground/70 font-display">
                      Add{" "}
                      <span className="text-primary font-bold">
                        ${amountToFreeShipping.toFixed(2)}
                      </span>{" "}
                      more for free shipping
                    </span>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-fire rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart items */}
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.slug}-${item.purchaseType}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gradient-card rounded-2xl border border-border p-5 flex gap-4"
                >
                  <div className="w-20 h-20 rounded-xl bg-card border border-border/60 flex items-center justify-center flex-shrink-0 p-2">
                    <img
                      src={
                        PRODUCT_IMAGES[item.slug] ||
                        PRODUCT_IMAGES["original-ramen"]
                      }
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-display font-bold text-foreground hover:text-primary transition-colors text-sm"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-0.5">
                          {item.purchaseType === "subscribe" ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-display font-bold uppercase tracking-wider">
                              Subscribe & Save 20%
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-display">
                              One-Time Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.slug, item.purchaseType)
                        }
                        className="text-muted-foreground hover:text-destructive transition-colors p-1 flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.slug,
                              item.purchaseType,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-display font-bold text-foreground w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.slug,
                              item.purchaseType,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-display font-bold text-primary text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-card rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="font-display text-lg font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="text-foreground font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span
                    className={
                      freeShipping
                        ? "text-green-400 font-semibold"
                        : "text-foreground"
                    }
                  >
                    {freeShipping ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="font-display font-bold text-foreground">
                    Total
                  </span>
                  <span className="font-display font-bold text-primary text-xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:hello@noodlebomb.co?subject=Pre-Order%20%E2%80%94%20${itemCount}%20item(s)&body=Hi%2C%20I%27d%20like%20to%20complete%20my%20pre-order%20for%20%24${subtotal.toFixed(2)}%20worth%20of%20sauces.`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-6 py-4 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--flame)/0.45)] hover:scale-[1.02] transition-all"
                >
                  <Package className="h-4 w-4" />
                  Complete Pre-Order
                </a>
                <Link
                  to="/shop"
                  className="w-full flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-full font-display text-sm font-semibold uppercase tracking-wider text-foreground/70 hover:border-primary/50 hover:text-primary transition-all"
                >
                  Continue Shopping
                </Link>
              </div>

              <p className="text-[11px] text-muted-foreground text-center mt-4">
                Ships week of May 5, 2026
              </p>

              <div className="mt-5 pt-5 border-t border-border/40 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground/40">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary/50" />
                  <span>100% Satisfaction Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/40">
                  <Truck className="h-3.5 w-3.5 text-primary/50" />
                  <span>Free shipping on orders $40+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
