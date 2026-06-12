import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, ChevronRight, Clock, Mail, Megaphone, Users } from "lucide-react";
import {
  GENERATED_BLOG_POSTS,
  GENERATED_EMAIL_CAMPAIGNS,
  GENERATED_RECIPES,
  GENERATED_SOCIAL_POSTS,
  RECIPE_FLAVORS,
  RECIPE_USE_CASES,
} from "@/lib/generatedRecipeContent";

const CATEGORY_ALIASES: Record<string, string[]> = {
  Grilling: ["wings", "marinade"],
  "Quick Meals": ["ramen", "stir-fry", "dipping-sauce"],
  Seafood: ["citrus-shoyu"],
  Ramen: ["ramen"],
  "Rice Bowls": ["rice-bowl"],
};

function filterIdsFromParam(value: string | null) {
  if (!value) return [];
  const decoded = decodeURIComponent(value);
  return CATEGORY_ALIASES[decoded] ?? [decoded.toLowerCase().replace(/\s+/g, "-")];
}

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeIds = filterIdsFromParam(searchParams.get("category"));
  const activeFlavor = searchParams.get("flavor");

  useEffect(() => {
    document.title = "Recipes | NoodleBomb Ramen Sauce";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Twenty-four NoodleBomb recipe ideas organized by flavor: ramen, rice bowls, wings, marinades, stir fry, and dipping sauces.";
  }, []);

  const recipes = useMemo(() => {
    return GENERATED_RECIPES.filter((recipe) => {
      const categoryMatch =
        activeIds.length === 0 ||
        activeIds.includes(recipe.category) ||
        activeIds.includes(recipe.flavorId);
      const flavorMatch = !activeFlavor || recipe.flavorId === activeFlavor;
      return categoryMatch && flavorMatch;
    });
  }, [activeFlavor, activeIds]);

  const clearFilters = () => setSearchParams({});
  const setCategory = (category: string) => setSearchParams({ category });
  const setFlavor = (flavor: string) => setSearchParams({ flavor });

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Recipe Content Engine
          </span>
          <h1 className="mt-4 font-display text-4xl font-black text-foreground md:text-6xl">
            More ways to eat. More reasons to buy.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Twenty-four edible use cases organized by flavor: ramen, rice bowls,
            wings, marinades, stir fry, and dipping sauces.
          </p>
        </motion.div>

        <div className="mb-10 grid gap-3 md:grid-cols-4">
          {[
            { label: "Recipes", value: GENERATED_RECIPES.length, icon: BookOpen },
            { label: "Social Posts", value: GENERATED_SOCIAL_POSTS.length, icon: Megaphone },
            { label: "Blog Drafts", value: GENERATED_BLOG_POSTS.length, icon: BookOpen },
            { label: "Email Campaigns", value: GENERATED_EMAIL_CAMPAIGNS.length, icon: Mail },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-4 font-display text-3xl font-black text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mb-10 rounded-2xl border border-border bg-card/60 p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className={`rounded-full px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition ${
                activeIds.length === 0 && !activeFlavor
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {RECIPE_USE_CASES.map((useCase) => (
              <button
                key={useCase.id}
                type="button"
                onClick={() => setCategory(useCase.label)}
                className={`rounded-full px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition ${
                  activeIds.includes(useCase.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {useCase.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {RECIPE_FLAVORS.map((flavor) => (
              <button
                key={flavor.id}
                type="button"
                onClick={() => setFlavor(flavor.id)}
                className={`rounded-full px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition ${
                  activeFlavor === flavor.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {flavor.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Recipe Library
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-foreground">
              {recipes.length} ideas showing
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-fire px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:shadow-fire"
          >
            Shop Sauces <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {recipes.map((recipe, index) => (
            <motion.article
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.25) }}
              className="rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/30"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-1 font-display text-xs font-bold uppercase tracking-wider text-primary">
                  {recipe.flavorName}
                </span>
                <span className="rounded-full bg-background px-2 py-1 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {recipe.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {recipe.time}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  Serves {recipe.serves}
                </span>
              </div>
              <h3 className="mb-2 font-display text-xl font-bold text-foreground">
                {recipe.title}
              </h3>
              <p className="mb-4 text-sm leading-6 text-muted-foreground">{recipe.hook}</p>

              <div className="mb-5 rounded-xl border border-border bg-background/70 p-4">
                <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Ingredients
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {recipe.ingredients.join(", ")}
                </p>
              </div>

              <ol className="mb-6 space-y-2">
                {recipe.steps.map((step, stepIndex) => (
                  <li key={step} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <span className="font-display font-bold text-primary">{stepIndex + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <Link
                to={recipe.flavorUrl}
                className="inline-flex items-center gap-1 font-display text-sm font-bold text-primary transition-colors hover:text-orange-400"
              >
                Shop {recipe.flavorName} <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
