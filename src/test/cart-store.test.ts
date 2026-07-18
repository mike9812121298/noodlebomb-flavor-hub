import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const cartStoreSource = fs.readFileSync(
  path.resolve(process.cwd(), "cart-store.js"),
  "utf8",
);

type CartItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
};

type CartApi = {
  getItems: () => CartItem[];
  add: (item: CartItem) => void;
  getSubtotal: () => number;
};

function loadCartStore() {
  window.eval(cartStoreSource);
  return (window as typeof window & { NB_CART: CartApi }).NB_CART;
}

describe("NoodleBomb cart catalog migration", () => {
  beforeEach(() => {
    localStorage.clear();
    delete (window as typeof window & { NB_CART?: CartApi }).NB_CART;
  });

  it("migrates legacy saved prices and names to the current catalog", () => {
    localStorage.setItem(
      "nb_cart_v2",
      JSON.stringify([
        { slug: "original", name: "Old Original", price: 11.99, qty: 1 },
        { slug: "spicy", name: "Old Spicy", price: 11.99, qty: 1 },
        { slug: "citrus", name: "Old Citrus", price: 11.99, qty: 1 },
        { slug: "trio", name: "Old Trio", price: 29.99, qty: 1 },
        { slug: "shoyu", name: "Old Shoyu", price: 11.99, qty: 1 },
        { slug: "shoyuspicy", name: "Old Spicy Shoyu", price: 11.99, qty: 1 },
        { slug: "firedust", name: "Fire Dust", price: 10.99, qty: 1 },
        { slug: "rgs", name: "RGS", price: 10.99, qty: 1 },
      ]),
    );

    const cart = loadCartStore();
    const items = cart.getItems();

    expect(items.map((item) => item.price)).toEqual([
      12.99, 12.99, 12.99, 32.99, 12.99, 12.99, 10.99, 10.99,
    ]);
    expect(items.map((item) => item.name)).toEqual([
      "Original",
      "Spicy Tokyo",
      "Citrus Shoyu",
      "The NoodleBomb Trio",
      "Shoyu Reserve",
      "Spicy Shoyu",
      "NoodleBomb Fire Dust",
      "NoodleBomb Roasted Garlic Sesame",
    ]);
    expect(JSON.parse(localStorage.getItem("nb_cart_v2") || "[]")).toEqual(items);
  });

  it("ignores a stale caller-supplied price for a known product", () => {
    const cart = loadCartStore();

    cart.add({ slug: "original", name: "Old Original", price: 0.01, qty: 1 });

    expect(cart.getItems()).toEqual([
      { slug: "original", name: "Original", price: 12.99, qty: 1 },
    ]);
    expect(cart.getSubtotal()).toBe(12.99);
  });

  it("adds Spicy Shoyu at the live Shopify price after final label approval", () => {
    const cart = loadCartStore();

    cart.add({ slug: "shoyuspicy", name: "Old Spicy Shoyu", price: 0.01, qty: 1 });

    expect(cart.getItems()).toEqual([
      { slug: "shoyuspicy", name: "Spicy Shoyu", price: 12.99, qty: 1 },
    ]);
    expect(cart.getSubtotal()).toBe(12.99);
  });
});
