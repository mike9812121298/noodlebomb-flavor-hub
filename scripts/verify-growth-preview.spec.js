import { test, expect } from "@playwright/test";

const baseUrl = process.env.NB_PREVIEW_URL;
const evidenceDir = "A:/Documents/Claude/NoodleBomb/Audits/2026-07-19-growth-sprint";
const evidenceLabel = process.env.NB_EVIDENCE_LABEL || "preview";

if (!baseUrl) throw new Error("NB_PREVIEW_URL is required");

for (const device of [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
]) {
  test(`${device.name} conversion path`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: device.viewport });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    let signupPayload = null;

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.route("https://a.klaviyo.com/client/subscriptions**", async (route) => {
      signupPayload = JSON.parse(route.request().postData() || "{}");
      await route.fulfill({ status: 202, contentType: "application/vnd.api+json", body: "" });
    });

    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#root h1")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("script[src*='build/homepage.js']")).toHaveCount(1);
    await expect(page.locator("script[src*='unpkg.com/react']")).toHaveCount(0);
    await expect(page.locator(".hero-product-bg")).toHaveJSProperty("complete", true);
    expect(await page.locator(".hero-product-bg").evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await page.screenshot({ path: `${evidenceDir}/${evidenceLabel}-${device.name}-hero.png`, fullPage: false });

    await page.evaluate(() => {
      localStorage.removeItem("nb_welcome_seen_v1");
      window.scrollTo(0, document.documentElement.scrollHeight * 0.45);
    });
    await expect(page.locator("#reviews-heading")).toBeVisible({ timeout: 15000 });
    await expect(page.locator(".nb-rev-card").first()).toContainText(/Amazon review/i);
    if (await page.locator(".nb-welcome-x").isVisible()) await page.locator(".nb-welcome-x").click();
    await page.locator("#reviews-heading").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${evidenceDir}/${evidenceLabel}-${device.name}-reviews.png`, fullPage: false });

    await page.evaluate(() => localStorage.removeItem("nb_welcome_seen_v1"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("#root h1")).toBeVisible({ timeout: 15000 });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.45));
    await expect(page.locator(".nb-welcome-card")).toBeVisible({ timeout: 12000 });
    await page.locator(".nb-welcome-form input[type=email]").fill(`preview-${device.name}@example.com`);
    await page.locator(".nb-welcome-form button[type=submit]").click();
    await expect(page.locator(".nb-welcome-card")).toContainText("Use code WELCOME10");
    expect(signupPayload?.data?.relationships?.list?.data?.id).toBe("WtA8eA");
    expect(signupPayload?.data?.attributes?.profile?.data?.attributes?.subscriptions?.email?.marketing?.consent).toBe("SUBSCRIBED");
    await page.screenshot({ path: `${evidenceDir}/${evidenceLabel}-${device.name}-welcome.png`, fullPage: false });

    await page.goto(`${baseUrl}/contact`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    const contact = page.locator('form[data-lead-form="contact"]');
    await expect(contact).toHaveAttribute("action", "https://formsubmit.co/hello@noodlebomb.co");
    await expect(contact).not.toHaveAttribute("data-nb-klaviyo-bound", "1");

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    await context.close();
  });
}
