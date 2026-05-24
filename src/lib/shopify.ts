import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import type { CartItem } from "@/hooks/useCart";

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "nu2vqa-ma.myshopify.com";
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || "2026-04";
const STOREFRONT_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "f59fc9587d70903d22d0b8cc53e882b7";

export const SHOPIFY_HANDLES: Record<string, string> = {
  original: "original",
  "original-ramen": "original",
  spicy: "spicy-tokyo",
  "spicy-tokyo": "spicy-tokyo",
  citrus: "citrus-shoyu",
  "citrus-shoyu": "citrus-shoyu",
  shoyu: "shoyu-reserve",
  "shoyu-reserve": "shoyu-reserve",
  trio: "the-noodlebomb-trio",
  "variety-pack": "the-noodlebomb-trio",
};

const FALLBACK_VARIANT_IDS: Record<string, string> = {
  original: "gid://shopify/ProductVariant/53998041596214",
  "original-ramen": "gid://shopify/ProductVariant/53998041596214",
  spicy: "gid://shopify/ProductVariant/53998042120502",
  "spicy-tokyo": "gid://shopify/ProductVariant/53998042120502",
  citrus: "gid://shopify/ProductVariant/53998041071926",
  "citrus-shoyu": "gid://shopify/ProductVariant/53998041071926",
  trio: "gid://shopify/ProductVariant/53998042644790",
  "variety-pack": "gid://shopify/ProductVariant/53998042644790",
  shoyu: "gid://shopify/ProductVariant/54006619636022",
  "shoyu-reserve": "gid://shopify/ProductVariant/54006619636022",
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  onlineStoreUrl?: string | null;
  featuredImage?: { url: string; altText?: string | null } | null;
  price: {
    amount: string;
    currencyCode: string;
  };
  variantId: string;
  availableForSale: boolean;
};

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  onlineStoreUrl?: string | null;
  featuredImage?: { url: string; altText?: string | null } | null;
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
    }>;
  };
};

const client = createStorefrontApiClient({
  storeDomain: STORE_DOMAIN,
  apiVersion: API_VERSION,
  publicAccessToken: STOREFRONT_TOKEN,
});

function normalizeProduct(product?: ShopifyProductNode | null): ShopifyProduct | null {
  const variant = product?.variants.nodes[0];
  if (!product || !variant) return null;
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    onlineStoreUrl: product.onlineStoreUrl,
    featuredImage: product.featuredImage,
    price: variant.price,
    variantId: variant.id,
    availableForSale: variant.availableForSale,
  };
}

export async function fetchShopifyProducts() {
  const query = `#graphql
    query NoodleBombProducts {
      products(first: 12) {
        nodes {
          id
          handle
          title
          description
          onlineStoreUrl
          featuredImage { url altText }
          variants(first: 1) {
            nodes {
              id
              availableForSale
              price { amount currencyCode }
            }
          }
        }
      }
    }
  `;
  const response = await client.request<{ products: { nodes: ShopifyProductNode[] } }>(query);
  if (response.errors) throw new Error("Shopify product list request failed");
  return response.data?.products.nodes.map(normalizeProduct).filter(Boolean) as ShopifyProduct[];
}

export async function fetchShopifyProductBySlug(slug: string) {
  const handle = SHOPIFY_HANDLES[slug] || slug;
  const query = `#graphql
    query NoodleBombProduct($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        onlineStoreUrl
        featuredImage { url altText }
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price { amount currencyCode }
          }
        }
      }
    }
  `;
  const response = await client.request<{ product: ShopifyProductNode | null }>(query, {
    variables: { handle },
  });
  if (response.errors) throw new Error(`Shopify product request failed for ${handle}`);
  return normalizeProduct(response.data?.product);
}

async function getVariantId(slug: string) {
  const product = await fetchShopifyProductBySlug(slug).catch(() => null);
  return product?.variantId || FALLBACK_VARIANT_IDS[slug];
}

export async function createShopifyCheckoutUrl(
  items: Array<Pick<CartItem, "slug" | "quantity" | "sellingPlanId">>,
) {
  const lines = await Promise.all(
    items
      .filter((item) => item.quantity > 0)
      .map(async (item) => {
        const line: { merchandiseId: string | undefined; quantity: number; sellingPlanId?: string } = {
          merchandiseId: await getVariantId(item.slug),
          quantity: item.quantity,
        };
        if (item.sellingPlanId) {
          line.sellingPlanId = item.sellingPlanId;
        }
        return line;
      }),
  );
  const validLines = lines.filter((line) => line.merchandiseId);
  if (!validLines.length) throw new Error("No Shopify variants found for checkout");

  const mutation = `#graphql
    mutation NoodleBombCartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { checkoutUrl }
        userErrors { field message }
      }
    }
  `;
  const response = await client.request<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: Array<{ message: string }> };
  }>(mutation, { variables: { lines: validLines } });
  const userError = response.data?.cartCreate.userErrors[0];
  if (response.errors || userError) {
    throw new Error(userError?.message || "Shopify checkout creation failed");
  }
  const checkoutUrl = response.data?.cartCreate.cart?.checkoutUrl;
  if (!checkoutUrl) throw new Error("Shopify did not return a checkout URL");
  return checkoutUrl;
}

export function formatShopifyPrice(product?: ShopifyProduct | null, fallback = "$11.99") {
  if (!product?.price.amount) return fallback;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.price.currencyCode,
  }).format(Number(product.price.amount));
}
