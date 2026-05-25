import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";
import {
  fetchRelatedRecipes,
  getCachedRelatedRecipes,
  getFallbackRelatedRecipes,
  RelatedRecipe,
} from "@/lib/relatedRecipes";

interface RelatedRecipesProps {
  shopifyHandle: string;
}

const RelatedRecipes = ({ shopifyHandle }: RelatedRecipesProps) => {
  const [recipes, setRecipes] = useState<RelatedRecipe[]>(() => getFallbackRelatedRecipes(shopifyHandle));

  useEffect(() => {
    const cached = getCachedRelatedRecipes(shopifyHandle);
    if (cached?.length) setRecipes(cached);

    let active = true;
    fetchRelatedRecipes(shopifyHandle)
      .then((nextRecipes) => {
        if (active && nextRecipes.length) setRecipes(nextRecipes);
      })
      .catch(() => {
        // Static fallback keeps the section complete if Shopify is unavailable.
      });

    return () => {
      active = false;
    };
  }, [shopifyHandle]);

  if (!recipes.length) return null;

  return (
    <section className="mt-20 border-t border-border/60 pt-14">
      <div className="mb-7 text-center">
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70">
          Try this sauce on
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
          Built for more than ramen
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {recipes.map((recipe) => (
          <Link
            key={recipe.slug}
            to={`/recipes/${recipe.slug}`}
            className="group grid min-h-28 grid-cols-[64px_1fr] items-center gap-4 rounded-2xl border border-border bg-card/70 p-4 transition-colors hover:border-primary/40"
          >
            <span className="grid h-16 w-16 place-items-center rounded-xl border border-border bg-primary/10 text-primary">
              <ChefHat className="h-6 w-6" />
            </span>
            <span>
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Recipe
              </span>
              <strong className="mt-1 block font-display text-lg leading-tight text-foreground group-hover:text-primary">
                {recipe.title}
              </strong>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedRecipes;
