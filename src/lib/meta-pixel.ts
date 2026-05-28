type Fbq = (
  command: "track" | "trackCustom",
  event: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

const currency = "USD";

export type MetaCartItem = {
  slug: string;
  name: string;
  price: number;
  quantity?: number;
};

function isPixelReady() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

export function trackMetaPageView() {
  if (!isPixelReady()) return;
  window.fbq?.("track", "PageView");
}

export function trackMetaViewContent(item: MetaCartItem & { category?: string }) {
  if (!isPixelReady()) return;
  window.fbq?.("track", "ViewContent", {
    content_ids: [item.slug],
    content_name: item.name,
    content_category: item.category ?? "Sauce",
    content_type: "product",
    value: Number(item.price.toFixed(2)),
    currency,
  });
}

export function trackMetaAddToCart(item: MetaCartItem) {
  if (!isPixelReady()) return;
  const quantity = item.quantity ?? 1;
  window.fbq?.("track", "AddToCart", {
    content_ids: [item.slug],
    content_name: item.name,
    content_category: "Sauce",
    content_type: "product",
    contents: [{ id: item.slug, quantity, item_price: item.price }],
    value: Number((item.price * quantity).toFixed(2)),
    currency,
  });
}

export function trackMetaInitiateCheckout(items: MetaCartItem[], value: number) {
  if (!isPixelReady()) return;
  window.fbq?.("track", "InitiateCheckout", {
    content_ids: items.map((item) => item.slug),
    content_type: "product",
    contents: items.map((item) => ({
      id: item.slug,
      quantity: item.quantity ?? 1,
      item_price: item.price,
    })),
    num_items: items.reduce((total, item) => total + (item.quantity ?? 1), 0),
    value: Number(value.toFixed(2)),
    currency,
  });
}
