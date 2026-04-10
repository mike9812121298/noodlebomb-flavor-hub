import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import heroImage from "@/assets/hero-ramen.jpg";
import recipeWings from "@/assets/nb-recipe-wings.jpeg";
import recipeStirfry from "@/assets/nb-recipe-stirfry.jpeg";
import recipePulledpork from "@/assets/nb-recipe-pulledpork.png";

const categories = ["All", "Ramen", "Rice Bowls", "Grilling", "Quick Meals", "Seafood", "Under 20 Min"];

const recipes = [
  { title: "Spicy Miso Ramen", image: heroImage, time: "25 min", difficulty: "Medium", bestWith: "Spicy Tokyo", calories: "480", category: "Ramen" },
  { title: "Garlic Butter Rice Bowl", image: recipeStirfry, time: "15 min", difficulty: "Easy", bestWith: "Original", calories: "350", category: "Rice Bowls" },
  { title: "Grilled Chicken Thighs", image: recipeWings, time: "20 min", difficulty: "Easy", bestWith: "Original", calories: "320", category: "Grilling" },
  { title: "5-Minute Egg Drop Noodles", image: heroImage, time: "5 min", difficulty: "Easy", bestWith: "Original", calories: "280", category: "Quick Meals" },
  { title: "Citrus Shrimp Skewers", image: recipeStirfry, time: "15 min", difficulty: "Easy", bestWith: "Citrus Shoyu", calories: "220", category: "Seafood" },
  { title: "Tokyo Fire Wings", image: recipeWings, time: "18 min", difficulty: "Medium", bestWith: "Spicy Tokyo", calories: "450", category: "Grilling" },
  { title: "NoodleBomb Pulled Pork", image: recipePulledpork, time: "45 min", difficulty: "Medium", bestWith: "Original", calories: "520", category: "Grilling" },
  { title: "Spicy Tuna Rice Bowl", image: heroImage, time: "10 min", difficulty: "Easy", bestWith: "Spicy Tokyo", calories: "410", category: "Rice Bowls" },
  { title: "NoodleBomb Stir-Fry", image: recipeStirfry, time: "12 min", difficulty: "Easy", bestWith: "Original", calories: "380", category: "Quick Meals" },
];

function parseMinutes(time: string) {
  const match = time.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 99;
}

const Recipes = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [active, setActive] = useState(
    categories.includes(initialCategory) ? initialCategory : "All"
  );

  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    if (categories.includes(cat)) setActive(cat);
  }, [searchParams]);

  const filtered = active === "All"
    ? recipes
    : active === "Under 20 Min"
    ? recipes.filter((r) => parseMinutes(r.time) <= 20)
    : recipes.filter((r) => r.category === active);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container py-12">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 bg-gradient-fire rounded-2xl px-6 py-4 flex items-center gap-3"
        >
          <Flame className="h-5 w-5 text-primary-foreground" />
          <span className="font-display text-sm font-bold text-primary-foreground uppercase tracking-wider">
            Every Recipe — Cooked With Noodle Bomb
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4 block">Recipes</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Cook With the Bomb</h1>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full font-display text-xs font-semibold uppercase tracking-wider transition-all ${
                active === cat
                  ? "bg-gradient-fire text-primary-foreground shadow-fire"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <RecipeCard {...r} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
