import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const app = readFileSync("app.jsx", "utf8");
const index = readFileSync("index.html", "utf8");
const shared = readFileSync("page-shared.js", "utf8");
const popup = readFileSync("welcome-popup.js", "utf8");
const reviews = readFileSync("reviews-config.js", "utf8");

describe("storefront growth sprint", () => {
  it("routes only marketing signup forms into the verified NoodleBomb Klaviyo list", () => {
    expect(shared).toContain("companyId: 'XSwJ9H', listId: 'WtA8eA'");
    expect(shared).toContain("revision: '2026-07-15'");
    expect(shared).toContain("subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } }");
    expect(shared).toContain("form[data-lead-form=\"newsletter\"]");
    expect(shared).toContain("form[data-lead-form=\"content-newsletter\"]");
    expect(shared).not.toContain("document.querySelectorAll('form[action*=\"formsubmit.co\"]')");
  });

  it("reveals WELCOME10 only after Klaviyo accepts the popup signup", () => {
    expect(popup).toContain("enabled: true");
    expect(popup).toContain("code: 'WELCOME10'");
    expect(popup).toContain("subscribeEmail(email).then(function ()");
    expect(popup).not.toContain("formsubmit.co");
  });

  it("uses one eager local homepage bundle and responsive approved imagery", () => {
    expect(index.match(/^\s*bootApp\(\);/gm)).toHaveLength(1);
    expect(index).toContain("build/homepage.js?v=20260719-growth");
    expect(index).toContain("imagesrcset=");
    expect(index).not.toContain("https://unpkg.com/react@");
  });

  it("mounts source-attributed reviews without aggregate rating markup", () => {
    expect(app).toContain("React.createElement(Testimonials, null)");
    expect(app).toContain("From Amazon listings");
    expect(reviews).toContain('source: "Amazon review"');
    expect(index + app + reviews).not.toContain("aggregateRating\":");
  });
});
