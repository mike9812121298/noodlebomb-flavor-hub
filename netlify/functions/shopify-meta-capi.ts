import {
  buildMetaUserData,
  sendMetaCapiEvents,
  type MetaCapiEvent,
} from "../../src/lib/meta-capi";

declare const process: {
  env: Record<string, string | undefined>;
};

type NetlifyEvent = {
  httpMethod?: string;
  body?: string | null;
  headers?: Record<string, string | undefined>;
};

type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

type ShopifyWebhookPayload = {
  id?: number | string;
  token?: string;
  checkout_token?: string;
  email?: string;
  contact_email?: string;
  phone?: string;
  currency?: string;
  presentment_currency?: string;
  total_price?: string;
  subtotal_price?: string;
  landing_site?: string;
  customer?: {
    email?: string;
    phone?: string;
  };
  billing_address?: {
    phone?: string;
  };
  shipping_address?: {
    phone?: string;
  };
  line_items?: Array<{
    product_id?: number | string;
    variant_id?: number | string;
    sku?: string;
  }>;
};

const SITE_URL = "https://noodlebomb.co";

function json(statusCode: number, body: Record<string, unknown>): NetlifyResponse {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function header(headers: Record<string, string | undefined> | undefined, name: string) {
  const lowerName = name.toLowerCase();
  const match = Object.entries(headers || {}).find(([key]) => key.toLowerCase() === lowerName);
  return match?.[1];
}

function parseMoney(value?: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : undefined;
}

function productContentIds(payload: ShopifyWebhookPayload) {
  return payload.line_items
    ?.map((item) => item.sku || item.variant_id || item.product_id)
    .filter(Boolean)
    .map(String);
}

function metaEventName(topic?: string): MetaCapiEvent["event_name"] | null {
  if (topic === "orders/create") return "Purchase";
  if (topic === "checkouts/create") return "InitiateCheckout";
  return null;
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  const pixelId = process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    return json(202, { ok: true, skipped: "Meta CAPI env vars not configured" });
  }

  const topic = header(event.headers, "x-shopify-topic");
  const eventName = metaEventName(topic);
  if (!eventName) {
    return json(202, { ok: true, skipped: `Unsupported topic ${topic || "unknown"}` });
  }

  let payload: ShopifyWebhookPayload;
  try {
    payload = JSON.parse(event.body || "{}") as ShopifyWebhookPayload;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  const eventId = `${topic}:${payload.id || payload.token || payload.checkout_token || Date.now()}`;
  const clientIp = header(event.headers, "x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = header(event.headers, "user-agent");
  const userData = await buildMetaUserData({
    email: payload.email || payload.contact_email || payload.customer?.email,
    phone: payload.phone || payload.customer?.phone || payload.billing_address?.phone || payload.shipping_address?.phone,
    clientIp,
    userAgent,
  });

  const eventSourceUrl = payload.landing_site?.startsWith("http")
    ? payload.landing_site
    : `${SITE_URL}${payload.landing_site || ""}`;

  const metaEvent: MetaCapiEvent = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    event_source_url: eventSourceUrl,
    user_data: userData,
    custom_data: {
      currency: payload.currency || payload.presentment_currency || "USD",
      value: parseMoney(payload.total_price || payload.subtotal_price),
      content_ids: productContentIds(payload),
      content_type: "product",
      order_id: payload.id ? String(payload.id) : undefined,
    },
  };

  const result = await sendMetaCapiEvents([metaEvent], {
    pixelId,
    accessToken,
    graphApiVersion: process.env.META_GRAPH_API_VERSION,
    testEventCode: process.env.META_TEST_EVENT_CODE,
  });

  return json(200, { ok: true, event_id: eventId, result });
};
