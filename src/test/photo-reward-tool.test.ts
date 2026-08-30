import { describe, expect, it } from "vitest";
import {
  REWARD_PRODUCTS,
  buildDiscountInput,
  generateRewardCode,
  normalizeRewardCode,
  parseEnvFile,
  validateLiveVariant,
} from "../../ops/photo-reward/issue-photo-reward.mjs";

describe("photo reward operator tool", () => {
  it("generates a non-ambiguous 12-character private code", () => {
    const code = generateRewardCode(() => Uint8Array.from({ length: 12 }, (_, i) => i));
    expect(code).toMatch(/^BOWLSHOT-[A-HJ-NP-Z2-9]{12}$/);
    expect(code).toBe("BOWLSHOT-ABCDEFGHJKLM");
  });

  it("rejects an unsafe or malformed manual code", () => {
    expect(() => normalizeRewardCode("WELCOME10")).toThrow(/must use BOWLSHOT/);
    expect(() => normalizeRewardCode("BOWLSHOT-OOOOOOOOOOOO")).toThrow(
      /must use BOWLSHOT/,
    );
  });

  it("parses private env files without evaluating values", () => {
    expect(
      parseEnvFile('SHOPIFY_STORE_DOMAIN="nu2vqa-ma.myshopify.com"\n# note\nKEY=value'),
    ).toEqual({
      SHOPIFY_STORE_DOMAIN: "nu2vqa-ma.myshopify.com",
      KEY: "value",
    });
  });

  it("fails closed when Shopify price drifts from canon", () => {
    const configured = REWARD_PRODUCTS.original;
    expect(() =>
      validateLiveVariant("original", {
        id: configured.variantId,
        price: "12.99",
        title: "Default Title",
        product: {
          id: "gid://shopify/Product/1",
          title: "Original",
          handle: "original",
          status: "ACTIVE",
        },
      }),
    ).toThrow(/canon requires 13.99/);
  });

  it("builds one fixed-value reward for one exact variant", () => {
    const configured = REWARD_PRODUCTS["fire-dust"];
    const product = validateLiveVariant("fire-dust", {
      id: configured.variantId,
      price: "10.99",
      title: "Default Title",
      product: {
        id: "gid://shopify/Product/2",
        title: "Fire Dust",
        handle: "fire-dust",
        status: "ACTIVE",
      },
    });
    const input = buildDiscountInput({
      code: "BOWLSHOT-ABCDEFGHJKLM",
      product,
      startsAt: "2026-08-30T18:00:00.000Z",
    });

    expect(input.usageLimit).toBe(1);
    expect(input.appliesOncePerCustomer).toBe(true);
    expect(input.context).toEqual({ all: "ALL" });
    expect(input.customerGets.value.discountAmount).toEqual({
      amount: "10.99",
      appliesOnEachItem: false,
    });
    expect(input.customerGets.items.products.productVariantsToAdd).toEqual([
      configured.variantId,
    ]);
    expect(input.customerGets.appliesOnOneTimePurchase).toBe(true);
    expect(input.customerGets.appliesOnSubscription).toBe(false);
    expect(input.combinesWith).toEqual({
      orderDiscounts: false,
      productDiscounts: false,
      shippingDiscounts: true,
    });
  });
});

