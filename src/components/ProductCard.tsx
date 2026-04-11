import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronDown } from "lucide-react";
import SpiceLevel from "@/components/SpiceLevel";

const ingredientData: Record<string, { ingredients: string; allergens: string }> = {
  "Original Ramen Sauce": {
    ingredients: "Water, Soy Sauce (Water, Wheat, Soybeans, Salt), Mirin, Sake, Garlic, Ginger, Sesame Oil.",
    allergens: "Soy, Wheat (Gluten), Sesame.",
  },
  "Spicy Tokyo Ramen Sauce": {
    ingredients: "Water, Soy Sauce (Water, Wheat, Soybeans, Salt), Mirin, Sake, Chili Paste, Garlic, Ginger, Sesame Oil.",
    allergens: "Soy, Wheat (Gluten), Sesame.",
  },
  "Citrus Shoyu Ramen Sauce": {
    ingredients: "Water, Soy Sauce (Water, Wheat, Soybeans, Salt), Citrus Juice (Yuzu, Sudachi), Mirin, Sake, Garlic, Sesame Oil.",
    allergens: "Soy, Wheat (Gluten), Sesame.",
  },
};

interface ProductCardProps {
  name: string;
  tagline: string;
  price: string;
  image: string;
  spiceLevel: number;
  color: string;
  pairsWellWith?: string[];
  subscribePrice?: string;
  flavorHook?: string;
  badge?: string;
  buyUrl?: string;
  comingSoon?: boolean;
  proTip?: string;
}

const ProductCard = ({ name, tagline, price, image, spiceLevel, color, pairsWellWith, subscribePrice, flavorHook, badge, buyUrl, comingSoon, proTip }: ProductCardProps) => {
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscribe">("subscribe");
  const [showDetails, setShowDetails] = useState(false);

  const details = ingredientData[name];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-gradient-card rounded-2xl border border-border overflow-hidden transition-shadow duration-500 hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)] hover:border-primary/20"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-card rounded-t-2xl flex items-center justify-center px-4 pt-6">
        {image ? (
          <img src={image} alt={name} className={`h-full w-auto object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.08] ${comingSoon ? "opacity-60" : ""}`} />
        ) : (
          <div className={`text-5xl ${comingSoon ? "opacity-60" : ""}`}>🍜</div>
        )}
        {comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-5 py-2 rounded-full bg-background/90 border border-border text-foreground font-display text-sm font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-display font-semibold uppercase tracking-wider ${color}`}>
            {name}
          </span>
        </div>
        {badge && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-gradient-fire text-primary-foreground text-[10px] font-display font-bold uppercase tracking-wider shadow-fire">
              {badge}
            </span>
          </div>
        )}
        {/* Dark gradient behind product name */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-1">{name}</h3>
        {!comingSoon && <p className="font-display text-2xl font-bold text-primary mb-1.5">{price}</p>}
        <p className="text-sm text-foreground/70 mb-2">{tagline}</p>
        {flavorHook && (
          <p className="text-xs font-display font-bold uppercase tracking-wider text-foreground/50 mb-3">{flavorHook}</p>
        )}
        <div className="mb-4">
          <SpiceLevel level={spiceLevel} />
        </div>
        {pairsWellWith && pairsWellWith.length > 0 && (
          <p className="text-xs text-muted-foreground mb-4">
            <span className="text-foreground/70 font-display font-semibold">Pairs well with:</span>{" "}
            {pairsWellWith.join(", ")}
          </p>
        )}
        {proTip && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-[11px] text-foreground/60 leading-relaxed">
              <span className="font-display font-bold text-primary uppercase tracking-wider text-[10px]">Pro Tip: </span>
              {proTip}
            </p>
          </div>
        )}

        {/* Ingredients & Allergens accordion */}
        {details && (
          <div className="mb-4 border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-xs font-display font-bold uppercase tracking-wider text-foreground/70">Details</span>
              <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
            </button>
            {showDetails && (
              <div className="px-4 py-3 space-y-2">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  <span className="font-display font-semibold text-foreground/70 uppercase tracking-wider text-[10px]">Ingredients: </span>
                  {details.ingredients}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  <span className="font-display font-semibold text-orange-400 uppercase tracking-wider text-[10px]">Allergens: </span>
                  {details.allergens}
                </p>
              </div>
            )}
          </div>
        )}

        {!comingSoon && (
          <>
            {/* Purchase type selector */}
            {subscribePrice && (
              <div className="mb-4 space-y-2">
                <label
                  className={`flex items-center gap-2 cursor-pointer text-sm px-3 py-2 rounded-lg transition-all ${
                    purchaseType === "one-time" ? "bg-secondary/50 border border-border" : "border border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name={`purchase-${name}`}
                    checked={purchaseType === "one-time"}
                    onChange={() => setPurchaseType("one-time")}
                    className="accent-primary"
                  />
                  <span className="text-foreground/80">One-Time Purchase</span>
                </label>
                <label
                  className={`flex items-center gap-2 cursor-pointer text-sm px-3 py-2 rounded-lg transition-all ${
                    purchaseType === "subscribe"
                      ? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.1)]"
                      : "border border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name={`purchase-${name}`}
                    checked={purchaseType === "subscribe"}
                    onChange={() => setPurchaseType("subscribe")}
                    className="accent-primary"
                  />
                  <span className="text-primary font-display font-semibold">Subscribe & Save 20%</span>
                </label>
                {purchaseType === "subscribe" && (
                  <p className="text-[11px] text-muted-foreground pl-3">Delivered every 30 days. Cancel or skip anytime.</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-2xl font-bold text-primary">
                  {purchaseType === "subscribe" && subscribePrice ? subscribePrice : price}
                </span>
              </div>
              <div className="text-center">
                <a
                  href={buyUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-full text-sm font-display font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-105"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Pre-Order
                </a>
                <p className="text-[11px] font-display text-muted-foreground mt-2 tracking-wide">Ships week of May 5, 2026</p>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
