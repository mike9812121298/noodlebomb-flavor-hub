export interface RelatedRecipe {
  slug: string;
  title: string;
}

const STORE_DOMAIN = "nu2vqa-ma.myshopify.com";
const API_VERSION = "2026-04";
const STOREFRONT_TOKEN = "f59fc9587d70903d22d0b8cc53e882b7";
const CACHE_TTL_MS = 5 * 60 * 1000;

const TITLE_OVERRIDES: Record<string, string> = {
  "original-chicken-ramen": "Original Chicken Ramen",
  "original-garlic-sesame-ramen": "Original Garlic Sesame Ramen",
  "original-crispy-chicken-rice-bowl": "Original Crispy Chicken Rice Bowl",
  "spicy-tokyo-chili-ramen": "Spicy Tokyo Chili Ramen",
  "spicy-tokyo-air-fryer-wings": "Spicy Tokyo Air Fryer Wings",
  "spicy-tokyo-chicken-rice-bowl": "Spicy Tokyo Chicken Rice Bowl",
  "citrus-shoyu-salmon-ramen": "Citrus Shoyu Salmon Ramen",
  "citrus-shoyu-grilled-wings": "Citrus Shoyu Grilled Wings",
  "citrus-shoyu-salmon-rice-bowl": "Citrus Shoyu Salmon Rice Bowl",
  "citrus-shoyu-cold-noodles": "Citrus Shoyu Cold Noodles",
};

const FALLBACK_RELATED_RECIPES: Record<string, string[]> = {
  original: ["original-chicken-ramen", "original-garlic-sesame-ramen", "original-crispy-chicken-rice-bowl"],
  "spicy-tokyo": ["spicy-tokyo-chili-ramen", "spicy-tokyo-air-fryer-wings", "spicy-tokyo-chicken-rice-bowl"],
  "citrus-shoyu": ["citrus-shoyu-salmon-ramen", "citrus-shoyu-grilled-wings", "citrus-shoyu-salmon-rice-bowl"],
  "the-noodlebomb-trio": ["original-chicken-ramen", "spicy-tokyo-chili-ramen", "citrus-shoyu-salmon-ramen"],
  "shoyu-reserve": ["citrus-shoyu-salmon-ramen", "original-garlic-sesame-ramen", "citrus-shoyu-cold-noodles"],
};

export const PRODUCT_TO_SHOPIFY_HANDLE: Record<string, string> = {
  "original-ramen": "original",
  "spicy-tokyo": "spicy-tokyo",
  "citrus-shoyu": "citrus-shoyu",
  "variety-pack": "the-noodlebomb-trio",
  "shoyu-reserve": "shoyu-reserve",
};

function cleanRecipeTitle(value: string) {
  return value.replace(/\b7\s*(?:fl\.?\s*)?oz\b/gi, "").replace(/\s{2,}/g, " ").trim();
}

export function titleFromRecipeSlug(slug: string) {
  if (TITLE_OVERRIDES[slug]) return cleanRecipeTitle(TITLE_OVERRIDES[slug]);
  return cleanRecipeTitle(
    slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  );
}

function toRecipes(handles: string[]): RelatedRecipe[] {
  return handles.slice(0, 3).map((slug) => ({ slug, title: titleFromRecipeSlug(slug) }));
}

function parseMetafieldValue(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 3) : [];
  } catch {
    return [];
  }
}

function cacheKey(handle: string) {
  return `nb_related_recipes:${handle}`;
}

export function getFallbackRelatedRecipes(handle: string) {
  return toRecipes(FALLBACK_RELATED_RECIPES[handle] ?? []);
}

export function getCachedRelatedRecipes(handle: string) {
  try {
    const cached = JSON.parse(window.localStorage.getItem(cacheKey(handle)) ?? "null") as
      | { savedAt: number; handles: string[] }
      | null;
    if (!cached || Date.now() - cached.savedAt > CACHE_TTL_MS) return null;
    return toRecipes(cached.handles);
  } catch {
    return null;
  }
}

function writeCachedRelatedRecipes(handle: string, handles: string[]) {
  try {
    window.localStorage.setItem(cacheKey(handle), JSON.stringify({ savedAt: Date.now(), handles }));
  } catch {
    // Cache is optional; fallback recipes keep the PDP complete.
  }
}

export async function fetchRelatedRecipes(handle: string) {
  const response = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query:
        'query ProductRelatedRecipes($handle: String!) { product(handle: $handle) { metafield(namespace: "custom", key: "related_recipes") { value type } } }',
      variables: { handle },
    }),
  });

  if (!response.ok) throw new Error(`Storefront API ${response.status}`);
  const payload = await response.json();
  const handles = parseMetafieldValue(payload?.data?.product?.metafield?.value);
  if (handles.length) writeCachedRelatedRecipes(handle, handles);
  return toRecipes(handles);
}
