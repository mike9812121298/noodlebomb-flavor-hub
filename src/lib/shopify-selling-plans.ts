export type PurchaseChoice = "one-time" | "subscribe";
export type SubscribeCadence = 30 | 45 | 60;

const SELLING_PLAN_IDS: Record<SubscribeCadence, string | undefined> = {
  30: import.meta.env.VITE_SHOPIFY_SELLING_PLAN_ID_30D,
  45: import.meta.env.VITE_SHOPIFY_SELLING_PLAN_ID_45D,
  60: import.meta.env.VITE_SHOPIFY_SELLING_PLAN_ID_60D,
};

export const SUBSCRIBE_CADENCES: SubscribeCadence[] = [30, 45, 60];

export function getSellingPlanId(cadence: SubscribeCadence) {
  return SELLING_PLAN_IDS[cadence];
}

export function hasSellingPlanIds() {
  return SUBSCRIBE_CADENCES.every((cadence) => Boolean(SELLING_PLAN_IDS[cadence]));
}
