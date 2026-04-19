import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
  Truck,
} from "lucide-react";
import SpiceLevel from "@/components/SpiceLevel";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import nbOriginal from "@/assets/nb-original-clean.png";
import nbSpicyTokyo from "@/assets/nb-spicy-tokyo-clean.png";
import nbCitrusShoyu from "@/assets/nb-citrus-shoyu-clean.png";
import nbLineupTrio from "@/assets/nb-lineup-trio-clean.png";

interface ProductData {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  displayPrice: string;
  subscribePrice: number | null;
  displaySubscribePrice: string | null;
  image: string;
  spiceLevel: number;
  pairsWellWith: string[];
  flavorHook: string;
  badge?: string;
  description: string;
  ingredients: string;
  allergens: string;
}

const PRODUCTS: Record<string, ProductData> = {
  "original-ramen": {
    slug: "original-ramen",
    name: "Original Ramen Sauce",
    tagline: "Umami, Perfected",
    price: 11.99,
    displayPrice: "$11.99",
    subscribePrice: 9.59,
    displaySubscribePrice: "$9.59/mo",
    image: nbOriginal,
    spiceLevel: 1,
    pairsWellWith: ["Ramen", "Rice Bowls", "Stir Fry"],
    flavorHook: "Bold. Balanced. Essential.",
    badge: "⭐ Best Seller",
    description:
      "Deep soy umami anchored by garlic, ginger, and sesame oil — with a whisper of sweetness and medium heat. Balanced and versatile, it's built for ramen, rice bowls, and grilled proteins alike. The one that goes with everything.",
    ingredients:
      "Water, Soy Sauce (Water, Wheat, Soybeans, Salt), Mirin, Sake, Garlic, Ginger, Sesame Oil.",
    allergens: "Soy, Wheat (Gluten), Sesame.",
  },
  "spicy-tokyo": {
    slug: "spicy-tokyo",
    name: "Spicy Tokyo Ramen Sauce",
    tagline: "Street Heat Legend",
    price: 11.99,
    displayPrice: "$11.99",
    subscribePrice: 9.59,
    displaySubscribePrice: "$9.59/mo",
    image: nbSpicyTokyo,
    spiceLevel: 3,
    pairsWellWith: ["Wings", "Fried Rice", "Steak"],
    flavorHook: "Heat That Hooks You.",
    badge: "🔥 Most Popular",
    description:
      "Fiery, chili-forward heat layered over dark roasted soy and sesame oil — more intense than Original, less garlic-forward, pure Tokyo street energy. Hot enough to hook you, with enough umami depth to keep pulling you back. Turn up the heat without losing the flavor.",
    ingredients:
      "Water, Soy Sauce (Water, Wheat, Soybeans, Salt), Mirin, Sake, Chili Paste, Garlic, Ginger, Sesame Oil.",
    allergens: "Soy, Wheat (Gluten), Sesame.",
  },
  "citrus-shoyu": {
    slug: "citrus-shoyu",
    name: "Citrus Shoyu Ramen Sauce",
    tagline: "Bright Side of Bold",
    price: 11.99,
    displayPrice: "$11.99",
    subscribePrice: 9.59,
    displaySubscribePrice: "$9.59/mo",
    image: nbCitrusShoyu,
    spiceLevel: 1,
    pairsWellWith: ["Seafood", "Shrimp", "Salads"],
    flavorHook: "Bright. Tangy. Fresh.",
    description:
      "Bright citrus and sudachi lift a clean soy base into something tangy, fresh, and surprisingly addictive. Mild heat with a citrus-forward profile — best on light ramen, sushi, fish, and anything where brightness matters. The fresh, light counterpart to the deeper sauces.",
    ingredients:
      "Water, Soy Sauce (Water, Wheat, Soybeans, Salt), Citrus Juice (Yuzu, Sudachi), Mirin, Sake, Garlic, Sesame Oil.",
    allergens: "Soy, Wheat (Gluten), Sesame.",
  },
  "variety-pack": {
    slug: "variety-pack",
    name: "Variety 3-Pack",
    tagline: "The Full Flavor Hit",
    price: 29.99,
    displayPrice: "$29.99",
    subscribePrice: null,
    displaySubscribePrice: null,
    image: nbLineupTrio,
    spiceLevel: 2,
    pairsWellWith: ["Everything"],
    flavorHook: "One of Each. All the Flavor.",
    badge: "🎁 Best Value",
    description:
      "Original, Spicy Tokyo, and Citrus Shoyu — the complete NoodleBomb lineup in one box. Free shipping included.",
    ingredients:
      "Includes Original Ramen Sauce, Spicy Tokyo Ramen Sauce, and Citrus Shoyu Ramen Sauce.",
    allergens: "Soy, Wheat (Gluten), Sesame.",
  },
};

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, itemCount } = useCart();
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = slug ? PRODUCTS[slug] : null;

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4 bg-background pt-24">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Product not found
        </h1>
        <Link to="/shop" className="text-primary hover:underline font-display">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      purchaseType: "one-time",
    });
    setAddedToCart(true);
    toast({
      title: "Added to cart!",
      description: `${product.name} added.`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 md:pb-0">
      <div className="container py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square bg-gradient-card rounded-3xl border border-border overflow-hidden flex items-center justify-center p-10"
          >
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-gradient-fire text-primary-foreground text-xs font-display font-bold uppercase tracking-wider shadow-fire">
                  {product.badge}
                </span>
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-auto object-contain transition-transform duration-500 hover:scale-105"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary block mb-2">
                {product.tagline}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {product.name}
              </h1>
              <p className="text-xs font-display font-bold uppercase tracking-wider text-foreground/50 mt-1">
                {product.flavorHook}
              </p>
            </div>

            <p className="text-foreground/80 text-base leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <SpiceLevel level={product.spiceLevel} />
              {product.pairsWellWith.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground/70 font-semibold">
                    Pairs with:
                  </span>{" "}
                  {product.pairsWellWith.join(", ")}
                </span>
              )}
            </div>



            {/* Price + CTA */}
            <div className="pt-2">
              <div className="flex items-end gap-2 mb-4">
                <span className="font-display text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all ${
                    addedToCart
                      ? "bg-green-500 scale-[0.98]"
                      : "bg-gradient-fire hover:shadow-[0_0_40px_hsl(var(--flame)/0.45)] hover:scale-[1.02]"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {addedToCart ? "Added!" : "Add to Cart"}
                </button>
                <Link
                  to="/cart"
                  className="px-5 py-4 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all font-display text-sm font-bold uppercase tracking-wider text-foreground/70 whitespace-nowrap"
                >
                  Cart{itemCount > 0 && ` (${itemCount})`}
                </Link>
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-3"><Truck className="h-3.5 w-3.5" />
                Pre-order · Ships May 8, 2026</p><p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-1.5"><ShieldCheck className="h-3.5 w-3.5" />30-day money-back guarantee. Love it or we refund you.
              </p>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-6 pt-2 border-t border-border/40">
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                <Truck className="h-4 w-4 text-primary/60" />
                Free shipping on $40+
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                <ShieldCheck className="h-4 w-4 text-primary/60" />
                100% Satisfaction Guaranteed
              </div>
            </div>

            {/* Ingredients accordion */}
            <div className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <span className="text-xs font-display font-bold uppercase tracking-wider text-foreground/70">
                  Ingredients & Allergens
                </span>
                <motion.div
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-4 h-4 text-primary" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {showDetails && (
                  <motion.div
                    key="details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-4 py-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/70 uppercase text-[10px] tracking-wider">
                          Ingredients:{" "}
                        </span>
                        {product.ingredients}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-orange-400 uppercase text-[10px] tracking-wider">
                          Allergens:{" "}
                        </span>
                        {product.allergens}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
