import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Lock,
  Mail,
  ExternalLink,
  CheckCircle2,
  Repeat,
  Tag,
  Flame,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { getCheckoutUrl, WIX_STORE_BASE } from "@/lib/wix-checkout";
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

const FREE_SHIPPING_THRESHOLD = 40;
const EMAIL_KEY = "nb_checkout_email";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, itemCount, freeShipping, clearCart } = useCart();

  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [step] = useState<1 | 2 | 3>(2);

  // Restore stashed email on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMAIL_KEY);
      if (stored) {
        setEmail(stored);
        setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Empty cart → bounce back to /cart
  useEffect(() => {
    if (itemCount === 0 && !redirecting) {
      navigate("/cart", { replace: true });
    }
  }, [itemCount, redirecting, navigate]);

  const validateEmail = (value: string) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(ok);
    if (ok) {
      try {
        localStorage.setItem(EMAIL_KEY, value);
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const estimatedDelivery = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + 5);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  }, []);

  const wixCheckoutUrl =
    items.length === 1 ? getCheckoutUrl(items[0]?.slug) : WIX_STORE_BASE;

  const handleProceed = () => {
    if (!emailValid) {
      setEmailTouched(true);
      return;
    }
    setRedirecting(true);
    // Open the Wix store in a new tab so the cart isn't lost if they bounce back
    window.open(wixCheckoutUrl, "_blank", "noopener,noreferrer");
  };

  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  if (itemCount === 0) {
    return null; // useEffect above will redirect
  }

  return (
    <div className="relative min-h-screen bg-background pt-24 pb-32 md:pb-20 overflow-hidden">
      <EmberParticles count={6} />

      <div className="container relative z-10 py-10 md:py-12 max-w-6xl">
        {/* Header + step indicator */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              <span className="text-gradient-fire">Checkout</span>
            </h1>

            {/* Stepper */}
            <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-[0.2em]">
              {[
                { n: 1, label: "Cart" },
                { n: 2, label: "Review" },
                { n: 3, label: "Pay" },
              ].map((s, i) => {
                const active = s.n === step;
                const done = s.n < step;
                return (
                  <div key={s.n} className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1.5 ${
                        active
                          ? "text-primary"
                          : done
                          ? "text-foreground/50"
                          : "text-foreground/30"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          active
                            ? "bg-gradient-fire text-primary-foreground shadow-fire"
                            : done
                            ? "bg-foreground/20 text-foreground/70"
                            : "bg-secondary/40 border border-border/60 text-foreground/40"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-3 w-3" /> : s.n}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < 2 && (
                      <span
                        className={`w-6 h-px ${
                          done ? "bg-foreground/30" : "bg-border/40"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column — review + email */}
          <div className="lg:col-span-3 space-y-5">
            {/* Email capture */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-4 w-4 text-primary/80" />
                <h2 className="font-display text-base font-bold text-foreground">
                  Contact Information
                </h2>
              </div>

              <label className="text-[11px] font-display font-bold uppercase tracking-[0.15em] text-foreground/55 mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                onBlur={() => setEmailTouched(true)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl bg-secondary/40 border text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors font-display ${
                  emailTouched && !emailValid
                    ? "border-destructive/60 focus:border-destructive"
                    : "border-border/60 focus:border-primary/50"
                }`}
              />
              {emailTouched && !emailValid && (
                <p className="text-xs text-destructive mt-1.5 font-display">
                  Please enter a valid email address.
                </p>
              )}

              <label className="flex items-start gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border/60 bg-secondary/40 accent-[hsl(var(--flame))] cursor-pointer"
                />
                <span className="text-xs text-foreground/65 font-display leading-relaxed">
                  Email me product drops, recipes, and the occasional discount.
                  Unsubscribe anytime.
                </span>
              </label>
            </motion.div>

            {/* Order review */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="card-premium rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-foreground">
                  Your Order ({itemCount} {itemCount === 1 ? "item" : "items"})
                </h2>
                <Link
                  to="/cart"
                  className="text-xs font-display font-semibold uppercase tracking-wider text-primary/80 hover:text-primary transition-colors"
                >
                  Edit
                </Link>
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  const isSubscription = item.purchaseType === "subscribe";
                  return (
                    <div
                      key={`${item.slug}-${item.purchaseType}`}
                      className="flex gap-3 items-start"
                    >
                      <div className="relative w-16 h-16 rounded-xl bg-secondary/40 border border-border/60 flex items-center justify-center p-1.5 flex-shrink-0">
                        <img
                          src={
                            PRODUCT_IMAGES[item.slug] ||
                            PRODUCT_IMAGES["original-ramen"]
                          }
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-display font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-foreground text-sm leading-tight">
                          {item.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {isSubscription ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 text-[9px] font-display font-bold uppercase tracking-wider text-primary">
                              <Repeat className="h-2 w-2" />
                              Subscription
                            </span>
                          ) : (
                            <span className="text-[10px] font-display uppercase tracking-wider text-foreground/45">
                              One-time
                            </span>
                          )}
                          <span className="text-[10px] font-display uppercase tracking-wider text-foreground/40">
                            ${item.price.toFixed(2)} each
                          </span>
                        </div>
                      </div>
                      <span className="font-display font-bold text-foreground text-sm tabular-nums whitespace-nowrap">
                        ${lineTotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Wix handoff explainer */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-fire flex items-center justify-center shadow-fire flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-display font-bold text-foreground mb-1">
                    You'll finish on our secure store.
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    Payment, shipping, and tax are handled on{" "}
                    <span className="text-primary font-semibold">
                      shop.noodlebomb.co
                    </span>
                    . When you click below, we'll open it in a new tab —{" "}
                    {items.length > 1
                      ? `add your ${itemCount} items there to complete the order. `
                      : ""}
                    Your cart here stays saved.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column — sticky summary + checkout */}
          <div className="lg:col-span-2">
            <div className="card-premium rounded-2xl p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-bold text-foreground mb-1">
                Total
              </h2>
              <p className="text-xs text-muted-foreground/80 mb-5">
                Tax + shipping calculated on next page
              </p>

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
                    {freeShipping ? "FREE" : "Calculated"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated tax</span>
                  <span className="text-foreground/55">Calculated</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="font-display font-bold text-foreground">
                    Subtotal
                  </span>
                  <span className="font-display font-bold text-primary text-2xl tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo + delivery */}
              {!freeShipping && amountToFreeShipping > 0 && (
                <div className="mb-4 px-3 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-[11px] text-foreground/60 font-display flex items-start gap-2">
                  <Tag className="h-3 w-3 mt-0.5 text-primary/70 flex-shrink-0" />
                  <span>
                    Add ${amountToFreeShipping.toFixed(2)} more to your cart to
                    unlock free shipping.{" "}
                    <Link
                      to="/cart"
                      className="text-primary hover:underline font-semibold"
                    >
                      Edit cart →
                    </Link>
                  </span>
                </div>
              )}

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

              {/* Primary CTA */}
              <button
                onClick={handleProceed}
                disabled={!emailValid || redirecting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-6 py-4 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--flame)/0.45)] hover:scale-[1.02] transition-all btn-shimmer animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {redirecting ? (
                  <>
                    <ExternalLink className="h-3.5 w-3.5" />
                    Opening Secure Checkout…
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Pay ${subtotal.toFixed(2)} →
                  </>
                )}
              </button>

              {/* Redirected confirmation */}
              {redirecting && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 text-xs text-foreground/80 font-display"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">
                        New tab opened.
                      </p>
                      <p className="mt-1 leading-relaxed">
                        If nothing happened, your browser may have blocked the
                        popup —{" "}
                        <a
                          href={wixCheckoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-semibold"
                        >
                          click here
                        </a>{" "}
                        to open the checkout manually.
                      </p>
                      <button
                        onClick={() => {
                          clearCart();
                          navigate("/");
                        }}
                        className="mt-2 text-[11px] uppercase tracking-wider text-foreground/55 hover:text-primary transition-colors"
                      >
                        I finished my order — clear my cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Trust signals */}
              <div className="mt-5 pt-5 border-t border-border/40 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-foreground/55">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                  <span>Secure 256-bit SSL · PCI-compliant payment</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-foreground/55">
                  <Truck className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                  <span>Free shipping on orders $40+</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-foreground/55">
                  <Repeat className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                  <span>30-day satisfaction guarantee</span>
                </div>
              </div>

              {/* Payment methods */}
              <div className="mt-5 pt-5 border-t border-border/40">
                <p className="text-[10px] font-display uppercase tracking-[0.15em] text-foreground/40 mb-2">
                  We Accept
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Visa", "Mastercard", "Amex", "Discover", "Apple Pay", "Google Pay"].map(
                    (m) => (
                      <span
                        key={m}
                        className="px-2 py-1 rounded-md bg-secondary/40 border border-border/40 text-[10px] font-display font-semibold text-foreground/70"
                      >
                        {m}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom incentive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 text-xs font-display font-semibold uppercase tracking-[0.15em] text-foreground/45 hover:text-primary transition-colors"
          >
            <Flame className="h-3 w-3" />
            Browse recipes while you wait
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
        <div className="container flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-display uppercase tracking-wider text-foreground/50">
              Total
            </p>
            <p className="font-display font-bold text-primary text-lg tabular-nums">
              ${subtotal.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleProceed}
            disabled={!emailValid || redirecting}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-fire px-5 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_30px_hsl(var(--flame)/0.4)] disabled:opacity-50 disabled:shadow-none"
          >
            <Lock className="h-3.5 w-3.5" />
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
