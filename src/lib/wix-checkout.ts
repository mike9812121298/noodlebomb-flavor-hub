// NoodleBomb Wix Stores deep-link map.
//
// The public site (noodlebomb.co) is a React/Lovable app on Netlify with no
// checkout. The actual transaction engine is the Wix Stores instance hosted at
// the free Wix URL below. Every "Add to Cart" / "Pre-Order" CTA must hand the
// shopper off to a Wix product page so they can complete checkout.
//
// Source of truth for slugs: Wix Stores product catalog (pulled 2026-04-25).
// Map keys are the *internal* React-router slugs used across this codebase.
//
// Add new SKUs here when launching them. If a slug is unknown, the helper
// falls back to the Wix store homepage rather than the broken local cart.

export const WIX_STORE_BASE = "https://shop.noodlebomb.co";

// Map of internal React slugs -> Wix Stores slug
const WIX_PRODUCT_SLUG: Record<string, string> = {
  // Singles (NB-001 / NB-002 / NB-003)
  "original-ramen": "noodlebomb-original-ramen-sauce",
  "spicy-tokyo": "noodle-bomb-spicy-tokyo-ramen-sauce",
  "yuzu-citrus": "noodle-bomb-citrus-shoyu-ramen-sauce",
  "citrus-shoyu": "noodle-bomb-citrus-shoyu-ramen-sauce", // legacy alias
  // Bundles
  "variety-pack": "the-noodlebomb-trio", // NB-004 (live trio)
  "trio": "the-noodlebomb-trio",
  "sampler": "noodlebomb-variety-3-pack", // NB-005
  // 3-packs (NB-006 / NB-007 / NB-008)
  "original-3pack": "noodlebomb-original-ramen-sauce-3-pack",
  "citrus-shoyu-3pack": "noodlebomb-citrus-shoyu-ramen-sauce-3-pack",
  "spicy-tokyo-3pack": "noodlebomb-spicy-tokyo-ramen-sauce-3-pack",
  // 12-pack (NB-009)
  "original-12pack": "noodlebomb-original-ramen-sauce-12-pack",
  // Subscriptions (NB-010 / NB-011 / NB-012)
  "premium-ramen-box": "premium-ramen-box",
  "monthly-ramen-box": "monthly-ramen-box",
  "ramen-box": "monthly-ramen-box",
  "ramenbox": "monthly-ramen-box",
};

/**
 * Returns a Wix Stores deep link for an internal slug.
 * Falls back to the Wix store homepage for unknown slugs (never the local cart).
 */
export function getCheckoutUrl(slug?: string | null): string {
  if (!slug) return WIX_STORE_BASE;
  // Strip any leading "/product/" prefix the caller may have passed.
  const key = slug.replace(/^\/+/, "").replace(/^product\//, "").trim();
  const wixSlug = WIX_PRODUCT_SLUG[key];
  if (wixSlug) return `${WIX_STORE_BASE}/product-page/${wixSlug}`;
  return WIX_STORE_BASE;
}

/**
 * True if a URL targets the Wix store (i.e. an external checkout link).
 * Components can use this to choose between react-router <Link> and a real <a>.
 */
export function isExternalCheckout(url?: string | null): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}
