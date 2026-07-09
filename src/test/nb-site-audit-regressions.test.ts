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

  it("aligns public sauce and trio prices with Shopify checkout pricing", () => {
    const shop = read("shop.html");
    const cartStore = read("cart-store.js");
    const trioPage = read("ramen-sauce-trio.html");
    const productPages = [
      "product-original.html",
      "product-spicy.html",
      "product-citrus.html",
      "product-shoyu-reserve.html",
      "product-spicy-shoyu.html",
    ].map(read).join("\n");
    const rgsPage = read("product-roasted-garlic-sesame.html");

    expect(cartStore).toMatch(/original:\s*\{[^}]*price:\s*12\.99/);
    expect(cartStore).toMatch(/spicy:\s*\{[^}]*price:\s*12\.99/);
    expect(cartStore).toMatch(/citrus:\s*\{[^}]*price:\s*12\.99/);
    expect(cartStore).toMatch(/shoyu:\s*\{[^}]*price:\s*12\.99/);
    expect(cartStore).toMatch(/shoyuspicy:\s*\{[^}]*price:\s*12\.99/);
    expect(cartStore).toMatch(/trio:\s*\{[^}]*price:\s*32\.99/);
    expect(cartStore).toMatch(/rgs:\s*\{[^}]*price:\s*10\.99/);

    expect(shop).toContain("SAUCES $12.99 - SPICES $10.99");
    expect(shop).toMatch(/Original[\s\S]{0,120}\$12\.99/);
    expect(shop).toMatch(/Spicy Tokyo[\s\S]{0,120}\$12\.99/);
    expect(shop).toMatch(/Citrus Shoyu[\s\S]{0,120}\$12\.99/);
    expect(shop).toMatch(/Reserve[\s\S]{0,120}\$12\.99/);
    expect(shop).toMatch(/Reserve Heat[\s\S]{0,120}\$12\.99/);
    expect(shop).toMatch(/Roasted Garlic Sesame[\s\S]{0,140}\$10\.99/);
    expect(shop).toContain("Add the Trio - $32.99");

    expect(trioPage).toContain("Shop the Trio - $32.99");
    expect(trioPage).toContain("The Trio is $32.99");
    expect(trioPage).toMatch(/sav(?:e|es)\s+\$5\.98/i);
    expect(trioPage).toContain("which reaches NoodleBomb's automatic free US shipping threshold");

    expect(productPages).toContain("$12.99");
    expect(productPages).not.toContain("$11.99");
    expect(productPages).not.toMatch(/price:\s*11\.99/);
    expect(productPages).not.toMatch(/PREORDER/i);
    expect(rgsPage).toContain('"price": "10.99"');
    expect(rgsPage).not.toContain('"price": "11.99"');
  });

  it("gates the Monthly Box page while subscription migration is pending", () => {
    const monthlyBox = read("monthly-box.html");

    expect(monthlyBox).not.toContain("selling_plan=");
    expect(monthlyBox).not.toContain("nu2vqa-ma.myshopify.com/cart/add");
    expect(monthlyBox).not.toMatch(/Subscribe - \$\d/i);
    expect(monthlyBox).toContain("Box signups are paused");
    expect(monthlyBox).toContain("Join the box waitlist");
  });

  it("forces the stale discontinued 4-pack product-page URL to the live shop", () => {
    const netlify = read("netlify.toml");
    const redirects = read("_redirects");

    expect(netlify).toMatch(/from = "\/product-page\/noodlebomb-variety-4-pack"\s+to = "\/shop"\s+status = 301\s+force = true/s);
    expect(redirects).toMatch(/^\/product-page\/noodlebomb-variety-4-pack\s+\/shop\s+301!/m);
  });

  it("keeps failed Shopify checkout recovery on-domain with a saved-cart banner", () => {
    const checkoutClient = read("shopify-checkout.js");
    const cart = read("cart.jsx");

    expect(checkoutClient).not.toMatch(/wix/i);
    expect(checkoutClient).not.toContain("fallbackUrl");
    expect(checkoutClient).toContain("checkout_error");
    expect(checkoutClient).toContain("/cart?checkout_error=1");
    expect(checkoutClient).toContain("checkout_error");

    expect(cart).toContain("checkout_error");
    expect(cart).toContain("Checkout hit a snag");
    expect(cart).toContain("your cart is saved");
  });

  it("keeps browser-shipped source free of retired-store fallback names", () => {
    const shippedSources = [
      "app.jsx",
      "components.jsx",
      "shopify-checkout.js",
      "shopify-config.js",
      "cart-store.js",
      "cart.jsx",
      "checkout.jsx",
      "index.html",
    ].map(read).join("\n");

    expect(shippedSources).not.toMatch(/wix/i);
    expect(shippedSources).not.toContain("fallbackUrl");
    expect(shippedSources).not.toContain("shop.noodlebomb.co");
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

  it("aligns browser source constants and JSON-LD with the approved price ledger", () => {
    const app = read("app.jsx");
    const components = read("components.jsx");
    const cart = read("cart.jsx");
    const index = read("index.html");
    const dormant = [
      "src/pages/ProductPage.tsx",
      "src/pages/Shop.tsx",
      "src/pages/Index.tsx",
      "src/components/BundleBuilder.tsx",
    ].filter((file) => existsSync(`${root}/${file}`)).map(read).join("\n");

    expect(app).toMatch(/const TRIO = \{ slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 32\.99 \}/);
    expect(components).toMatch(/const NB_BOTTLE_PRICE = 12\.99;/);
    expect(components).toMatch(/const NB_TRIO = \{ slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 32\.99 \}/);
    expect(cart).toMatch(/const TRIO = \{ slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 32\.99 \}/);
    expect(cart).toContain("// 43.98");

    expect(index).toContain('"price": "12.99"');
    expect(index).toContain('"price": "32.99"');
    expect(index).not.toContain('"price": "11.99"');
    expect(index).not.toContain('"price": "29.99"');

    expect(dormant).not.toMatch(/price:\s*11\.99/);
    expect(dormant).not.toMatch(/displayPrice:\s*"\$11\.99"/);
    expect(dormant).not.toMatch(/subscribePrice:\s*9\.59/);
    expect(dormant).not.toMatch(/displaySubscribePrice:\s*"\$9\.59\/mo"/);
    expect(dormant).toContain('price: 12.99');
    expect(dormant).toContain('displaySubscribePrice: "$11.04/mo"');
  });

  it("does not ship fake review claims before a real reviews platform is live", () => {
    const reviewSource = [
      "src/components/AnnouncementBar.tsx",
      "src/components/ReviewsSection.tsx",
      "src/components/SocialProof.tsx",
      "src/components/TestimonialSection.tsx",
      "src/pages/ProductPage.tsx",
      "src/pages/Shop.tsx",
    ].filter((file) => existsSync(`${root}/${file}`)).map(read).join("\n");

    expect(reviewSource).not.toMatch(/4\.9\s*Stars?/i);
    expect(reviewSource).not.toMatch(/500\+\s*Reviews?/i);
    expect(reviewSource).not.toMatch(/Verified Buyer/i);
    expect(reviewSource).not.toMatch(/stars:\s*5/);
    expect(reviewSource).not.toContain(String.fromCodePoint(0x2b50));
    expect(reviewSource).not.toMatch(new RegExp(`${String.fromCodePoint(0x1f525)}\\s*Most Popular`, "i"));
    expect(reviewSource).not.toMatch(/Sarah K\.|Jessica|Marcus|Emily R\./i);
    expect(reviewSource).toMatch(/Real reviews are coming next/i);
    expect(reviewSource).toMatch(/No fake stars/i);
  });

  it("qualifies wholesale leads without publishing wholesale pricing", () => {
    const modal = read("components.jsx");
    const wholesale = read("wholesale.html");
    const requiredFields = [
      "store_name",
      "buyer_name",
      "buyer_email",
      "phone",
      "store_website",
      "store_city_state",
      "store_type",
      "location_count",
      "products_interested",
    ];

    for (const field of requiredFields) {
      expect(modal, `${field} missing from modal lead form`).toContain(`name="${field}"`);
      expect(wholesale, `${field} missing from wholesale page`).toContain(`name="${field}"`);
    }

    expect(`${modal}\n${wholesale}`).not.toMatch(/\$6\s*wholesale/i);
    expect(`${modal}\n${wholesale}`).not.toMatch(/wholesale\s+price\s*[:=]?\s*\$\d/i);
    expect(wholesale).toContain("Request wholesale info");
  });

});
