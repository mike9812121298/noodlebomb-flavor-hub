declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackViewContent(contentName: string, contentId: string, value?: number) {
  window.fbq?.("track", "ViewContent", {
    content_name: contentName,
    content_ids: [contentId],
    content_type: "product",
    value,
    currency: "USD",
  });
}

export function trackAddToCart(contentName: string, contentId: string, value?: number) {
  window.fbq?.("track", "AddToCart", {
    content_name: contentName,
    content_ids: [contentId],
    content_type: "product",
    value,
    currency: "USD",
  });
}
