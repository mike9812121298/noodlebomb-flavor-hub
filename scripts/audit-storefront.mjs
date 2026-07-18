import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file.replace(/^\//, '')));
const failures = [];
const passes = [];

function check(condition, label, detail = '') {
  if (condition) passes.push(label);
  else failures.push(`${label}${detail ? `: ${detail}` : ''}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function localFileForUrl(value) {
  const clean = value.split(/[?#]/, 1)[0];
  if (!clean || clean === '/' || clean.startsWith('//')) return null;
  if (/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(clean)) return null;
  if (clean.startsWith('#')) return null;
  const relative = clean.replace(/^\//, '');
  if (path.extname(relative)) return relative;
  return null;
}

const manifest = JSON.parse(read('data/product-manifest.json'));
const catalogSource = read('cart-store.js');
const shopifySource = read('shopify-config.js');
const appSource = read('app.jsx');
const shellSource = `${appSource}\n${read('components.jsx')}\n${read('index.html')}`;

check(manifest.products.length === 8, 'manifest has exactly 8 revenue products');

for (const product of manifest.products) {
  const pricePattern = new RegExp(
    `${escapeRegExp(product.slug)}:\\s*\\{[^}]*name:\\s*['\"]${escapeRegExp(product.name)}['\"][^}]*price:\\s*${escapeRegExp(product.price.toFixed(2))}`,
    's'
  );
  check(pricePattern.test(catalogSource), `${product.slug} catalog name and price match manifest`);
  if (product.available === false) {
    check(!shopifySource.includes(`${product.slug}:`), `${product.slug} safety hold removes Shopify variant mapping`);
  } else {
    check(shopifySource.includes(`${product.slug}:`) && shopifySource.includes(product.variantId), `${product.slug} Shopify variant mapping matches manifest`);
  }
  check(exists(product.image), `${product.slug} approved image exists`, product.image);
}

const productionFiles = [
  'app.jsx',
  'cart.jsx',
  'checkout.jsx',
  ...fs.readdirSync(root).filter((file) => file.endsWith('.html'))
];
const productionText = productionFiles.map((file) => `${file}\n${read(file)}`).join('\n');

const forbiddenAssetPatterns = [
  /original-front-transparent/i,
  /spicy-tokyo-front-transparent/i,
  /citrus-shoyu-front-transparent/i,
  /fire-dust-front-transparent/i,
  /roasted-garlic-sesame-front-transparent/i,
  /shoyu-reserve-front-transparent/i,
  /nb-trio-transparent/i
];
for (const pattern of forbiddenAssetPatterns) {
  check(!pattern.test(productionText), `no legacy product image reference matching ${pattern}`);
}

check(!/aggregateRating/i.test(productionText), 'no fabricated aggregateRating markup');
check(/FREE_SHIPPING_THRESHOLD\s*=\s*29\.99/.test(catalogSource), 'cart free-shipping threshold is $29.99');
check(/FLAT_SHIPPING:\s*3\.00/.test(catalogSource), 'cart flat-shipping display rate is $3.00');
check(!/FREE_SHIPPING_THRESHOLD\s*=\s*32\.99/.test(catalogSource), 'cart has no stale $32.99 shipping threshold');
check(/cartFreeShippingThreshold[^\n]*\|\|\s*29\.99/.test(read('components.jsx')), 'header cart fallback threshold is $29.99');
check(!/\$32\.99\+/.test(productionText), 'customer copy has no stale $32.99+ shipping threshold');
check(/\$29\.99\+/.test(productionText), 'customer copy includes the approved $29.99+ shipping threshold');
check(!/\$3\.50/.test(productionText), 'customer copy has no stale $3.50 flat-shipping rate');
check(/\$3\.00/.test(productionText), 'customer copy includes Shopify checkout\'s $3.00 flat-shipping rate');
check(/begin_checkout/.test(read('cart.jsx')), 'checkout click emits begin_checkout analytics');
check(/data-lead-form/.test(productionText), 'lead forms carry analytics labels');
check(fs.existsSync(path.join(root, 'contact.html')), 'contact page exists');
check(/from\s*=\s*"\/contact"/i.test(read('netlify.toml')), 'Netlify contact route exists');
check(/\/first-box-50\s+\/monthly-box#waitlist\s+301/.test(read('_redirects')), 'first-box route is a permanent redirect');
check(!/https:\/\/noodlebomb\.co\/first-box-50/.test(read('sitemap.xml')), 'first-box route is absent from sitemap');

const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = read(file);
  const attrPattern = /(?:href|src|poster)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrPattern)) {
    const local = localFileForUrl(match[1]);
    if (local) check(exists(local), `${file} local asset exists`, match[1]);
  }
}

const htmlText = htmlFiles.map((file) => read(file)).join('\n');
check(!/href=["']#open-(?:contact|wholesale)["']/i.test(htmlText), 'no dead contact or wholesale sentinel links');

const validHomepageFragmentTargets = new Set([
  'main-content',
  'starter-path',
  'ingredients',
  'bundle-builder',
  'order-map',
  'stores',
  'monthly',
  'lineup',
  'faq',
  'cta'
]);
const navigationFragmentTargets = new Set([
  ...[...shellSource.matchAll(/\bhref\s*(?:=|:)\s*["']#([a-z][a-z0-9-]+)["']/gi)].map((match) => match[1]),
  ...[...shellSource.matchAll(/\[\s*["'][^"']+["']\s*,\s*["']\/?#([a-z][a-z0-9-]+)["']\s*\]/gi)].map((match) => match[1])
].filter((target) => !target.startsWith('open-')));
for (const target of navigationFragmentTargets) {
  check(
    validHomepageFragmentTargets.has(target),
    `homepage navigation fragment #${target} is a rendered section or handled alias`
  );
}

console.log(`Storefront audit: ${passes.length} checks passed, ${failures.length} failed.`);
if (failures.length) {
  console.error('\nFAILURES');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('OK: product canon, approved imagery, routes, lead tracking, checkout analytics, and local assets are internally consistent.');
