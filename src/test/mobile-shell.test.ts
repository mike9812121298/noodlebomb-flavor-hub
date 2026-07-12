import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const app = readFileSync("app.jsx", "utf8");
const components = readFileSync("components.jsx", "utf8");
const index = readFileSync("index.html", "utf8");
const shared = readFileSync("page-shared.js", "utf8");
const serviceWorker = readFileSync("sw.js", "utf8");

describe("mobile storefront shell", () => {
  it("keeps the five-button mobile dock visible and outside the animated main element", () => {
    expect(app).toContain('className: "nb-app-dock is-visible"');
    expect(app).toContain("ReactDOM.createPortal(dock, document.body)");
    expect(app).toContain('href: "#bundle-builder"');
    expect(app).toContain('href: "/monthly-box"');
    expect(app).toContain('href: "/recipes"');
    expect(app).toContain('React.createElement("span", null, "Cart")');
    expect(index).toMatch(/\.hero-trust-line\s*\{\s*display:\s*none\s*!important;/);
    expect(index).toContain("padding: 0 24px 156px !important;");
  });

  it("uses a fresh hero-image cache key everywhere the approved hero is loaded", () => {
    const heroUrl = "nb-hero-pour-page.webp?v=20260712-mobilefix";
    for (const source of [app, components, index, shared, serviceWorker]) {
      expect(source).toContain(heroUrl);
    }
    expect(serviceWorker).toContain("noodlebomb-app-shell-v36-mobile-recovery-20260712");
  });
});
