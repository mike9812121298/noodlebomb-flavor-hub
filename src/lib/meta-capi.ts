export type MetaCapiUserData = {
  em?: string[];
  ph?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
};

export type MetaCapiCustomData = {
  currency?: string;
  value?: number;
  content_ids?: string[];
  content_type?: string;
  order_id?: string;
};

export type MetaCapiEvent = {
  event_name: "InitiateCheckout" | "Purchase";
  event_time: number;
  event_id: string;
  action_source: "website";
  event_source_url?: string;
  user_data: MetaCapiUserData;
  custom_data?: MetaCapiCustomData;
};

type MetaCapiConfig = {
  pixelId: string;
  accessToken: string;
  graphApiVersion?: string;
  testEventCode?: string;
};

function normalizeCustomerValue(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256CustomerValue(value?: string | null) {
  const normalized = normalizeCustomerValue(value);
  if (!normalized) return undefined;

  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalized),
  );
  return toHex(digest);
}

export async function buildMetaUserData(input: {
  email?: string | null;
  phone?: string | null;
  clientIp?: string;
  userAgent?: string;
}) {
  const [emailHash, phoneHash] = await Promise.all([
    sha256CustomerValue(input.email),
    sha256CustomerValue(input.phone),
  ]);

  const userData: MetaCapiUserData = {};
  if (emailHash) userData.em = [emailHash];
  if (phoneHash) userData.ph = [phoneHash];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  return userData;
}

export async function sendMetaCapiEvents(events: MetaCapiEvent[], config: MetaCapiConfig) {
  const graphApiVersion = config.graphApiVersion || "v23.0";
  const url = new URL(`https://graph.facebook.com/${graphApiVersion}/${config.pixelId}/events`);
  url.searchParams.set("access_token", config.accessToken);

  const payload: { data: MetaCapiEvent[]; test_event_code?: string } = { data: events };
  if (config.testEventCode) payload.test_event_code = config.testEventCode;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Meta CAPI request failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body;
}
