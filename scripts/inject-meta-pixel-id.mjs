import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const pixelId = process.env.VITE_FACEBOOK_PIXEL_ID?.trim();
const placeholder = "%VITE_FACEBOOK_PIXEL_ID%";

if (!pixelId) {
  console.log("Meta pixel env not set; storefront pixel remains disabled.");
  process.exit(0);
}

for (const file of readdirSync(process.cwd()).filter((name) => name.endsWith(".html"))) {
  const path = join(process.cwd(), file);
  const html = readFileSync(path, "utf8");
  if (!html.includes(placeholder)) continue;
  writeFileSync(path, html.replaceAll(placeholder, pixelId));
  console.log(`Injected Meta pixel ID into ${file}`);
}
