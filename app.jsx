// NoodleBomb - app composition.
// React hooks are destructured once in components.jsx (loaded before app.jsx)
// so they're already available in this shared global scope. Re-declaring them
// here would throw "Identifier 'useEffect' has already been declared" now that
// the JSX bundles ship as plain <script> tags (post-Babel-in-browser) and
// share global scope. cart.jsx and checkout.jsx keep their own destructures
// because they ship as single-file bundles on cart.html / checkout.html.
// Wix Stores deep links (added 2026-04-25 for production deploy)
// Kept for the Footer "Shop all" browse links - purchases now flow through
// the local cart (cart.html -> checkout.html -> Wix payment handoff).
const WIX_URLS = {"original": "/original-ramen-sauce", "spicy": "/spicy-tokyo-ramen-sauce", "citrus": "/citrus-shoyu-ramen-sauce", "trio": "/cart?add=trio&qty=1", "shoyu": "https://nu2vqa-ma.myshopify.com/products/shoyu-reserve", "cart": "https://nu2vqa-ma.myshopify.com/cart", "shop": "https://nu2vqa-ma.myshopify.com/collections/all?sort_by=alphabetical"};

// Trio bundle price - used by the bundle CTAs.
const TRIO = { slug: 'trio', name: 'The NoodleBomb Trio', priceUsd: 29.99 };

// Branded cart permalink: keep shoppers inside noodlebomb.co until the final
// Shopify checkout handoff. /cart reads add/qty and stores the line locally.
const SHOPIFY_VARIANT_IDS = {
  original: '53998041596214',
  spicy:  '53998042120502',
  citrus:  '53998041071926',
  trio:  '53998042644790',
  shoyu:  '54006619636022',
  shoyuspicy: '54097354686774'
};
const PRODUCT_DETAIL_URLS = {
  original: '/original-ramen-sauce',
  spicy: '/spicy-tokyo-ramen-sauce',
  citrus: '/citrus-shoyu-ramen-sauce',
  shoyu: '/product/shoyu-reserve',
  shoyuspicy: '/spicy-shoyu-ramen-sauce'
};
const cartPermalink = (slug, qty = 1) => {
  const n = Math.max(1, Math.floor(Number(qty) || 1));
  return `/cart?add=${encodeURIComponent(slug)}&qty=${n}`;
};
const openCartWithFeedback = (e, label = 'Opening cart...') => {
  if (!e || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
  const link = e.currentTarget;
  const href = link.href;
  e.preventDefault();
  e.stopPropagation();
  link.classList.add('is-buying');
  link.setAttribute('aria-busy', 'true');
  if (!link.dataset.originalText) link.dataset.originalText = link.textContent;
  link.textContent = label;
  window.setTimeout(() => { window.location.href = href; }, 180);
};

// Legacy local-cart helper kept for the drawer's "View full cart" path; no
// longer wired to any Add-to-Cart button. Add-to-Cart goes direct to Shopify.
const addAndOpenCart = (item, e) => {
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
  if (e) e.preventDefault();
  if (window.NB_CART) window.NB_CART.add(item);
  window.dispatchEvent(new CustomEvent('nb-open-cart'));
};

// Flavor Finder: add the recommended bottle to the cart (canonical NB_CART.add),
// then continue to that bottle's product page so the shopper lands on it with the
// bottle already in their cart - no second add. Falls back to the /cart permalink
// (which adds via the URL) for modifier/middle-clicks or if the cart store is absent.
const addFlavorAndViewProduct = (key, e) => {
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
  if (e) e.preventDefault();
  const f = FLAVORS[key];
  if (window.NB_CART && f) {
  window.NB_CART.add({ slug: key, name: f.name, price: f.priceUsd, qty: 1 });
  window.location.href = PRODUCT_DETAIL_URLS[key] || cartPermalink(key);
  } else {
  window.location.href = cartPermalink(key);
  }
};

const FLAVORS = {
  original: { name: 'Original', tag: 'No.01 - Garlic & Sesame', short: 'No.01', color: '#D4A24A', ink: '#0E0D0C', rgb: '212, 162, 74', deep: '#8A6424',
  line1: 'The one that started it all.',
  line2: 'Roasted garlic, toasted sesame, smooth soy.',
  price: '$11.99', priceUsd: 11.99, pack: '$29.99 / 3-pack' },
  spicy: { name: 'Spicy Tokyo', tag: 'No.03 - Spicy Tokyo', short: 'No.03', color: '#E84A3A', ink: '#0E0D0C', rgb: '232, 74, 58', deep: '#8B1E1E',
  line1: 'Umami meets fire.',
  line2: 'Roasted chili, garlic, sesame.',
  price: '$11.99', priceUsd: 11.99, pack: '$29.99 / 3-pack' },
  citrus: { name: 'Citrus Shoyu', tag: 'No.02 - Citrus Shoyu', short: 'No.02', color: '#FF6A1A', ink: '#0B0B0B', rgb: '255, 106, 26', deep: '#B83A10',
  line1: 'Bright, tangy, refreshing.',
  line2: 'Shoyu base with a clean citrus lift.',
  price: '$11.99', priceUsd: 11.99, pack: '$29.99 / 3-pack' },
  shoyu: { name: 'Shoyu Reserve', tag: 'Reserve - Soy Sauce', short: 'RSV', color: '#D7A84D', ink: '#0E0D0C', rgb: '215, 168, 77', deep: '#7A5A21',
  line1: 'Slow-brewed shoyu depth.',
  line2: 'Bold, clean finish.',
  price: '$11.99', priceUsd: 11.99, pack: '$11.99 / bottle' },
  shoyuspicy: { name: 'Spicy Shoyu', tag: 'Reserve - Spicy Soy Sauce', short: 'SPY', color: '#E84A3A', ink: '#0E0D0C', rgb: '232, 74, 58', deep: '#7A231E',
  line1: 'Reserve depth with heat.',
  line2: 'Bold shoyu finish, turned up.',
  price: '$11.99', priceUsd: 11.99, pack: '$11.99 / bottle' }
};

const FLAVOR_IMAGES = {
  original: 'uploads/nb-original-front-cutout-2026-05-09.webp',
  spicy: 'uploads/nb-spicy-front-cutout-2026-05-09.webp',
  citrus: 'uploads/nb-citrus-front-cutout-2026-05-09.webp',
  shoyu: 'uploads/nb-shoyu-reserve-front-cutout-v2-2026-06-07.webp',
  shoyuspicy: 'uploads/nb-shoyu-spicy-front-cutout-2026-06-09.webp'
};

// Soy Sauce reserve line - second product group on the lineup (DTC, 2026-06-09).
const SOY_SAUCES = [
  { slug: 'shoyu', name: 'Shoyu Reserve', tag: 'Reserve - Soy Sauce', color: '#D7A84D', rgb: '215, 168, 77', line1: 'Slow-brewed shoyu depth.', line2: 'Bold, clean finish.', price: '$11.99', image: 'uploads/nb-shoyu-reserve-front-cutout-v2-2026-06-07.webp', detail: '/product/shoyu-reserve' },
  { slug: 'shoyuspicy', name: 'Spicy Shoyu', tag: 'Reserve - Spicy Soy Sauce', color: '#E84A3A', rgb: '232, 74, 58', line1: 'Reserve depth with heat.', line2: 'Bold shoyu finish, turned up.', price: '$11.99', image: 'uploads/nb-shoyu-spicy-front-cutout-2026-06-09.webp', detail: '/spicy-shoyu-ramen-sauce' }
];

const FOOD_IMAGES = {
  ramen: 'uploads/nb-hero-pour-page.webp',
  stirfry: 'uploads/usecase-noodles-v2.jpg',
  // Editorial wings - glossy, saucy, close crop
  wings: 'uploads/usecase-wings-v2.jpg',
  rice: 'uploads/usecase-rice-v2.jpg',
  dumplings: 'uploads/usecase-dumplings-v2.jpg',
  // Editorial pulled pork - shredded on a bun, close crop (replaced slow-cooker shot)
  pulledpork: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=1600&q=80&auto=format&fit=crop'
};

const ORDER_MAP_FALLBACK_CITIES = [
  { city: 'Bonney Lake', state: 'WA', lat: 47.177, lng: -122.186, orders: 1, source: 'brand_hq' }
];

const normalizeOrderCity = (city) => {
  if (!city || !city.city || !city.state) return null;
  const lat = Number(city.lat);
  const lng = Number(city.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
  city: String(city.city).trim(),
  state: String(city.state).trim().toUpperCase(),
  lat,
  lng,
  orders: Math.max(1, Math.floor(Number(city.orders) || 1)),
  latestProduct: city.latestProduct || city.product || 'NoodleBomb order',
  lastOrderAt: city.lastOrderAt || null,
  source: city.source || 'order_city'
  };
};

const normalizeStoreLocation = (store) => {
  if (!store || !store.name || !store.city || !store.state) return null;
  const lat = Number(store.lat);
  const lng = Number(store.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
  name: String(store.name).trim(),
  city: String(store.city).trim(),
  state: String(store.state).trim().toUpperCase(),
  lat,
  lng,
  address: store.address ? String(store.address).trim() : '',
  postalCode: store.postalCode ? String(store.postalCode).trim() : '',
  websiteUrl: store.websiteUrl ? String(store.websiteUrl).trim() : '',
  products: Array.isArray(store.products) ? store.products.filter(Boolean).map(String) : [],
  status: store.status || 'confirmed',
  source: store.source || 'confirmed_stockist'
  };
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - Flavor Breakdown: sticky bottle + orbiting flavor dimensions
const ORDER_NA_VIEWBOX = { width: 1000, height: 620 };
const ORDER_NA_MERCATOR = { minLng: -171, maxLng: -50, minLat: 15, maxLat: 72 };
const mercatorY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
const ORDER_NA_MIN_MERC = mercatorY(ORDER_NA_MERCATOR.minLat);
const ORDER_NA_MAX_MERC = mercatorY(ORDER_NA_MERCATOR.maxLat);

const projectNorthAmericaPoint = ({ lat, lng }) => {
  const safeLat = Math.max(ORDER_NA_MERCATOR.minLat - 3, Math.min(ORDER_NA_MERCATOR.maxLat + 4, Number(lat)));
  const safeLng = Math.max(ORDER_NA_MERCATOR.minLng - 4, Math.min(ORDER_NA_MERCATOR.maxLng + 4, Number(lng)));
  const x = ((safeLng - ORDER_NA_MERCATOR.minLng) / (ORDER_NA_MERCATOR.maxLng - ORDER_NA_MERCATOR.minLng)) * ORDER_NA_VIEWBOX.width;
  const y = ((ORDER_NA_MAX_MERC - mercatorY(safeLat)) / (ORDER_NA_MAX_MERC - ORDER_NA_MIN_MERC)) * ORDER_NA_VIEWBOX.height;
  return {
  x: Math.max(34, Math.min(ORDER_NA_VIEWBOX.width - 34, x)),
  y: Math.max(34, Math.min(ORDER_NA_VIEWBOX.height - 34, y)),
  visible: Number.isFinite(x) && Number.isFinite(y),
  };
};

const ORDER_NA_REGIONS = [
  {
  id: 'usa',
  label: 'United States',
  emphasis: true,
  d: 'M629.6,333.4L655.9,346.4L682.8,344.7L717.8,362.9L731.0,374.4L729.8,409.1L794.5,377.7L822.3,377.7L841.0,353.5L853.0,357.3L859.8,379.6L833.8,390.4L827.9,403.0L835.0,409.5L804.0,415.9L818.6,415.9L802.0,417.5L794.2,433.7L789.0,428.8L792.9,438.4L785.6,448.7L782.2,431.9L782.4,441.2L776.9,439.9L787.4,462.9L741.0,496.7L748.9,545.3L737.9,540.3L718.2,507.5L630.7,512.3L610.4,525.2L607.2,540.5L594.9,536.5L578.9,513.1L554.2,514.0L533.0,494.2L495.7,497.6L465.1,486.4L445.2,487.9L416.3,470.8L385.1,421.5L389.3,372.6L382.8,346.0L395.7,347.4L400.1,357.0L398.0,337.5L629.6,333.4Z M131.7,34.0L226.5,39.1L248.0,47.9L248.0,202.4L264.1,206.6L277.3,221.4L293.6,209.5L324.7,251.6L338.8,259.5L334.4,272.9L305.1,231.6L284.1,230.5L234.9,205.4L197.4,194.3L188.2,197.3L189.9,206.9L159.4,218.0L168.4,188.6L140.3,215.4L146.4,221.9L138.6,231.3L103.9,258.5L51.4,277.6L101.8,245.8L115.4,221.2L98.7,227.7L88.0,219.2L74.6,224.5L70.1,206.7L59.4,209.4L46.7,199.6L43.5,177.2L53.2,161.2L84.5,151.7L78.4,141.7L84.5,135.5L68.1,142.7L37.8,137.2L35.5,114.1L53.9,105.8L60.7,105.8L59.6,114.3L77.0,113.6L35.0,73.8L39.6,64.0L64.7,54.6L75.1,35.4L131.7,34.0Z',
  },
  {
  id: 'canada',
  label: 'Canada',
  d: 'M664.9,52.1L664.9,71.7L675.9,56.8L691.3,94.9L706.4,44.5L730.4,49.0L741.5,58.6L740.6,96.4L724.4,108.6L704.4,106.1L691.5,135.8L643.3,177.9L630.7,220.8L642.9,223.0L650.4,244.9L733.3,268.8L734.5,290.7L752.8,313.9L763.6,298.8L753.5,274.5L780.6,251.8L764.3,222.7L774.1,208.6L767.7,173.6L803.0,171.8L823.4,190.7L838.1,191.8L840.6,220.7L854.1,230.5L879.5,202.0L905.8,246.4L902.5,254.2L939.4,275.0L953.0,303.5L917.1,324.3L864.5,324.5L825.6,359.8L875.6,335.1L882.9,340.2L875.1,347.1L880.4,365.6L904.8,369.1L913.1,357.9L919.0,368.7L866.7,391.0L880.8,374.9L858.4,376.4L853.0,357.3L841.0,353.5L822.3,377.7L794.5,377.7L729.8,409.1L731.0,374.4L682.8,344.7L655.9,346.4L629.6,333.4L396.9,337.5L360.0,318.0L356.6,301.5L334.6,279.0L338.8,259.5L293.6,209.5L277.3,221.4L248.0,202.4L248.0,47.9L285.1,63.7L302.4,49.6L340.5,38.3L346.2,46.6L359.9,34.5L373.9,52.5L384.9,39.0L386.0,54.0L409.3,46.2L460.8,63.6L471.9,73.1L460.3,82.2L475.2,86.1L504.6,80.8L513.4,91.6L522.4,82.5L513.9,74.7L519.3,68.3L536.0,65.6L574.8,86.9L599.6,84.4L606.0,69.7L618.8,76.1L618.8,93.2L634.4,60.4L616.6,34.0L645.6,34.0L656.9,38.3L649.5,48.1L664.9,52.1Z M469.7,34.0L563.8,34.0L578.7,41.7L577.8,50.4L564.2,52.0L566.7,66.5L537.5,58.3L476.8,70.5L443.5,43.0L484.2,34.8L426.4,34.0L469.7,34.0Z M697.8,34.0L844.7,34.0L859.8,58.2L844.6,67.1L902.0,100.8L885.0,132.2L861.8,109.0L851.1,111.1L850.1,120.8L873.4,142.0L875.9,168.3L844.8,152.0L866.4,179.3L826.3,164.8L794.8,137.3L771.0,144.5L764.0,139.0L769.4,127.1L802.0,124.7L812.8,93.4L807.3,79.2L777.9,63.8L783.2,58.9L760.7,38.8L741.3,47.3L667.7,34.0L703.9,34.0L697.8,34.0Z',
  },
  {
  id: 'mexico',
  label: 'Mexico',
  d: 'M610.4,540.3L604.4,566.0L617.4,586.0L663.0,586.0L667.1,576.7L681.5,573.1L695.5,577.8L690.6,586.0L545.5,586.0L537.0,563.6L485.7,516.5L478.1,498.9L464.7,493.8L465.5,506.9L508.8,560.5L503.9,563.2L486.1,548.9L485.1,539.2L462.4,526.1L469.7,519.5L445.2,487.9L465.1,486.4L495.7,497.6L533.0,494.2L554.2,514.0L578.9,513.1L594.9,536.5L610.4,540.3Z',
  },
];

const orderGlobeClamp = (value, min, max) => Math.max(min, Math.min(max, value));
const orderGlobeRadians = (degrees) => (Number(degrees) || 0) * Math.PI / 180;

const pointInEllipse = (lat, lng, centerLat, centerLng, radiusLat, radiusLng) => {
  const y = (lat - centerLat) / radiusLat;
  const x = (lng - centerLng) / radiusLng;
  return (x * x + y * y) <= 1;
};

const tiltedEllipseValue = (lat, lng, centerLat, centerLng, radiusLat, radiusLng, rotation = 0) => {
  const adjustedX = (lng - centerLng) * Math.cos(orderGlobeRadians(centerLat));
  const adjustedY = lat - centerLat;
  const angle = orderGlobeRadians(rotation);
  const x = adjustedX * Math.cos(angle) + adjustedY * Math.sin(angle);
  const y = -adjustedX * Math.sin(angle) + adjustedY * Math.cos(angle);
  return ((x / radiusLng) * (x / radiusLng)) + ((y / radiusLat) * (y / radiusLat));
};

const pointInTiltedEllipse = (lat, lng, centerLat, centerLng, radiusLat, radiusLng, rotation = 0) => {
  return tiltedEllipseValue(lat, lng, centerLat, centerLng, radiusLat, radiusLng, rotation) <= 1;
};

const orderGlobeNoise = (lat, lng) => {
  const value = Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const ORDER_GLOBE_LAND_MASSES = [
  { id: 'alaska', lat: 63, lng: -151, rLat: 9.6, rLng: 17, rot: -10 },
  { id: 'aleutians', lat: 52.5, lng: -171, rLat: 2.4, rLng: 18, rot: -10 },
  { id: 'west-canada', lat: 58, lng: -124, rLat: 12, rLng: 14, rot: -8 },
  { id: 'central-canada', lat: 58, lng: -103, rLat: 16, rLng: 23, rot: 3 },
  { id: 'east-canada', lat: 54, lng: -75, rLat: 13, rLng: 16, rot: 8 },
  { id: 'labrador', lat: 56, lng: -61, rLat: 8.5, rLng: 7.8, rot: 10 },
  { id: 'greenland', lat: 72, lng: -42, rLat: 12.5, rLng: 8.5, rot: -12 },
  { id: 'greenland-south', lat: 61, lng: -44, rLat: 8.5, rLng: 5.4, rot: -13 },
  { id: 'us-west', lat: 39, lng: -116, rLat: 11, rLng: 12, rot: -5 },
  { id: 'us-central', lat: 39, lng: -99, rLat: 12, rLng: 16, rot: 0 },
  { id: 'us-east', lat: 38, lng: -81, rLat: 12, rLng: 12, rot: 4 },
  { id: 'new-england', lat: 43, lng: -70, rLat: 5.6, rLng: 4.2, rot: 18 },
  { id: 'california-baja', lat: 31, lng: -116, rLat: 8.5, rLng: 3.6, rot: -16 },
  { id: 'florida', lat: 28, lng: -81, rLat: 5.4, rLng: 4.2, rot: -8 },
  { id: 'mexico', lat: 23.5, lng: -102, rLat: 10.8, rLng: 17, rot: -13 },
  { id: 'yucatan', lat: 19.8, lng: -89, rLat: 4.2, rLng: 5.4, rot: 6 },
  { id: 'central-america', lat: 15.5, lng: -88, rLat: 4.4, rLng: 11, rot: -22 },
  { id: 'caribbean', lat: 20, lng: -75, rLat: 3.8, rLng: 12, rot: -8 },
  { id: 'north-south-america', lat: 6, lng: -74, rLat: 8, rLng: 13, rot: -6 },
  { id: 'andes', lat: -14, lng: -72, rLat: 29, rLng: 8.5, rot: -6 },
  { id: 'brazil', lat: -10, lng: -52, rLat: 18, rLng: 17, rot: -13 },
  { id: 'guianas', lat: 5, lng: -56, rLat: 6.4, rLng: 8.8, rot: -8 },
  { id: 'patagonia', lat: -46, lng: -70, rLat: 11, rLng: 4.6, rot: 6 },
  { id: 'south-cone', lat: -36, lng: -65, rLat: 19, rLng: 8, rot: 8 },
  { id: 'western-europe', lat: 48, lng: 2, rLat: 9.5, rLng: 11, rot: -2 },
  { id: 'uk-ireland', lat: 54, lng: -3, rLat: 5.2, rLng: 3.2, rot: -8 },
  { id: 'iberia', lat: 40, lng: -4, rLat: 5.2, rLng: 5.5, rot: -6 },
  { id: 'iceland', lat: 65, lng: -19, rLat: 2.9, rLng: 4.2, rot: -8 },
  { id: 'scandinavia', lat: 63, lng: 18, rLat: 13, rLng: 8, rot: -18 },
  { id: 'eastern-europe', lat: 50, lng: 30, rLat: 9, rLng: 15, rot: 4 },
  { id: 'italy-balkans', lat: 42, lng: 15, rLat: 7, rLng: 8, rot: -12 },
  { id: 'anatolia', lat: 39, lng: 36, rLat: 4.8, rLng: 10.5, rot: 5 },
  { id: 'north-africa', lat: 25, lng: 10, rLat: 13, rLng: 26, rot: 0 },
  { id: 'west-africa', lat: 8, lng: -4, rLat: 16, rLng: 14, rot: -6 },
  { id: 'central-africa', lat: 0, lng: 20, rLat: 18, rLng: 20, rot: 3 },
  { id: 'east-africa', lat: 2, lng: 36, rLat: 19, rLng: 11, rot: -9 },
  { id: 'south-africa', lat: -23, lng: 24, rLat: 16, rLng: 13, rot: -4 },
  { id: 'madagascar', lat: -19, lng: 47, rLat: 9, rLng: 3.8, rot: -13 },
  { id: 'middle-east', lat: 29, lng: 45, rLat: 10, rLng: 16, rot: 5 },
  { id: 'central-asia', lat: 45, lng: 65, rLat: 12, rLng: 27, rot: 4 },
  { id: 'west-russia', lat: 58, lng: 60, rLat: 14, rLng: 33, rot: 1 },
  { id: 'east-russia', lat: 58, lng: 111, rLat: 14, rLng: 42, rot: 1 },
  { id: 'china', lat: 34, lng: 103, rLat: 14, rLng: 17, rot: -5 },
  { id: 'india', lat: 21, lng: 78, rLat: 10, rLng: 8, rot: -10 },
  { id: 'southeast-asia', lat: 13, lng: 103, rLat: 9, rLng: 12, rot: -8 },
  { id: 'japan-korea', lat: 37, lng: 136, rLat: 7, rLng: 7.5, rot: -20 },
  { id: 'taiwan', lat: 23.7, lng: 121, rLat: 2.2, rLng: 1.2, rot: 8 },
  { id: 'indonesia', lat: -3, lng: 120, rLat: 6, rLng: 23, rot: 2 },
  { id: 'philippines', lat: 12, lng: 123, rLat: 5, rLng: 4.5, rot: 8 },
  { id: 'papua', lat: -6, lng: 145, rLat: 4.8, rLng: 9, rot: 3 },
  { id: 'australia', lat: -25, lng: 134, rLat: 13, rLng: 16, rot: 3 },
  { id: 'tasmania', lat: -42, lng: 147, rLat: 2.3, rLng: 2.5, rot: 8 },
  { id: 'new-zealand', lat: -42, lng: 174, rLat: 6, rLng: 3, rot: -22 },
];

const ORDER_GLOBE_OCEAN_CUTOUTS = [
  { lat: 58, lng: -86, rLat: 8.6, rLng: 10.5, rot: 0 },
  { lat: 46, lng: -87, rLat: 3.4, rLng: 6.2, rot: 0 },
  { lat: 27.5, lng: -90, rLat: 6.8, rLng: 10.2, rot: 0 },
  { lat: 38, lng: -122, rLat: 6.2, rLng: 3.2, rot: 2 },
  { lat: 49, lng: -128, rLat: 6.5, rLng: 4.4, rot: -8 },
  { lat: 53, lng: -56, rLat: 4.4, rLng: 3.8, rot: 8 },
  { lat: 36, lng: 18, rLat: 4, rLng: 20, rot: 2 },
  { lat: 43, lng: 34, rLat: 3, rLng: 6.2, rot: 0 },
  { lat: 43, lng: 51, rLat: 5.2, rLng: 3.5, rot: 0 },
  { lat: 22, lng: 39, rLat: 7, rLng: 2.1, rot: 0 },
  { lat: 27, lng: 51, rLat: 3.8, rLng: 3.5, rot: 0 },
  { lat: 16, lng: 88, rLat: 8, rLng: 6.4, rot: 0 },
  { lat: 15, lng: 113, rLat: 7, rLng: 10.5, rot: -5 },
  { lat: -8, lng: 105, rLat: 5, rLng: 8, rot: 0 },
];

const isWorldGlobeDot = (lat, lng) => {
  let bestMargin = -Infinity;
  ORDER_GLOBE_LAND_MASSES.forEach((region) => {
  const value = tiltedEllipseValue(lat, lng, region.lat, region.lng, region.rLat, region.rLng, region.rot);
  if (value <= 1) bestMargin = Math.max(bestMargin, 1 - value);
  });
  if (bestMargin < 0) return false;
  if (ORDER_GLOBE_OCEAN_CUTOUTS.some((cutout) => (
  pointInTiltedEllipse(lat, lng, cutout.lat, cutout.lng, cutout.rLat, cutout.rLng, cutout.rot)
  ))) return false;

  const coastNoise = orderGlobeNoise(lat * 2.7 + 11, lng * 2.2 - 7);
  if (bestMargin < 0.035 && coastNoise < 0.62) return false;
  if (bestMargin < 0.095 && coastNoise < 0.32) return false;
  if (bestMargin < 0.17 && coastNoise < 0.10) return false;
  return true;
};

const buildWorldGlobeDots = () => {
  const dots = [];
  for (let lat = -56; lat <= 80; lat += 0.72) {
  for (let lng = -180; lng <= 180; lng += 0.82) {
  const noise = orderGlobeNoise(lat, lng);
  const dotLat = lat + (noise - 0.5) * 0.10;
  const dotLng = lng + (orderGlobeNoise(lng, lat) - 0.5) * 0.14;
  if (isWorldGlobeDot(dotLat, dotLng)) {
  dots.push({ lat: dotLat, lng: dotLng, tone: 0.70 + noise * 0.30 });
  }
  }
  }
  return dots;
};

const ORDER_GLOBE_CENTER_LNG = -98;
const makeLatLine = (lat, lngStart, lngEnd, step = 4) => {
  const points = [];
  const direction = lngStart <= lngEnd ? 1 : -1;
  for (let lng = lngStart; direction > 0 ? lng <= lngEnd : lng >= lngEnd; lng += step * direction) {
  points.push({ lat, lng });
  }
  return points;
};
const ORDER_GLOBE_COUNTRY_SEAMS = [
  { points: makeLatLine(49, -124, -96, 3) },
  { points: [{ lat: 48.7, lng: -96 }, { lat: 47.2, lng: -90 }, { lat: 44.8, lng: -84 }, { lat: 43.2, lng: -79 }, { lat: 45.2, lng: -73 }, { lat: 47.2, lng: -68 }] },
  { points: [{ lat: 32, lng: -117 }, { lat: 32, lng: -112 }, { lat: 31, lng: -108 }, { lat: 29.6, lng: -104 }, { lat: 29, lng: -100 }, { lat: 26, lng: -97 }] },
  { points: [{ lat: 15, lng: -92 }, { lat: 14.6, lng: -88 }, { lat: 13.6, lng: -85 }, { lat: 12, lng: -83 }] },
  { points: [{ lat: 7, lng: -78 }, { lat: 0, lng: -77 }, { lat: -10, lng: -76 }, { lat: -22, lng: -70 }, { lat: -38, lng: -71 }] },
  { points: makeLatLine(0, -78, -50, 3) },
  { points: makeLatLine(36, -10, 35, 3) },
  { points: makeLatLine(48, -5, 38, 3) },
  { points: makeLatLine(14, -17, 42, 4) },
  { points: makeLatLine(0, -10, 43, 4) },
  { points: [{ lat: 30, lng: 35 }, { lat: 28, lng: 44 }, { lat: 26, lng: 54 }, { lat: 25, lng: 62 }] },
  { points: makeLatLine(30, 68, 122, 4) },
  { points: makeLatLine(45, 35, 135, 5) },
  { points: [{ lat: 8, lng: 95 }, { lat: 16, lng: 102 }, { lat: 22, lng: 106 }, { lat: 30, lng: 108 }] },
  { points: makeLatLine(-25, 113, 153, 4) },
];

const projectOrderGlobePoint = (point, spin, viewport, radius) => {
  const latRad = orderGlobeRadians(point.lat);
  const lngRad = orderGlobeRadians(point.lng - ORDER_GLOBE_CENTER_LNG);
  const yaw = orderGlobeRadians(spin?.y || 0);
  const tilt = orderGlobeRadians(spin?.x || 0);

  const cosLat = Math.cos(latRad);
  const baseX = cosLat * Math.sin(lngRad);
  const baseY = Math.sin(latRad);
  const baseZ = cosLat * Math.cos(lngRad);

  const yawX = baseX * Math.cos(yaw) + baseZ * Math.sin(yaw);
  const yawZ = baseZ * Math.cos(yaw) - baseX * Math.sin(yaw);
  const tiltY = baseY * Math.cos(tilt) - yawZ * Math.sin(tilt);
  const tiltZ = baseY * Math.sin(tilt) + yawZ * Math.cos(tilt);

  return {
  x: viewport.cx + yawX * radius,
  y: viewport.cy - tiltY * radius,
  z: tiltZ,
  visible: tiltZ > -0.08,
  alpha: orderGlobeClamp((tiltZ + 0.10) / 0.46, 0, 1),
  };
};

function LiveOrderGlobeCanvas({ locations, latestLocation, isStoreLayer, spin, zoom, isDragging, onPointSelect }) {
  const canvasRef = useRef(null);
  const projectedPinsRef = useRef([]);
  const selectedKeyRef = useRef('');
  const hoverFrameRef = useRef(0);
  const pendingHoverRef = useRef(null);
  const [landDots, setLandDots] = useState([]);

  const latestKey = latestLocation
  ? (isStoreLayer
  ? `${latestLocation.name}-${latestLocation.city}-${latestLocation.state}`
  : `${latestLocation.city}-${latestLocation.state}`)
  : '';

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas || landDots.length) return undefined;
  let cancelled = false;
  let timer = 0;
  let idleId = 0;
  const build = () => {
  if (cancelled) return;
  const run = () => {
  if (!cancelled) setLandDots(buildWorldGlobeDots());
  };
  if ('requestIdleCallback' in window) {
  idleId = window.requestIdleCallback(run, { timeout: 1200 });
  } else {
  timer = window.setTimeout(run, 120);
  }
  };
  const observer = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting)) {
  observer.disconnect();
  build();
  }
  }, { rootMargin: '800px 0px' });
  observer.observe(canvas);
  return () => {
  cancelled = true;
  window.clearTimeout(timer);
  if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
  observer.disconnect();
  };
  }, [landDots.length]);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return undefined;
  const context = canvas.getContext('2d');
  if (!context) return undefined;

  const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  let animationFrame = 0;
  let lastSizeKey = '';
  let lastPaintAt = 0;

  const drawProjectedLine = (points, viewport, radius, strokeStyle, lineWidth, lineDash = []) => {
  context.save();
  context.beginPath();
  context.setLineDash(lineDash);
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  let drawing = false;
  points.forEach((point) => {
  const projected = projectOrderGlobePoint(point, spin, viewport, radius);
  if (!projected.visible || projected.alpha < 0.08) {
  drawing = false;
  return;
  }
  if (!drawing) {
  context.moveTo(projected.x, projected.y);
  drawing = true;
  } else {
  context.lineTo(projected.x, projected.y);
  }
  });
  context.stroke();
  context.restore();
  };

  const render = (time = 0) => {
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, rect.width || canvas.offsetWidth || 620);
  const cssHeight = Math.max(320, rect.height || canvas.offsetHeight || 520);
  const minFrameMs = isDragging || cssWidth < 520 ? 24 : 16;
  if (!reducedMotion && time && lastPaintAt && time - lastPaintAt < minFrameMs) {
  animationFrame = window.requestAnimationFrame(render);
  return;
  }
  lastPaintAt = time || performance.now();
  const dpr = orderGlobeClamp(window.devicePixelRatio || 1, 1, isDragging ? 1 : 1.25);
  const sizeKey = `${Math.round(cssWidth)}-${Math.round(cssHeight)}-${dpr}`;
  if (sizeKey !== lastSizeKey) {
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  lastSizeKey = sizeKey;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, cssWidth, cssHeight);

  const globeZoom = orderGlobeClamp(Number(zoom) || 1, 1, 2.35);
  const baseRadius = Math.min(cssWidth, cssHeight) * 0.505;
  const radius = baseRadius * globeZoom;
  const viewport = {
  cx: cssWidth * 0.50,
  cy: cssHeight * 0.515,
  };

  context.save();
  context.shadowColor = 'rgba(63, 164, 180, .22)';
  context.shadowBlur = 72;
  context.shadowOffsetY = 18;
  context.beginPath();
  context.arc(viewport.cx, viewport.cy, radius, 0, Math.PI * 2);
  context.fillStyle = 'rgba(131, 222, 230, .20)';
  context.fill();
  context.restore();

  const sphereGradient = context.createRadialGradient(
  viewport.cx - radius * 0.42,
  viewport.cy - radius * 0.46,
  radius * 0.06,
  viewport.cx,
  viewport.cy,
  radius * 1.06
  );
  sphereGradient.addColorStop(0, 'rgba(255, 255, 255, .99)');
  sphereGradient.addColorStop(0.17, 'rgba(244, 255, 254, .98)');
  sphereGradient.addColorStop(0.48, 'rgba(220, 250, 249, .98)');
  sphereGradient.addColorStop(0.76, 'rgba(190, 232, 240, .98)');
  sphereGradient.addColorStop(1, 'rgba(158, 210, 226, .99)');
  context.beginPath();
  context.arc(viewport.cx, viewport.cy, radius, 0, Math.PI * 2);
  context.fillStyle = sphereGradient;
  context.fill();

  context.save();
  context.beginPath();
  context.arc(viewport.cx, viewport.cy, radius, 0, Math.PI * 2);
  context.clip();

  [-60, -30, 0, 30, 60].forEach((lat) => {
  const points = [];
  for (let lng = -180; lng <= 180; lng += 4) points.push({ lat, lng });
  drawProjectedLine(points, viewport, radius, 'rgba(56, 154, 172, .105)', 0.6);
  });
  for (let lng = -180; lng <= 180; lng += 30) {
  const points = [];
  for (let lat = -74; lat <= 78; lat += 3) points.push({ lat, lng });
  drawProjectedLine(points, viewport, radius, 'rgba(56, 154, 172, .085)', 0.55);
  }

  const landDotRadius = orderGlobeClamp(radius * 0.00235, 0.52, 0.92);
  const landGlowRadius = landDotRadius * 1.45;
  const landDotBudget = isDragging || cssWidth < 520 ? 950 : 1800;
  const landDotStep = landDots.length > landDotBudget ? Math.ceil(landDots.length / landDotBudget) : 1;
  for (let index = 0; index < landDots.length; index += landDotStep) {
  const dot = landDots[index];
  const projected = projectOrderGlobePoint(dot, spin, viewport, radius);
  if (!projected.visible || projected.alpha <= 0.04) continue;
  const alpha = 0.30 + projected.alpha * 0.62;
  if (projected.alpha > 0.88 && dot.tone > 0.92) {
  context.beginPath();
  context.globalAlpha = 0.08;
  context.fillStyle = 'rgba(29, 185, 175, .8)';
  context.arc(projected.x, projected.y, landGlowRadius, 0, Math.PI * 2);
  context.fill();
  }
  context.beginPath();
  context.globalAlpha = alpha;
  context.fillStyle = `rgba(32, 203, 190, ${0.70 + dot.tone * 0.26})`;
  context.arc(projected.x, projected.y, landDotRadius, 0, Math.PI * 2);
  context.fill();
  }
  context.globalAlpha = 1;
  ORDER_GLOBE_COUNTRY_SEAMS.forEach((line) => {
  drawProjectedLine(line.points, viewport, radius, 'rgba(255,255,255,.18)', 0.45, [1, 5]);
  });

  context.globalAlpha = 1;
  projectedPinsRef.current = [];
  const pinRadius = landDotRadius;
  const pinFill = isStoreLayer ? '#d89531' : '#d62820';
  const pinGlow = isStoreLayer ? 'rgba(216, 148, 49, .50)' : 'rgba(214, 40, 32, .56)';
  const visiblePins = [...locations]
  .map((location) => ({
  location,
  key: isStoreLayer ? `${location.name}-${location.city}-${location.state}` : `${location.city}-${location.state}`,
  projected: projectOrderGlobePoint(location, spin, viewport, radius),
  }))
  .filter((item) => item.projected.visible && item.projected.alpha > 0.12)
  .sort((a, b) => a.projected.z - b.projected.z);

  visiblePins.forEach(({ location, key, projected }) => {
  const isLatest = latestKey && key === latestKey;
  const pulse = reducedMotion || !isLatest ? 1 : 1 + Math.sin(time / 260) * 0.18;
  const alpha = 0.62 + projected.alpha * 0.38;
  projectedPinsRef.current.push({ key, location, x: projected.x, y: projected.y, radius: Math.max(18, pinRadius + 12) });

  context.save();
  context.globalAlpha = isLatest ? alpha : alpha * 0.34;
  context.beginPath();
  context.fillStyle = pinGlow;
  context.arc(projected.x, projected.y, pinRadius * (isLatest ? 7.2 * pulse : 2.7), 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = alpha;
  context.beginPath();
  context.fillStyle = 'rgba(255, 249, 239, .96)';
  context.arc(projected.x, projected.y, pinRadius + 0.82, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.fillStyle = pinFill;
  context.arc(projected.x, projected.y, pinRadius * 1.02, 0, Math.PI * 2);
  context.fill();
  context.restore();
  });

  context.restore();

  const edgeGradient = context.createRadialGradient(
  viewport.cx,
  viewport.cy,
  radius * 0.56,
  viewport.cx,
  viewport.cy,
  radius * 1.02
  );
  edgeGradient.addColorStop(0, 'rgba(255,255,255,0)');
  edgeGradient.addColorStop(0.62, 'rgba(255,255,255,0)');
  edgeGradient.addColorStop(0.76, 'rgba(80, 158, 184, .055)');
  edgeGradient.addColorStop(1, 'rgba(84, 147, 172, .24)');
  context.beginPath();
  context.arc(viewport.cx, viewport.cy, radius, 0, Math.PI * 2);
  context.fillStyle = edgeGradient;
  context.fill();
  context.beginPath();
  context.arc(viewport.cx, viewport.cy, radius - 0.5, 0, Math.PI * 2);
  context.strokeStyle = 'rgba(255,255,255,.78)';
  context.lineWidth = 1;
  context.stroke();

  if (!reducedMotion) {
  animationFrame = window.requestAnimationFrame(render);
  }
  };

  render(0);
  return () => {
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
  if (hoverFrameRef.current) {
  window.cancelAnimationFrame(hoverFrameRef.current);
  hoverFrameRef.current = 0;
  }
  pendingHoverRef.current = null;
  };
  }, [locations, latestKey, isStoreLayer, isDragging, spin?.x, spin?.y, zoom]);

  const handlePointerMove = (event) => {
  if (isDragging) return;
  const canvas = canvasRef.current;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  pendingHoverRef.current = {
  x: event.clientX - rect.left,
  y: event.clientY - rect.top,
  };
  if (hoverFrameRef.current) return;
  hoverFrameRef.current = window.requestAnimationFrame(() => {
  hoverFrameRef.current = 0;
  const point = pendingHoverRef.current;
  if (!point) return;
  let hit = null;
  let bestDistance = Infinity;
  projectedPinsRef.current.forEach((pin) => {
  const distance = Math.hypot(pin.x - point.x, pin.y - point.y);
  if (distance <= pin.radius && distance < bestDistance) {
  hit = pin;
  bestDistance = distance;
  }
  });
  const nextKey = hit?.key || '';
  if (selectedKeyRef.current !== nextKey) {
  selectedKeyRef.current = nextKey;
  onPointSelect?.(hit?.location || null);
  }
  if (canvasRef.current) canvasRef.current.style.cursor = hit ? 'pointer' : 'grab';
  });
  };

  const clearSelection = () => {
  pendingHoverRef.current = null;
  if (hoverFrameRef.current) {
  window.cancelAnimationFrame(hoverFrameRef.current);
  hoverFrameRef.current = 0;
  }
  selectedKeyRef.current = '';
  onPointSelect?.(null);
  if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  };

  return (
  <canvas
  ref={canvasRef}
  className="live-globe-canvas"
  aria-hidden="true"
  onMouseMove={handlePointerMove}
  onMouseLeave={clearSelection}
  />
  );
}

function FlavorBreakdown({ flavor }) {
  const stickyRef = useRef(null);
  const [p, setP] = useState(0); // 0..1 progress

  useEffect(() => {
  const on = () => {
  const el = stickyRef.current;if (!el) return;
  const rect = el.getBoundingClientRect();
  const total = el.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  setP(total > 0 ? scrolled / total : 0);
  };
  window.addEventListener('scroll', on, { passive: true });on();
  return () => window.removeEventListener('scroll', on);
  }, []);

  // Flavor cards, spaced so the final card has enough screen time before
  // the sticky scene exits.
  const ingredients = [
  { label: 'Original', note: 'Garlic-sesame depth for noodles, rice, eggs, and stir-fry.', angle: -130, appearAt: 0.05, img: 'uploads/fb-umami.jpg' },
  { label: 'Spicy Tokyo', note: 'Roasted chili heat for wings, fried rice, noodles, and grilled meat.', angle: -45, appearAt: 0.42, img: 'uploads/fb-heat.jpg' },
  { label: 'Citrus Shoyu', note: 'Bright shoyu lift for dumplings, vegetables, seafood, and rich bowls.', angle: 90, appearAt: 0.78, img: 'uploads/fb-brightness.jpg' }];


  return (
  <section id="ingredients" className="fb-section" ref={stickyRef} style={{ position: 'relative', background: 'var(--paper)', scrollMarginTop: 80 }}>
  {/* MOBILE: stacked layout (<=768px) */}
  <div className="fb-mobile" style={{ display: 'none', padding: '80px 24px 96px' }}>
  <div className="mono" style={{ color: 'var(--muted)', marginBottom: 24, letterSpacing: '0.18em' }}>
  Index 02 - Flavor Breakdown
  </div>
  <h2 className="display" style={{ margin: '0 0 48px', fontSize: 'clamp(40px, 11vw, 56px)', letterSpacing: '-0.04em', lineHeight: 0.95, fontWeight: 700 }}>
  Built for dinner.<br /><span className="accent-fg">Goes on everything.</span>
  </h2>
  {/* Stacked ingredient rows */}
  <div style={{ borderTop: '1px solid var(--line)', marginBottom: 48 }}>
  {ingredients.map((ing, i) => (
  <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'baseline', padding: '20px 0', borderBottom: '1px solid var(--line)' }}>
  <div className="display accent-fg" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, flexShrink: 0, width: 56 }}>
  {String(i + 1).padStart(2, '0')}
  </div>
  <div style={{ flex: 1, minWidth: 0 }}>
  <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 4 }}>
  {ing.label}
  </div>
  <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.4 }}>
  {ing.note}
  </div>
  </div>
  </div>
  ))}
  </div>
  {/* Bottle below */}
  <div style={{ display: 'flex', justifyContent: 'center' }}>
  <div style={{ width: '70vw', maxWidth: 320, aspectRatio: '0.55 / 1' }}>
  <Bottle flavor={FLAVORS[flavor].tag} src={FLAVOR_IMAGES[flavor]} />
  </div>
  </div>
  </div>

  {/* DESKTOP: sticky scroll mechanic (>768px) */}
  {/* Height: 240vh = 140vh of sticky pin (for ingredients to fade in) +
  100vh of natural sticky exit. Was 320vh - extra 80vh was pure dead
  scroll past the last ingredient.

  The 100vh exit phase is structural to sticky positioning (the sticky
  child has to scroll its own height to leave viewport). Without
  intervention, the user sees ~100vh of "scene-already-shown,
  slowly-scrolling-away" which reads as a blank section. The
  `sceneOpacity` below fades the entire pinned scene out as progress
  approaches 1.0 so by the time the exit phase begins, there's
  nothing visible to "scroll past" - Range section's content takes
  over cleanly underneath. */}
  <div className="fb-desktop" style={{ height: '200vh' }}>
  <div className="fb-sticky" style={{
  position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  // Keep scene fully visible until last ingredient lands at p=0.95,
  // then fade out in the final 5% so the next section enters cleanly.
  opacity: p < 0.98 ? 1 : Math.max(0, Math.min(1, (1 - p) / 0.02)),
  transition: 'opacity .25s linear',
  }}>
  {/* Atmospheric backgrounds - fade in/out per ingredient */}
  {ingredients.map((ing, i) => {
  const nextAppear = i < ingredients.length - 1 ? ingredients[i + 1].appearAt : 1.0;
  const fadeIn = Math.max(0, Math.min(1, (p - ing.appearAt) / 0.08));
  const fadeOut = Math.max(0, Math.min(1, (p - nextAppear + 0.05) / 0.08));
  const bgOpacity = Math.min(fadeIn, 1 - fadeOut) * 0.35;
  return (
  <div key={`bg${i}`} style={{
  position: 'absolute', inset: 0, zIndex: 0,
  opacity: bgOpacity,
  transition: 'opacity 0.3s linear',
  pointerEvents: 'none'
  }}>
  <img src={ing.img} alt="" loading="lazy" style={{
  width: '100%', height: '100%', objectFit: 'cover',
  filter: 'brightness(0.5) saturate(0.7)',
  transform: 'scale(1.05)'
  }} />
  </div>
  );
  })}
  {/* Section header */}
  <div className="fb-section-header" style={{ position: 'absolute', top: 100, left: 28, right: 28, display: 'flex', justifyContent: 'space-between' }}>
  <span className="mono" style={{ color: 'var(--muted)' }}>Index 02 - Flavor Breakdown</span>
  <span className="mono" style={{ color: 'var(--muted)' }}>pour.02 / of.05</span>
  </div>
  <h2 className="display section-h2 fb-headline" style={{
  position: 'absolute', top: 140, left: 28, margin: 0,
  maxWidth: '60vw',
  opacity: Math.max(0, Math.min(1, (0.20 - p) / 0.12)),
  transform: `translateY(${-p * 80}px) scale(${1 - p * 0.08})`,
  transition: 'opacity .3s linear',
  pointerEvents: p > 0.18 ? 'none' : 'auto'
  }}>
  Built for dinner.<br /><span className="accent-fg">Goes on everything.</span>
  </h2>

  {/* Bottle center */}
  <div className="fb-bottle" style={{ width: 'min(300px, 22vw)', height: 'min(580px, 58vh)', position: 'relative', zIndex: 2 }}>
  <div className="bottle-float">
  <Bottle flavor={FLAVORS[flavor].tag} tilt={p * 6} src={FLAVOR_IMAGES[flavor]} />
  </div>
  </div>

  {/* Ingredients orbit */}
  {ingredients.map((ing, i) => {
  const active = p >= ing.appearAt;
  const rad = 260;
  const ang = ing.angle * Math.PI / 180;
  const x = Math.cos(ang) * rad;
  const y = Math.sin(ang) * rad;
  return (
  <div key={i} className="ingredient-orbit" style={{
  position: 'absolute',
  left: '50%', top: '50%',
  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
  opacity: active ? 1 : 0,
  transition: 'opacity 0.7s ease, transform 0.9s cubic-bezier(.2,.7,.2,1)',
  pointerEvents: 'none'
  }}>
  <div className="ingredient-orbit-inner" style={{
  transform: active ? 'translateY(0)' : 'translateY(16px)',
  transition: 'transform 0.9s cubic-bezier(.2,.7,.2,1)',
  textAlign: ang > 0 || Math.abs(ang) > Math.PI / 2 ? 'left' : 'right',
  minWidth: 200
  }}>
  <div className="mono accent-fg" style={{ marginBottom: 4 }}>{String(i + 1).padStart(2, '0')}</div>
  <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em' }}>{ing.label}</div>
  <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--muted)' }}>{ing.note}</div>
  </div>
  </div>);

  })}

  {/* progress dots */}
  <div className="fb-progress-dots" style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 12 }}>
  {ingredients.map((ing, i) =>
  <div key={i} style={{
  width: p >= ing.appearAt ? 10 : 8, height: p >= ing.appearAt ? 10 : 8, borderRadius: 999,
  background: p >= ing.appearAt ? 'var(--accent)' : 'rgba(240,235,227,0.28)',
  transition: 'background .4s, width .4s, height .4s',
  boxShadow: p >= ing.appearAt ? '0 0 0 4px rgba(var(--accent-rgb),0.18)' : 'none'
  }} />
  )}
  </div>
  </div>
  </div> {/* /.fb-desktop */}
  </section>);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - Flavor scene atmospheres
function FlavorBreakdownV2({ flavor, setFlavor }) {
  const useCases = [
  { label: 'Wings', key: 'spicy', verb: 'Toss', reason: 'Spicy Tokyo brings chili-garlic heat for wings and crispy edges.' },
  { label: 'Rice', key: 'shoyu', verb: 'Pour', reason: 'Shoyu Reserve gives plain rice, bowls, and leftovers a slow-brewed soy finish.' },
  { label: 'Noodles', key: 'shoyu', verb: 'Stir', reason: 'Slow-brewed shoyu depth makes noodles taste finished without needing much else.' },
  { label: 'Dumplings', key: 'citrus', verb: 'Dip', reason: 'Clean citrus lift cuts through rich fillings and fried edges.' },
  { label: 'Eggs', key: 'original', verb: 'Finish', reason: 'A little roasted garlic and sesame makes breakfast taste intentional.' },
  { label: 'Vegetables', key: 'citrus', verb: 'Glaze', reason: 'Bright shoyu keeps roasted or steamed vegetables lively.' },
  { label: 'Chicken', key: 'spicy', verb: 'Brush', reason: 'Spicy Tokyo adds chili, garlic, and sesame as a quick glaze or final layer.' },
  { label: 'Leftovers', key: 'original', verb: 'Wake up', reason: 'Original is the easy reset when yesterday needs a second life.' },
  ];
  const flavorNotes = {
  original: {
  job: 'Best first bottle',
  line: 'Garlic, sesame, and smooth soy for rice, eggs, noodles, and leftovers.',
  signal: 'Warm gold, roasted garlic, toasted sesame.',
  headline: ['The weeknight', 'save-button.'],
  body: 'For rice, eggs, noodles, and leftovers. Original brings roasted garlic, toasted sesame, and smooth soy so plain food tastes finished fast.',
  profile: [
  ['Savory', 92],
  ['Garlic', 78],
  ['Heat', 18],
  ['Bright', 32],
  ]
  },
  spicy: {
  job: 'Best when you want heat',
  line: 'Roasted chili over garlic-sesame depth for wings, fried rice, and grilled chicken.',
  signal: 'Red heat, faint smoke, chili edge.',
  headline: ['Heat that still', 'tastes like food.'],
  body: 'For wings, chicken, fried rice, and anything that needs a kick. Spicy Tokyo brings roasted chili, garlic, and sesame without burying the meal.',
  profile: [
  ['Savory', 86],
  ['Garlic', 72],
  ['Heat', 88],
  ['Bright', 24],
  ]
  },
  citrus: {
  job: 'Best when food needs lift',
  line: 'Bright shoyu and citrus for dumplings, vegetables, seafood, and rich bowls.',
  signal: 'Orange lift, citrus spark, bright finish.',
  headline: ['Brighten the', 'whole plate.'],
  body: 'For dumplings, vegetables, seafood, and rich bowls. Citrus Shoyu cuts through heavy bites with orange-bright lift and a clean savory finish.',
  profile: [
  ['Savory', 74],
  ['Garlic', 42],
  ['Heat', 14],
  ['Bright', 92],
  ]
  },
  shoyu: {
  job: 'Best for slow-brewed depth',
  line: 'Slow-brewed shoyu for rice, noodles, eggs, dumplings, and marinades.',
  signal: 'Deep gold, clean soy, slow-brewed finish.',
  headline: ['Slow-brewed depth,', 'weeknight fast.'],
  body: 'For rice, noodles, eggs, dumplings, and marinades. Shoyu Reserve adds bold, clean soy depth when dinner needs to taste finished without getting loud.',
  profile: [
  ['Savory', 94],
  ['Garlic', 18],
  ['Heat', 8],
  ['Bright', 36],
  ]
  }
  };
  const [selectedUse, setSelectedUse] = useState(useCases.find((item) => item.key === flavor)?.label || 'Rice');
  const selected = useCases.find((item) => item.label === selectedUse) || useCases[0];
  const activeKey = selected.key;
  const activeFlavor = FLAVORS[activeKey] || FLAVORS.original;
  const activeItem = flavorNotes[activeKey] || flavorNotes.original;
  const reserveActive = activeKey === 'shoyu';

  const chooseUse = (item) => {
  setSelectedUse(item.label);
  setFlavor(item.key);
  };

  useEffect(() => {
  const current = useCases.find((item) => item.label === selectedUse);
  if (current && current.key === flavor) return;
  const match = useCases.find((item) => item.key === flavor);
  if (match) setSelectedUse(match.label);
  }, [flavor]);

  return (
  <section
  id="ingredients"
  className="fbv2-section"
  data-flavor={activeKey}
  style={{
  '--fbv2-rgb': activeFlavor.rgb,
  '--fbv2-accent': activeFlavor.color,
  '--fbv2-deep': activeFlavor.deep,
  background: 'var(--paper)',
  padding: 'clamp(96px, 11vw, 150px) clamp(24px, 5.5vw, 80px)',
  borderTop: '1px solid var(--line)',
  borderBottom: '1px solid var(--line)',
  scrollMarginTop: 80
  }}
  >
  <div className="fbv2-atmosphere" aria-hidden="true">
  <span className="fbv2-mood fbv2-mood-a" />
  <span className="fbv2-mood fbv2-mood-b" />
  <span className="fbv2-mood fbv2-mood-c" />
  </div>
  <div className="fbv2-shell" style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, .95fr) minmax(280px, 400px) minmax(0, .95fr)', gap: 'clamp(28px, 5vw, 72px)', alignItems: 'center' }}>
  <div className="fbv2-copy">
  <Reveal>
  <div className="mono" style={{ color: 'var(--muted)', marginBottom: 16, letterSpacing: '0.18em' }}>Index 02 - Flavor Finder</div>
  </Reveal>
  <Reveal delay={1}>
  <h2 key={`${activeKey}-headline`} className="display section-h2 fbv2-dynamic-copy" style={{ margin: '0 0 22px', maxWidth: 500 }}>
  {activeItem.headline[0]}<br /><span className="accent-fg">{activeItem.headline[1]}</span>
  </h2>
  </Reveal>
  <Reveal delay={2}>
  <p key={`${activeKey}-body`} className="fbv2-dynamic-copy" style={{ color: 'var(--ink-60)', fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.65, maxWidth: 560, margin: 0 }}>
  {activeItem.body}
  </p>
  </Reveal>
  <Reveal delay={2}>
  <div className="fbv2-use-grid" aria-label="Choose what you are eating">
  {useCases.map((item) => {
  const f = FLAVORS[item.key];
  const active = item.label === selectedUse;
  return (
  <button
  key={item.label}
  type="button"
  className={`fbv2-use-chip${active ? ' is-active' : ''}`}
  style={{ '--chip-accent': f.color }}
  aria-pressed={active}
  onClick={() => chooseUse(item)}
  >
  <span>{item.verb}</span>
  {item.label}
  </button>
  );
  })}
  </div>
  </Reveal>
  </div>

  <Reveal delay={2}>
  <div className="fbv2-bottle-stage">
  <div className="fbv2-glow" aria-hidden="true" />
  <div className="fbv2-sauce-ring" aria-hidden="true" />
  <div key={`${activeKey}-${selectedUse}-swipe`} className="fbv2-sauce-swipe" aria-hidden="true" />
  <div key={`${activeKey}-${selectedUse}-burst`} className="fbv2-flavor-burst" aria-hidden="true" />
  <div key={`${activeKey}-${selectedUse}`} className={`fbv2-bottle-swap is-${activeKey}`}>
  <Bottle flavor={activeFlavor.tag} src={FLAVOR_IMAGES[activeKey]} />
  </div>
  <div key={`${activeKey}-${selectedUse}-caption`} className="fbv2-stage-caption">
  <span>{activeFlavor.short}</span>
  {activeItem.signal}
  </div>
  </div>
  </Reveal>

  <div className="fbv2-panel">
  <Reveal delay={2}>
  <div className="fbv2-reco-label">Recommended for {selected.label}</div>
  <h3>{activeFlavor.name}</h3>
  <p>{selected.reason}</p>
  <div className="fbv2-job">{activeItem.job}</div>
  <div className="fbv2-profile" aria-label={`${activeFlavor.name} taste profile`}>
  {activeItem.profile.map(([label, value]) => (
  <div key={label} className="fbv2-profile-row">
  <span>{label}</span>
  <div className="fbv2-profile-track"><i style={{ width: `${value}%` }} /></div>
  </div>
  ))}
  </div>
  <div className="fbv2-actions">
  <a className="fbv2-add" href={cartPermalink(activeKey)} onClick={(e) => addFlavorAndViewProduct(activeKey, e)}>Add {activeFlavor.name}</a>
  <a className="fbv2-trio" href={reserveActive ? '#bundle-builder' : cartPermalink('trio')}>{reserveActive ? 'Build a bundle' : 'Get all 3'}</a>
  </div>
  <div className="mono" style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '0.12em', marginTop: 10 }}>
  $3.50 flat US ship - FREE on $29.99+
  </div>
  <div className="fbv2-panel-note">{activeItem.line}</div>
  </Reveal>
  </div>
  </div>
  </section>
  );
}

function FlavorScene({ kind }) {
  // Stable random positions via key-based arrays
  if (kind === 'original') {
  const seeds = [[8,20],[18,70],[28,15],[42,85],[58,30],[72,65],[86,12],[94,55],[15,45],[65,80],[38,58],[80,38]];
  return (
  <div className="scene scene-original scene-grain">
  <div className="glow2" />
  <div className="glow" />
  {seeds.map(([l,t],i) => (
  <span key={i} className="sesame" style={{ left:`${l}%`, top:`${t}%`, animationDelay:`${(i*1.2)%14}s`, animationDuration:`${12+(i%5)*1.2}s` }} />
  ))}
  </div>
  );
  }
  if (kind === 'citrus') {
  const pith = [[12,25],[28,18],[40,75],[55,35],[70,62],[18,82],[48,12],[62,88],[32,50],[78,28]];
  return (
  <div className="scene scene-citrus scene-grain">
  <div className="sun" />
  <div className="sun-core" />
  {pith.map(([l,t],i) => (
  <span key={i} className="pith" style={{ left:`${l}%`, top:`${t}%`, animationDelay:`${(i*1.8)%18}s`, transform:`rotate(${i*37}deg)` }} />
  ))}
  </div>
  );
  }
  if (kind === 'spicy') {
  const embers = [[6,0],[14,0],[22,0],[30,0],[38,0],[46,0],[54,0],[62,0],[70,0],[78,0],[86,0],[94,0],[10,0],[34,0],[58,0],[82,0]];
  return (
  <div className="scene scene-spicy scene-grain">
  <div className="smear" />
  <div className="vignette" />
  {embers.map(([l],i) => (
  <span key={i} className="ember" style={{ left:`${l}%`, animationDelay:`${(i*0.45)%6}s`, animationDuration:`${5+(i%4)}s`, width:`${3+(i%3)}px`, height:`${3+(i%3)}px` }} />
  ))}
  </div>
  );
  }
  return null;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - Horizontal scroll "Use it on..."
function UseItOn() {
  const wrap = useRef(null);
  const track = useRef(null);
  const mobileScroller = useRef(null);
  const [progress, setProgress] = useState(0);
  const [mobileIdx, setMobileIdx] = useState(0);

  useEffect(() => {
  const on = () => {
  const el = wrap.current;if (!el) return;
  const rect = el.getBoundingClientRect();
  const total = el.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  setProgress(total > 0 ? scrolled / total : 0);
  };
  window.addEventListener('scroll', on, { passive: true });on();
  return () => window.removeEventListener('scroll', on);
  }, []);

  const items = [
  { key: 'original', name: 'Original',  no: 'No.01', tag: 'GARLIC & SESAME', line: 'The one that started it all.',  note: 'Roasted garlic. Toasted sesame. Smooth soy.',  bg: '#8A6424', ink: '#F5F1EA', sub: 'rgba(245,241,234,0.68)', img: FLAVOR_IMAGES.original, lifestyle: 'uploads/range-original-clean-2026-05-07.jpg' },
  { key: 'spicy',  name: 'Spicy Tokyo',  no: 'No.03', tag: 'UMAMI MEETS FIRE', line: 'Roasted chili. Garlic. Sesame.',  note: 'Bold heat for wings, fried rice, noodles, and anything that needs a kick.', bg: '#B23A0C', ink: '#F5F1EA', sub: 'rgba(245,241,234,0.70)', img: FLAVOR_IMAGES.spicy, lifestyle: 'uploads/range-spicy-clean-2026-05-07.jpg' },
  { key: 'citrus',  name: 'Citrus Shoyu', no: 'No.02', tag: 'BRIGHT & TANGY',  line: 'Shoyu base. Clean citrus lift.',  note: 'Bright citrus over clean shoyu. Cuts through richness.', bg: '#B83A10', ink: '#F5F1EA', sub: 'rgba(245,241,234,0.70)',  img: FLAVOR_IMAGES.citrus, lifestyle: 'uploads/range-citrus-clean-2026-05-07.jpg' },
  ];
  const panelCount = items.length;

  // Mobile carousel: track which panel is centered
  useEffect(() => {
  const el = mobileScroller.current;
  if (!el) return;
  const on = () => {
  const w = el.clientWidth;
  const i = Math.round(el.scrollLeft / w);
  setMobileIdx(Math.max(0, Math.min(panelCount - 1, i)));
  };
  el.addEventListener('scroll', on, { passive: true });
  return () => el.removeEventListener('scroll', on);
  }, [panelCount]);

  const mobileActive = items[mobileIdx];
  // Shift by (panels-1) * 100vw
  const shift = progress * (panelCount - 1) * 100;

  // Interpolate background color across slides
  const activeIdx = Math.min(panelCount - 1, Math.round(progress * (panelCount - 1)));
  const active = items[activeIdx];

  return (
  <section id="range" ref={wrap} className="range-section" style={{ position: 'relative', background: mobileActive.bg, transition: 'background 0.6s cubic-bezier(.2,.7,.2,1)', color: mobileActive.ink, scrollMarginTop: 80 }}>
  {/* MOBILE: native scroll-snap carousel with dots */}
  <div className="range-mobile" style={{ display: 'none', padding: '64px 0 28px', background: mobileActive.bg, transition: 'background .5s cubic-bezier(.2,.7,.2,1)' }}>
  <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
  <span className="mono" style={{ color: mobileActive.sub }}>Index 03 - The Range</span>
  <span className="mono" style={{ color: mobileActive.sub }}>{String(mobileIdx + 1).padStart(2, '0')} / {String(panelCount).padStart(2, '0')}</span>
  </div>
  <div
  ref={mobileScroller}
  className="range-mobile-scroller"
  style={{
  display: 'flex',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  paddingInline: '4vw',
  gap: 16,
  }}
  >
  {items.map((it, i) => (
  <div key={i} style={{
  flex: '0 0 88vw',
  scrollSnapAlign: 'center',
  padding: '16px 12px 28px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  minHeight: 520,
  }}>
  <div style={{ position: 'relative', width: '100%', height: 320, marginBottom: 24 }}>
  <img src={it.img} alt={`NoodleBomb ${it.no} ${it.name}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: it.comingSoon ? 'drop-shadow(0 24px 40px rgba(0,0,0,0.45)) grayscale(0.3)' : 'drop-shadow(0 24px 40px rgba(0,0,0,0.45))', opacity: it.comingSoon ? 0.85 : 1 }} />
  {it.comingSoon && (
  <div style={{
  position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
  padding: '6px 12px', background: 'rgba(11,11,11,0.78)',
  border: `1px solid ${it.ink}`, color: it.ink,
  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 600,
  letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap',
  }}>{it.comingSoon}</div>
  )}
  </div>
  <div className="mono" style={{ color: it.sub, marginBottom: 12, letterSpacing: '0.15em', fontSize: 11 }}>{it.no} - {it.tag}</div>
  <h3 className="display" style={{ fontSize: 'clamp(40px, 11vw, 64px)', lineHeight: 0.92, color: it.ink, margin: '0 0 16px', fontWeight: 700, letterSpacing: '-0.04em', overflowWrap: 'break-word', maxWidth: '100%' }}>
  {it.name}.
  </h3>
  <div className="serif" style={{ fontStyle: 'normal', fontSize: 20, color: it.ink, opacity: 0.88, letterSpacing: '-0.035em', marginBottom: 10 }}>
  {it.line}
  </div>
  <div style={{ fontFamily: 'Inter Tight', fontSize: 14, color: it.sub, lineHeight: 1.5 }}>
  {it.note}
  </div>
  </div>
  ))}
  </div>
  {/* Dots - visible 8/24px pill, but each button is 44x44 tap target */}
  <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}>
  {items.map((it, i) => (
  <button
  key={i}
  aria-label={`Go to ${it.name}`}
  onClick={() => {
  const el = mobileScroller.current;
  if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }}
  style={{
  width: 44,
  height: 44,
  background: 'transparent',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  }}
  >
  <span aria-hidden="true" style={{
  display: 'block',
  width: i === mobileIdx ? 24 : 8,
  height: 8,
  borderRadius: 999,
  background: '#ffffff',
  opacity: i === mobileIdx ? 1 : 0.4,
  transition: 'width .3s, opacity .3s',
  }} />
  </button>
  ))}
  </div>
  </div>

  {/* DESKTOP: original sticky horizontal scroll */}
  <div className="range-desktop" style={{ height: `${panelCount * 100}vh`, background: active.bg, transition: 'background 0.6s cubic-bezier(.2,.7,.2,1)', color: active.ink }}>
  <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
  {/* header */}
  <div style={{ position: 'absolute', top: 28, left: 28, right: 28, zIndex: 5, display: 'flex', justifyContent: 'space-between' }}>
  <span className="mono" style={{ color: active.sub, opacity: 1 }}>Index 03 - The Range</span>
  <span className="mono" style={{ color: active.sub, opacity: 1 }}>{String(Math.min(panelCount, Math.floor(progress * panelCount) + 1)).padStart(2, '0')} / {String(panelCount).padStart(2, '0')}</span>
  </div>

  <div ref={track} style={{
  display: 'flex',
  height: '100%',
  transform: `translateX(-${shift}vw)`,
  transition: 'transform 0.08s linear',
  willChange: 'transform'
  }}>
  {items.map((it, i) =>
  <div key={i} className="hpanel" style={{ width: '100vw', height: '100%', flexShrink: 0, padding: 'clamp(80px, 10vw, 120px) clamp(28px, 6vw, 96px) 80px', display: 'flex', gap: 'clamp(24px, 4vw, 72px)', alignItems: 'stretch', position: 'relative', overflow: 'hidden' }}>
  {/* Atmospheric scene */}
  <FlavorScene kind={it.key} />
  {/* Huge watermark numeral */}
  <div className="flavor-numeral serif" style={{ left: '2vw', bottom: '-6vh', color: it.ink }}>
  {String(i + 1).padStart(2,'0')}
  </div>
  {/* Bottle image */}
  <div style={{ flex: '1 1 46%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
  <div className="flavor-bottle-bob" style={{ width: '100%', height: '100%', maxWidth: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
  <img src={it.lifestyle || it.img} alt={`NoodleBomb ${it.no} ${it.name} sauce`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', borderRadius: 4, filter: it.comingSoon ? 'drop-shadow(0 40px 60px rgba(0,0,0,0.45)) grayscale(0.3)' : 'drop-shadow(0 40px 60px rgba(0,0,0,0.45))', opacity: it.comingSoon ? 0.85 : 1 }} />
  {it.comingSoon && (
  <div style={{
  position: 'absolute',
  top: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '8px 16px',
  background: 'rgba(11,11,11,0.78)',
  border: `1px solid ${it.ink}`,
  color: it.ink,
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  zIndex: 3,
  }}>
  {it.comingSoon}
  </div>
  )}
  </div>
  </div>
  {/* Side copy */}
  <div style={{ flex: '1 1 46%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 40, position: 'relative', zIndex: 2 }}>
  <div className="mono" style={{ color: it.sub, opacity: 1, marginBottom: 16, letterSpacing: '0.15em' }}>{it.no} - {it.tag}</div>
  <h3 className="display range-flavor-name" style={{ fontSize: 'clamp(48px, 9vw, 160px)', lineHeight: 0.92, color: it.ink, margin: 0, fontWeight: 700, letterSpacing: '-0.05em', overflowWrap: 'break-word' }}>
  {it.name}.
  </h3>
  <div className="serif" style={{ fontStyle: 'normal', fontSize: 'clamp(22px, 2.2vw, 30px)', marginTop: 20, color: it.ink, opacity: 0.88, letterSpacing: '-0.035em', maxWidth: 480 }}>
  {it.line}
  </div>
  <div style={{ fontFamily: 'Inter Tight', fontSize: 'clamp(16px, 1.2vw, 18px)', marginTop: 14, color: it.sub, maxWidth: 440, lineHeight: 1.5 }}>
  {it.note}
  </div>
  </div>
  </div>
  )}
  </div>

  {/* progress bar */}
  <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
  <div style={{ height: 1, background: active.sub, opacity: 0.25, position: 'relative' }}>
  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: active.ink }} />
  </div>
  </div>
  </div>
  </div> {/* /.range-desktop */}
  </section>);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - Pour shot + Comparison
function PourAndCompare({ flavor = 'original' }) {
  return (
  <section id="pour" style={{ background: 'var(--paper)', padding: '140px clamp(24px, 5.5vw, 80px)', scrollMarginTop: 80 }}>
  <div style={{ maxWidth: 1200, margin: '0 auto' }}>
  <Reveal><div className="mono" style={{ color: 'var(--muted)', marginBottom: 16 }}>How It Works</div></Reveal>
  <Reveal delay={1}>
  <h2 className="display section-h2" style={{ margin: '0 0 20px' }}>
  One bottle.<br />
  <span style={{ color: 'var(--muted)' }}>Everything savory.</span>
  </h2>
  </Reveal>
  <Reveal delay={1.5}>
  <p style={{ fontFamily: 'Inter Tight', fontSize: 'clamp(17px, 1.6vw, 20px)', lineHeight: 1.55, color: 'var(--ink-60)', maxWidth: 560, margin: '0 0 64px' }}>
  NoodleBomb is a bold ramen sauce built to go wherever you want flavor: noodles, rice, wings, dumplings, eggs, vegetables, and whatever is already in the pan.
  </p>
  </Reveal>

  {/* 3-step guide */}
  <Reveal delay={2}>
  <div className="pour-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(24px, 4vw, 48px)', marginBottom: 80 }}>
  {[
  { step: '01', title: 'Pick your base', desc: 'Noodles, rice, wings, eggs, dumplings, vegetables, grilled meat - anything savory works.' },
  { step: '02', title: 'Pour, toss, or glaze', desc: 'Use a little to finish, or more when you want the sauce to carry the whole bite.' },
  { step: '03', title: 'Eat it your way', desc: 'Hot bowl, cold leftovers, sheet-pan dinner, game-day wings. Same bottle, different cravings.' },
  ].map((s, i) => (
  <div key={i}>
  <div className="display accent-fg" style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 16, opacity: 0.7 }}>{s.step}</div>
  <div style={{ fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', marginBottom: 8 }}>{s.title}</div>
  <div style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--ink-60)', lineHeight: 1.55 }}>{s.desc}</div>
  </div>
  ))}
  </div>
  </Reveal>

  {/* What NoodleBomb Replaces */}
  <Reveal delay={2}>
  <div style={{ borderTop: '1px solid var(--line)', paddingTop: 64 }}>
  <div className="mono" style={{ color: 'var(--muted)', marginBottom: 24, letterSpacing: '0.18em' }}>What NoodleBomb Replaces</div>
  <div className="pour-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
  <div>
  <div style={{ fontFamily: 'Inter Tight', fontSize: 14, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>The old way</div>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
  {['Soy sauce', 'Mirin', 'Sesame oil', 'Garlic paste', 'Dashi stock', 'Chili oil', '20 minutes of prep'].map((item, i) => (
  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Inter', fontSize: 15, color: 'var(--ink-40)' }}>
  <span style={{ color: 'var(--ink-40)', fontSize: 14 }}>x</span>
  <span style={{ textDecoration: 'line-through' }}>{item}</span>
  </div>
  ))}
  </div>
  </div>
  <div>
  <div style={{ fontFamily: 'Inter Tight', fontSize: 14, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>The NoodleBomb way</div>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
  {['One bottle of NoodleBomb', '30 seconds', 'Big savory flavor'].map((item, i) => (
  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Inter Tight', fontSize: i === 0 ? 20 : 15, fontWeight: i === 0 ? 700 : 500, color: 'var(--ink)' }}>
  <span style={{ color: 'var(--accent)', fontSize: 14 }}>OK</span>
  {item}
  </div>
  ))}
  </div>
  <div style={{ marginTop: 28 }}>
  <a href="/shop" className="btn btn-accent" style={{ textDecoration: 'none', display: 'inline-flex', padding: '14px 24px', borderRadius: 999 }}>Shop sauces</a>
  </div>
  </div>
  </div>
  </div>
  </Reveal>

  {/* Quick stats */}
  <Reveal delay={3}>
  <div className="pour-grid" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
  {[
  { num: '7', unit: 'oz', label: 'per bottle' },
  { num: '14', unit: '', label: 'servings per bottle' },
  { num: '30', unit: 'sec', label: 'bowl to table' },
  { num: '3', unit: '', label: 'ways to finish dinner' },
  ].map((s, i) => (
  <div key={i} style={{ textAlign: 'center' }}>
  <div className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
  {s.num}{s.unit && <span style={{ fontSize: '0.45em', color: 'var(--muted)', fontWeight: 400, marginLeft: 4 }}>{s.unit}</span>}
  </div>
  <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.14em', marginTop: 8 }}>{s.label}</div>
  </div>
  ))}
  </div>
  </Reveal>
  </div>
  </section>);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - Origin (editorial, stats-driven, conversion-aware)
function Origin() {
  const stats = [
  { num: '7', label: 'real ingredients per bottle' },
  { num: '14', label: 'servings per bottle' },
  { num: '3', label: 'bottles for different cravings' },
  { num: '1', label: 'kitchen in Bonney Lake, WA' },
  ];
  return (
  <section
  id="origin"
  style={{
  background: 'var(--paper-2)',
  padding: 'clamp(96px, 12vw, 140px) clamp(24px, 5.5vw, 80px)',
  borderTop: '1px solid var(--line)',
  scrollMarginTop: 80,
  }}
  >
  <div style={{ maxWidth: 1100, margin: '0 auto' }}>
  <Reveal>
  <div className="mono" style={{ color: 'var(--muted)', marginBottom: 28, letterSpacing: '0.18em' }}>
  </div>
  </Reveal>

  <Reveal delay={1}>
  <h2
  className="display"
  style={{
  margin: '0 0 56px',
  fontSize: 'clamp(40px, 5.5vw, 76px)',
  letterSpacing: '-0.04em',
  lineHeight: 0.95,
  fontWeight: 700,
  maxWidth: '14ch',
  }}
  >
  </h2>
  </Reveal>

  {/* Stats row */}
  <Reveal delay={2}>
  <div
  className="origin-stats"
  style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 24,
  padding: '40px 0',
  borderTop: '1px solid var(--line)',
  borderBottom: '1px solid var(--line)',
  marginBottom: 56,
  }}
  >
  {stats.map((s, i) => (
  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
  <div
  className="display"
  style={{
  fontSize: 'clamp(48px, 6vw, 80px)',
  fontWeight: 700,
  letterSpacing: '-0.04em',
  lineHeight: 0.9,
  color: 'var(--ink)',
  }}
  >
  {s.num}
  </div>
  <div
  className="mono"
  style={{
  color: 'var(--muted)',
  fontSize: 11,
  letterSpacing: '0.16em',
  maxWidth: '18ch',
  }}
  >
  {s.label}
  </div>
  </div>
  ))}
  </div>
  </Reveal>

  {/* Behind-the-scenes: making-of photo */}
  <Reveal delay={2}>
  <figure style={{ margin: '0 0 56px', position: 'relative', overflow: 'hidden', borderRadius: 0, aspectRatio: '21/9' }}>
  <img
  src="uploads/origin-making.webp"
  alt="NoodleBomb sauce being crafted by hand in Bonney Lake, WA"
  loading="lazy"
  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
  />
  <figcaption style={{ position: 'absolute', left: 24, bottom: 16, fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.18em', color: 'rgba(245,241,234,0.85)', textTransform: 'uppercase' }}>
  Small batch - Bonney Lake, WA - Goes on everything
  </figcaption>
  </figure>
  </Reveal>

  {/* Single editorial line - no long story */}
  <Reveal delay={3}>
  <div
  style={{
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
  gap: 'clamp(32px, 5vw, 80px)',
  alignItems: 'end',
  }}
  className="origin-quote-row"
  >
  <p
  className="serif"
  style={{
  fontSize: 'clamp(22px, 2.4vw, 32px)',
  lineHeight: 1.35,
  letterSpacing: '-0.015em',
  fontStyle: 'normal',
  color: 'var(--ink)',
  margin: 0,
  maxWidth: '36ch',
  }}
  >
  "If you find a sauce that works harder than this one, I want to know about it."
  </p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
  <div
  style={{
  fontFamily: 'Inter Tight',
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: '-0.01em',
  }}
  >
 - Ashley March
  </div>
  <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.16em' }}>
  Founder - Bonney Lake, WA
  </div>
  </div>
  </div>
  </Reveal>

  {/* Conversion CTA - turn the section into a buy moment, not a dead end */}
  <Reveal delay={4}>
  <div
  style={{
  marginTop: 64,
  paddingTop: 40,
  borderTop: '1px solid var(--line)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  alignItems: 'center',
  justifyContent: 'space-between',
  }}
  >
  <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.16em' }}>
  Small batch - est. 2024
  </div>
  <a
  href={cartPermalink('trio')}
  style={{
  display: 'inline-flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 28px',
  borderRadius: 999,
  background: 'var(--ink)',
  color: 'var(--paper)',
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'transform .28s, box-shadow .35s',
  }}
  onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.35)';
  }}
  onMouseLeave={(e) => {
  e.currentTarget.style.transform = '';
  e.currentTarget.style.boxShadow = 'none';
  }}
  >
  Try the Trio - $29.99 | Save $6
  </a>
  <div className="mono" style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '0.14em' }}>
  $3.50 flat US ship - FREE on $29.99+
  </div>
  </div>
  </Reveal>
  </div>
  </section>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - Testimonials (real-feed only)
function Testimonials() {
  const quotes = Array.isArray(window.NB_REAL_TESTIMONIALS) ? window.NB_REAL_TESTIMONIALS.filter((q) => q?.body && q?.name).slice(0, 3) : [];
  if (!quotes.length) return null;

  return (
  <section id="reviews" style={{ background: 'var(--paper)', padding: '140px clamp(24px, 5.5vw, 80px)', borderTop: '1px solid var(--line)', scrollMarginTop: 80 }}>
  <div style={{ maxWidth: 1300, margin: '0 auto' }}>
  <Reveal>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 56, flexWrap: 'wrap', gap: 12 }}>
  <span className="mono" style={{ color: 'var(--muted)' }}>Index 07 - What They're Saying</span>
  <span className="mono" style={{ color: 'var(--muted)' }}>Early taste-testers</span>
  </div>
  </Reveal>
  <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
  {quotes.map((q, i) =>
  <Reveal key={i} delay={i + 1}>
  <div style={{ background: 'var(--paper-2)', padding: 32, height: '100%', display: 'flex', flexDirection: 'column', gap: 20, minHeight: 280, overflow: 'visible' }}>
  <div className="accent-fg display" style={{ fontSize: 48, lineHeight: 1, marginBottom: 0, flexShrink: 0 }}>"</div>
  <div style={{ fontFamily: 'Inter Tight', fontSize: 18, lineHeight: 1.45, letterSpacing: '-0.01em', flex: 1, overflow: 'visible' }}>{q.body}</div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexShrink: 0, paddingTop: 4, borderTop: '1px solid rgba(240,235,227,0.06)' }}>
  <div style={{ fontFamily: 'Inter Tight', fontWeight: 600, fontSize: 14 }}> -  {q.name}</div>
  <div className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>{q.tag}</div>
  </div>
  </div>
  </Reveal>
  )}
  </div>
  </div>
  </section>);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - Flavor picker (changes accent color)
function FinalCTA() {
  return (
  <>
  <section id="cta" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', transition: 'background .6s, color .6s', padding: '128px clamp(24px, 5.5vw, 80px) 96px', textAlign: 'center', position: 'relative', overflow: 'hidden', scrollMarginTop: 80 }}>
  <div className="ask-grain"></div>
  {/* Dotted texture overlay */}
  <div aria-hidden="true" style={{
  position: 'absolute', inset: 0,
  backgroundImage: 'radial-gradient(rgba(245,241,234,0.5) 1px, transparent 1px)',
  backgroundSize: '7px 7px',
  opacity: 0.07,
  pointerEvents: 'none',
  mixBlendMode: 'overlay'
  }} />
  <div style={{ position: 'relative', zIndex: 1 }}>
  <Reveal><div className="mono" style={{ marginBottom: 24, opacity: 0.7 }}>Index 11 - The Ask</div></Reveal>
  <Reveal delay={1}>
  <h2 className="display" style={{ fontSize: 'clamp(60px, 12vw, 220px)', margin: 0, lineHeight: 0.9, fontWeight: 700 }}>
  Pour it<br />on everything.
  </h2>
  </Reveal>

  {/* "Everything" icon row */}
  <Reveal delay={2}>
  <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center', gap: 'clamp(28px, 5vw, 72px)', flexWrap: 'wrap' }}>
  {[
  { glyph: 'R', label: 'ramen', svg: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h22a10 10 0 0 1-22 0Z"/><path d="M9 14c0-3 2-5 4-5M16 14c0-4 3-7 5-7M22 14c0-2 1-3 3-3"/><path d="M3 22h26"/></svg> },
  { label: 'wings', svg: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22c4-2 8-3 12-3s7 1 9 3"/><path d="M9 19c1-3 4-6 8-7s7 0 9 2"/><path d="M13 14c2-2 5-3 8-3"/><circle cx="22" cy="24" r="1.4"/></svg> },
  { label: 'rice', svg: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 14h20l-2 12H8Z"/><path d="M9 14c0-4 3-7 7-7s7 3 7 7"/><path d="M11 18l1 4M16 18v4M21 18l-1 4"/></svg> },
  { label: 'dumplings', svg: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 20c0-5 5-9 11-9s11 4 11 9c0 1-1 2-2 2H7c-1 0-2-1-2-2Z"/><path d="M9 20c1-2 2-3 3-3M14 20c1-2 2-3 3-3M19 20c1-2 2-3 3-3"/></svg> }
  ].map((it, i) => (
  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--accent-ink)', opacity: 0.85 }}>
  <div style={{ width: 56, height: 56, borderRadius: 999, border: '1px solid rgba(245,241,234,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  {it.svg}
  </div>
  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.85 }}>{it.label}</span>
  </div>
  ))}
  </div>
  </Reveal>

  <Reveal delay={3}>
  <div className="finalcta-row" style={{ marginTop: 48, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
  <a className="btn" href={WIX_URLS.shop} target="_blank" rel="noopener" style={{ background: 'var(--accent-ink)', color: 'var(--accent)', padding: '18px 32px', fontWeight: 600, border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'Inter', fontSize: 15, letterSpacing: '-0.005em', transition: 'transform .2s, box-shadow .2s', textDecoration: 'none', display: 'inline-block', flexShrink: 0 }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>Shop all from $11.99</a>
  <form className="finalcta-waitlist" action="https://formsubmit.co/hello@noodlebomb.co" method="POST" style={{ display: 'flex', flex: 1, minWidth: 280, gap: 0, border: '1px solid rgba(245,241,234,0.35)', borderRadius: 4, overflow: 'hidden', background: 'rgba(0,0,0,0.18)' }}>
  <input type="hidden" name="_subject" value="NoodleBomb Waitlist Signup" />
  <input type="hidden" name="_template" value="table" />
  <input type="hidden" name="_next" value="https://noodlebomb.co/?subscribed=1" />
  <input type="hidden" name="_captcha" value="false" />
  <input type="email" name="email" placeholder="Join the waitlist - your@email.com" required
  style={{ flex: 1, minWidth: 0, padding: '14px 16px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--accent-ink)', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em' }} />
  <button type="submit" style={{ background: 'transparent', color: 'var(--accent-ink)', border: 'none', borderLeft: '1px solid rgba(245,241,234,0.25)', padding: '0 20px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background .2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(245,241,234,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>Notify me</button>
  </form>
  </div>
  </Reveal>

  {/* Trust line - desktop: static one-liner. Mobile: scrolling marquee (text doesn't fit on one line, so animate it). */}
  <Reveal delay={4}>
  <div className="trust-line-wrap" style={{ marginTop: 36, overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)' }}>
  <div className="trust-line-track mono" style={{ display: 'inline-flex', whiteSpace: 'nowrap', fontSize: 11, letterSpacing: '0.18em', opacity: 0.7, willChange: 'transform' }}>
  {Array.from({ length: 4 }).map((_, j) => (
  <span key={j} style={{ paddingRight: 32 }}>
  PREMIUM INGREDIENTS - SMALL BATCH - MADE IN BONNEY LAKE, WA - $3.50 FLAT US SHIPPING - FREE ON $29.99+
  </span>
  ))}
  </div>
  </div>
  </Reveal>
  </div>
  <div className="finalcta-corner finalcta-corner-left" style={{ position: 'absolute', bottom: 24, left: 28, zIndex: 1 }}>
  <span className="mono" style={{ opacity: 0.65 }}>small-batch - made in the USA</span>
  </div>
  <div className="finalcta-corner finalcta-corner-right" style={{ position: 'absolute', bottom: 24, right: 28, zIndex: 1 }}>
  <span className="mono" style={{ opacity: 0.65 }}>pacific northwest - est. 2024</span>
  </div>
  </section>

  {/* Marquee - animated infinite scroller */}
  <div className="marq-wrap" style={{ padding: '32px 0', background: '#080706', color: 'var(--ink)', overflow: 'hidden', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', transform: 'skewY(-2deg)', margin: '0 -2vw' }}>
  <div className="marq-track">
  {Array.from({ length: 2 }).map((_, j) =>
  <React.Fragment key={j}>
  {['SMALL BATCH', '-', 'PREMIUM INGREDIENTS', '-', 'SLOW-BREWED FOR DEPTH', '-', 'POUR IT ON EVERYTHING', '-', 'MADE IN BONNEY LAKE WA', '-'].map((s, i) =>
  <span key={i} className="display" style={{ fontSize: 96, letterSpacing: '-0.05em', color: 'var(--ink)', opacity: 0.18 }}>{s}</span>
  )}
  </React.Fragment>
  )}
  </div>
  </div>

  <footer style={{ background: '#080706', color: 'var(--ink)', padding: '80px 28px 40px' }}>
  {/* Newsletter capture */}
  <div className="footer-newsletter" style={{ maxWidth: 1440, margin: '0 auto 48px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 48, alignItems: 'center' }}>
  <div>
  <div className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.05, fontWeight: 600 }}>
  Sauce drops, restock alerts, the occasional recipe.
  </div>
  <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--ink-60)', marginTop: 10 }}>
  Once a month. Never spam.
  </div>
  </div>
  <form className="footer-newsletter-form" action="https://formsubmit.co/hello@noodlebomb.co" method="POST" style={{ display: 'flex', gap: 0, border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden', background: '#100E0C' }}>
  <input type="hidden" name="_subject" value="NoodleBomb Newsletter Signup" />
  <input type="hidden" name="_template" value="table" />
  <input type="email" name="email" placeholder="your@email.com" required
  style={{ flex: 1, minWidth: 0, padding: '16px 18px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em' }} />
  <button type="submit" className="btn" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', padding: '0 28px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', fontSize: 14, letterSpacing: '-0.005em', transition: 'filter .2s' }} onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.08)'} onMouseOut={(e) => e.currentTarget.style.filter = 'none'}>Subscribe</button>
  </form>
  </div>
  <div style={{ borderTop: '1px solid var(--line)', maxWidth: 1440, margin: '0 auto 56px' }} />

  <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 64, maxWidth: 1440, margin: '0 auto' }}>
  <div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-ink)', fontFamily: 'Inter Tight', fontWeight: 800, fontSize: 12 }}>N</div>
  <span className="display" style={{ fontSize: 18, letterSpacing: '-0.04em', fontWeight: 700 }}>noodlebomb</span>
  </div>
  <p style={{ maxWidth: 320, color: 'var(--ink-60)', fontSize: 13, lineHeight: 1.6 }}>
  Bold ramen sauce crafted in the Pacific Northwest. Made for noodles, rice, wings, dumplings, eggs, vegetables, and every quick meal that needs a bigger finish.
  </p>
  </div>
  {[
  ['Shop', [['Original', WIX_URLS.original], ['Spicy Tokyo', WIX_URLS.spicy], ['Citrus Shoyu', WIX_URLS.citrus], ['The NoodleBomb Trio', WIX_URLS.trio], ['Shoyu Reserve', WIX_URLS.shoyu], ['Monthly Box', '#monthly']]],
  ['Learn', [['Recipes', '/recipes'], ['Ingredients', '#ingredients'], ['The Range', '#range'], ['The Pour', '#pour'], ['Monthly Box', '#monthly']]],
  ['Company', [['About', '/about'], ['Where to Buy', '/#stores'], ['FAQ', '/faq'], ['Wholesale', '#open-wholesale'], ['Contact', '#open-contact'], ['hello@noodlebomb.co', 'mailto:hello@noodlebomb.co'], ['253-486-3445', 'tel:+12534863445']]]].
  map(([h, items]) =>
  <div key={h}>
  <div className="mono" style={{ marginBottom: 20 }}>{h}</div>
  {items.map(([label, href]) => {
  const external = href.startsWith('http');
  const isHash = href.startsWith('#') && !href.startsWith('#open-');
  const sentinel = href.startsWith('#open-');
  return (
  <a key={label} href={sentinel ? '#' : href}
  className="footer-link"
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener' : undefined}
  onClick={(e) => {
  if (sentinel) {
  e.preventDefault();
  const kind = href.replace('#open-', '');
  if (window.NB_OPEN_INQUIRY) window.NB_OPEN_INQUIRY(kind);
  } else if (isHash) {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  // mailto: and http(s): links fall through to default behavior
  }}
  style={{ display: 'block', fontSize: 13, padding: '6px 0', color: 'var(--ink)', opacity: 0.85, cursor: 'pointer', transition: 'opacity .2s, transform .2s', textDecoration: 'none' }}
  onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateX(3px)'; }}
  onMouseOut={(e) => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.transform = 'translateX(0)'; }}>{label}</a>
  );
  })}
  </div>
  )}
  </div>
  {/* Social row - Instagram + TikTok */}
  <div className="footer-social-row" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, maxWidth: 1440, marginLeft: 'auto', marginRight: 'auto', marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
  <a
  href="https://instagram.com/noodlebomb"
  target="_blank"
  rel="noopener"
  aria-label="NoodleBomb on Instagram"
  style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', opacity: 0.65, transition: 'opacity .2s, transform .2s', textDecoration: 'none' }}
  onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateY(-2px)'; }}
  onMouseOut={(e) => { e.currentTarget.style.opacity = 0.65; e.currentTarget.style.transform = 'translateY(0)'; }}
  >
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
  </a>
  <a
  href="https://tiktok.com/@noodlebomb"
  target="_blank"
  rel="noopener"
  aria-label="NoodleBomb on TikTok"
  style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', opacity: 0.65, transition: 'opacity .2s, transform .2s', textDecoration: 'none' }}
  onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'translateY(-2px)'; }}
  onMouseOut={(e) => { e.currentTarget.style.opacity = 0.65; e.currentTarget.style.transform = 'translateY(0)'; }}
  >
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
  </a>
  </div>

  <div className="footer-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 28, borderTop: '1px solid var(--line)', maxWidth: 1440, marginLeft: 'auto', marginRight: 'auto', gap: 24, flexWrap: 'wrap' }}>
  <span className="mono">(c) 2026 noodlebomb co. all rights reserved.</span>
  <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
  <span className="mono">pour responsibly.</span>
  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mono" style={{ background: 'none', border: 'none', color: 'var(--ink)', opacity: 0.7, cursor: 'pointer', padding: '15px 0', minHeight: 44, transition: 'opacity .2s', display: 'inline-flex', alignItems: 'center', gap: 6 }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}>
  <span>Top</span>
  </button>
  </div>
  </div>
  </footer>
  </>);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - Tweaks panel
function Tweaks({ state, set, open, setOpen }) {
  if (!open) return null;
  return (
  <div className="tweaks">
  <h4>
  <span>Tweaks</span>
  <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setOpen(false)}>x</span>
  </h4>
  <div className="row">
  <span>Flavor</span>
  <div className="swatches">
  {Object.entries(FLAVORS).map(([k, f]) =>
  <div key={k}
  className={`sw ${state.flavor === k ? 'active' : ''}`}
  style={{ background: f.color }}
  onClick={() => set({ flavor: k })}
  title={f.name} />

  )}
  </div>
  </div>
  <div className="row">
  <span>Grain texture</span>
  <div className={`toggle ${state.grain ? 'on' : ''}`} onClick={() => set({ grain: !state.grain })} />
  </div>
  <div className="row">
  <span>Anti-pattern mode</span>
  <div className={`toggle ${state.spam ? 'on' : ''}`} onClick={() => set({ spam: !state.spam })} />
  </div>
  <div className="row" style={{ display: 'block' }}>
  <div style={{ marginBottom: 6 }}>Headline</div>
  <input type="text" value={state.headline} onChange={(e) => set({ headline: e.target.value })} />
  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>use \n for line break</div>
  </div>
  </div>);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - App
// - - - - - - - - - - - - - - - - - - - - - - - - - - - TrustStrip - 4-icon trust signals (under hero)
function TrustStrip() {
  const items = [
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, label: '$3.50 flat US ship - FREE on $29.99+' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, label: 'Love it or your money back' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, label: 'Ships in 1-2 days' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>, label: 'Small-batch, made in USA' },
  ];
  return (
  <section style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '28px clamp(24px, 5.5vw, 80px)' }}>
  <div className="trust-strip-grid" style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, alignItems: 'center' }}>
  {items.map((it, i) => (
  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
  <div style={{ color: 'var(--accent)', flexShrink: 0, opacity: 0.85 }}>{it.icon}</div>
  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>{it.label}</span>
  </div>
  ))}
  </div>
  </section>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - StickyCartBar - fixed top-of-page bar after hero scroll
// - - - - - - - - - - - - - - - - - - - - - - - - - - - Live View globe - "WATCH THE BOMBS DROP"
// COBE dot-matrix globe, auto-rotate-to-each-order, HQ->city shipping arcs,
// flavor-colored order toasts. Ported from the standalone Live View design
// (Babel-in-browser -> compiled component) and wired to the SAME real feeds
// the storefront already loads: /data/order-map-cities.json,
// /.netlify/functions/order-map, /data/store-locations.json.
//
// COBE ships self-hosted as /vendor/cobe.bundle.js (cobe + phenomenon bundled
// by esbuild) and is exposed on window.createGlobe by a module script in
// index.html. The globe guards for that global so SSR / first-paint never break.
//
// Design tokens are namespaced --nbg-* (the storefront already uses --nb-*),
// and every class is prefixed nbg- so nothing leaks into the rest of the page.

const NBG_COLORS = {
  '--nbg-chili': '#E8392A',
  '--nbg-chili-hot': '#FF4A36',
  '--nbg-sesame': '#E8A23D',
  '--nbg-citrus': '#E6C93C',
  '--nbg-gold': '#CCA24A',
  '--nbg-gold-hot': '#E4B751',
  '--nbg-cream': '#F6EFE1',
};
const nbgColor = (key) => NBG_COLORS[key] || NBG_COLORS['--nbg-chili'];

// Brand flavors - orders pick one at random (drives the toast theater).
const NBG_FLAVORS = [
  { name: 'Original',  tag: 'Garlic & Sesame', color: '--nbg-sesame', img: '/uploads/nb-original-front-cutout-v2-2026-06-07.webp',  weight: 4 },
  { name: 'Spicy Tokyo',  tag: 'Roasted Chili',  color: '--nbg-chili',  img: '/uploads/nb-spicy-front-cutout-v2-2026-06-07.webp',  weight: 4 },
  { name: 'Citrus Shoyu', tag: 'Bright Shoyu',  color: '--nbg-citrus', img: '/uploads/nb-citrus-front-cutout-v2-2026-06-07.webp',  weight: 3 },
  { name: 'Shoyu Reserve', tag: 'Slow-brewed depth', color: '--nbg-gold', img: '/uploads/nb-shoyu-reserve-front-cutout-v2-2026-06-07.webp', weight: 1 },
  { name: 'The Trio',  tag: 'One of each',  color: '--nbg-cream',  img: '/uploads/og-trio-counter-page.webp',  weight: 2 },
];
const NBG_FLAVOR_POOL = [];
NBG_FLAVORS.forEach((f) => { for (let i = 0; i < f.weight; i++) NBG_FLAVOR_POOL.push(f); });
const nbgPickFlavor = () => NBG_FLAVOR_POOL[Math.floor(Math.random() * NBG_FLAVOR_POOL.length)];
const nbgFlavorFromProduct = (product) => {
  const text = String(product || '').toLowerCase();
  if (text.includes('trio') || text.includes('all 3') || text.includes('all three')) return NBG_FLAVORS.find((f) => f.name === 'The Trio');
  if (text.includes('spicy') || text.includes('tokyo') || text.includes('heat')) return NBG_FLAVORS.find((f) => f.name === 'Spicy Tokyo');
  if (text.includes('citrus') || text.includes('bright')) return NBG_FLAVORS.find((f) => f.name === 'Citrus Shoyu');
  if (text.includes('shoyu reserve') || text.includes('soy') || text.includes('shoyu')) return NBG_FLAVORS.find((f) => f.name === 'Shoyu Reserve');
  if (text.includes('original') || text.includes('garlic') || text.includes('sesame')) return NBG_FLAVORS.find((f) => f.name === 'Original');
  return null;
};
const nbgDisplayProduct = (product, flavor) => {
  const text = String(product || '').trim();
  if (text && !/amazon order|noodlebomb order/i.test(text)) return text;
  return flavor?.name ? `${flavor.name} Sauce` : 'NoodleBomb order';
};

// HQ: small-batch kitchen, Bonney Lake, WA.
const NBG_HQ = { lat: 47.1768, lng: -122.1865 };
const NBG_DEG = Math.PI / 180;
const NBG_ARC_LIFE = 3400;
const NBG_FILL = 0.815;
const NBG_SPIN_SCALE = 0.006;
const NBG_ZOOM_MIN = 1;
const NBG_ZOOM_MAX = 4;
const nbgClamp = (v, a, b) => Math.max(a, Math.min(b, v));
const nbgFmt = (n) => Number(n || 0).toLocaleString('en-US');

const NBG_CHILI = [0.910, 0.224, 0.165];
const NBG_SESAME = [0.910, 0.635, 0.239];
const NBG_THEME = {
  dark: 1, diffuse: 1.05, bg: '#17100A',
  base: [0.52, 0.39, 0.22], glow: [0.20, 0.10, 0.05],
  order: NBG_CHILI, store: NBG_SESAME, mapBrightness: 5.9,
  glowCss: 'radial-gradient(circle, rgba(204,162,74,.22), rgba(232,57,42,.06) 48%, transparent 66%)',
};

function nbgFaceAngles(lat, lng) {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
}
const [NBG_NA_PHI, NBG_NA_THETA] = nbgFaceAngles(38, -98);

function nbgProjectPt(lat, lng, phiEff, theta, cx, cy, R) {
  const la = lat * NBG_DEG, lo = lng * NBG_DEG;
  const lambda0 = 1.5 * Math.PI - phiEff;
  const dl = lo - lambda0;
  const x = Math.cos(la) * Math.sin(dl);
  const y0 = Math.sin(la);
  const z0 = Math.cos(la) * Math.cos(dl);
  const yr = y0 * Math.cos(theta) - z0 * Math.sin(theta);
  const zr = y0 * Math.sin(theta) + z0 * Math.cos(theta);
  return { x: cx + x * R, y: cy - yr * R, z: zr };
}

const US_STATE_SET = new Set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' '));

// ===== COBE globe + drag/zoom + animated pins + arc overlay + focus =====
function BombGlobe({ mode, autoSpin, spinSpeed, shippedRef, arcsRef, focusRef, searchRef, storesRef }) {
  const canvasRef = useRef(null);
  const fxRef = useRef(null);
  const scaleRef = useRef(null);
  const widthRef = useRef(0);
  const phiRef = useRef(NBG_NA_PHI);
  const thetaRef = useRef(NBG_NA_THETA);
  const dragXRef = useRef(0);
  const interacting = useRef(null);
  const pointerStart = useRef({ x: 0, y: 0, phi: 0, theta: 0 });
  const zoomRef = useRef(1);
  const pointers = useRef(new Map());
  const pinch = useRef(null);
  const lastFocusTs = useRef(0);
  const focusTarget = useRef(null);

  const [ready, setReady] = useState(typeof window !== 'undefined' && !!window.createGlobe);
  const [visible, setVisible] = useState(true);

  const applyZoom = React.useCallback(() => {
  if (scaleRef.current) scaleRef.current.style.transform = `scale(${zoomRef.current})`;
  }, []);
  const zoomBy = React.useCallback((f) => {
  zoomRef.current = nbgClamp(zoomRef.current * f, NBG_ZOOM_MIN, NBG_ZOOM_MAX); applyZoom();
  }, [applyZoom]);
  const resetZoom = React.useCallback(() => { zoomRef.current = 1; applyZoom(); }, [applyZoom]);

  // Wait for the self-hosted COBE module to attach window.createGlobe.
  useEffect(() => {
  if (ready || typeof window === 'undefined') return undefined;
  let alive = true;
  if (typeof window.NBLoadCobeGlobe === 'function') {
  window.NBLoadCobeGlobe().then(() => {
  if (alive && window.createGlobe) setReady(true);
  }).catch(() => {});
  }
  const tick = () => {
  if (!alive) return;
  if (window.createGlobe) { setReady(true); return; }
  window.setTimeout(tick, 60);
  };
  tick();
  return () => { alive = false; };
  }, [ready]);

  useEffect(() => {
  if (typeof window === 'undefined') return undefined;
  const el = canvasRef.current && canvasRef.current.closest('.nbg-globe-wrap');
  if (!el || !('IntersectionObserver' in window)) return undefined;
  const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0, rootMargin: '140px' });
  io.observe(el);
  return () => io.disconnect();
  }, []);

  useEffect(() => {
  if (!ready || !visible || typeof window === 'undefined' || !window.createGlobe) return undefined;
  const canvas = canvasRef.current;
  const fx = fxRef.current;
  if (!canvas || !fx) return undefined;
  const ctx = fx.getContext('2d');
  let w = canvas.offsetWidth || 560;
  widthRef.current = w;
  const compactGlobe = w < 520 || window.matchMedia?.('(pointer: coarse)')?.matches;
  const dpr = Math.min(window.devicePixelRatio || 1, compactGlobe ? 1.35 : 1.65);
  const mapSamples = compactGlobe ? 9500 : 14500;
  const tdef = NBG_THEME;

  function drawFx(phiEff, theta) {
  const W = Math.max(1, Math.round(widthRef.current * dpr));
  if (fx.width !== W) { fx.width = W; fx.height = W; }
  ctx.clearRect(0, 0, W, W);
  if (mode !== 'orders') return;
  const cx = W / 2, cy = W / 2, R = (W / 2) * NBG_FILL;
  const now = performance.now();
  const hq = nbgProjectPt(NBG_HQ.lat, NBG_HQ.lng, phiEff, theta, cx, cy, R);
  const arcs = arcsRef.current;
  for (let i = arcs.length - 1; i >= 0; i--) if (now - arcs[i].born > NBG_ARC_LIFE) arcs.splice(i, 1);
  for (const arc of arcs) {
  const b = nbgProjectPt(arc.lat, arc.lng, phiEff, theta, cx, cy, R);
  if (hq.z <= 0.02 || b.z <= 0.02) continue;
  const age = now - arc.born;
  const prog = Math.min(1, age / 700);
  const fade = age > NBG_ARC_LIFE - 800 ? Math.max(0, (NBG_ARC_LIFE - age) / 800) : 1;
  const mx = (hq.x + b.x) / 2, my = (hq.y + b.y) / 2;
  let dx = mx - cx, dy = my - cy; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
  const dist = Math.hypot(b.x - hq.x, b.y - hq.y);
  const lift = dist * 0.22 + 18 * dpr;
  const ctrlx = mx + dx * lift, ctrly = my + dy * lift;
  const bez = (t) => { const it = 1 - t; return [it * it * hq.x + 2 * it * t * ctrlx + t * t * b.x, it * it * hq.y + 2 * it * t * ctrly + t * t * b.y]; };
  const N = 42;
  ctx.beginPath();
  for (let i = 0; i <= N * prog; i++) { const p = bez(i / N); if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }
  ctx.strokeStyle = `rgba(204,162,74,${0.85 * fade})`;
  ctx.lineWidth = 2 * dpr; ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(204,162,74,0.7)'; ctx.shadowBlur = 8 * dpr;
  ctx.stroke(); ctx.shadowBlur = 0;
  if (prog < 1) {
  const h = bez(prog);
  ctx.beginPath(); ctx.arc(h[0], h[1], 3 * dpr, 0, 7);
  ctx.fillStyle = `rgba(255,238,200,${fade})`;
  ctx.shadowColor = 'rgba(255,220,150,0.9)'; ctx.shadowBlur = 10 * dpr; ctx.fill(); ctx.shadowBlur = 0;
  } else {
  const ring = nbgClamp((age - 700) / 1200, 0, 1);
  ctx.beginPath(); ctx.arc(b.x, b.y, (3 + ring * 12) * dpr, 0, 7);
  ctx.strokeStyle = `rgba(232,57,42,${(1 - ring) * 0.7 * fade})`; ctx.lineWidth = 2 * dpr; ctx.stroke();
  ctx.beginPath(); ctx.arc(b.x, b.y, 2.6 * dpr, 0, 7);
  ctx.fillStyle = `rgba(232,57,42,${fade})`;
  ctx.shadowColor = 'rgba(232,57,42,0.9)'; ctx.shadowBlur = 8 * dpr; ctx.fill(); ctx.shadowBlur = 0;
  }
  }
  if (hq.z > 0) {
  const pulse = (now / 1100) % 1;
  ctx.beginPath(); ctx.arc(hq.x, hq.y, (4 + pulse * 11) * dpr, 0, 7);
  ctx.strokeStyle = `rgba(204,162,74,${(1 - pulse) * 0.6})`; ctx.lineWidth = 2 * dpr; ctx.stroke();
  ctx.beginPath(); ctx.arc(hq.x, hq.y, 4.2 * dpr, 0, 7);
  ctx.fillStyle = '#E4B751'; ctx.shadowColor = 'rgba(228,183,81,0.9)'; ctx.shadowBlur = 11 * dpr; ctx.fill(); ctx.shadowBlur = 0;
  }
  const s = searchRef && searchRef.current;
  if (s && s.ts) {
  const sp = nbgProjectPt(s.lat, s.lng, phiEff, theta, cx, cy, R);
  if (sp.z > 0) {
  const tp = (now / 850) % 1;
  ctx.beginPath(); ctx.arc(sp.x, sp.y, (6 + tp * 18) * dpr, 0, 7);
  ctx.strokeStyle = `rgba(228,183,81,${(1 - tp) * 0.85})`; ctx.lineWidth = 2.5 * dpr; ctx.stroke();
  ctx.beginPath(); ctx.arc(sp.x, sp.y, 5.2 * dpr, 0, 7);
  ctx.fillStyle = '#FFE9B0'; ctx.shadowColor = 'rgba(255,220,140,1)'; ctx.shadowBlur = 16 * dpr; ctx.fill(); ctx.shadowBlur = 0;
  }
  }
  }

  const globe = window.createGlobe(canvas, {
  devicePixelRatio: dpr, width: w * dpr, height: w * dpr,
  phi: phiRef.current, theta: thetaRef.current,
  dark: tdef.dark, diffuse: tdef.diffuse, mapSamples, mapBrightness: tdef.mapBrightness,
  baseColor: tdef.base, markerColor: mode === 'stores' ? tdef.store : tdef.order,
  glowColor: tdef.glow, opacity: 0.95, markers: [],
  onRender: (state) => {
  const f = focusRef.current;
  if (f && f.ts && f.ts !== lastFocusTs.current) {
  lastFocusTs.current = f.ts;
  if (interacting.current === null) {
  let [tp, tt] = nbgFaceAngles(f.lat, f.lng);
  while (tp - phiRef.current > Math.PI) tp -= 2 * Math.PI;
  while (tp - phiRef.current < -Math.PI) tp += 2 * Math.PI;
  focusTarget.current = { phi: tp, theta: tt, until: performance.now() + (f.hold || 2400) };
  }
  }
  const ft = focusTarget.current;
  let spinning = true;
  if (ft && autoSpin && performance.now() < ft.until && interacting.current === null && !pinch.current) {
  phiRef.current += (ft.phi - phiRef.current) * 0.055;
  thetaRef.current += (ft.theta - thetaRef.current) * 0.055;
  spinning = false;
  }
  if (autoSpin && spinning && interacting.current === null && !pinch.current) phiRef.current += spinSpeed;

  state.phi = phiRef.current + dragXRef.current;
  state.theta = thetaRef.current;
  if (mode === 'stores') {
  // Read storesRef live each frame - store data loads async, so a
  // marker list captured at effect-init would stay empty forever.
  state.markers = (storesRef.current || []).map((d) => ({ location: [d.lat, d.lng], size: 0.045 }));
  } else {
  const list = shippedRef.current; const now = performance.now();
  for (const m of list) { const tgt = (m.boostUntil && now < m.boostUntil) ? m.target * 1.7 : m.target; m.size += (tgt - m.size) * 0.09; }
  state.markers = list.map((m) => ({ location: [m.lat, m.lng], size: m.size }));
  }
  state.width = widthRef.current * dpr; state.height = widthRef.current * dpr;
  drawFx(state.phi, state.theta);
  },
  });
  requestAnimationFrame(() => (canvas.style.opacity = '1'));
  applyZoom();

  const dist = () => { const p = [...pointers.current.values()]; return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); };
  const onDown = (e) => {
  focusTarget.current = null;
  pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.current.size === 2) { interacting.current = null; pinch.current = { d: dist(), z: zoomRef.current }; }
  else if (pointers.current.size === 1) {
  interacting.current = e.clientX;
  pointerStart.current = { x: e.clientX, y: e.clientY, phi: phiRef.current + dragXRef.current, theta: thetaRef.current };
  canvas.style.cursor = 'grabbing';
  }
  };
  const onMove = (e) => {
  if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch.current && pointers.current.size >= 2) { zoomRef.current = nbgClamp(pinch.current.z * (dist() / pinch.current.d), NBG_ZOOM_MIN, NBG_ZOOM_MAX); applyZoom(); return; }
  if (interacting.current === null) return;
  const half = widthRef.current * 0.5;
  const dx = (e.clientX - pointerStart.current.x) / half;
  const dy = (e.clientY - pointerStart.current.y) / half;
  phiRef.current = pointerStart.current.phi + dx * Math.PI; dragXRef.current = 0;
  thetaRef.current = pointerStart.current.theta - dy * Math.PI * 0.6;
  };
  const onUp = (e) => {
  pointers.current.delete(e.pointerId);
  if (pointers.current.size < 2) pinch.current = null;
  if (pointers.current.size === 0) { interacting.current = null; if (canvas) canvas.style.cursor = 'grab'; }
  };
  const onWheel = (e) => { e.preventDefault(); zoomRef.current = nbgClamp(zoomRef.current * Math.exp(-e.deltaY * 0.0016), NBG_ZOOM_MIN, NBG_ZOOM_MAX); applyZoom(); };
  const onResize = () => { widthRef.current = canvas.offsetWidth || 560; };

  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('dblclick', resetZoom);
  window.addEventListener('resize', onResize);
  return () => {
  globe.destroy();
  canvas.removeEventListener('pointerdown', onDown);
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onUp);
  canvas.removeEventListener('wheel', onWheel);
  canvas.removeEventListener('dblclick', resetZoom);
  window.removeEventListener('resize', onResize);
  };
  }, [mode, autoSpin, spinSpeed, visible, ready]);

  return (
  <React.Fragment>
  <div className="nbg-globe-stage">
  <div className="nbg-globe-scale" ref={scaleRef}>
  <canvas ref={canvasRef} className="nbg-globe-canvas" style={{ cursor: 'grab', opacity: 0, transition: 'opacity .6s ease' }} />
  <canvas ref={fxRef} className="nbg-fx-canvas" />
  </div>
  </div>
  <div className="nbg-zoom-ctl">
  <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.35)}>+</button>
  <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.35)}>-</button>
  </div>
  </React.Fragment>
  );
}

// ===== Animated counter =====
function BombCount({ value }) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);
  useEffect(() => {
  const from = fromRef.current, to = value, start = performance.now(), dur = 900;
  cancelAnimationFrame(rafRef.current);
  const tick = (now) => {
  const p = Math.min(1, (now - start) / dur);
  const e = 1 - Math.pow(1 - p, 3);
  setShown(Math.round(from + (to - from) * e));
  if (p < 1) rafRef.current = requestAnimationFrame(tick); else fromRef.current = to;
  };
  rafRef.current = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafRef.current);
  }, [value]);
  return <span>{nbgFmt(shown)}</span>;
}

function OrderMapSection() {
  const [cities, setCities] = useState(ORDER_MAP_FALLBACK_CITIES);
  const [stores, setStores] = useState([]);
  const [status, setStatus] = useState('loading');
  const [mapMeta, setMapMeta] = useState(null);

  const [mode, setMode] = useState('orders');
  const [toastOn, setToastOn] = useState(false);
  const [latest, setLatest] = useState(null);
  const [recent, setRecent] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const shippedRef = useRef([]);
  const arcsRef = useRef([]);
  const focusRef = useRef({ lat: 0, lng: 0, ts: 0 });
  const searchRef = useRef({ lat: 0, lng: 0, ts: 0 });
  const storesRef = useRef([]);
  const searchUntilRef = useRef(0);
  const cityCountRef = useRef(new Map());
  const lastIdxRef = useRef(-1);
  const hideTimer = useRef(0);
  const loopTimer = useRef(0);
  const sectionRef = useRef(null);

  const prefersReduced = typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // - - - Real feeds: static city cache (instant first paint), live order
  // function (authoritative), stores. The live function pulls fresh Shopify +
  // Amazon order cities on every request; we re-poll it through the day so new
  // orders light up the globe and refresh the ticker without a page reload.
  // Static JSON only paints before live arrives - it never overwrites a live
  // result, and an unchanged payload is skipped to avoid resetting animations.
  useEffect(() => {
  let active = true;
  let liveApplied = false;
  let anyApplied = false;
  let lastSig = '';
  const loadJson = async (url, timeoutMs = 3200) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store', signal: controller.signal });
  if (!res.ok) return null;
  return await res.json();
  } catch (_) {
  return null;
  } finally {
  clearTimeout(timer);
  }
  };
  const applyCityData = (data, kind) => {
  // kind: 'live' | 'static'. Live wins and locks out later static writes;
  // static only fills the gap before the first live response lands.
  const isLive = kind === 'live';
  if (!isLive && liveApplied) return false;
  const rows = Array.isArray(data?.cities) ? data.cities.map(normalizeOrderCity).filter(Boolean) : [];
  if (!active || !rows.length) return false;
  const liveOk = isLive && data?.configured !== false;
  const sig = rows.length + '::' + rows.slice(0, 4).map((r) => r.city + r.state + (r.lastOrderAt || r.orders)).join(',');
  if (sig === lastSig && anyApplied) { if (liveOk) liveApplied = true; return false; }
  lastSig = sig;
  setCities(rows);
  setMapMeta(data || null);
  setStatus(data?.configured === false ? 'fallback' : kind);
  if (liveOk) liveApplied = true;
  anyApplied = true;
  return true;
  };
  const applyStoreData = (data) => {
  const rows = Array.isArray(data?.stores) ? data.stores.map(normalizeStoreLocation).filter(Boolean) : [];
  if (!active) return false;
  setStores(rows);
  return rows.length > 0;
  };
  const liveOrderUrl = typeof window !== 'undefined' ? window.NB_ORDER_MAP_FUNCTION_URL : '';
  const loadLive = () => liveOrderUrl
  ? loadJson(liveOrderUrl, 4800).then((data) => { if (data) applyCityData(data, 'live'); })
  : Promise.resolve(false);
  const load = async () => {
  const staticLoad = loadJson('/data/order-map-cities.json', 5200)
  .then((data) => applyCityData(data, 'static'));
  const liveLoad = loadLive();
  const storeLoad = loadJson('/data/store-locations.json', 5200)
  .then((data) => applyStoreData(data));
  await Promise.allSettled([staticLoad, liveLoad, storeLoad]);
  if (!active) return;
  if (!anyApplied) {
  setCities(ORDER_MAP_FALLBACK_CITIES);
  setStatus('fallback');
  }
  };
  load();
  // Re-poll the live order function through the day so new orders surface
  // without a reload. Idle while the tab is hidden; refresh on return.
  const REFRESH_MS = 180000; // 3 min - above the function's 120s cache window
  const poll = window.setInterval(() => {
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
  loadLive();
  }, REFRESH_MS);
  const onVisible = () => { if (document.visibilityState === 'visible') loadLive(); };
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible);
  return () => {
  active = false;
  window.clearInterval(poll);
  if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible);
  };
  }, []);

  useEffect(() => {
  if (typeof window === 'undefined') return undefined;
  let timer = 0;
  const handleMapHash = () => {
  if (!['#order-map', '#stores'].includes(window.location.hash)) return;
  if (window.location.hash === '#stores') setMode('stores');
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
  document.getElementById('order-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 250);
  };
  handleMapHash();
  window.addEventListener('hashchange', handleMapHash);
  return () => {
  window.clearTimeout(timer);
  window.removeEventListener('hashchange', handleMapHash);
  };
  }, []);

  // - - - Real data -> globe shape (city pool the simulation + search draw from).
  const liveCities = useMemo(() => cities.filter((city) => city.source !== 'brand_hq'), [cities]);
  const orderCities = useMemo(() => liveCities.map((c) => ({
  city: c.city, region: c.state, lat: c.lat, lng: c.lng, orders: c.orders, product: c.latestProduct,
  })), [liveCities]);
  const storeCities = useMemo(() => stores.map((s) => ({
  name: s.name, city: s.city, region: s.state, lat: s.lat, lng: s.lng,
  })), [stores]);

  useEffect(() => { storesRef.current = storeCities; }, [storeCities]);

  const hasOrderData = orderCities.length > 0;
  const citiesReached = mapMeta?.stats?.citiesBombed || liveCities.length;

  const statesCount = useMemo(() => {
  const set = new Set();
  orderCities.forEach((c) => { if (US_STATE_SET.has(c.region)) set.add(c.region); });
  return set.size;
  }, [orderCities]);
  const countries = useMemo(() => {
  const regions = new Set(orderCities.map((c) => c.region));
  let n = orderCities.length ? 1 : 0; // US
  if ([...regions].some((r) => ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'].includes(r))) n++;
  if (regions.has('MX')) n++;
  if (regions.has('BS')) n++;
  if (regions.has('PR')) n++;
  return n;
  }, [orderCities]);

  // Seed every real order city as a lit pin (real footprint shows immediately;
  // the live-feed theater below only re-pings already-counted cities).
  useEffect(() => {
  if (!orderCities.length) { shippedRef.current = []; cityCountRef.current = new Map(); return; }
  shippedRef.current = orderCities.map((c) => ({
  city: c.city, region: c.region, lat: c.lat, lng: c.lng, product: c.product,
  size: 0.012 + Math.random() * 0.005, target: 0.015 + Math.random() * 0.006,
  }));
  const counts = new Map();
  orderCities.forEach((c) => counts.set(c.city + c.region, Math.max(1, c.orders || 1)));
  cityCountRef.current = counts;
  setRecent(orderCities.slice(0, 8).map((c) => {
  const flavor = nbgFlavorFromProduct(c.product) || nbgPickFlavor();
  return { city: c.city, region: c.region, product: nbgDisplayProduct(c.product, flavor), flavor };
  }));
  }, [orderCities]);

  // Entrance reveal.
  useEffect(() => {
  if (typeof window === 'undefined') { setRevealed(true); return undefined; }
  const el = sectionRef.current;
  if (!el) { setRevealed(true); return undefined; }
  const r = el.getBoundingClientRect();
  if (r.top < (window.innerHeight || 800) * 0.85 && r.bottom > 0) { setRevealed(true); return undefined; }
  let io;
  if ('IntersectionObserver' in window) {
  io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); io.disconnect(); } }, { threshold: 0.2 });
  io.observe(el);
  }
  const fb = window.setTimeout(() => setRevealed(true), 2600);
  return () => { if (io) io.disconnect(); window.clearTimeout(fb); };
  }, []);

  const dropOrder = React.useCallback(() => {
  const pool = shippedRef.current;
  if (!pool.length) return;
  let idx = Math.floor(Math.random() * pool.length);
  if (idx === lastIdxRef.current) idx = (idx + 1) % pool.length;
  lastIdxRef.current = idx;
  const c = pool[idx];
  const flavor = nbgFlavorFromProduct(c.product) || nbgPickFlavor();
  const product = nbgDisplayProduct(c.product, flavor);
  const key = c.city + c.region;
  c.boostUntil = performance.now() + 550;
  cityCountRef.current.set(key, (cityCountRef.current.get(key) || 0) + 1);
  arcsRef.current.push({ lat: c.lat, lng: c.lng, born: performance.now() });
  if (arcsRef.current.length > 9) arcsRef.current.shift();
  if (performance.now() > searchUntilRef.current) focusRef.current = { lat: c.lat, lng: c.lng, ts: Date.now() };
  setLatest({ id: Date.now(), city: c.city, region: c.region, product, flavor });
  setRecent((r) => [{ city: c.city, region: c.region, product, flavor }, ...r].slice(0, 10));
  setToastOn(true);
  clearTimeout(hideTimer.current);
  hideTimer.current = window.setTimeout(() => setToastOn(false), 4200);
  }, []);

  useEffect(() => {
  if (mode !== 'orders' || prefersReduced || !hasOrderData) { setToastOn(false); return undefined; }
  let alive = true;
  const loop = () => { if (!alive) return; dropOrder(); loopTimer.current = window.setTimeout(loop, 2600 + Math.random() * 3200); };
  const first = window.setTimeout(loop, 1600);
  return () => { alive = false; window.clearTimeout(first); window.clearTimeout(loopTimer.current); };
  }, [mode, prefersReduced, hasOrderData, dropOrder]);

  useEffect(() => () => {
  if (loopTimer.current) window.clearTimeout(loopTimer.current);
  if (hideTimer.current) window.clearTimeout(hideTimer.current);
  }, []);

  const runSearch = (e) => {
  if (e) e.preventDefault();
  const q = query.trim().toLowerCase();
  if (!q) return;
  const pool = orderCities;
  const best = pool.find((c) => (c.city + ', ' + c.region).toLowerCase() === q)
  || pool.find((c) => c.city.toLowerCase() === q)
  || pool.find((c) => c.city.toLowerCase().startsWith(q))
  || pool.find((c) => c.city.toLowerCase().includes(q))
  || pool.find((c) => c.region.toLowerCase() === q);
  if (!best) { setSearchResult({ found: false, q: query.trim() }); return; }
  const key = best.city + best.region;
  const count = cityCountRef.current.get(key) || best.orders || 0;
  setMode('orders');
  searchUntilRef.current = performance.now() + 7000;
  focusRef.current = { lat: best.lat, lng: best.lng, ts: Date.now(), hold: 6500 };
  searchRef.current = { lat: best.lat, lng: best.lng, ts: Date.now() };
  setSearchResult({ found: true, city: best.city, region: best.region, count });
  };

  const flavorColor = latest ? nbgColor(latest.flavor.color) : nbgColor('--nbg-chili');
  const spotlightFlavor = latest?.flavor || NBG_FLAVORS[0];
  const spotlightProduct = latest?.product || `${spotlightFlavor.name} Sauce`;
  const spotlightKey = latest ? `${latest.id}-${latest.city}-${latest.region}-${spotlightFlavor.name}` : 'starter-original';
  const storesCount = stores.length;

  return (
  <section
  ref={sectionRef}
  id="order-map"
  className={'nbg-live mode-' + mode + (revealed ? ' revealed' : '')}
  aria-labelledby="order-map-heading"
  >
  <style>{`
  .nbg-live {
  --nbg-bg: #17100A;
  --nbg-cream: #F6EFE1;
  --nbg-cream-2: #CBC1AE;
  --nbg-muted: #8B8270;
  --nbg-faint: #5C5648;
  --nbg-chili: #E8392A;
  --nbg-sesame: #E8A23D;
  --nbg-gold: #CCA24A;
  --nbg-gold-hot: #E4B751;
  --nbg-line: rgba(246,239,225,0.10);
  --nbg-line-strong: rgba(246,239,225,0.20);
  --nbg-r-sm: 8px; --nbg-r-md: 14px; --nbg-r-pill: 999px;
  --nbg-shadow: 0 18px 50px rgba(0,0,0,0.55);
  --nbg-shadow-chili: 0 10px 30px rgba(232,57,42,0.35);
  position: relative;
  background: var(--nbg-bg);
  color: var(--nbg-cream);
  font-family: 'Archivo', system-ui, sans-serif;
  padding: clamp(48px, 7vh, 96px) clamp(20px, 5vw, 80px);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  }
  .nbg-live::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
  radial-gradient(55% 68% at 75% 42%, rgba(204,162,74,.14), transparent 60%),
  linear-gradient(180deg, rgba(60,44,24,.42), rgba(10,8,5,.55)),
  repeating-linear-gradient(90deg, rgba(255,236,200,.022) 0 1px, transparent 1px 4px);
  }
  .nbg-live-photo {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: url("/uploads/og-trio-counter-page.webp") right center / cover no-repeat;
  opacity: .16;
  -webkit-mask-image: linear-gradient(90deg, transparent 4%, #000 60%);
  mask-image: linear-gradient(90deg, transparent 4%, #000 60%);
  }
  .nbg-live.mode-stores .nbg-live-photo { opacity: .06; }
  .nbg-grid {
  position: relative; z-index: 2;
  width: 100%; max-width: 1280px; margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(420px, 1.12fr);
  gap: clamp(24px, 5vw, 80px); align-items: center;
  }
  .nbg-eyebrow {
  display: inline-flex; align-items: center; gap: 10px; white-space: nowrap;
  font-family: 'Space Mono', ui-monospace, monospace;
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em;
  color: var(--nbg-gold); margin: 0 0 20px;
  }
  .nbg-live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--nbg-chili); box-shadow: 0 0 0 0 rgba(232,57,42,.55);
  animation: nbgPulse 2s infinite;
  }
  @keyframes nbgPulse {
  0% { box-shadow: 0 0 0 0 rgba(232,57,42,.5); }
  70% { box-shadow: 0 0 0 9px rgba(232,57,42,0); }
  100% { box-shadow: 0 0 0 0 rgba(232,57,42,0); }
  }
  .nbg-h {
  font-family: 'Archivo', system-ui, sans-serif; font-weight: 900;
  font-size: clamp(44px, 6vw, 92px); line-height: 0.92; letter-spacing: -0.03em;
  text-transform: uppercase; margin: 0 0 20px; text-wrap: balance;
  }
  .nbg-hl-gold { color: var(--nbg-gold); }
  .nbg-sub { font-size: 18px; line-height: 1.55; color: var(--nbg-cream-2); max-width: 44ch; margin: 0 0 24px; }
  .nbg-flavors { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
  .nbg-flavors-lab {
  font-family: 'Space Mono', ui-monospace, monospace; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.16em; color: var(--nbg-faint); margin-right: 4px;
  }
  .nbg-flavor-chip {
  display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600;
  color: var(--nbg-cream-2); background: #18130E; border: 1px solid var(--nbg-line);
  padding: 6px 13px 6px 11px; border-radius: var(--nbg-r-pill);
  }
  .nbg-fc-dot { width: 9px; height: 9px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
  .nbg-stats { display: flex; align-items: stretch; gap: 28px; margin-bottom: 22px; }
  .nbg-stat-num {
  font-family: 'Archivo', system-ui, sans-serif; font-weight: 800;
  font-size: clamp(40px, 4.8vw, 70px); line-height: 0.9; letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  }
  .nbg-stat-lab {
  font-family: 'Space Mono', ui-monospace, monospace; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.16em; color: var(--nbg-muted); margin-top: 10px;
  }
  .nbg-stat-div { width: 1px; background: var(--nbg-line); }
  .nbg-reach { display: flex; align-items: center; gap: 9px; align-self: center; color: var(--nbg-cream-2); font-size: 15px; }
  .nbg-reach b { font-family: 'Archivo', system-ui, sans-serif; font-weight: 900; font-size: 30px; letter-spacing: -0.02em; color: var(--nbg-gold); }
  .nbg-reach-line { display: inline-flex; align-items: baseline; gap: 7px; }
  .nbg-reach-dot { color: var(--nbg-faint); }
  .nbg-seg {
  position: relative; display: inline-flex; padding: 4px; background: #18130E;
  border: 1px solid var(--nbg-line); border-radius: var(--nbg-r-pill); margin-bottom: 14px;
  }
  .nbg-seg-btn {
  position: relative; z-index: 2; appearance: none; border: 0; background: transparent; cursor: pointer;
  font-family: 'Archivo', system-ui, sans-serif; font-size: 14px; font-weight: 700;
  color: var(--nbg-muted); padding: 10px 24px; border-radius: var(--nbg-r-pill);
  transition: color .18s ease; white-space: nowrap;
  }
  .nbg-seg-btn.on { color: #1a120c; }
  .nbg-seg-thumb {
  position: absolute; z-index: 1; top: 4px; bottom: 4px; border-radius: var(--nbg-r-pill);
  transition: transform .24s cubic-bezier(.2,.8,.2,1), background .24s ease, width .24s ease;
  }
  .nbg-live.mode-orders .nbg-seg-thumb { left: 4px; width: 96px; transform: translateX(0); background: var(--nbg-chili); box-shadow: var(--nbg-shadow-chili); }
  .nbg-live.mode-stores .nbg-seg-thumb { left: 4px; width: 144px; transform: translateX(96px); background: var(--nbg-sesame); box-shadow: 0 10px 30px rgba(232,162,61,.32); }
  .nbg-legend { font-size: 14px; color: var(--nbg-muted); }
  .nbg-lg { display: inline-flex; align-items: center; gap: 9px; }
  .nbg-lg-dot { width: 10px; height: 10px; border-radius: 50%; }
  .nbg-lg-dot.order { background: var(--nbg-chili); box-shadow: 0 0 10px rgba(232,57,42,.7); }
  .nbg-lg-dot.store { background: var(--nbg-sesame); box-shadow: 0 0 10px rgba(232,162,61,.7); }
  .nbg-lg-dot.home { background: var(--nbg-gold); box-shadow: 0 0 10px rgba(204,162,74,.8); }
  .nbg-join { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 18px; }
  .nbg-join-cta {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Archivo', system-ui, sans-serif; font-weight: 800; font-size: 15px;
  text-transform: uppercase; color: #1a120c; background: var(--nbg-gold); text-decoration: none;
  padding: 13px 22px; border-radius: var(--nbg-r-pill); box-shadow: 0 10px 30px rgba(204,162,74,.3);
  transition: background .16s ease, transform .16s ease;
  }
  .nbg-join-cta:hover { background: var(--nbg-gold-hot); transform: translateY(-1px); }
  .nbg-city-search {
  display: flex; align-items: center; gap: 4px; background: #18130E;
  border: 1px solid var(--nbg-line); border-radius: var(--nbg-r-pill); padding: 3px 3px 3px 16px;
  }
  .nbg-city-search:focus-within { border-color: var(--nbg-gold); }
  .nbg-city-search input {
  background: transparent; border: 0; outline: none; color: var(--nbg-cream);
  font-family: 'Archivo', system-ui, sans-serif; font-size: 14px; width: 124px;
  }
  .nbg-city-search input::placeholder { color: var(--nbg-muted); }
  .nbg-city-search button {
  width: 34px; height: 34px; flex: none; border: 0; cursor: pointer; border-radius: 50%;
  background: #221A12; color: var(--nbg-cream); font-size: 16px;
  display: flex; align-items: center; justify-content: center; transition: background .16s ease, color .16s ease;
  }
  .nbg-city-search button:hover { background: var(--nbg-gold); color: #1a120c; }
  .nbg-join-msg { margin-top: 13px; font-size: 14px; line-height: 1.5; color: var(--nbg-cream-2); max-width: 42ch; }
  .nbg-join-msg a { color: var(--nbg-gold); font-weight: 700; text-decoration: none; border-bottom: 1px solid transparent; }
  .nbg-join-msg a:hover { border-bottom-color: var(--nbg-gold); }
  .nbg-stores { margin-top: 16px; display: grid; gap: 10px; max-width: 46ch; }
  .nbg-store-card {
  padding: 13px 16px; border-radius: var(--nbg-r-md);
  background: rgba(232,162,61,.07); border: 1px solid rgba(232,162,61,.22);
  transition: border-color .2s ease, background .2s ease;
  }
  .nbg-store-card:hover { border-color: var(--nbg-sesame); background: rgba(232,162,61,.12); }
  .nbg-store-name { font-family: 'Archivo', system-ui, sans-serif; font-weight: 800; font-size: 16px; letter-spacing: -0.01em; color: var(--nbg-cream); }
  .nbg-store-addr { margin-top: 3px; font-size: 13.5px; line-height: 1.45; color: var(--nbg-cream-2); }
  .nbg-store-links { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 14px; }
  .nbg-store-link { font-size: 12.5px; font-weight: 700; color: var(--nbg-gold); text-decoration: none; border-bottom: 1px solid transparent; }
  .nbg-store-link:hover { color: var(--nbg-gold-hot); border-bottom-color: var(--nbg-gold-hot); }
  .nbg-globe-wrap {
  position: relative; width: 100%; max-width: 640px; margin-inline: auto;
  aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center;
  }
  .nbg-globe-glow { position: absolute; inset: -10%; filter: blur(10px); pointer-events: none; z-index: 0; }
  .nbg-globe-stage { position: absolute; inset: 0; z-index: 1; overflow: hidden; touch-action: none; }
  .nbg-globe-scale { position: absolute; inset: 0; transform-origin: center center; transition: transform .14s ease; }
  .nbg-globe-canvas { position: absolute; inset: 0; width: 100%; height: 100%; aspect-ratio: 1 / 1; touch-action: none; contain: layout paint size; }
  .nbg-fx-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .nbg-zoom-ctl { position: absolute; z-index: 4; right: 6%; top: 7%; display: flex; flex-direction: column; gap: 8px; }
  .nbg-zoom-ctl button {
  width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
  appearance: none; cursor: pointer; background: rgba(24,19,14,0.78);
  border: 1px solid var(--nbg-line-strong); border-radius: 50%; color: var(--nbg-cream);
  font-size: 22px; font-weight: 600; line-height: 1; backdrop-filter: blur(8px);
  transition: background .16s ease, border-color .16s ease, transform .12s ease;
  }
  .nbg-zoom-ctl button:hover { background: #221A12; border-color: var(--nbg-chili); }
  .nbg-zoom-ctl button:active { transform: translateY(1px); }
  .nbg-drag-hint {
  position: absolute; z-index: 2; left: 50%; bottom: 3%; transform: translateX(-50%);
  font-family: 'Space Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.22em;
  color: var(--nbg-faint); pointer-events: none; user-select: none;
  }
  .nbg-bottle-spotlight {
  position: absolute; z-index: 3; left: -5%; bottom: -4%;
  width: min(210px, 34%); min-width: 148px;
  pointer-events: none; user-select: none;
  filter: drop-shadow(0 28px 42px rgba(0,0,0,.62));
  }
  .nbg-bottle-halo {
  position: absolute; inset: 20% -8% 0; border-radius: 999px;
  background: radial-gradient(circle, var(--nbg-drop-color, var(--nbg-chili)) 0%, transparent 62%);
  opacity: .24; filter: blur(18px); transform: scale(.72);
  animation: nbgBottleHalo 1.15s cubic-bezier(.2,.8,.2,1) both;
  }
  .nbg-bottle-ring {
  position: absolute; left: 50%; bottom: 4%; width: 82%; aspect-ratio: 1 / .38;
  border: 1px solid color-mix(in srgb, var(--nbg-drop-color, var(--nbg-chili)) 70%, transparent);
  border-radius: 50%; transform: translateX(-50%) scale(.65);
  opacity: 0; animation: nbgBottleRing 1.05s cubic-bezier(.2,.8,.2,1) .08s both;
  }
  .nbg-bottle-img {
  position: relative; z-index: 2; display: block; width: 100%; height: auto;
  transform-origin: 50% 85%;
  animation: nbgBottleDrop .82s cubic-bezier(.16,.9,.24,1) both, nbgBottleFloat 3.8s ease-in-out .9s infinite;
  }
  .nbg-bottle-flash {
  position: absolute; z-index: 1; left: 50%; top: 42%; width: 70%; aspect-ratio: 1;
  border-radius: 50%; transform: translate(-50%, -50%) scale(.55);
  background: radial-gradient(circle, rgba(255,246,220,.56), rgba(255,246,220,0) 66%);
  opacity: 0; animation: nbgBottleFlash .72s ease-out both;
  }
  .nbg-bottle-label {
  position: absolute; z-index: 4; left: 14%; right: -34%; bottom: 10%;
  padding: 10px 12px 11px; border-radius: 12px;
  background: rgba(24,19,14,.9); border: 1px solid var(--nbg-line-strong);
  box-shadow: 0 18px 34px rgba(0,0,0,.38); backdrop-filter: blur(10px);
  animation: nbgBottleLabel .72s cubic-bezier(.2,.8,.2,1) .08s both;
  }
  .nbg-bottle-kicker {
  display: block; font-family: 'Space Mono', ui-monospace, monospace;
  font-size: 9px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
  color: var(--nbg-drop-color, var(--nbg-chili)); margin-bottom: 4px;
  }
  .nbg-bottle-name {
  display: block; font-family: 'Archivo', system-ui, sans-serif;
  font-size: 16px; font-weight: 900; line-height: 1.02; letter-spacing: -.01em;
  color: var(--nbg-cream);
  }
  @keyframes nbgBottleDrop {
  0% { opacity: 0; transform: translate3d(-22px,-30px,0) rotate(-8deg) scale(.78); }
  58% { opacity: 1; transform: translate3d(4px,4px,0) rotate(3deg) scale(1.08); }
  100% { opacity: 1; transform: translate3d(0,0,0) rotate(-1deg) scale(1); }
  }
  @keyframes nbgBottleFloat {
  0%,100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-7px) rotate(1.2deg); }
  }
  @keyframes nbgBottleHalo {
  0% { opacity: 0; transform: scale(.52); }
  42% { opacity: .36; transform: scale(1.05); }
  100% { opacity: .22; transform: scale(.84); }
  }
  @keyframes nbgBottleRing {
  0% { opacity: 0; transform: translateX(-50%) scale(.55); }
  38% { opacity: .88; }
  100% { opacity: 0; transform: translateX(-50%) scale(1.28); }
  }
  @keyframes nbgBottleFlash {
  0% { opacity: .9; transform: translate(-50%, -50%) scale(.35); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.45); }
  }
  @keyframes nbgBottleLabel {
  0% { opacity: 0; transform: translate3d(-8px,10px,0) scale(.92); }
  100% { opacity: 1; transform: none; }
  }
  .nbg-toast {
  position: absolute; z-index: 3; right: 1%; bottom: 8%;
  display: flex; align-items: center; gap: 12px; width: 252px;
  padding: 11px 11px 11px 16px; overflow: hidden;
  background: rgba(24,19,14,0.94); border: 1px solid var(--nbg-line-strong);
  border-radius: var(--nbg-r-md); box-shadow: var(--nbg-shadow); backdrop-filter: blur(10px);
  opacity: 0; transform: translateY(14px) scale(.96);
  transition: opacity .26s cubic-bezier(.2,.8,.2,1), transform .26s cubic-bezier(.2,.8,.2,1);
  pointer-events: none;
  }
  .nbg-toast-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
  .nbg-toast.show { opacity: 1; transform: translateY(0) scale(1); }
  .nbg-toast-chip {
  width: 54px; height: 54px; flex: none; border-radius: var(--nbg-r-sm); background: #F4ECDC;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.06);
  }
  .nbg-toast-chip img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
  .nbg-toast-tag { font-family: 'Space Mono', ui-monospace, monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: var(--nbg-chili); }
  .nbg-toast-city { font-family: 'Archivo', system-ui, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; color: var(--nbg-cream); line-height: 1; margin: 3px 0; }
  .nbg-toast-meta { font-size: 12px; color: var(--nbg-muted); }
  .nbg-toast-flavor { font-weight: 700; }
  .nbg-ticker {
  position: relative; z-index: 2; width: 100%; max-width: 1280px;
  margin: clamp(22px, 4vh, 40px) auto 0; display: flex; align-items: center; gap: 18px;
  border-top: 1px solid var(--nbg-line); padding-top: 18px;
  }
  .nbg-ticker-lab { flex: none; font-family: 'Space Mono', ui-monospace, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: var(--nbg-faint); }
  .nbg-ticker-vp { flex: 1; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent); mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent); }
  .nbg-ticker-track { display: inline-flex; gap: 30px; white-space: nowrap; animation: nbgTicker 42s linear infinite; will-change: transform; }
  .nbg-ticker-item { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--nbg-cream-2); }
  .nbg-ti-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
  .nbg-ti-flavor { font-size: 12px; font-weight: 600; opacity: .9; }
  @keyframes nbgTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .nbg-live:not(.revealed) .nbg-live-copy > * { opacity: 0; transform: translateY(18px); }
  .nbg-live.revealed .nbg-live-copy > * { opacity: 1; transform: none; transition: opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1); }
  .nbg-live.revealed .nbg-live-copy > *:nth-child(2) { transition-delay: .06s; }
  .nbg-live.revealed .nbg-live-copy > *:nth-child(3) { transition-delay: .12s; }
  .nbg-live.revealed .nbg-live-copy > *:nth-child(4) { transition-delay: .18s; }
  .nbg-live.revealed .nbg-live-copy > *:nth-child(5) { transition-delay: .24s; }
  .nbg-live.revealed .nbg-live-copy > *:nth-child(6) { transition-delay: .30s; }
  .nbg-live:not(.revealed) .nbg-globe-wrap { opacity: 0; transform: scale(.95); }
  .nbg-live.revealed .nbg-globe-wrap { opacity: 1; transform: none; transition: opacity .7s ease .14s, transform .8s cubic-bezier(.2,.8,.2,1) .14s; }
  .nbg-live:not(.revealed) .nbg-ticker { opacity: 0; }
  .nbg-live.revealed .nbg-ticker { opacity: 1; transition: opacity .6s ease .42s; }

  @media (prefers-reduced-motion: reduce) {
  .nbg-ticker-track { animation: none; }
  .nbg-live-dot { animation: none; }
  .nbg-live .nbg-live-copy > *, .nbg-live .nbg-globe-wrap, .nbg-live .nbg-ticker { opacity: 1 !important; transform: none !important; transition: none !important; }
  }
  @media (max-width: 880px) {
  .nbg-grid { grid-template-columns: 1fr; gap: 36px; }
  .nbg-live-copy { order: 2; }
  .nbg-globe-wrap { order: 1; max-width: 460px; }
  .nbg-toast { right: 0; bottom: 4%; }
  .nbg-stats { flex-wrap: wrap; gap: 18px 24px; }
  .nbg-reach b { font-size: 26px; }
  .nbg-bottle-spotlight { width: min(176px, 34%); left: -4%; bottom: -2%; }
  .nbg-bottle-label { right: -42%; }
  }
  @media (max-width: 560px) {
  .nbg-h { font-size: clamp(38px, 12vw, 60px); }
  .nbg-bottle-spotlight { width: 118px; min-width: 118px; left: 1%; bottom: 2%; }
  .nbg-bottle-label { display: none; }
  .nbg-toast { width: 218px; }
  .nbg-ticker-lab { display: none; }
  .nbg-zoom-ctl { right: 3%; top: 4%; }
  .nbg-reach { font-size: 14px; }
  .nbg-reach b { font-size: 22px; }
  }
  `}</style>

  <div className="nbg-live-photo" />
  <div className="nbg-grid">
  <div className="nbg-live-copy">
  <div className="nbg-eyebrow"><span className="nbg-live-dot" />LIVE VIEW - SHIPPED WORLDWIDE</div>
  <h2 id="order-map-heading" className="nbg-h">Get Your City <span className="nbg-hl-gold">on the Map</span></h2>
  <p className="nbg-sub">
  Every pin is a real NoodleBomb order - small-batch sauce shipped from
  Bonney Lake, WA to a hungry bowl somewhere. Drag the globe. Watch it light up.
  </p>

  <div className="nbg-flavors">
  <span className="nbg-flavors-lab">The lineup</span>
  {NBG_FLAVORS.filter((f) => f.name !== 'The Trio').map((f) => (
  <span className="nbg-flavor-chip" key={f.name}>
  <span className="nbg-fc-dot" style={{ background: nbgColor(f.color) }} />
  {f.name}
  </span>
  ))}
  </div>

  <div className="nbg-stats">
  <div>
  <div className="nbg-stat-num"><BombCount value={revealed ? citiesReached : 0} /></div>
  <div className="nbg-stat-lab">Cities Lit Up</div>
  </div>
  <div className="nbg-stat-div" />
  <div className="nbg-reach">
  <span className="nbg-reach-line"><b><BombCount value={revealed ? statesCount : 0} /></b> {statesCount === 1 ? 'state' : 'states'}</span>
  <span className="nbg-reach-dot"> - </span>
  <span className="nbg-reach-line"><b><BombCount value={revealed ? countries : 0} /></b> {countries === 1 ? 'country' : 'countries'}</span>
  </div>
  </div>

  <div className="nbg-seg" role="tablist" aria-label="Map layer">
  <span className="nbg-seg-thumb" />
  <button type="button" className={'nbg-seg-btn ' + (mode === 'orders' ? 'on' : '')} onClick={() => setMode('orders')}>Orders</button>
  <button type="button" className={'nbg-seg-btn ' + (mode === 'stores' ? 'on' : '')} onClick={() => setMode('stores')}>Find in stores</button>
  </div>

  <div className="nbg-legend">
  {mode === 'orders'
  ? <span className="nbg-lg"><span className="nbg-lg-dot home" /> Ships from Bonney Lake, WA <span className="nbg-lg-dot order" /> live orders</span>
  : <span className="nbg-lg"><span className="nbg-lg-dot store" /> {storesCount > 0 ? `${storesCount} ${storesCount === 1 ? 'store stocks' : 'stores stock'} NoodleBomb` : 'Retail finder coming soon - shop online now'}</span>}
  </div>

  {mode === 'stores' && storesCount > 0 && (
  <div className="nbg-stores">
  {stores.map((s) => {
  const addr = [s.address, [s.city, s.state].filter(Boolean).join(', '), s.postalCode].filter(Boolean).join(' - ');
  const mapsHref = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([s.name, s.address, s.city, s.state, s.postalCode].filter(Boolean).join(', '));
  const href = s.websiteUrl || mapsHref;
  return (
  <div className="nbg-store-card" key={s.name + s.city}>
  <div className="nbg-store-name">{s.name}</div>
  {addr && <div className="nbg-store-addr">{addr}</div>}
  <div className="nbg-store-links">
  {s.websiteUrl && <a className="nbg-store-link" href={href} target="_blank" rel="noopener noreferrer">Visit store</a>}
  <a className="nbg-store-link" href={mapsHref} target="_blank" rel="noopener noreferrer">Directions</a>
  </div>
  </div>
  );
  })}
  </div>
  )}

  <div className="nbg-join">
  <a className="nbg-join-cta" href="/shop">Put your city on the map</a>
  <form className="nbg-city-search" onSubmit={runSearch}>
  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find your city" aria-label="Search your city" />
  <button type="submit" aria-label="Search">Go</button>
  </form>
  </div>
  {searchResult && (
  <div className="nbg-join-msg">
  {searchResult.found
  ? (searchResult.count > 0
  ? <span><b style={{ color: nbgColor('--nbg-chili') }}>{searchResult.count} {searchResult.count === 1 ? 'order' : 'orders'}</b> already shipped to {searchResult.city}, {searchResult.region}. <a href="/shop">Join them</a></span>
  : <span>Nobody's repped <b style={{ color: nbgColor('--nbg-gold') }}>{searchResult.city}, {searchResult.region}</b> yet. <a href="/shop">Be the first</a></span>)
  : <span>Can't find "{searchResult.q}" - <a href="/shop">order anyway</a> and put it on the map.</span>}
  </div>
  )}
  </div>

  <div className="nbg-globe-wrap">
  <div className="nbg-globe-glow" style={{ background: mode === 'stores' ? 'radial-gradient(circle, rgba(232,162,61,.22), transparent 62%)' : NBG_THEME.glowCss }} />
  <BombGlobe
  mode={mode}
  autoSpin={!prefersReduced}
  spinSpeed={0.4 * NBG_SPIN_SCALE}
  shippedRef={shippedRef}
  arcsRef={arcsRef}
  focusRef={focusRef}
  searchRef={searchRef}
  storesRef={storesRef}
  />
  <div
  key={spotlightKey}
  className="nbg-bottle-spotlight"
  style={{ '--nbg-drop-color': flavorColor }}
  aria-hidden="true"
  >
  <span className="nbg-bottle-halo" />
  <span className="nbg-bottle-ring" />
  <span className="nbg-bottle-flash" />
  <img className="nbg-bottle-img" src={spotlightFlavor.img} alt={`${spotlightFlavor.name} bottle`} />
  <span className="nbg-bottle-label">
  <span className="nbg-bottle-kicker">Just bought</span>
  <span className="nbg-bottle-name">{spotlightProduct}</span>
  </span>
  </div>
  <div className="nbg-drag-hint">DRAG - SCROLL TO ZOOM</div>

  <div className={'nbg-toast ' + (toastOn && mode === 'orders' ? 'show' : '')}>
  <span className="nbg-toast-accent" style={{ background: flavorColor }} />
  <div className="nbg-toast-chip">{latest && <img src={latest.flavor.img} alt={latest.flavor.name} />}</div>
  <div>
  <div className="nbg-toast-tag">NEW ORDER</div>
  <div className="nbg-toast-city">{latest ? `${latest.city}, ${latest.region}` : ''}</div>
  <div className="nbg-toast-meta">
  <span className="nbg-toast-flavor" style={{ color: flavorColor }}>{latest ? latest.product : ''}</span>
  {latest ? ` - ${latest.flavor.tag}` : ''}
  </div>
  </div>
  </div>
  </div>
  </div>

  {recent.length > 0 && (
  <div className="nbg-ticker" aria-hidden="true">
  <span className="nbg-ticker-lab">Recently shipped</span>
  <div className="nbg-ticker-vp">
  <div className="nbg-ticker-track">
  {recent.concat(recent).map((o, i) => (
  <span className="nbg-ticker-item" key={i}>
  <span className="nbg-ti-dot" style={{ background: nbgColor(o.flavor.color) }} />
  {o.city}, {o.region}
  <span className="nbg-ti-flavor" style={{ color: nbgColor(o.flavor.color) }}>{o.product || o.flavor.name}</span>
  </span>
  ))}
  </div>
  </div>
  </div>
  )}
  </section>
  );
}

function MobileAppDock({ flavor, flavors }) {
  const [cartCount, setCartCount] = useState(() => (window.NB_CART ? window.NB_CART.getItemCount() : 0));

  useEffect(() => {
  const syncCart = () => setCartCount(window.NB_CART ? window.NB_CART.getItemCount() : 0);
  const unbindCart = window.NB_CART ? window.NB_CART.onChange(syncCart) : null;
  syncCart();
  return () => {
  if (unbindCart) unbindCart();
  };
  }, []);

  const active = flavors[flavor] || flavors.original;
  const goHash = (hash) => (event) => {
  event.preventDefault();
  const target = document.querySelector(hash);
  if (target) {
  const navOffset = window.matchMedia('(max-width: 768px)').matches ? 12 : 80;
  const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
  if (window.history && window.history.replaceState) window.history.replaceState(null, '', hash);
  };
  const openCart = () => window.dispatchEvent(new CustomEvent('nb-open-cart'));

  return (
  <nav className="nb-app-dock" aria-label="NoodleBomb mobile app navigation" style={{ '--dock-accent': active.color, '--dock-accent-rgb': active.rgb, '--dock-ink': active.ink }}>
  <a href="#main-content" onClick={goHash('#main-content')} className="nb-app-dock-item">
  <span className="nb-app-dock-icon" aria-hidden="true">N</span>
  <span>Home</span>
  </a>
  <a href="#bundle-builder" onClick={goHash('#bundle-builder')} className="nb-app-dock-item">
  <span className="nb-app-dock-icon" aria-hidden="true">+</span>
  <span>Build</span>
  </a>
  <a href="#monthly" onClick={goHash('#monthly')} className="nb-app-dock-item">
  <span className="nb-app-dock-icon" aria-hidden="true">$</span>
  <span>Box</span>
  </a>
  <a href="/recipes" className="nb-app-dock-item">
  <span className="nb-app-dock-icon" aria-hidden="true">R</span>
  <span>Recipes</span>
  </a>
  <button type="button" onClick={openCart} className="nb-app-dock-item nb-app-dock-button">
  <span className="nb-app-dock-icon" aria-hidden="true">C</span>
  <span>Cart</span>
  {cartCount > 0 && <span className="nb-app-dock-badge">{cartCount}</span>}
  </button>
  </nav>
  );
}

function StickyCartBar({ flavor, flavors }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
  const onScroll = () => {
  setVisible(window.scrollY > window.innerHeight * 0.85);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  return () => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  };
  }, []);
  const f = flavors[flavor] || flavors.original;
  const showBar = visible;
  const barName = `NoodleBomb ${f.name}`;
  const barPrice = `- ${f.price}`;
  const barHref = cartPermalink(flavor);
  const barCta = 'Add to Cart';
  return (
  <div
  className={'sticky-cart-bar' + (showBar ? ' visible' : '')}
  aria-hidden={!showBar}
  inert={!showBar ? '' : undefined}
  >
  <div className="scb-left">
  <span className="scb-dot" style={{ background: f.color }} />
  <span className="scb-name">{barName}</span>
  <span className="scb-price">{barPrice}</span>
  </div>
  <div className="scb-right">
  <a
  href={cartPermalink('trio')}
  className="scb-trio"
  tabIndex={showBar ? undefined : -1}
  >3-Pack - $29.99</a>
  <a
  href={barHref}
  className="scb-btn"
  tabIndex={showBar ? undefined : -1}
  >{barCta}</a>
  </div>
  </div>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FAQ - expandable Q&A above footer
function FAQ() {
  const [open, setOpen] = useState({});
  const toggle = (i) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  const items = [
  { q: 'How long does a bottle last?', a: 'It depends how you use it. The pour cap gives you control for bowls, wings, or mixing a quick marinade without over-pouring.' },
  { q: 'Does it need to be refrigerated?', a: 'Refrigerate after opening. Use within 6 months for peak flavor.' },
  { q: 'What can I put it on besides ramen?', a: 'Rice bowls, dumplings, stir-fry, eggs, roasted vegetables, wings, marinades. If it\u2019s savory, it probably works.' },
  { q: 'How spicy is Spicy Tokyo?', a: 'Medium heat - noticeable warmth, not a punishment. About a 5 out of 10.' },
  { q: 'When will my order ship?', a: 'Orders placed by 2pm PT ship the next business day from Bonney Lake, WA. Most US orders arrive in 3-5 days.' },
  { q: 'What\u2019s your return policy?', a: 'If you don\u2019t love it, email us within 30 days for a full refund. Keep the bottle.' },
  ];
  return (
  <section id="faq" style={{ background: 'var(--paper)', padding: '120px clamp(24px, 5.5vw, 80px)', borderTop: '1px solid var(--line)', scrollMarginTop: 80 }}>
  <div style={{ maxWidth: 880, margin: '0 auto' }}>
  <Reveal><div className="mono" style={{ color: 'var(--muted)', marginBottom: 16, letterSpacing: '0.18em' }}>FAQ</div></Reveal>
  <Reveal delay={1}>
  <h2 className="display" style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '-0.04em', lineHeight: 0.95, margin: '0 0 56px', fontWeight: 700 }}>
  Questions,<br /><span style={{ color: 'var(--muted)' }}>answered.</span>
  </h2>
  </Reveal>
  {items.map((it, i) => (
  <Reveal key={i} delay={Math.min(i + 2, 5)}>
  <div style={{ borderTop: '1px solid var(--line)' }}>
  <button
  type="button"
  onClick={() => toggle(i)}
  aria-expanded={!!open[i]}
  aria-controls={`faq-panel-${i}`}
  style={{
  width: '100%',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '22px 0', gap: 16,
  background: 'transparent', border: 0, color: 'inherit',
  cursor: 'pointer', textAlign: 'left', font: 'inherit',
  }}
  >
  <span style={{ fontFamily: 'Inter Tight', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>{it.q}</span>
  <span aria-hidden="true" style={{ fontFamily: 'Inter Tight', fontSize: 22, color: 'var(--muted)', flexShrink: 0, transition: 'transform .25s', transform: open[i] ? 'rotate(45deg)' : 'none' }}>+</span>
  </button>
  {open[i] && (
  <div id={`faq-panel-${i}`} style={{ paddingBottom: 22, fontFamily: 'Inter', fontSize: 15, color: 'var(--ink-60)', lineHeight: 1.6, maxWidth: '60ch' }}>{it.a}</div>
  )}
  </div>
  </Reveal>
  ))}
  <div style={{ borderTop: '1px solid var(--line)' }} />
  </div>
  </section>
  );
}


function BuildBundle() {
  const products = [
  {
  slug: 'original',
  name: 'Original',
  eyebrow: 'Base charge',
  role: 'Garlic, sesame, smooth soy depth.',
  price: FLAVORS.original.priceUsd,
  color: FLAVORS.original.color,
  rgb: FLAVORS.original.rgb,
  ink: FLAVORS.original.ink,
  image: FLAVOR_IMAGES.original,
  core: true,
  group: 'Pour sauces',
  groupNote: '7 fl oz bottles - eligible for Trio pricing',
  unit: '7 fl oz',
  trioEligible: true,
  imageAlt: 'NoodleBomb Original ramen sauce bottle'
  },
  {
  slug: 'spicy',
  name: 'Spicy Tokyo',
  eyebrow: 'Heat charge',
  role: 'Roasted chili for wings, rice, noodles, and late-night food.',
  price: FLAVORS.spicy.priceUsd,
  color: FLAVORS.spicy.color,
  rgb: FLAVORS.spicy.rgb,
  ink: FLAVORS.spicy.ink,
  image: FLAVOR_IMAGES.spicy,
  core: true,
  group: 'Pour sauces',
  groupNote: '7 fl oz bottles - eligible for Trio pricing',
  unit: '7 fl oz',
  trioEligible: true,
  imageAlt: 'NoodleBomb Spicy Tokyo ramen sauce bottle'
  },
  {
  slug: 'citrus',
  name: 'Citrus Shoyu',
  eyebrow: 'Bright charge',
  role: 'Clean citrus lift for dumplings, vegetables, seafood, and rich bowls.',
  price: FLAVORS.citrus.priceUsd,
  color: FLAVORS.citrus.color,
  rgb: FLAVORS.citrus.rgb,
  ink: FLAVORS.citrus.ink,
  image: FLAVOR_IMAGES.citrus,
  core: true,
  group: 'Pour sauces',
  groupNote: '7 fl oz bottles - eligible for Trio pricing',
  unit: '7 fl oz',
  trioEligible: true,
  imageAlt: 'NoodleBomb Citrus Shoyu ramen sauce bottle'
  },
  {
  slug: 'shoyu',
  name: 'Shoyu Reserve',
  eyebrow: 'Reserve soy',
  role: 'Slow-brewed premium soy sauce. Bold, clean finish.',
  price: 11.99,
  color: '#D7A84D',
  rgb: '215, 168, 77',
  ink: '#0E0D0C',
  image: 'uploads/nb-shoyu-reserve-front-cutout-v2-2026-06-07.webp',
  core: false,
  group: 'Soy sauces',
  groupNote: 'Reserve soy bottles - $11.99 each',
  unit: '7 fl oz',
  trioEligible: false,
  imageAlt: 'NoodleBomb Shoyu Reserve soy sauce bottle'
  },
  {
  slug: 'shoyuspicy',
  name: 'Spicy Shoyu',
  eyebrow: 'Reserve heat',
  role: 'Slow-brewed shoyu depth with a bold layer of heat.',
  price: 11.99,
  color: '#E84A3A',
  rgb: '232, 74, 58',
  ink: '#0E0D0C',
  image: 'uploads/nb-shoyu-spicy-front-cutout-2026-06-09.webp',
  core: false,
  group: 'Soy sauces',
  groupNote: 'Reserve soy bottles - $11.99 each',
  unit: '7 fl oz',
  trioEligible: false,
  imageAlt: 'NoodleBomb Spicy Shoyu soy sauce bottle'
  },
  {
  slug: 'firedust',
  name: 'Fire Dust',
  eyebrow: 'Shake spice',
  role: 'Korean chili garlic seasoning for ramen, rice, eggs, wings, and vegetables.',
  price: 10.99,
  color: '#E84A3A',
  rgb: '232, 74, 58',
  ink: '#0E0D0C',
  image: 'uploads/nb-fire-dust-front-cutout-2026-06-10.webp',
  core: false,
  group: 'Spices',
  groupNote: '3.2 oz Shake jars - $10.99 each',
  unit: '3.2 oz',
  trioEligible: false,
  imageAlt: 'NoodleBomb Fire Dust seasoning jar'
  },
  {
  slug: 'rgs',
  name: 'Roasted Garlic Sesame',
  eyebrow: 'Shake spice',
  role: 'Roasted garlic and sesame seasoning for bowls, eggs, rice, and vegetables.',
  price: 10.99,
  color: '#D4A24A',
  rgb: '212, 162, 74',
  ink: '#0E0D0C',
  image: 'uploads/nb-roasted-garlic-sesame-cutout-2026-06-22.webp',
  core: false,
  group: 'Spices',
  groupNote: '3.2 oz Shake jars - $10.99 each',
  unit: '3.2 oz',
  trioEligible: false,
  imageAlt: 'NoodleBomb Roasted Garlic Sesame seasoning jar'
  }
  ];

  const [quantities, setQuantities] = useState({
  original: 1,
  spicy: 1,
  citrus: 1,
  shoyu: 0,
  shoyuspicy: 0,
  firedust: 0,
  rgs: 0
  });
  const [added, setAdded] = useState(false);

  const totalItems = products.reduce((sum, p) => sum + (quantities[p.slug] || 0), 0);
  const trioEligibleProducts = products.filter((p) => p.trioEligible);
  const trioEligibleBottles = trioEligibleProducts.reduce((sum, p) => sum + (quantities[p.slug] || 0), 0);
  const trioSets = Math.floor(trioEligibleBottles / 3);
  const trioBottles = trioSets * 3;
  const compareTotal = products.reduce((sum, p) => sum + (quantities[p.slug] || 0) * p.price, 0);
  let discountedSlots = trioBottles;
  const discountedMix = [];
  const singles = products
  .map((product) => {
  const qty = quantities[product.slug] || 0;
  const discountedQty = product.trioEligible ? Math.min(qty, discountedSlots) : 0;
  if (product.trioEligible) discountedSlots -= discountedQty;
  if (discountedQty > 0) discountedMix.push(`${discountedQty}x ${product.name}`);
  return { ...product, qty: Math.max(0, qty - discountedQty) };
  })
  .filter((p) => p.qty > 0);
  const discountedMixLabel = discountedMix.join(' + ');
  const cartLines = [
  ...singles.map((p) => ({ slug: p.slug, name: p.name, price: p.price, qty: p.qty })),
  ...(trioSets > 0 ? [{
  slug: TRIO.slug,
  name: 'Trio Savings Bundle',
  price: TRIO.priceUsd,
  qty: trioSets,
  attributes: [
  { key: 'Bottle mix', value: discountedMixLabel },
  { key: 'Savings rule', value: 'Any 3 Pour bottles' }
  ]
  }] : [])
  ];
  const cartTotal = cartLines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const savings = Math.max(0, compareTotal - cartTotal);
  const activeProduct = [...products].reverse().find((p) => quantities[p.slug] > 0) || products[0];
  const remainderBottles = trioEligibleBottles % 3;
  const bottlesToNextTrio = trioEligibleBottles === 0 ? 3 : (remainderBottles === 0 ? 3 : 3 - remainderBottles);
  const power = Math.min(100, Math.round((totalItems / 12) * 100));

  const level = totalItems === 0
  ? 'Level 0'
  : totalItems === 1
  ? 'Level 1'
  : totalItems === 2
  ? 'Level 2'
  : trioSets >= 3
  ? 'Boss Level'
  : trioSets === 2
  ? 'Double Combo'
  : trioSets === 1
  ? 'Trio Combo'
  : 'Combo Hunt';
  const statusLine = totalItems === 0
  ? 'Tap + to start the meter.'
  : trioSets > 0
  ? `${trioSets} discounted Trio ${trioSets === 1 ? 'combo' : 'combos'} banked. ${bottlesToNextTrio === 3 ? 'Add 3 more Pour bottles to unlock another.' : `Add ${bottlesToNextTrio} more Pour bottle${bottlesToNextTrio === 1 ? '' : 's'} to unlock the next one.`}`
  : `Add ${bottlesToNextTrio} more Pour bottle${bottlesToNextTrio === 1 ? '' : 's'} to unlock Trio savings.`;
  const comboLine = trioSets > 0
  ? `${trioSets} Trio ${trioSets === 1 ? 'combo' : 'combos'} = ${trioBottles} bottles at bundle price`
  : 'Any 3 Pour bottles unlock the Trio price';
  const avgItemPrice = totalItems > 0 ? cartTotal / totalItems : 0;

  const updateQty = (slug, delta) => {
  setAdded(false);
  setQuantities((current) => ({
  ...current,
  [slug]: Math.max(0, Math.min(9, (current[slug] || 0) + delta))
  }));
  };

  const setFlavorQty = (slug, nextQty) => {
  setAdded(false);
  setQuantities((current) => ({
  ...current,
  [slug]: Math.max(0, Math.min(9, Math.floor(Number(nextQty) || 0)))
  }));
  };

  const addBundle = (e) => {
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
  if (e) {
  e.preventDefault();
  e.stopPropagation();
  }
  if (!totalItems) return;
  if (!window.NB_CART) {
  window.location.href = cartPermalink(fallbackSlug);
  return;
  }
  cartLines.forEach((line) => {
  window.NB_CART.add({ slug: line.slug, name: line.name, price: line.price, qty: line.qty });
  });
  setAdded(true);
  window.dispatchEvent(new CustomEvent('nb-open-cart'));
  window.setTimeout(() => setAdded(false), 1800);
  };

  const maxedOut = (slug) => quantities[slug] >= 9;
  const money = (n) => `$${n.toFixed(2)}`;
  const fallbackSlug = cartLines[0] ? cartLines[0].slug : 'trio';

  return (
  <section
  id="bundle-builder"
  className="bundle-section"
  style={{
  '--bundle-color': activeProduct.color,
  '--bundle-rgb': activeProduct.rgb,
  '--bundle-ink': activeProduct.ink,
  '--bundle-power': `${power}%`
  }}
  >
  <div className="bundle-scanline" aria-hidden="true" />
  <div className="bundle-shell">
  <Reveal>
  <div className="bundle-head">
  <div className="mono bundle-kicker">Build a Bundle</div>
  <h2 className="display">Power up your cart.</h2>
  <p>
  Tap + to stack bottles and spice jars like a loadout. Any 3 Pour bottles unlock Trio savings, and every item pushes the power meter higher.
  </p>
  <div className="bundle-savings-banner">
  <strong>Any 3 Pour bottles = Trio pricing</strong>
  <span>Mix sauces, soy, and spices. $3.50 flat US ship - FREE on $29.99+.</span>
  </div>
  </div>
  </Reveal>

  <div className="bundle-arena">
  <Reveal delay={1}>
  <div className="bundle-product-grid" aria-label="Build a NoodleBomb bundle">
  {products.map((product, index) => {
  const qty = quantities[product.slug];
  const isSelected = qty > 0;
  return (
  <React.Fragment key={product.slug}>
  {(index === 0 || product.group !== products[index - 1].group) && (
  <div className="bundle-group-title">
  <span>{product.group}</span>
  <small>{product.groupNote}</small>
  </div>
  )}
  <div
  className={`bundle-card bundle-card--${product.slug} ${isSelected ? 'is-selected' : ''}`}
  role="group"
  aria-label={`${product.name} quantity`}
  style={{ '--card-color': product.color, '--card-rgb': product.rgb, '--card-ink': product.ink }}
  >
  <span className="bundle-card-glow" aria-hidden="true" />
  <span className="bundle-card-top">
  <span className="mono">{product.eyebrow}</span>
  <span className="bundle-check">{qty ? `${qty}x` : '0'}</span>
  </span>
  <span className="bundle-bottle-slot">
  <img src={product.image} alt={product.imageAlt || `${product.name} product`} loading="lazy" />
  </span>
  <span className="bundle-card-copy">
  <strong>{product.name}</strong>
  <span>{product.role}</span>
  </span>
  <span className="bundle-price">{money(product.price)} <em>{product.unit}</em></span>
  <span className="bundle-qty-controls">
  <button
  type="button"
  className="bundle-qty-btn"
  onClick={() => updateQty(product.slug, -1)}
  disabled={qty === 0}
  aria-label={`Remove one ${product.name}`}
  >-</button>
  <input
  className="bundle-qty-count"
  type="number"
  inputMode="numeric"
  min="0"
  max="9"
  value={qty}
  onChange={(e) => setFlavorQty(product.slug, e.target.value)}
  aria-label={`${product.name} item count`}
  />
  <button
  type="button"
  className="bundle-qty-btn"
  onClick={() => updateQty(product.slug, 1)}
  disabled={maxedOut(product.slug)}
  aria-label={`Add one ${product.name}`}
  >+</button>
  </span>
  </div>
  </React.Fragment>
  );
  })}
  </div>
  </Reveal>

  <Reveal delay={2}>
  <div className="bundle-console" aria-live="polite">
  <div className="bundle-level-row">
  <span className="bundle-level">{level}</span>
  <span className="bundle-percent">{power}%</span>
  </div>
  <div className="bundle-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow={power} aria-label="Bundle power">
  <div className="bundle-meter-fill" />
  <div className="bundle-meter-sparks" />
  </div>
  <div className="bundle-status">{statusLine}</div>
  <div className="bundle-combo-line">{comboLine}</div>

  <div className="bundle-loadout">
  <div className="mono">Cart loadout</div>
  {cartLines.length ? cartLines.map((line) => (
  <div className="bundle-loadout-line" key={line.slug}>
  <span>{line.qty}x {line.name}</span>
  <strong>{money(line.price * line.qty)}</strong>
  </div>
  )) : (
  <div className="bundle-empty">No items selected.</div>
  )}
  </div>

  <div className="bundle-total">
  <div>
  <span>Total</span>
  <strong>{money(cartTotal)}</strong>
  </div>
  <div>
  <span>Savings</span>
  <strong>{savings > 0 ? money(savings) : '$0.00'}</strong>
  </div>
  <div>
  <span>Items</span>
  <strong>{totalItems}</strong>
  </div>
  <div>
  <span>Avg / item</span>
  <strong>{totalItems ? money(avgItemPrice) : '$0.00'}</strong>
  </div>
  </div>

  <a
  href={cartPermalink(fallbackSlug)}
  className={`bundle-add ${totalItems ? '' : 'is-disabled'} ${added ? 'is-added' : ''}`}
  onClick={addBundle}
  aria-disabled={!totalItems}
  >
  {added ? 'Added to cart' : `Add ${totalItems || 0} item${totalItems === 1 ? '' : 's'} - ${money(cartTotal)}`}
  </a>
  <div className="bundle-note">Any 3 Pour bottles unlock Trio savings. $3.50 flat US shipping - FREE on $29.99+ US orders. Priority $12 at checkout.</div>
  </div>
  </Reveal>
  </div>
  </div>
  </section>
  );
}


// THE DROP - Index 09. Spotlight-stage reserve section announcing the expanded
// line: Shoyu Reserve + Fire Dust. Ported from the
// "Reserve Section Final" design handoff. A spotlight auto-sweeps across the
// three bottles on a 4s timer; hovering/clicking a bottle or its card takes the
// light and pauses the sweep. Uses the production webp cutouts from /uploads.
const TDROP_MONO = "'Space Mono', 'JetBrains Mono', monospace";
const TDROP_DISP = "'Inter Tight', system-ui, sans-serif";
const TDROP_SERIF = "'Spectral', Georgia, serif";
const TDROP_PRODUCTS = [
  {
  key: 'classic', slug: 'shoyu', name: 'Shoyu Reserve', price: 11.99,
  glowRgb: '224,178,76', h: 252, glowInset: '2% -34% 4%',
  glowBg: 'radial-gradient(46% 44% at 50% 42%, rgba(224,178,76,0.30), rgba(224,178,76,0) 70%)',
  img: 'uploads/nb-shoyu-reserve-front-cutout-v2-2026-06-07.webp',
  alt: 'NoodleBomb Shoyu Reserve bottle',
  },
  {
  key: 'firedust-feature', slug: 'firedust', name: 'Fire Dust', price: 10.99,
  glowRgb: '232,74,58', h: 252, glowInset: '2% -34% 4%',
  glowBg: 'radial-gradient(46% 44% at 50% 42%, rgba(232,74,58,0.28), rgba(232,74,58,0) 70%)',
  img: 'uploads/nb-fire-dust-front-cutout-2026-06-10.webp',
  alt: 'NoodleBomb Fire Dust seasoning topper',
  },
  {
  key: 'rgs', slug: 'rgs', name: 'Roasted Garlic Sesame', price: 10.99,
  glowRgb: '212,162,74', h: 206, glowInset: '6% -26% 4%',
  glowBg: 'radial-gradient(50% 46% at 50% 48%, rgba(212,162,74,0.30), rgba(212,162,74,0) 70%)',
  img: 'uploads/nb-roasted-garlic-sesame-cutout-2026-06-22.webp',
  alt: 'NoodleBomb Roasted Garlic Sesame seasoning jar',
  },
];

const TDROP_CSS = `
.tdrop *{box-sizing:border-box;}
@keyframes tdropSway{0%,100%{transform:rotate(-1.6deg);}50%{transform:rotate(1.6deg);}}
@keyframes tdropFloat{0%{transform:translateY(0);}100%{transform:translateY(-14px);}}
@keyframes tdropMote{0%{opacity:0;transform:translateY(26px);}25%{opacity:0.9;}100%{opacity:0;transform:translateY(-150px);}}
.tdrop-slot{transition:opacity 500ms ease, filter 500ms ease, transform 500ms cubic-bezier(.2,.7,.2,1);transform-origin:bottom center;cursor:pointer;}
.tdrop-card{transition:transform 180ms cubic-bezier(.2,.7,.2,1), box-shadow 180ms ease, border-color 180ms ease;}
.tdrop-card--gold:hover{transform:translateY(-3px);box-shadow:0 32px 52px -20px rgba(0,0,0,0.75);border-color:rgba(224,178,76,0.3);}
.tdrop-card--chili:hover{transform:translateY(-3px);box-shadow:0 32px 52px -20px rgba(0,0,0,0.75);border-color:rgba(232,74,58,0.35);}
.tdrop-card--hero{transition:transform 180ms cubic-bezier(.2,.7,.2,1), box-shadow 180ms ease;}
.tdrop-card--hero:hover{transform:translateY(-3px);box-shadow:0 38px 60px -22px rgba(0,0,0,0.8), 0 0 80px -20px rgba(232,74,58,0.65);}
.tdrop-btn{transition:background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 120ms ease;}
.tdrop-btn:active{transform:scale(0.99) translateY(1px);}
.tdrop-btn--gold:hover{background:#1E170F;border-color:rgba(224,178,76,0.4);}
.tdrop-btn--chiliDark:hover{background:#1E170F;border-color:rgba(232,74,58,0.45);}
.tdrop-btn--chili:hover{background:linear-gradient(180deg,#F05545,#d4453a);box-shadow:0 0 56px -8px rgba(232,74,58,0.75);}
.tdrop-btn--cta:hover{background:linear-gradient(180deg,#EBC066,#D4A848);box-shadow:0 0 58px -10px rgba(224,178,76,0.7);}
@media (prefers-reduced-motion: reduce){.tdrop *{animation:none!important;}}
@media (max-width:760px){
  .tdrop-wrap{padding:64px 20px 80px!important;}
  .tdrop-header{flex-direction:column;align-items:flex-start!important;}
  .tdrop-h{font-size:clamp(32px,9vw,46px)!important;}
  .tdrop-specimens{grid-template-columns:1fr!important;}
  .tdrop-kanji{font-size:220px!important;}
  .tdrop-stage{min-height:300px!important;}
  .tdrop-strip{flex-direction:column;align-items:flex-start!important;}
  .tdrop-strip .tdrop-btn{margin-left:0!important;}
}
`;

function TheDropBottle({ p, anim }) {
  return (
  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', animation: anim, transformOrigin: 'bottom center' }}>
  <div aria-hidden="true" style={{ position: 'absolute', inset: p.glowInset, background: p.glowBg, filter: 'blur(14px)' }} />
  <img src={p.img} alt={p.alt} loading="lazy" decoding="async"
  style={{ position: 'relative', zIndex: 1, height: p.h, width: 'auto', display: 'block', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.5))' }} />
  </div>
  );
}

function TheDropMeter({ label, pct, kind }) {
  return (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
  <span style={{ font: `700 10px ${TDROP_MONO}`, letterSpacing: '0.14em', color: 'rgba(240,235,227,0.5)', width: 42 }}>{label}</span>
  <div style={{ flex: 1, height: 4, borderRadius: 999, background: '#261D14', overflow: 'hidden' }}>
  <i style={{ display: 'block', height: '100%', width: pct, background: kind === 'heat' ? 'linear-gradient(90deg,#b5352a,#E84A3A)' : 'linear-gradient(90deg,#8E6B2E,#E0B24C)' }} />
  </div>
  </div>
  );
}

function TheDrop() {
  const [sweep, setSweep] = useState(1);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // One 4s auto-sweep; pauses permanently once the shopper takes control.
  useEffect(() => {
  const timer = setInterval(() => {
  if (!pausedRef.current) setSweep((s) => (s + 1) % 3);
  }, 4000);
  return () => clearInterval(timer);
  }, []);

  // Load the two display fonts this section needs but the site doesn't ship globally.
  useEffect(() => {
  if (typeof document === 'undefined' || document.getElementById('tdrop-fonts')) return;
  const link = document.createElement('link');
  link.id = 'tdrop-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Spectral:ital,wght@1,500;1,600&display=swap';
  document.head.appendChild(link);
  }, []);

  const focus = (i) => () => { setSweep(i); setPaused(true); };
  const addOne = (p) => (e) => addAndOpenCart({ slug: p.slug, name: p.name, price: p.price, qty: 1 }, e);
  const addDrop = (e) => {
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
  if (e) e.preventDefault();
  if (!window.NB_CART) { window.location.href = '/cart?add=shoyu&qty=1'; return; }
  TDROP_PRODUCTS.forEach((p) => window.NB_CART.add({ slug: p.slug, name: p.name, price: p.price, qty: 1 }));
  window.dispatchEvent(new CustomEvent('nb-open-cart'));
  };

  const active = TDROP_PRODUCTS[sweep];
  const conePos = [16.6, 50, 83.3][sweep];

  const fleckDefs = [
  { left: '12%', bottom: '34%', size: 5, color: 'rgba(232,74,58,0.55)', dur: 4.2, delay: 0 },
  { left: '22%', bottom: '58%', size: 3, color: 'rgba(224,178,76,0.5)', dur: 5.1, delay: 0.8 },
  { left: '38%', bottom: '72%', size: 4, color: 'rgba(232,74,58,0.4)', dur: 4.6, delay: 1.6 },
  { left: '57%', bottom: '66%', size: 3, color: 'rgba(224,178,76,0.45)', dur: 5.4, delay: 0.4 },
  { left: '70%', bottom: '48%', size: 5, color: 'rgba(232,74,58,0.5)', dur: 4.0, delay: 1.2 },
  { left: '84%', bottom: '62%', size: 3, color: 'rgba(224,178,76,0.4)', dur: 5.8, delay: 2.0 },
  { left: '90%', bottom: '30%', size: 4, color: 'rgba(232,74,58,0.45)', dur: 4.8, delay: 0.6 },
  ];

  return (
  <section id="the-drop" className="tdrop tdrop-wrap" aria-label="The Drop - new releases"
  style={{
  fontFamily: TDROP_DISP, color: '#F0EBE3',
  backgroundColor: '#0E0D0C',
  backgroundImage: 'radial-gradient(58% 44% at 50% -6%, rgba(224,178,76,0.20), rgba(224,178,76,0) 70%), repeating-linear-gradient(90deg, rgba(240,235,227,0.012) 0 1px, transparent 1px 7px)',
  padding: '96px 48px 110px',
  }}>
  <style>{TDROP_CSS}</style>
  <div className="tdrop-inner" style={{ maxWidth: 1200, margin: '0 auto' }}>

  {/* section header */}
  <div className="tdrop-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 18 }}>
  <div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
  <span style={{ font: `700 12px ${TDROP_MONO}`, letterSpacing: '0.22em', color: '#E0B24C' }}>INDEX 09 - NEW DROP</span>
  <span style={{ font: `700 10px ${TDROP_MONO}`, letterSpacing: '0.14em', color: '#1A0806', background: 'linear-gradient(180deg,#E84A3A,#c93c2e)', padding: '5px 12px', borderRadius: 999 }}>JUST DROPPED</span>
  </div>
  <h2 className="tdrop-h" style={{ font: `800 clamp(40px,5vw,64px)/0.95 ${TDROP_DISP}`, letterSpacing: '-0.03em', margin: 0, background: 'linear-gradient(180deg,#FAF5EA 0%,#EBDDBE 38%,#C9A24E 58%,#F0E6CF 78%,#A8843C 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Heat joins the reserve.</h2>
  <h2 className="tdrop-h" style={{ font: `800 clamp(40px,5vw,64px)/0.95 ${TDROP_DISP}`, letterSpacing: '-0.03em', margin: 0, color: '#C9A24E' }}>The line just got bigger.</h2>
  </div>
  <p style={{ font: `400 16px/1.6 ${TDROP_DISP}`, color: 'rgba(240,235,227,0.6)', maxWidth: 360, margin: '0 0 6px' }}>Shoyu Reserve brings slow-brewed depth. Fire Dust brings the shake-on heat.</p>
  </div>

  {/* the stage - spotlight shelf */}
  <div className="tdrop-stage" style={{ position: 'relative', marginTop: 44, minHeight: 404 }}>
  <span className="tdrop-kanji" aria-hidden="true" style={{ position: 'absolute', zIndex: 0, bottom: -30, left: '50%', transform: 'translateX(-50%)', font: `600 380px/1 ${TDROP_SERIF}`, color: 'rgba(232,74,58,0.05)', pointerEvents: 'none', userSelect: 'none' }}>辛</span>

  {/* floating flecks */}
  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
  {fleckDefs.map((f, i) => (
  <span key={i} style={{ position: 'absolute', left: f.left, bottom: f.bottom, width: f.size, height: f.size, borderRadius: '50%', background: f.color, boxShadow: `0 0 ${f.size * 2}px ${f.color}`, animation: `tdropFloat ${f.dur}s ease-in-out ${f.delay}s infinite alternate` }} />
  ))}
  </div>

  {/* spotlight cone + dust motes (colored by active product) */}
  <div aria-hidden="true" style={{ position: 'absolute', zIndex: 1, top: -24, bottom: 0, left: `${conePos}%`, width: '42%', transform: 'translateX(-50%)', background: `radial-gradient(50% 86% at 50% 0%, rgba(${active.glowRgb},0.26), rgba(${active.glowRgb},0.05) 60%, transparent 78%)`, transition: 'left 600ms cubic-bezier(.2,.7,.2,1), background 600ms ease', pointerEvents: 'none' }}>
  {[0, 1, 2, 3].map((i) => (
  <span key={i} style={{ position: 'absolute', bottom: 46, left: `${32 + i * 12}%`, width: i % 2 ? 3 : 4, height: i % 2 ? 3 : 4, borderRadius: '50%', background: `rgba(${active.glowRgb},0.7)`, boxShadow: `0 0 8px rgba(${active.glowRgb},0.7)`, animation: `tdropMote ${3.6 + i * 0.9}s linear ${i * 1.1}s infinite` }} />
  ))}
  </div>

  {/* product row */}
  <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'end', minHeight: 404, paddingBottom: 16 }}>
  {TDROP_PRODUCTS.map((p, i) => {
  const isActive = i === sweep;
  const transform = isActive ? 'scale(1.1)' : `scale(0.94) rotate(${i < sweep ? '-3.5deg' : '3.5deg'})`;
  return (
  <div key={p.key} className="tdrop-slot" onMouseEnter={focus(i)} onClick={focus(i)} role="button" tabIndex={0}
  aria-label={`Spotlight ${p.name}`}
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focus(i)(); } }}
  style={{ display: 'flex', justifyContent: 'center', opacity: isActive ? 1 : 0.38, filter: isActive ? 'none' : 'saturate(0.5) brightness(0.7)', transform }}>
  <TheDropBottle p={p} anim={isActive ? 'tdropSway 4s ease-in-out infinite' : 'none'} />
  </div>
  );
  })}
  </div>

  {/* shelf line */}
  <div aria-hidden="true" style={{ position: 'absolute', left: '4%', right: '4%', bottom: 14, height: 2, background: 'linear-gradient(90deg,transparent,rgba(224,178,76,0.35) 18%,rgba(232,74,58,0.45) 50%,rgba(224,178,76,0.35) 82%,transparent)', boxShadow: '0 0 30px rgba(232,74,58,0.3)' }} />
  {/* floor marks */}
  <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
  {['01', '02', '03'].map((n) => (
  <span key={n} style={{ textAlign: 'center', font: `700 10px ${TDROP_MONO}`, letterSpacing: '0.3em', color: 'rgba(240,235,227,0.22)' }}>{n}</span>
  ))}
  </div>
  </div>

  {/* specimen cards */}
  <div className="tdrop-specimens" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 20, marginTop: 34, alignItems: 'start' }}>

  {/* NO.01 - Shoyu Reserve */}
  <div className="tdrop-card tdrop-card--gold" onMouseEnter={focus(0)}
  style={{ border: '1px solid rgba(240,235,227,0.10)', borderRadius: 14, background: 'linear-gradient(180deg,#1A140D,#120E09)', boxShadow: '0 24px 40px -20px rgba(0,0,0,0.6)', padding: '22px 24px' }}>
  <span style={{ font: `700 11px ${TDROP_MONO}`, letterSpacing: '0.18em', color: '#C9A24E' }}>NO.01 - THE ORIGINAL</span>
  <h3 style={{ font: `800 22px/1 ${TDROP_DISP}`, letterSpacing: '-0.02em', margin: '9px 0 5px', color: '#F0EBE3' }}>Shoyu Reserve.</h3>
  <p style={{ font: `400 13.5px/1.5 ${TDROP_DISP}`, color: 'rgba(240,235,227,0.6)', margin: '0 0 14px' }}>Slow-brewed depth. Bold, clean finish.</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
  <TheDropMeter label="UMAMI" pct="92%" kind="umami" />
  <TheDropMeter label="HEAT" pct="7%" kind="heat" />
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  <span style={{ font: `500 italic 21px ${TDROP_SERIF}`, color: '#F0EBE3' }}>$11.99</span>
  <button onClick={addOne(TDROP_PRODUCTS[0])} className="tdrop-btn tdrop-btn--gold" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', border: '1px solid rgba(240,235,227,0.14)', borderRadius: 999, background: '#14100B', color: '#F0EBE3', font: `700 11px ${TDROP_DISP}`, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Add</button>
  </div>
  </div>

  {/* NO.02 hero - Fire Dust */}
  <div className="tdrop-card tdrop-card--hero" onMouseEnter={focus(1)}
  style={{ position: 'relative', border: '1px solid rgba(232,74,58,0.45)', borderRadius: 14, background: 'linear-gradient(180deg,#1E120E,#140C0A)', boxShadow: '0 30px 50px -22px rgba(0,0,0,0.7), 0 0 60px -24px rgba(232,74,58,0.5)', padding: '24px 26px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span style={{ font: `700 11px ${TDROP_MONO}`, letterSpacing: '0.18em', color: '#E84A3A' }}>NO.02 - WANT HEAT</span>
  <span aria-hidden="true" style={{ font: `700 22px/1 ${TDROP_SERIF}`, color: 'rgba(232,74,58,0.6)' }}>辛</span>
  </div>
  <h3 style={{ font: `800 26px/1 ${TDROP_DISP}`, letterSpacing: '-0.02em', margin: '10px 0 5px', color: '#F0EBE3' }}>Fire Dust.</h3>
  <p style={{ font: `400 14px/1.5 ${TDROP_DISP}`, color: 'rgba(240,235,227,0.62)', margin: '0 0 14px' }}>Korean chili crunch seasoning for ramen, eggs, rice, wings, and vegetables.</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
  <TheDropMeter label="UMAMI" pct="88%" kind="umami" />
  <TheDropMeter label="HEAT" pct="74%" kind="heat" />
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  <span style={{ font: `500 italic 23px ${TDROP_SERIF}`, color: '#F0EBE3' }}>$10.99</span>
  <span style={{ font: `700 10px ${TDROP_MONO}`, letterSpacing: '0.14em', color: 'rgba(240,235,227,0.4)' }}>3.2 OZ</span>
  <button onClick={addOne(TDROP_PRODUCTS[1])} className="tdrop-btn tdrop-btn--chili" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', border: 'none', borderRadius: 999, background: 'linear-gradient(180deg,#E84A3A,#c93c2e)', color: '#fff', font: `700 12px ${TDROP_DISP}`, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 40px -10px rgba(232,74,58,0.6)' }}>Add</button>
  </div>
  </div>

  {/* NO.03 - Roasted Garlic Sesame */}
  <div className="tdrop-card tdrop-card--chili" onMouseEnter={focus(2)}
  style={{ border: '1px solid rgba(240,235,227,0.10)', borderRadius: 14, background: 'linear-gradient(180deg,#1A140D,#120E09)', boxShadow: '0 24px 40px -20px rgba(0,0,0,0.6)', padding: '22px 24px' }}>
  <span style={{ font: `700 11px ${TDROP_MONO}`, letterSpacing: '0.18em', color: '#E0B24C' }}>NO.03 - SAVORY CRUNCH</span>
  <h3 style={{ font: `800 22px/1 ${TDROP_DISP}`, letterSpacing: '-0.02em', margin: '9px 0 5px', color: '#F0EBE3' }}>Roasted Garlic Sesame.</h3>
  <p style={{ font: `400 13.5px/1.5 ${TDROP_DISP}`, color: 'rgba(240,235,227,0.6)', margin: '0 0 14px' }}>Roasted garlic and sesame seasoning for bowls, eggs, rice, and vegetables.</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
  <TheDropMeter label="UMAMI" pct="80%" kind="umami" />
  <TheDropMeter label="HEAT" pct="62%" kind="heat" />
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  <span style={{ font: `500 italic 21px ${TDROP_SERIF}`, color: '#F0EBE3' }}>$10.99</span>
  <span style={{ font: `700 10px ${TDROP_MONO}`, letterSpacing: '0.14em', color: 'rgba(240,235,227,0.4)' }}>3.2 OZ</span>
  <button onClick={addOne(TDROP_PRODUCTS[2])} className="tdrop-btn tdrop-btn--chiliDark" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', border: '1px solid rgba(240,235,227,0.14)', borderRadius: 999, background: '#14100B', color: '#F0EBE3', font: `700 11px ${TDROP_DISP}`, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Add</button>
  </div>
  </div>
  </div>

  {/* full-drop bundle strip */}
  <div className="tdrop-strip" style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', border: '1px solid rgba(201,162,78,0.35)', borderRadius: 14, padding: '18px 26px', background: 'linear-gradient(90deg,rgba(224,178,76,0.10),rgba(20,16,11,0.3))' }}>
  <span style={{ font: `700 12px ${TDROP_MONO}`, letterSpacing: '0.2em', color: '#E0B24C' }}>GET THE FULL DROP</span>
  <span style={{ font: `400 14px ${TDROP_DISP}`, color: 'rgba(240,235,227,0.65)' }}>Shoyu Reserve + Fire Dust + Roasted Garlic Sesame - <span style={{ color: '#F0EBE3', fontWeight: 600 }}>$29.99</span> <span style={{ textDecoration: 'line-through', color: 'rgba(240,235,227,0.4)' }}>$33.97</span> - ships free.</span>
  <button onClick={addDrop} className="tdrop-btn tdrop-btn--cta" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 26px', border: 'none', borderRadius: 999, background: 'linear-gradient(180deg,#E0B24C,#C99A3F)', color: '#1A1206', font: `700 12px ${TDROP_DISP}`, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 44px -12px rgba(224,178,76,0.55)' }}>Add the drop</button>
  </div>

  </div>
  </section>
  );
}

function App() {
  const DEFAULTS = /*EDITMODE-BEGIN*/{
  "flavor": "original",
  "grain": true,
  "spam": false,
  "headline": "TRY ALL 3\nFLAVORS"
  } /*EDITMODE-END*/;

  const [state, setState] = useState(DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [inquiry, setInquiry] = useState(null); // null | 'wholesale' | 'contact'
  const [showDeferredHome, setShowDeferredHome] = useState(false);

  // Dev-mode gate: only enable Tweaks panel + spam banner + parent postMessage hooks
  // when running on localhost or with ?dev=1 in URL. Keeps these out of production traffic.
  const IS_DEV_MODE = (() => {
  if (typeof window === 'undefined') return false;
  if (window.location.search.includes('dev=1')) return true;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.lovable.dev') || h.endsWith('.lovable.app');
  })();

  // Expose modal opener globally so footer/anchor clicks can trigger it
  useEffect(() => {
  window.NB_OPEN_INQUIRY = (kind) => setInquiry(kind);
  const onClick = (e) => {
  const link = e.target.closest && e.target.closest('a[href="#open-contact"], a[href="#open-wholesale"]');
  if (!link) return;
  e.preventDefault();
  setInquiry(link.getAttribute('href') === '#open-wholesale' ? 'wholesale' : 'contact');
  };
  document.addEventListener('click', onClick);
  return () => {
  document.removeEventListener('click', onClick);
  delete window.NB_OPEN_INQUIRY;
  };
  }, []);

  // Honor ?flavor=X on initial load - used by the empty-cart recommendations
  // (cart.jsx links to "/?flavor=spicy#lineup") so the homepage reflects the
  // flavor the user clicked through to instead of defaulting to original.
  useEffect(() => {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('flavor');
  if (requested && FLAVORS[requested]) {
  setState((s) => ({ ...s, flavor: requested }));
  }
  }, []);
  const set = (patch) => {
  setState((s) => {
  const next = { ...s, ...patch };
  if (IS_DEV_MODE) {
  try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*'); } catch (_) {}
  }
  return next;
  });
  };

  // Lenis smooth scroll - DISABLED 2026-05-03.
  // Lenis sets `overflow: hidden auto` on <html>, which breaks `position: sticky`
  // on FlavorBreakdown (Index 02) and UseItOn / Range (Index 03). When sticky
  // fails, the pinned content scrolls off-screen and the user sees a black/blank
  // section background - exactly the "scrolls into black screen" bug Mike flagged.
  // Native scroll works fine; smooth-scroll polish isn't worth the regression.
  useEffect(() => {
  // Explicitly remove any Lenis-set overflow if the script loaded before this
  // effect ran (defense-in-depth, since the Lenis script tag is still in HTML).
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.documentElement.classList.remove('lenis-smooth', 'lenis-scrolling');
  }, []);

  useEffect(() => {
  if (typeof window === 'undefined') return undefined;
  let attempts = 0;
  let timer = 0;
  const scrollToMapHash = () => {
  if (!['#order-map', '#stores'].includes(window.location.hash)) return;
  const target = document.getElementById('order-map');
  if (target) {
  target.scrollIntoView({ behavior: attempts > 0 ? 'smooth' : 'auto', block: 'start' });
  return;
  }
  if (attempts < 12) {
  attempts += 1;
  timer = window.setTimeout(scrollToMapHash, 250);
  }
  };
  scrollToMapHash();
  window.addEventListener('hashchange', scrollToMapHash);
  return () => {
  window.clearTimeout(timer);
  window.removeEventListener('hashchange', scrollToMapHash);
  };
  }, []);

  // Accent color swap
  useEffect(() => {
  const f = FLAVORS[state.flavor];
  const root = document.documentElement;
  const body = document.body;
  root.dataset.flavor = state.flavor;
  body.dataset.flavor = state.flavor;
  document.documentElement.style.setProperty('--accent', f.color);
  document.documentElement.style.setProperty('--accent-ink', f.ink);
  document.documentElement.style.setProperty('--accent-rgb', f.rgb);
  document.documentElement.style.setProperty('--accent-deep', f.deep);
  document.documentElement.style.setProperty('--accent-soft', `rgba(${f.rgb}, 0.24)`);
  document.documentElement.style.setProperty('--accent-glow', `rgba(${f.rgb}, 0.62)`);
  body.classList.remove('flavor-shift');
  window.requestAnimationFrame(() => body.classList.add('flavor-shift'));
  const timer = window.setTimeout(() => body.classList.remove('flavor-shift'), 760);
  return () => window.clearTimeout(timer);
  }, [state.flavor]);

  // Grain
  useEffect(() => {
  document.body.classList.toggle('grain', state.grain);
  }, [state.grain]);

  // Keep first paint focused on the shopping-critical top of the homepage.
  // Lower-page proof/content still appears shortly after idle or immediately
  // when the shopper scrolls/taps/uses the keyboard.
  useEffect(() => {
  if (showDeferredHome || typeof window === 'undefined') return undefined;
  var done = false;
  var timer = 0;
  var idleId = 0;
  var reveal = function () {
  if (done) return;
  done = true;
  setShowDeferredHome(true);
  };
  window.addEventListener('scroll', reveal, { once: true, passive: true });
  window.addEventListener('pointerdown', reveal, { once: true, passive: true });
  window.addEventListener('keydown', reveal, { once: true });
  if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(reveal, { timeout: 2200 });
  else timer = window.setTimeout(reveal, 1800);
  return function () {
  window.removeEventListener('scroll', reveal);
  window.removeEventListener('pointerdown', reveal);
  window.removeEventListener('keydown', reveal);
  window.clearTimeout(timer);
  if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
  };
  }, [showDeferredHome]);

  // Edit mode messaging - DEV ONLY (gated by IS_DEV_MODE so prod traffic gets no postMessage hooks)
  useEffect(() => {
  if (!IS_DEV_MODE) return;
  const onMsg = (e) => {
  if (!e.data || !e.data.type) return;
  if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
  if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
  };
  window.addEventListener('message', onMsg);
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (_) {}
  return () => window.removeEventListener('message', onMsg);
  }, [IS_DEV_MODE]);

  const headline = (state.headline || '').replace(/\\n/g, '\n');

  return (
  <>
  {IS_DEV_MODE && state.spam && <div className="spam-banner">! LIMITED TIME!!! 50% OFF - HURRY - ONLY 3 LEFT!!! !</div>}
  <StickyCartBar flavor={state.flavor} flavors={FLAVORS} />
  <Nav flavor={state.flavor} setFlavor={(k) => set({ flavor: k })} flavors={FLAVORS} />
  <MobileAppDock flavor={state.flavor} flavors={FLAVORS} />
  <Hero headline={headline} bottleSrc={FLAVOR_IMAGES[state.flavor]} flavorKey={state.flavor} flavorMeta={FLAVORS[state.flavor]} />
  <TrustStrip />
  <FlavorBreakdownV2 flavor={state.flavor} setFlavor={(k) => set({ flavor: k })} />
  <BuildBundle />
  {showDeferredHome && (
  <>
  <OrderMapSection />
  <MonthlyDrop />
  <Testimonials />
  <UseItOn />
  <FAQ />
  <FinalCTA />
  </>
  )}
  {IS_DEV_MODE && <Tweaks state={state} set={set} open={tweaksOpen} setOpen={setTweaksOpen} />}
  <InquiryModal open={!!inquiry} kind={inquiry} onClose={() => setInquiry(null)} />
  </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

