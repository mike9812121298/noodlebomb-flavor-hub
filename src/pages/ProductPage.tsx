import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCheckoutUrl } from "@/lib/wix-checkout";
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
    flavorHook: "Deep umami that makes every bowl taste intentional.",
    badge: "⭐ Best Seller",
    description:
      "Dark soy anchors a foundation of roasted garlic, warm ginger, and toasted sesame — then a slow medium heat moves through and settles. No sharp edges. It coats noodles instead of sitting on top, glazes protein without fighting the other flavors. Balanced enough for rice bowls, punchy enough for the wok. The one you reach for without thinking. The entry point that never gets old.",
    ingredients:
      "Water, light soy sauce (water, soybeans, wheat, salt, sugar, preservative), brown sugar, rice vinegar, lemon juice (water, lemon juice from concentrate, preservatives), mirin (water, rice, sugar, alcohol, salt), honey, sesame oil, beef bouillon (salt, oil, monosodium glutamate, starch, sugar, beef, milk ingredient, natural flavors, color, preservatives), garlic, mushroom seasoning (salt, maltodextrin, sugar, yeast extract, mushroom powder), gochujang (rice, water, sweetener, chili pepper, salt, soybeans, wheat, garlic, spices), sriracha (chili peppers, sugar, salt, garlic, vinegar, preservatives, xanthan gum), chili flakes, monosodium glutamate, ginger powder, xanthan gum.",
    allergens: "Soy, wheat, milk, sesame, sulphites.",
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
    flavorHook: "Tokyo street heat — dark, layered, built to burn clean.",
    badge: "🔥 Most Popular",
    description:
      "Chili-forward from the first drop. Dark roasted soy and sesame thread underneath, giving the heat something to stand on. The burn arrives fast and settles in the back of your throat — but there's enough umami depth to keep you coming back. Not just hot. Layered. Built for when you want the heat to be the main event, not an afterthought. Intensity without apology.",
    ingredients:
      "Water, light soy sauce (water, soybeans, wheat, salt, sugar), rice vinegar, lemon juice (water, lemon juice from concentrate, preservatives), mirin (water, rice, sugar, alcohol, salt), brown sugar, honey, sesame oil, beef bouillon (salt, oil, monosodium glutamate, starch, sugar, beef, milk ingredient, natural flavors, color, preservatives), garlic, mushroom seasoning (salt, maltodextrin, sugar, yeast extract, mushroom powder), gochujang (rice, water, sweetener, chili pepper, salt, soybeans, wheat, garlic, spices), sriracha (chili peppers, sugar, salt, garlic, vinegar, preservatives, xanthan gum), chili flakes, monosodium glutamate, ginger powder, xanthan gum.",
    allergens: "Soy, wheat, milk, sesame, sulphites.",
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
    flavorHook: "Clean soy lifted by yuzu — bright, sharp, surprisingly bold.",
    description:
      "Yuzu-forward citrus breaks over a lighter shoyu base — tangy and bright up front, with a mild heat that whispers rather than burns. The texture runs lean and clean, coating without weighing anything down. Drizzle it cold, use it as a finish. Opens up seafood, brightens cold noodle bowls, cuts through anything fatty. The sauce that proves bold and bright aren't opposites.",
    ingredients:
      "Water, light soy sauce (water, soybeans, wheat, salt, sugar), rice vinegar, lemon juice (water, lemon juice from concentrate, preservatives), orange juice (water, orange juice from concentrate, preservatives), mirin (water, rice, sugar, alcohol, salt), brown sugar, honey, sesame oil, beef bouillon (salt, oil, monosodium glutamate, starch, sugar, beef, milk ingredient, natural flavors, color, preservatives), garlic, mushroom seasoning (salt, maltodextrin, sugar, yeast extract, mushroom powder), gochujang (rice, water, sweetener, chili pepper, salt, soybeans, wheat, garlic, spices), sriracha (chili peppers, sugar, salt, garlic, vinegar, preservatives, xanthan gum), chili flakes, monosodium glutamate, ginger powder, xanthan gum.",
    allergens: "Soy, wheat, milk, sesame, sulphites.",
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
                <a
                  href={getCheckoutUrl(slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground bg-gradient-fire hover:shadow-[0_0_40px_hsl(var(--flame)/0.45)] hover:scale-[1.02] transition-all"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Order Now
                </a>
                <Link
                  to="/cart"
                  className="px-5 py-4 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all font-display text-sm font-bold uppercase tracking-wider text-foreground/70 whitespace-nowrap"
                >
                  Cart{itemCount > 0 && ` (${itemCount})`}
                </Link>
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-3"><Truck className="h-3.5 w-3.5" />
                Free shipping · Ships from WA</p><p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-1.5"><ShieldCheck className="h-3.5 w-3.5" />30-day money-back guarantee. Love it or we refund you.
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
