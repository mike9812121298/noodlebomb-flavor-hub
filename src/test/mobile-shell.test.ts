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
    const heroUrl = "nb-hero-pour-page.webp?v=20260712-stability";
    for (const source of [app, components, index, serviceWorker]) {
      expect(source).toContain(heroUrl);
    }
    expect(serviceWorker).toContain("noodlebomb-app-shell-v38-smooth-20260712");
    expect(shared).not.toContain("window.location.reload()");
    expect(app).toContain('image.dataset.nbRetry = "1"');
  });

  it("renders one fixed React hero without static swap or deferred boot scripts", () => {
    expect(shared).not.toMatch(/Hero crossfade slideshow|nb-hero-slide/);
    expect(index.match(/^\s*bootApp\(\);/gm)).toHaveLength(1);
    expect(index).not.toMatch(/addEventListener\([^\n]*bootApp/);
  });

  it("keeps expensive motion dormant until it can help the visible experience", () => {
    expect(app).toContain("const [visible, setVisible] = useState(false)");
    expect(app).toContain('if (ready || !visible || typeof window === "undefined")');
    expect(app).toContain('rootMargin: "220px 0px"');
    expect(app).toContain("compactGlobe ? 1 : 1.65");
    expect(app).toContain("const [mapActive, setMapActive] = useState(false)");
    expect(app).toContain("!hasOrderData || !mapActive");
    expect(index).toContain("build/app.js?v=20260712-final2");
    expect(index).toContain("Mobile performance budget");
    expect(index).toContain(".hero-product-bg { will-change: auto; }");
  });
});
