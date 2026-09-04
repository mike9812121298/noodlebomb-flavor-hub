import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (name: string) => readFileSync(join(root, name), "utf8");

describe("production storefront canon", () => {
  it("keeps every public root surface off the retired Pour and Trio prices", () => {
    const publicRootFiles = readdirSync(root).filter((name) => /\.(?:html|js|jsx)$/.test(name));
    const publicRootText = publicRootFiles.map((name) => read(name)).join("\n");

    expect(publicRootText).not.toContain("$12.99");
    expect(publicRootText).not.toContain("$32.99");
    expect(publicRootText).not.toMatch(/pantry series/i);
  });

  it("publishes the current price tiers and free-shipping threshold", () => {
    const homepage = read("index.html");
    const runtime = read("app.jsx");
    const trio = read("ramen-sauce-trio.html");

    expect(homepage).toContain("$13.99");
    expect(homepage).toContain("$10.99");
    expect(homepage).toContain("$34.99");
    expect(homepage).toContain("Free US shipping $29.99+");
    expect(runtime).toContain('price: "$13.99"');
    expect(runtime).toContain('const TRIO = { slug: "trio", name: "The NoodleBomb Trio", priceUsd: 34.99 }');
    expect(runtime).toContain("Save $6.98");
    expect(runtime).not.toMatch(/Fire Dust\."[\s\S]{0,500}\$13\.99/);
    expect(trio).toContain("$34.99");
    expect(trio).toContain("$29.99+");
  });

  it("keeps both Shoyu products classified as soy sauce with current storage truth", () => {
    const reserve = read("product-shoyu-reserve.html");
    const spicy = read("product-spicy-shoyu.html");

    expect(reserve).toContain("Shoyu Reserve Soy Sauce");
    expect(spicy).toContain("Spicy Shoyu Soy Sauce");
    expect(reserve).toContain("2-year shelf life");
    expect(spicy).toContain("2-year shelf life");
    expect(reserve).toContain("Refrigeration is not required after opening.");
    expect(spicy).toContain("Refrigeration is not required after opening.");
  });

  it("preserves the locked homepage boot, hero, metadata, and Monthly Box bytes", () => {
    const homepage = read("index.html");
    const monthlyBox = readFileSync(join(root, "monthly-box.html"));

    expect(homepage.match(/^\s*bootApp\(\);\s*$/gm)).toHaveLength(1);
    expect(homepage).toContain("/uploads/nb-hero-pour-page.webp");
    expect(homepage).not.toContain("nb-hero-pour-page-2.webp");
    expect(homepage).toContain("/og-trio-2026-06.png");
    expect(homepage).not.toContain("aggregateRating");
    expect(createHash("sha1").update(monthlyBox).digest("hex")).toBe(
      "f7a38b4aded67170e1a2e54658bb64a4b4aa09c4",
    );
  });
});
