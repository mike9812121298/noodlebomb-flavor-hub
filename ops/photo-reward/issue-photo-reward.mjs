#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const SHOPIFY_API_VERSION = "2026-07";
export const EXPECTED_STORE = "nu2vqa-ma.myshopify.com";
export const DEFAULT_ENV_FILE =
  "C:\\Users\\12534\\.openclaw\\secrets\\shopify_noodlev7.env";

export const REWARD_PRODUCTS = Object.freeze({
  original: Object.freeze({
    name: "Original Pour",
    kind: "Pour ramen sauce",
    expectedPrice: "13.99",
    variantId: "gid://shopify/ProductVariant/53998041596214",
  }),
  spicy: Object.freeze({
    name: "Spicy Pour",
    kind: "Pour ramen sauce",
    expectedPrice: "13.99",
    variantId: "gid://shopify/ProductVariant/53998042120502",
  }),
  citrus: Object.freeze({
    name: "Citrus Pour",
    kind: "Pour ramen sauce",
    expectedPrice: "13.99",
    variantId: "gid://shopify/ProductVariant/53998041071926",
  }),
  shoyu: Object.freeze({
    name: "Shoyu Reserve",
    kind: "Pour soy sauce",
    expectedPrice: "13.99",
    variantId: "gid://shopify/ProductVariant/54006619636022",
  }),
  "spicy-shoyu": Object.freeze({
    name: "Spicy Shoyu Reserve",
    kind: "Pour soy sauce",
    expectedPrice: "13.99",
    variantId: "gid://shopify/ProductVariant/54097354686774",
  }),
  "fire-dust": Object.freeze({
    name: "Fire Dust",
    kind: "Shake spice",
    expectedPrice: "10.99",
    variantId: "gid://shopify/ProductVariant/54111262146870",
  }),
  "roasted-garlic-sesame": Object.freeze({
    name: "Roasted Garlic Sesame",
    kind: "Shake spice",
    expectedPrice: "10.99",
    variantId: "gid://shopify/ProductVariant/54125810614582",
  }),
});

const REQUIRED_SCOPES = ["read_discounts", "read_products", "write_discounts"];
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_PATTERN = /^BOWLSHOT-[A-HJ-NP-Z2-9]{12}$/;

const AUTH_QUERY = `#graphql
  query RewardToolAuth {
    shop {
      name
      myshopifyDomain
      currencyCode
    }
    currentAppInstallation {
      accessScopes {
        handle
      }
    }
  }
`;

const VARIANT_QUERY = `#graphql
  query RewardVariant($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        id
        title
        price
        product {
          id
          title
          handle
          status
        }
      }
    }
  }
`;

const DISCOUNT_BY_CODE_QUERY = `#graphql
  query RewardDiscountByCode($code: String!) {
    codeDiscountNodeByCode(code: $code) {
      id
      codeDiscount {
        __typename
        ... on DiscountCodeBasic {
          title
          status
          startsAt
          endsAt
          usageLimit
          appliesOncePerCustomer
          asyncUsageCount
          shortSummary
          codes(first: 1) {
            nodes {
              code
            }
          }
          combinesWith {
            orderDiscounts
            productDiscounts
            shippingDiscounts
          }
          customerGets {
            appliesOnOneTimePurchase
            appliesOnSubscription
            value {
              ... on DiscountAmount {
                amount {
                  amount
                  currencyCode
                }
                appliesOnEachItem
              }
            }
            items {
              ... on DiscountProducts {
                productVariants(first: 10) {
                  nodes {
                    id
                    title
                    product {
                      id
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_DISCOUNT_MUTATION = `#graphql
  mutation CreatePhotoReward($input: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $input) {
      codeDiscountNode {
        id
      }
      userErrors {
        field
        code
        message
      }
    }
  }
`;

const EXPIRE_DISCOUNT_MUTATION = `#graphql
  mutation ExpirePhotoReward($id: ID!, $input: DiscountCodeBasicInput!) {
    discountCodeBasicUpdate(id: $id, basicCodeDiscount: $input) {
      codeDiscountNode {
        id
      }
      userErrors {
        field
        code
        message
      }
    }
  }
`;

export function parseEnvFile(contents) {
  const result = {};
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    result[match[1]] = value;
  }
  return result;
}

export function generateRewardCode(randomSource = randomBytes) {
  const bytes = randomSource(12);
  if (!bytes || bytes.length < 12) {
    throw new Error("The random source did not return 12 bytes.");
  }
  let suffix = "";
  for (let index = 0; index < 12; index += 1) {
    suffix += CODE_ALPHABET[bytes[index] % CODE_ALPHABET.length];
  }
  return `BOWLSHOT-${suffix}`;
}

export function normalizeRewardCode(value) {
  const code = String(value || "")
    .trim()
    .toUpperCase();
  if (!CODE_PATTERN.test(code)) {
    throw new Error(
      "Reward codes must use BOWLSHOT- followed by 12 uppercase letters or digits (excluding 0, 1, I, and O).",
    );
  }
  return code;
}

export function validateLiveVariant(productKey, liveVariant) {
  const configured = REWARD_PRODUCTS[productKey];
  if (!configured) {
    throw new Error(
      `Unknown product '${productKey}'. Choose one of: ${Object.keys(REWARD_PRODUCTS).join(", ")}.`,
    );
  }
  if (!liveVariant || liveVariant.id !== configured.variantId || !liveVariant.product) {
    throw new Error(`Live Shopify variant identity did not match ${configured.name}.`);
  }
  if (liveVariant.product.status !== "ACTIVE") {
    throw new Error(`${configured.name} is not ACTIVE in Shopify.`);
  }
  if (String(liveVariant.price) !== configured.expectedPrice) {
    throw new Error(
      `${configured.name} price is ${liveVariant.price}; canon requires ${configured.expectedPrice}. No code was created.`,
    );
  }
  return {
    key: productKey,
    ...configured,
    livePrice: String(liveVariant.price),
    productId: liveVariant.product.id,
    productTitle: liveVariant.product.title,
    productHandle: liveVariant.product.handle,
    variantTitle: liveVariant.title,
  };
}

export function buildDiscountInput({ code, product, startsAt }) {
  const normalizedCode = normalizeRewardCode(code);
  if (!product?.variantId || !product?.livePrice) {
    throw new Error("A verified live product is required before a discount can be built.");
  }
  return {
    title: `NoodleBomb Photo Reward - ${product.name} - ${normalizedCode.slice(-6)}`,
    code: normalizedCode,
    startsAt,
    context: { all: "ALL" },
    customerGets: {
      value: {
        discountAmount: {
          amount: product.livePrice,
          appliesOnEachItem: false,
        },
      },
      items: {
        products: {
          productVariantsToAdd: [product.variantId],
        },
      },
      appliesOnOneTimePurchase: true,
      appliesOnSubscription: false,
    },
    combinesWith: {
      orderDiscounts: false,
      productDiscounts: false,
      shippingDiscounts: true,
    },
    usageLimit: 1,
    appliesOncePerCustomer: true,
    tags: ["photo-reward", "single-use", "operator-issued"],
  };
}

export function safeDiscountSummary(node) {
  if (!node) return null;
  const discount = node.codeDiscount;
  if (!discount) return { nodeId: node.id, type: null };
  const amount = discount.customerGets?.value?.amount;
  const variants = discount.customerGets?.items?.productVariants?.nodes || [];
  return {
    nodeId: node.id,
    type: discount.__typename,
    code: discount.codes?.nodes?.[0]?.code || null,
    title: discount.title || null,
    status: discount.status || null,
    startsAt: discount.startsAt || null,
    endsAt: discount.endsAt || null,
    usageLimit: discount.usageLimit ?? null,
    usageCount: discount.asyncUsageCount ?? null,
    appliesOncePerCustomer: discount.appliesOncePerCustomer ?? null,
    amount: amount
      ? { amount: amount.amount, currencyCode: amount.currencyCode }
      : null,
    appliesOnEachItem:
      discount.customerGets?.value?.appliesOnEachItem ?? null,
    appliesOnOneTimePurchase:
      discount.customerGets?.appliesOnOneTimePurchase ?? null,
    appliesOnSubscription:
      discount.customerGets?.appliesOnSubscription ?? null,
    eligibleVariantIds: variants.map((variant) => variant.id),
    combinesWith: discount.combinesWith || null,
    shortSummary: discount.shortSummary || null,
  };
}

function readCredentials(envFile) {
  const fileValues = existsSync(envFile)
    ? parseEnvFile(readFileSync(envFile, "utf8"))
    : {};
  return { ...fileValues, ...process.env };
}

function credentialValue(env, names) {
  for (const name of names) {
    if (env[name]) return env[name];
  }
  return null;
}

async function mintAccessToken({ store, clientId, clientSecret, fetchImpl }) {
  const response = await fetchImpl(`https://${store}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });
  if (!response.ok) {
    throw new Error(`Shopify token mint failed with HTTP ${response.status}.`);
  }
  const payload = await response.json();
  if (!payload.access_token) {
    throw new Error("Shopify token mint returned no access token.");
  }
  return payload.access_token;
}

export async function createAdminClient({
  envFile = DEFAULT_ENV_FILE,
  fetchImpl = fetch,
} = {}) {
  const env = readCredentials(resolve(envFile));
  const store = credentialValue(env, ["SHOPIFY_STORE_DOMAIN"]);
  if (store !== EXPECTED_STORE) {
    throw new Error(
      `Refusing store '${store || "missing"}'. Expected ${EXPECTED_STORE}.`,
    );
  }

  const clientId = credentialValue(env, [
    "SHOPIFY_NOODLEV7_CLIENT_ID",
    "SHOPIFY_CLIENT_ID",
    "SHOPIFY_API_KEY",
  ]);
  const clientSecret = credentialValue(env, [
    "SHOPIFY_NOODLEV7_CLIENT_SECRET",
    "SHOPIFY_CLIENT_SECRET",
    "SHOPIFY_API_SECRET",
  ]);
  let token = null;
  if (clientId && clientSecret) {
    token = await mintAccessToken({ store, clientId, clientSecret, fetchImpl });
  } else {
    token = credentialValue(env, [
      "SHOPIFY_ADMIN_ACCESS_TOKEN",
      "SHOPIFY_NOODLEV7_ACCESS_TOKEN",
    ]);
  }
  if (!token) {
    throw new Error("No Shopify Admin credential path is available.");
  }

  const endpoint = `https://${store}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const graphql = async (query, variables = {}) => {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) {
      throw new Error(`Shopify GraphQL failed with HTTP ${response.status}.`);
    }
    const payload = await response.json();
    if (payload.errors?.length) {
      throw new Error(
        `Shopify GraphQL rejected the request: ${payload.errors
          .map((error) => error.message)
          .join("; ")}`,
      );
    }
    return payload.data;
  };

  const auth = await graphql(AUTH_QUERY);
  if (auth.shop?.myshopifyDomain !== EXPECTED_STORE) {
    throw new Error("Authenticated Shopify shop identity did not match NoodleBomb.");
  }
  const scopes = new Set(
    (auth.currentAppInstallation?.accessScopes || []).map((scope) => scope.handle),
  );
  const missingScopes = REQUIRED_SCOPES.filter((scope) => !scopes.has(scope));
  if (missingScopes.length) {
    throw new Error(
      `Shopify app is missing required scopes: ${missingScopes.join(", ")}.`,
    );
  }

  return {
    graphql,
    shop: auth.shop,
    apiVersion: SHOPIFY_API_VERSION,
    scopes: [...scopes].sort(),
  };
}

export async function getLiveRewardProduct(client, productKey) {
  const configured = REWARD_PRODUCTS[productKey];
  if (!configured) return validateLiveVariant(productKey, null);
  const data = await client.graphql(VARIANT_QUERY, { id: configured.variantId });
  return validateLiveVariant(productKey, data.node);
}

export async function getDiscountByCode(client, code) {
  const normalizedCode = normalizeRewardCode(code);
  const data = await client.graphql(DISCOUNT_BY_CODE_QUERY, {
    code: normalizedCode,
  });
  return safeDiscountSummary(data.codeDiscountNodeByCode);
}

function assertCreatedDiscount(summary, { code, product }) {
  if (!summary) throw new Error("Created discount could not be read back.");
  const failures = [];
  if (summary.type !== "DiscountCodeBasic") failures.push("type");
  if (summary.code !== code) failures.push("code");
  if (summary.status !== "ACTIVE") failures.push("status");
  if (summary.usageLimit !== 1) failures.push("usageLimit");
  if (summary.appliesOncePerCustomer !== true)
    failures.push("appliesOncePerCustomer");
  if (summary.amount?.amount !== product.livePrice) failures.push("amount");
  if (summary.appliesOnEachItem !== false) failures.push("appliesOnEachItem");
  if (summary.appliesOnOneTimePurchase !== true)
    failures.push("appliesOnOneTimePurchase");
  if (summary.appliesOnSubscription !== false)
    failures.push("appliesOnSubscription");
  if (
    summary.eligibleVariantIds.length !== 1 ||
    summary.eligibleVariantIds[0] !== product.variantId
  ) {
    failures.push("eligibleVariantIds");
  }
  if (
    summary.combinesWith?.orderDiscounts !== false ||
    summary.combinesWith?.productDiscounts !== false ||
    summary.combinesWith?.shippingDiscounts !== true
  ) {
    failures.push("combinesWith");
  }
  if (failures.length) {
    throw new Error(
      `Created discount failed readback checks: ${failures.join(", ")}.`,
    );
  }
}

export async function issueReward({
  client,
  productKey,
  code = generateRewardCode(),
  apply = false,
  now = new Date(),
}) {
  const product = await getLiveRewardProduct(client, productKey);
  const normalizedCode = normalizeRewardCode(code);
  const existing = await getDiscountByCode(client, normalizedCode);
  if (existing) {
    throw new Error(`Discount code ${normalizedCode} already exists.`);
  }
  const input = buildDiscountInput({
    code: normalizedCode,
    product,
    startsAt: now.toISOString(),
  });
  const preview = {
    mode: apply ? "apply" : "dry-run",
    shop: client.shop.myshopifyDomain,
    apiVersion: client.apiVersion,
    product: {
      key: product.key,
      name: product.name,
      kind: product.kind,
      livePrice: product.livePrice,
      currencyCode: client.shop.currencyCode,
      variantId: product.variantId,
      shopifyTitle: product.productTitle,
      shopifyHandle: product.productHandle,
    },
    code: normalizedCode,
    controls: {
      oneGlobalRedemption: true,
      oneUsePerCustomer: true,
      fixedTotalDiscount: product.livePrice,
      eligibleVariantCount: 1,
      oneTimePurchaseOnly: true,
      combinesWithShippingDiscountsOnly: true,
    },
  };
  if (!apply) return preview;

  const data = await client.graphql(CREATE_DISCOUNT_MUTATION, { input });
  const result = data.discountCodeBasicCreate;
  if (result.userErrors?.length) {
    throw new Error(
      `Shopify rejected the discount: ${result.userErrors
        .map((error) => `${error.field?.join(".") || "input"}: ${error.message}`)
        .join("; ")}`,
    );
  }
  if (!result.codeDiscountNode?.id) {
    throw new Error("Shopify returned no DiscountCodeNode ID.");
  }
  const readback = await getDiscountByCode(client, normalizedCode);
  assertCreatedDiscount(readback, { code: normalizedCode, product });
  return { ...preview, nodeId: result.codeDiscountNode.id, readback };
}

export async function expireReward({ client, code, apply = false, now = new Date() }) {
  const normalizedCode = normalizeRewardCode(code);
  const existing = await getDiscountByCode(client, normalizedCode);
  if (!existing) throw new Error(`Discount code ${normalizedCode} was not found.`);
  if (existing.type !== "DiscountCodeBasic") {
    throw new Error(`Discount code ${normalizedCode} is not a basic amount-off code.`);
  }
  const preview = {
    mode: apply ? "apply" : "dry-run",
    action: "expire",
    code: normalizedCode,
    nodeId: existing.nodeId,
    currentStatus: existing.status,
    endsAt: now.toISOString(),
  };
  if (!apply) return preview;
  const data = await client.graphql(EXPIRE_DISCOUNT_MUTATION, {
    id: existing.nodeId,
    input: { endsAt: now.toISOString() },
  });
  const result = data.discountCodeBasicUpdate;
  if (result.userErrors?.length) {
    throw new Error(
      `Shopify rejected the expiration: ${result.userErrors
        .map((error) => `${error.field?.join(".") || "input"}: ${error.message}`)
        .join("; ")}`,
    );
  }
  const readback = await getDiscountByCode(client, normalizedCode);
  if (!readback || readback.status === "ACTIVE" || !readback.endsAt) {
    throw new Error("Expired discount did not pass readback verification.");
  }
  return { ...preview, readback };
}

function parseCliArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = { command, apply: false };
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === "--apply") {
      options.apply = true;
      continue;
    }
    if (["--product", "--code", "--env-file"].includes(arg)) {
      const value = rest[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value.`);
      }
      options[arg.slice(2).replace("-", "_")] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument '${arg}'.`);
  }
  return options;
}

function usage() {
  return `NoodleBomb private photo-reward code tool

Dry-run a new code (default):
  node ops/photo-reward/issue-photo-reward.mjs issue --product original

Create and verify a live, single-use code:
  node ops/photo-reward/issue-photo-reward.mjs issue --product original --apply

Inspect a code:
  node ops/photo-reward/issue-photo-reward.mjs inspect --code BOWLSHOT-XXXXXXXXXXXX

Expire a QA or compromised code:
  node ops/photo-reward/issue-photo-reward.mjs expire --code BOWLSHOT-XXXXXXXXXXXX --apply

Products: ${Object.keys(REWARD_PRODUCTS).join(", ")}`;
}

export async function runCli(argv) {
  const options = parseCliArgs(argv);
  if (options.command === "help" || options.command === "--help") {
    return { help: usage() };
  }
  const client = await createAdminClient({
    envFile: options.env_file || DEFAULT_ENV_FILE,
  });
  if (options.command === "issue") {
    if (!options.product) throw new Error("issue requires --product.");
    return issueReward({
      client,
      productKey: options.product,
      code: options.code || generateRewardCode(),
      apply: options.apply,
    });
  }
  if (options.command === "inspect") {
    if (!options.code) throw new Error("inspect requires --code.");
    return {
      shop: client.shop.myshopifyDomain,
      discount: await getDiscountByCode(client, options.code),
    };
  }
  if (options.command === "expire") {
    if (!options.code) throw new Error("expire requires --code.");
    return expireReward({ client, code: options.code, apply: options.apply });
  }
  throw new Error(`Unknown command '${options.command}'.\n\n${usage()}`);
}

const isCli =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isCli) {
  runCli(process.argv.slice(2))
    .then((result) => {
      if (result.help) console.log(result.help);
      else console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(`Photo reward tool stopped: ${error.message}`);
      process.exitCode = 1;
    });
}
