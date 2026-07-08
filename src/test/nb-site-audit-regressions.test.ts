import { describe, expect, it } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";

const root = process.cwd();
const read = (file: string) => readFileSync(`${root}/${file}`, "utf8");

const legacyMarketingRoutes = [
  "/product/original-ramen",
  "/product/spicy-tokyo",
  "/product/citrus-shoyu",
  "/product/trio",
  "/product/the-noodlebomb-trio",
  "/product-page/*",
  "/cart-page",
  "/category/*",
  "/ramensauce",
  "/ramensauce-1",
  "/ramensauce-2",
];

describe("NoodleBomb July site-audit regressions", () => {
  it("keeps legacy marketing routes on noodlebomb.co instead of raw Shopify or Wix storefronts", () => {
    const netlify = read("netlify.toml");
    const redirects = read("_redirects");

    for (const route of legacyMarketingRoutes) {
      const netlifyBlock = new RegExp(
        String.raw`\[\[redirects\]\]\s+from = "${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace("\\*", ".*")}"[\s\S]*?(?=\n\[\[redirects\]\]|\n\[\[headers\]\]|$)`,
        "m",
      ).exec(netlify)?.[0] ?? "";
      expect(netlifyBlock, `${route} missing from netlify.toml`).not.toBe("");
      expect(netlifyBlock, `${route} should not expose raw Shopify`).not.toContain("nu2vqa-ma.myshopify.com");
      expect(netlifyBlock, `${route} should not expose legacy Wix`).not.toContain("noodlebomb.co");

      const redirectsLine = redirects
        .split(/\r?\n/)
        .find((line) => line.trim().startsWith(route.replace("/*", "/")));
      expect(redirectsLine, `${route} missing from _redirects`).toBeTruthy();
      expect(redirectsLine, `${route} should not expose raw Shopify`).not.toContain("nu2vqa-ma.myshopify.com");
      expect(redirectsLine, `${route} should not expose legacy Wix`).not.toContain("noodlebomb.co");
    }
  });

  it("catches old Wix blog and blank routes with explicit search-safe redirects", () => {
    const netlify = read("netlify.toml");
    const redirects = read("_redirects");

    expect(netlify).toMatch(/from = "\/post\/\*"\s+to = "\/recipes"\s+status = 301/s);
    expect(netlify).toMatch(/from = "\/blank-\*"\s+to = "\/404\.html"\s+status = 410/s);
    expect(redirects).toMatch(/^\/post\/\*\s+\/recipes\s+301!/m);
    expect(redirects).toMatch(/^\/blank-\*\s+\/404\.html\s+410!/m);
  });

  it("standardizes free-shipping copy to the current $29.99 US threshold", () => {
    const files = [
      "app.jsx",
      "cart.jsx",
      "checkout.jsx",
      "cart.html",
      "shipping-returns.html",
      "shop.html",
      "seasonings.html",
      "ramen-seasoning.html",
    ];

    for (const file of files) {
      const text = read(file);
      expect(text, `${file} should not mention the old $35 threshold`).not.toMatch(/free shipping over \$35/i);
    }

    const combined = files.map(read).join("\n");
    expect(combined).toContain("Free US shipping on orders $29.99+");
  });

  it("has an on-domain contact page and metadata targets for key pages", () => {
    expect(existsSync(`${root}/contact.html`)).toBe(true);
    expect(read("netlify.toml")).toMatch(/from = "\/contact"\s+to = "\/contact\.html"\s+status = 200/s);
    expect(read("_redirects")).toMatch(/^\/contact\s+\/contact\.html\s+200/m);

    const shopDesc = read("shop.html").match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
    const rewardsDesc = read("rewards.html").match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
    expect(shopDesc.length, "shop meta description should be 155 chars or less").toBeLessThanOrEqual(155);
    expect(rewardsDesc.length, "rewards meta description should be 155 chars or less").toBeLessThanOrEqual(155);
  });

  it("does not reintroduce stale Shoyu preorder or kitchen-production claims", () => {
    const publicText = [
      "page-shared.js",
      "index.html",
      "product-original.html",
      "product-spicy.html",
      "product-citrus.html",
      "product-shoyu-reserve.html",
      "faq.html",
      "about.html",
    ].map(read).join("\n");

    expect(publicText).not.toMatch(/PREORDER FOR \$9\.99/i);
    expect(publicText).not.toMatch(/hand[- ]mixed/i);
    expect(publicText).not.toMatch(/same hands mix every batch/i);
    expect(publicText).not.toMatch(/Handcrafted in Bonney Lake/i);
    expect(publicText).toContain("co-packer in Tacoma, Washington");
  });

  it("does not expose stale production or Shoyu Reserve pricing claims anywhere public", () => {
    const publicHtml = readdirSync(root)
      .filter((file) => file.endsWith(".html"))
      .map(read)
      .join("\n");
    const dormantSourceText = [
      "src/pages/ProductPage.tsx",
      "src/pages/Shop.tsx",
      "src/pages/Index.tsx",
    ].filter((file) => existsSync(`${root}/${file}`)).map(read).join("\n");

    expect(publicHtml).not.toMatch(/Handcrafted in Bonney Lake/i);
    expect(publicHtml).not.toMatch(/hand[- ]mixed/i);
    expect(publicHtml).not.toMatch(/PREORDER FOR \$9\.99/i);
    expect(dormantSourceText).not.toMatch(/displayPrice:\s*"\$9\.99"/i);
    expect(dormantSourceText).not.toMatch(/price:\s*9\.99/i);
  });

  it("ships basic security and cache headers for public static assets", () => {
    const netlify = read("netlify.toml");
    const headers = read("_headers");

    expect(netlify).toContain("Content-Security-Policy");
    expect(headers).toContain("Content-Security-Policy");
    expect(netlify).toMatch(/for = "\/\*\.js"[\s\S]*?Cache-Control = "public, max-age=300, must-revalidate"/);
    expect(netlify).toMatch(/for = "\/\*\.css"[\s\S]*?Cache-Control = "public, max-age=300, must-revalidate"/);
    expect(headers).toMatch(/^\/\*\.js\s+Cache-Control: public, max-age=300, must-revalidate/m);
    expect(headers).toMatch(/^\/\*\.css\s+Cache-Control: public, max-age=300, must-revalidate/m);
  });
});
