// Reconstructed 2026-07-01 from the live compiled bundle (/build/cart.js on noodlebomb.co).
// The original JSX source lives only in the deploy tree; this file is the compiled
// equivalent (plain JS, no JSX sugar) and re-builds byte-stable through esbuild.
const { useEffect, useState, useMemo } = React;
const NB_SITE_URLS = {
  original: "https://noodlebomb.co/original-ramen-sauce",
  citrus: "https://noodlebomb.co/citrus-shoyu-ramen-sauce",
  spicy: "https://noodlebomb.co/spicy-tokyo-ramen-sauce",
  shoyu: "https://nu2vqa-ma.myshopify.com/products/shoyu-reserve",
  shoyuspicy: "https://noodlebomb.co/spicy-shoyu-ramen-sauce",
  rgs: "https://noodlebomb.co/roasted-garlic-sesame",
  trio: "https://noodlebomb.co/#lineup",
  firedust: "https://noodlebomb.co/fire-dust",
  cart: "https://noodlebomb.co/cart.html",
  shop: "https://noodlebomb.co/#lineup"
};
const SHOPIFY_VARIANT_IDS = {
  original: "53998041596214",
  citrus: "53998041071926",
  spicy: "53998042120502",
  trio: "53998042644790",
  shoyu: "54006619636022",
  shoyuspicy: "54097354686774",
  firedust: "54111262146870",
  rgs: "54125810614582"
};
const getShopifyCartPermalink = (items) => {
  const lines = (items || []).map((it) => {
    const id = SHOPIFY_VARIANT_IDS[it.slug];
    const qty = Math.max(1, Math.floor(it.qty || 1));
    return id ? `${id}:${qty}` : null;
  }).filter(Boolean);
  return lines.length ? `https://nu2vqa-ma.myshopify.com/cart/${lines.join(",")}` : NB_SITE_URLS.shop;
};
const getCheckoutUrl = (items) => {
  if (!items || items.length === 0) return NB_SITE_URLS.shop;
  return getShopifyCartPermalink(items);
};
const FREE_SHIPPING = window.NB_CART && window.NB_CART.FREE_SHIPPING_THRESHOLD || 32.99;
const hasFreeShippingTrio = (items) => (items || []).some((i) => i.slug === "trio" && (Number(i.qty) || 0) > 0);
const getBottleCount = (items) => (items || []).reduce((n, i) => n + (i.slug === "trio" ? 3 : 1) * (Number(i.qty) || 0), 0);
const FLAT_SHIPPING = 3.5;
const TRIO = { slug: "trio", name: "The NoodleBomb Trio", priceUsd: 32.99 };
const FIRE_DUST = { slug: "firedust", name: "NoodleBomb Fire Dust", label: "Fire Dust", price: 10.99, tag: "Korean chili crunch \xB7 3.2 oz topper" };
const RITUAL_KIT = {
  name: "Ramen Ritual Kit",
  tag: "The full set \u2014 all 3 sauces + Fire Dust topper",
  components: [
    { slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd },
    { slug: FIRE_DUST.slug, name: FIRE_DUST.name, price: FIRE_DUST.price }
  ]
};
const RITUAL_KIT_TOTAL = RITUAL_KIT.components.reduce((s, c) => s + c.price, 0);
const PRODUCT_IMAGES = {
  original: "uploads/nb-original-front-cutout-2026-06-26.webp",
  spicy: "uploads/nb-spicy-tokyo-cutout-2026-06-22.webp",
  citrus: "uploads/nb-citrus-cutout-2026-06-22.webp",
  trio: "uploads/noodlebomb-trio.png",
  shoyu: "uploads/nb-shoyu-reserve-cutout-2026-06-22.webp",
  shoyuspicy: "uploads/nb-shoyu-spicy-front-cutout-2026-06-09.webp",
  firedust: "uploads/nb-fire-dust-front-cutout-2026-06-10-thumb.webp",
  rgs: "uploads/nb-roasted-garlic-sesame-cutout-2026-06-22.webp"
};
const PRODUCT_LABELS = {
  original: { tag: "No.01", tagline: "Garlic & Sesame" },
  spicy: { tag: "No.03", tagline: "Spicy Tokyo" },
  citrus: { tag: "No.02", tagline: "Citrus Shoyu" },
  trio: { tag: "3-Pack", tagline: "The Trio" },
  shoyu: { tag: "Reserve", tagline: "Shoyu Reserve" },
  shoyuspicy: { tag: "Reserve", tagline: "Spicy Shoyu" },
  firedust: { tag: "Shake-On", tagline: "Fire Dust" },
  rgs: { tag: "Shake-On", tagline: "Roasted Garlic Sesame" }
};
const RECS = [
  { slug: "original", name: "Original", tag: "No.01 \xB7 Garlic & Sesame", price: 12.99 },
  { slug: "spicy", name: "Spicy Tokyo", tag: "No.03 \xB7 Spicy Tokyo", price: 12.99 },
  { slug: "citrus", name: "Citrus Shoyu", tag: "No.02 \xB7 Citrus Shoyu", price: 12.99 }
];
const fmtUSD = (n) => "$" + (Number(n) || 0).toFixed(2);
const isoDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const lineKey = (item, index) => `${item.slug}-${index}-${JSON.stringify(item.attributes || [])}`;
const bottleMix = (item) => {
  var _a;
  return (_a = (item.attributes || []).find((attr) => attr.key === "Bottle mix")) == null ? void 0 : _a.value;
};
const Truck = (props) => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("rect", { x: "1", y: "3", width: "15", height: "13" }), /* @__PURE__ */ React.createElement("path", { d: "M16 8h4l3 5v3h-7" }), /* @__PURE__ */ React.createElement("circle", { cx: "5.5", cy: "18.5", r: "2.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "18.5", cy: "18.5", r: "2.5" }));
const Trash = (props) => /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ React.createElement("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }));
const Shield = (props) => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }));
const Repeat = (props) => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("polyline", { points: "17 1 21 5 17 9" }), /* @__PURE__ */ React.createElement("path", { d: "M3 11V9a4 4 0 0 1 4-4h14" }), /* @__PURE__ */ React.createElement("polyline", { points: "7 23 3 19 7 15" }), /* @__PURE__ */ React.createElement("path", { d: "M21 13v2a4 4 0 0 1-4 4H3" }));
const Check = (props) => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }));
function RitualKitCard({ items, variant }) {
  const inCart = (slug) => (items || []).some((i) => i.slug === slug);
  const missing = RITUAL_KIT.components.filter((c) => !inCart(c.slug));
  if (missing.length === 0) return null;
  const addKit = () => {
    if (!window.NB_CART) return;
    missing.forEach((c) => window.NB_CART.add({ slug: c.slug, name: c.name, price: c.price }));
    const detail = { components: missing.map((c) => c.slug), total: RITUAL_KIT_TOTAL };
    try {
      window.dispatchEvent(new CustomEvent("nb_add_ritual_kit", { detail }));
    } catch (_) {
    }
    try {
      window.fbq && window.fbq("trackCustom", "AddRamenRitualKit", detail);
    } catch (_) {
    }
    try {
      window.dataLayer && window.dataLayer.push({ event: "add_ritual_kit", ...detail });
    } catch (_) {
    }
  };
  const isFeature = variant === "feature";
  const cta = missing.length === RITUAL_KIT.components.length ? "Add the Kit" : "Complete the Kit";
  return /* @__PURE__ */ React.createElement("div", { className: "card cart-ritual-kit", style: {
    marginTop: isFeature ? 28 : 0,
    marginBottom: isFeature ? 0 : 24,
    textAlign: "left",
    border: "1px solid var(--accent)",
    background: "linear-gradient(180deg, rgba(232,74,58,0.10) 0%, rgba(232,74,58,0.03) 100%)",
    padding: 20
  } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { color: "var(--accent)", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, marginBottom: 12 } }, "COMPLETE THE SET \xB7 BEST VALUE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 54, height: 54, background: "var(--paper-3)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 } }, /* @__PURE__ */ React.createElement("img", { src: PRODUCT_IMAGES.trio, alt: "The NoodleBomb Trio", loading: "lazy", style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } })), /* @__PURE__ */ React.createElement("div", { style: { width: 54, height: 54, background: "var(--paper-3)", border: "1px solid var(--line)", borderLeft: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 4 } }, /* @__PURE__ */ React.createElement("img", { src: PRODUCT_IMAGES.firedust, alt: "NoodleBomb Fire Dust seasoning topper", loading: "lazy", style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter Tight", fontWeight: 800, fontSize: 18, color: "var(--ink)", lineHeight: 1.15 } }, RITUAL_KIT.name), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter", fontSize: 12.5, color: "var(--ink-60)", lineHeight: 1.5, marginTop: 3 } }, RITUAL_KIT.tag))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "Inter Tight", fontWeight: 800, fontSize: 22, color: "var(--accent)", fontVariantNumeric: "tabular-nums" } }, fmtUSD(RITUAL_KIT_TOTAL)), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.13em", color: "var(--ink-40)", textTransform: "uppercase" } }, "3 sauces + topper")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: addKit,
      "aria-label": "Add the Ramen Ritual Kit to cart for " + fmtUSD(RITUAL_KIT_TOTAL),
      style: {
        flexShrink: 0,
        padding: "13px 26px",
        borderRadius: 999,
        background: "var(--accent)",
        color: "var(--accent-ink)",
        border: 0,
        fontFamily: "Inter Tight, sans-serif",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
        lineHeight: 1,
        transition: "transform .2s, box-shadow .2s"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(232,74,58,0.28)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "none";
      }
    },
    cta,
    " \u2192"
  )));
}
const FIRST_BOX_50_URL = "https://nu2vqa-ma.myshopify.com/discount/FIRSTBOX50?redirect=/cart/add?id=54099648545078%26quantity=1%26selling_plan=8721727798";
function BowlClubUpsell({ item }) {
  const sourceName = item && item.name ? item.name : "your sauce";
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    border: "1px solid rgba(212,162,74,0.85)",
    background: "linear-gradient(135deg, rgba(212,162,74,0.16) 0%, rgba(232,74,58,0.08) 48%, rgba(13,11,9,0.94) 100%)",
    padding: 22,
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 58,
    height: 58,
    borderRadius: 999,
    flexShrink: 0,
    background: "rgba(212,162,74,0.18)",
    border: "1px solid rgba(212,162,74,0.55)",
    color: "var(--gold)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter Tight",
    fontSize: 19,
    fontWeight: 800,
    letterSpacing: "0.08em"
  } }, "50%"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { color: "var(--accent)", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, marginBottom: 5 } }, "RAMEN NIGHT UPGRADE"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter Tight", fontWeight: 800, fontSize: 18, color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.02em" } }, "Turn ", sourceName, " into a full ramen night."), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter", fontSize: 12.5, color: "var(--ink-60)", lineHeight: 1.55 } }, "Your first Monthly Ramen Box includes premium ramen, a recipe idea, and another full 7 oz NoodleBomb sauce bottle. Use FIRSTBOX50 for 50% off the first box; renews monthly unless skipped or canceled.")), /* @__PURE__ */ React.createElement("a", {
    href: FIRST_BOX_50_URL,
    target: "_blank",
    rel: "noopener",
    onClick: () => {
      try {
        window.fbq && window.fbq("trackCustom", "BowlClubUpsellClick", { source: "cart_one_bottle", code: "FIRSTBOX50" });
      } catch (_) {
      }
      try {
        window.dataLayer && window.dataLayer.push({ event: "bowl_club_upsell_click", source: "cart_one_bottle", code: "FIRSTBOX50" });
      } catch (_) {
      }
    },
    style: {
      flexShrink: 0,
      padding: "12px 18px",
      borderRadius: 999,
      background: "var(--accent)",
      color: "var(--accent-ink)",
      textDecoration: "none",
      fontFamily: "Inter Tight, sans-serif",
      fontSize: 13,
      fontWeight: 800,
      letterSpacing: "0.13em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      boxShadow: "0 12px 28px rgba(232,74,58,0.22)"
    }
  }, "Get first box 50% off"));
}
function CartPage() {
  const [items, setItems] = useState(() => window.NB_CART ? window.NB_CART.getItems() : []);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const onCheckoutClick = (e) => {
    if (checkoutLoading) {
      e.preventDefault();
      return;
    }
    if (window.NB_SHOPIFY_CHECKOUT && window.NB_SHOPIFY_CHECKOUT.isEnabled()) {
      setCheckoutLoading(true);
      window.NB_SHOPIFY_CHECKOUT.handleCheckoutClick(items, e, getCheckoutUrl(items)).finally(() => setCheckoutLoading(false));
    }
  };
  useEffect(() => {
    if (!window.NB_CART) return;
    return window.NB_CART.onChange(() => setItems(window.NB_CART.getItems()));
  }, []);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const hasTrio = hasFreeShippingTrio(items);
  const bottleCount = getBottleCount(items);
  const freeShipping = subtotal >= FREE_SHIPPING;
  const remaining = freeShipping ? 0 : Math.max(FREE_SHIPPING - subtotal, 0);
  const progress = freeShipping ? 100 : Math.min(subtotal / FREE_SHIPPING * 100, 100);
  const delivery = useMemo(() => {
    const a = /* @__PURE__ */ new Date();
    a.setDate(a.getDate() + 5);
    const b = /* @__PURE__ */ new Date();
    b.setDate(b.getDate() + 7);
    return isoDate(a) + " \u2013 " + isoDate(b);
  }, []);
  const recsToShow = RECS.filter((r) => !items.some((i) => i.slug === r.slug)).slice(0, 3);
  const setQty = (item, qty) => window.NB_CART && window.NB_CART.setQty(item.slug, qty, item.attributes);
  const remove = (item) => window.NB_CART && window.NB_CART.remove(item.slug, item.attributes);
  const addRec = (rec) => window.NB_CART && window.NB_CART.add({ slug: rec.slug, name: rec.name, price: rec.price });
  const hasTrioInCart = items.some((i) => i.slug === "trio");
  const hasFireDustInCart = items.some((i) => i.slug === FIRE_DUST.slug);
  const oneBottleUpsellSlugs = ["original", "spicy", "citrus", "shoyu", "shoyuspicy"];
  const singleBottleItem = items.length === 1 ? items[0] : null;
  const showBowlClubUpsell = !!singleBottleItem && oneBottleUpsellSlugs.includes(singleBottleItem.slug) && Number(singleBottleItem.qty) === 1 && !hasTrioInCart;
  const trioSingleSlugs = ["original", "spicy", "citrus"];
  const trioSingleCount = items.filter((i) => trioSingleSlugs.includes(i.slug)).reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
  const showTrioUpsell = !showBowlClubUpsell && !hasTrioInCart && trioSingleCount >= 1 && trioSingleCount <= 2;
  const showRitualKit = !hasTrioInCart && !hasFireDustInCart && !showTrioUpsell;
  const showFireDustUpsell = !hasFireDustInCart && !showRitualKit;
  if (itemCount === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "empty" }, /* @__PURE__ */ React.createElement("a", { className: "crumb", href: "/" }, "\u2190 Back to site"), /* @__PURE__ */ React.createElement("div", { className: "empty-mark" }, /* @__PURE__ */ React.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "21", r: "1" }), /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "21", r: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" }))), /* @__PURE__ */ React.createElement("h1", null, "Your cart is ", /* @__PURE__ */ React.createElement("em", null, "empty.")), /* @__PURE__ */ React.createElement("p", null, "Start with one bottle, or grab the Trio and taste the full range."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (window.NB_CART) window.NB_CART.add({ slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd });
        },
        className: "btn",
        style: { width: "auto", display: "inline-flex", padding: "14px 32px", cursor: "pointer", border: 0 }
      },
      "Add the Trio \u2014 ",
      fmtUSD(TRIO.priceUsd)
    ), /* @__PURE__ */ React.createElement("a", { className: "btn btn-secondary", href: "/#lineup", style: { width: "auto", display: "inline-flex", padding: "14px 32px" } }, "Shop the lineup \u2192")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 11, color: "var(--ink-40)", fontFamily: "JetBrains Mono", letterSpacing: "0.16em", textTransform: "uppercase" } }, "All 3 flavors \xB7 save $8.98"), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 520, margin: "28px auto 0" } }, /* @__PURE__ */ React.createElement(RitualKitCard, { items, variant: "feature" })), /* @__PURE__ */ React.createElement("div", { className: "recommendations" }, RECS.map((r) => /* @__PURE__ */ React.createElement("a", { key: r.slug, className: "rec-card", href: "/?flavor=" + r.slug + "#lineup" }, /* @__PURE__ */ React.createElement("div", { className: "img-wrap" }, /* @__PURE__ */ React.createElement("img", { src: PRODUCT_IMAGES[r.slug], alt: "NoodleBomb " + r.name + " ramen sauce" })), /* @__PURE__ */ React.createElement("h3", null, r.name), /* @__PURE__ */ React.createElement("div", { className: "tag" }, r.tag), /* @__PURE__ */ React.createElement("div", { className: "price-row" }, /* @__PURE__ */ React.createElement("span", { className: "price" }, fmtUSD(r.price)), /* @__PURE__ */ React.createElement("span", { className: "arrow" }, "View \u2192"))))));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", { className: "crumb", href: "/#lineup" }, "\u2190 Continue shopping"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("h1", { className: "page-title" }, "Your ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)", fontFamily: "Inter Tight", fontStyle: "normal", fontWeight: 800 } }, "cart."))), /* @__PURE__ */ React.createElement("p", { className: "page-meta" }, itemCount, " ", itemCount === 1 ? "item" : "items", " \xB7 secure checkout opens on Shopify"), /* @__PURE__ */ React.createElement("div", { className: "layout" }, /* @__PURE__ */ React.createElement("div", null, freeShipping ? /* @__PURE__ */ React.createElement("div", { className: "card ship-bar unlocked" }, /* @__PURE__ */ React.createElement("div", { className: "icon" }, /* @__PURE__ */ React.createElement(Truck, null)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter Tight", fontWeight: 700, fontSize: 14, color: "var(--ink)" } }, "\u2713 Free US shipping included"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--ink-40)", fontSize: 12, marginTop: 2 } }, "Your cart crossed the $32.99 free-shipping line."))) : /* @__PURE__ */ React.createElement("div", { className: "card ship-bar" }, /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-60)" } }, "Add ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, fmtUSD(remaining)), " for ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink)" } }, "FREE US shipping"), " \xB7 else $3.50 flat"), /* @__PURE__ */ React.createElement(Truck, null)), /* @__PURE__ */ React.createElement("div", { className: "track" }, /* @__PURE__ */ React.createElement("div", { className: "fill", style: { width: progress + "%" } }))), showBowlClubUpsell && /* @__PURE__ */ React.createElement(BowlClubUpsell, { item: singleBottleItem }), showRitualKit && /* @__PURE__ */ React.createElement(RitualKitCard, { items, variant: "inline" }), (() => {
    if (!showTrioUpsell) return null;
    const singleSlugs = trioSingleSlugs;
    const singleCount = trioSingleCount;
    const swapToTrio = () => {
      if (window.NB_CART) {
        singleSlugs.forEach((slug) => window.NB_CART.remove(slug));
        window.NB_CART.add({ slug: TRIO.slug, name: TRIO.name, price: TRIO.priceUsd });
      }
      const detail = { fromSingleCount: singleCount, savings: 5.98, destination: "trio" };
      try {
        window.dispatchEvent(new CustomEvent("nb_cart_upgrade_to_trio", { detail }));
      } catch (_) {
      }
      try {
        window.fbq && window.fbq("trackCustom", "UpgradeToTrioPrompt", detail);
      } catch (_) {
      }
      try {
        window.dataLayer && window.dataLayer.push({ event: "upgrade_to_trio_prompt", ...detail });
      } catch (_) {
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "card", style: {
      border: "1px solid var(--accent)",
      background: "linear-gradient(180deg, rgba(232,74,58,0.12) 0%, rgba(232,74,58,0.04) 100%)",
      padding: 22,
      display: "flex",
      gap: 18,
      alignItems: "center"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 56,
      height: 56,
      flexShrink: 0,
      background: "var(--paper-3)",
      border: "1px solid var(--line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 4
    } }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "uploads/noodlebomb-trio.png",
        alt: "The NoodleBomb Trio",
        loading: "lazy",
        style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { color: "var(--accent)", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, marginBottom: 4 } }, "CART SLOT 1: TRIO"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter Tight", fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 4 } }, "Add a third bottle for trio pricing"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter", fontSize: 12, color: "var(--ink-60)", lineHeight: 1.5 } }, "Any 3 bottles qualify for the $32.99 Trio price.")), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: swapToTrio,
        "aria-label": "Swap singles for the Trio bundle",
        style: {
          flexShrink: 0,
          padding: "12px 20px",
          borderRadius: 999,
          background: "var(--accent)",
          color: "var(--accent-ink)",
          border: 0,
          fontFamily: "Inter",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "transform .2s, box-shadow .2s"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(232,74,58,0.28)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "none";
        }
      },
      "Swap to Trio"
    ));
  })(), items.map((item, index) => /* @__PURE__ */ React.createElement("div", { key: lineKey(item, index), className: "card line-item" }, /* @__PURE__ */ React.createElement("div", { className: "line-item-img" }, /* @__PURE__ */ React.createElement("img", { src: PRODUCT_IMAGES[item.slug] || PRODUCT_IMAGES.original, alt: item.name })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "line-item-name" }, item.name), /* @__PURE__ */ React.createElement("div", { className: "line-item-meta" }, PRODUCT_LABELS[item.slug] && PRODUCT_LABELS[item.slug].tagline || "", " \xB7 ", fmtUSD(item.price), " each"), bottleMix(item) && /* @__PURE__ */ React.createElement("div", { className: "line-item-meta", style: { marginTop: 4, color: "var(--accent)" } }, "Mix: ", bottleMix(item))), /* @__PURE__ */ React.createElement("button", { className: "icon-btn", onClick: () => remove(item), "aria-label": "Remove " + item.name }, /* @__PURE__ */ React.createElement(Trash, null))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "qty" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setQty(item, item.qty - 1), disabled: item.qty <= 1, "aria-label": "Decrease" }, "\u2212"), /* @__PURE__ */ React.createElement("span", null, item.qty), /* @__PURE__ */ React.createElement("button", { onClick: () => setQty(item, item.qty + 1), "aria-label": "Increase" }, "+")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter Tight", fontWeight: 700, fontSize: 22, color: "var(--accent)", fontVariantNumeric: "tabular-nums" } }, fmtUSD(item.price * item.qty)))))), showFireDustUpsell && /* @__PURE__ */ React.createElement("div", { className: "cart-powerup", style: { marginTop: 28 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { color: "var(--ink-40)", marginBottom: 14 } }, "Complete the set"), /* @__PURE__ */ React.createElement("div", { className: "card cart-rec-card", style: { padding: 14, display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, background: "var(--paper-3)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("img", { src: PRODUCT_IMAGES.firedust, alt: "NoodleBomb Fire Dust seasoning topper", style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter Tight", fontWeight: 700, fontSize: 15, color: "var(--ink)" } }, FIRE_DUST.label), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--ink-60)", fontSize: 12, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, FIRE_DUST.tag), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent)", fontFamily: "Inter Tight", fontWeight: 700, fontSize: 14, marginTop: 3 } }, fmtUSD(FIRE_DUST.price))), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "cart-rec-add",
      onClick: () => addRec(FIRE_DUST),
      "aria-label": "Add NoodleBomb Fire Dust to cart",
      style: {
        padding: "11px 20px",
        borderRadius: 999,
        background: "var(--accent)",
        color: "var(--accent-ink)",
        border: 0,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "Inter Tight, sans-serif",
        lineHeight: 1,
        flexShrink: 0,
        transition: "transform .2s"
      },
      onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.05)",
      onMouseLeave: (e) => e.currentTarget.style.transform = ""
    },
    "Add"
  ))), recsToShow.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 28 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { color: "var(--ink-40)", marginBottom: 14 } }, "You might also like"), /* @__PURE__ */ React.createElement("div", { className: "cart-recs-grid", style: { display: "grid", gridTemplateColumns: "repeat(" + recsToShow.length + ", minmax(0, 1fr))", gap: 10 } }, recsToShow.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.slug, className: "card cart-rec-card", style: { padding: 14, display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 48, height: 48, background: "var(--paper-3)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("img", { src: PRODUCT_IMAGES[r.slug], alt: r.name, style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter Tight", fontWeight: 700, fontSize: 14, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, r.name), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent)", fontFamily: "Inter Tight", fontWeight: 700, fontSize: 14, marginTop: 2 } }, fmtUSD(r.price))), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "cart-rec-add",
      onClick: () => addRec(r),
      "aria-label": "Add " + r.name + " to cart",
      style: {
        width: 32,
        height: 32,
        borderRadius: 999,
        background: "var(--accent)",
        color: "var(--accent-ink)",
        border: 0,
        cursor: "pointer",
        fontSize: 18,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform .2s",
        flexShrink: 0
      },
      onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.12)",
      onMouseLeave: (e) => e.currentTarget.style.transform = ""
    },
    "+"
  )))))), /* @__PURE__ */ React.createElement("div", { className: "card summary" }, /* @__PURE__ */ React.createElement("h2", null, "Order summary"), /* @__PURE__ */ React.createElement("p", { className: "lede" }, "Secure checkout handoff"), /* @__PURE__ */ React.createElement("div", { className: "row-line" }, /* @__PURE__ */ React.createElement("span", null, "Subtotal (", itemCount, ")"), /* @__PURE__ */ React.createElement("span", { className: "v" }, fmtUSD(subtotal))), /* @__PURE__ */ React.createElement("div", { className: "row-line" }, /* @__PURE__ */ React.createElement("span", null, "Shipping"), /* @__PURE__ */ React.createElement("span", { className: "v", style: freeShipping ? { color: "var(--accent)", fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 } : { color: "var(--ink-40)", fontSize: 12 } }, freeShipping ? "Free (US)" : "At checkout")), /* @__PURE__ */ React.createElement("div", { className: "row-line" }, /* @__PURE__ */ React.createElement("span", null, "Estimated tax"), /* @__PURE__ */ React.createElement("span", { className: "v", style: { color: "var(--ink-40)", fontSize: 12 } }, "At checkout")), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("div", { className: "row-line total" }, /* @__PURE__ */ React.createElement("span", { className: "label" }, "Subtotal"), /* @__PURE__ */ React.createElement("span", { className: "v" }, fmtUSD(subtotal))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, padding: "12px 14px", border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--ink-60)" } }, /* @__PURE__ */ React.createElement(Truck, null), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, "Estimated delivery"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink)", fontFamily: "Inter Tight", fontWeight: 600 } }, delivery)), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22, display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement(
    "a",
    {
      className: "btn",
      href: getCheckoutUrl(items),
      onClick: onCheckoutClick,
      "aria-busy": checkoutLoading,
      "aria-disabled": checkoutLoading,
      style: { opacity: checkoutLoading ? 0.7 : 1, pointerEvents: checkoutLoading ? "none" : "auto" }
    },
    checkoutLoading ? "Opening checkout\u2026" : `Secure checkout \u2014 ${fmtUSD(subtotal)}`
  ), items.length > 1 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px 14px", justifyContent: "center", paddingTop: 2 } }, items.map((it) => NB_SITE_URLS[it.slug] && /* @__PURE__ */ React.createElement("a", { key: it.slug, href: NB_SITE_URLS[it.slug], style: { fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.13em", color: "var(--ink-40)", textDecoration: "underline", textUnderlineOffset: 3, textTransform: "uppercase" } }, it.name, " \u2192"))), /* @__PURE__ */ React.createElement("a", { className: "btn btn-secondary", href: "/#lineup", style: { display: "inline-flex" } }, "Continue shopping")), /* @__PURE__ */ React.createElement("div", { className: "trust" }, /* @__PURE__ */ React.createElement("div", { className: "trust-row" }, /* @__PURE__ */ React.createElement(Shield, null), " Secure SSL checkout"), /* @__PURE__ */ React.createElement("div", { className: "trust-row" }, /* @__PURE__ */ React.createElement(Truck, null), " $3.50 flat US shipping \xB7 FREE on $32.99+ US orders"), /* @__PURE__ */ React.createElement("div", { className: "trust-row" }, /* @__PURE__ */ React.createElement(Repeat, null), " 30-day satisfaction guarantee"), /* @__PURE__ */ React.createElement("div", { className: "trust-row" }, /* @__PURE__ */ React.createElement(Check, null), " Ships from Bonney Lake, WA")))), /* @__PURE__ */ React.createElement("div", { className: "sticky-mobile" }, /* @__PURE__ */ React.createElement("div", { className: "total" }, /* @__PURE__ */ React.createElement("small", null, "Subtotal"), /* @__PURE__ */ React.createElement("strong", null, fmtUSD(subtotal))), /* @__PURE__ */ React.createElement(
    "a",
    {
      className: "btn",
      href: getCheckoutUrl(items),
      onClick: onCheckoutClick,
      "aria-busy": checkoutLoading,
      "aria-disabled": checkoutLoading,
      style: { opacity: checkoutLoading ? 0.7 : 1, pointerEvents: checkoutLoading ? "none" : "auto" }
    },
    checkoutLoading ? "Opening\u2026" : "Checkout \u2192"
  )));
}
ReactDOM.createRoot(document.getElementById("cart-root")).render(/* @__PURE__ */ React.createElement(CartPage, null));
