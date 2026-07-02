// Reconstructed 2026-07-01 from the live compiled bundle (/build/checkout.js on noodlebomb.co).
// The original JSX source lives only in the deploy tree; this file is the compiled
// equivalent (plain JS, no JSX sugar) and re-builds byte-stable through esbuild.
const { useEffect, useState, useMemo, useRef } = React;
const FREE_SHIPPING = window.NB_CART && window.NB_CART.FREE_SHIPPING_THRESHOLD || 32.99;
const hasFreeShippingTrio = (items) => (items || []).some((i) => i.slug === "trio" && (Number(i.qty) || 0) > 0);
const EMAIL_KEY = "nb_checkout_email";
const NB_SITE_URLS = {
  original: "https://noodlebomb.co/original-ramen-sauce",
  citrus: "https://noodlebomb.co/citrus-shoyu-ramen-sauce",
  spicy: "https://noodlebomb.co/spicy-tokyo-ramen-sauce",
  shoyu: "https://nu2vqa-ma.myshopify.com/products/shoyu-reserve",
  shoyuspicy: "https://noodlebomb.co/spicy-shoyu-ramen-sauce",
  firedust: "https://noodlebomb.co/fire-dust",
  rgs: "https://noodlebomb.co/roasted-garlic-sesame",
  trio: "https://noodlebomb.co/#lineup",
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
const PRODUCT_IMAGES = {
  original: "uploads/nb-original-cart-thumb-2026-06-06.webp",
  citrus: "uploads/nb-citrus-cart-thumb-2026-06-06.webp",
  spicy: "uploads/nb-spicy-cart-thumb-2026-06-06.webp",
  shoyu: "uploads/shoyu-reserve-cart-thumb-2026-06-06.webp",
  shoyuspicy: "uploads/nb-shoyu-spicy-front-cutout-2026-06-09.webp",
  firedust: "uploads/nb-fire-dust-front-cutout-2026-06-10-thumb.webp",
  rgs: "uploads/nb-roasted-garlic-sesame-cutout-2026-06-22.webp",
  trio: "uploads/noodlebomb-trio.png"
};
const PRODUCT_TAGS = {
  original: "Garlic & Sesame",
  spicy: "Spicy Tokyo",
  citrus: "Citrus Shoyu",
  trio: "3-pack bundle",
  shoyu: "Shoyu Reserve",
  shoyuspicy: "Spicy Shoyu",
  firedust: "Fire Dust",
  rgs: "Roasted Garlic Sesame"
};
const fmtUSD = (n) => "$" + (Number(n) || 0).toFixed(2);
const isoDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const lineKey = (item, index) => `${item.slug}-${index}-${JSON.stringify(item.attributes || [])}`;
const bottleMix = (item) => {
  var _a;
  return (_a = (item.attributes || []).find((attr) => attr.key === "Bottle mix")) == null ? void 0 : _a.value;
};
const Mail = () => /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ React.createElement("polyline", { points: "22,6 12,13 2,6" }));
const Truck = () => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { x: "1", y: "3", width: "15", height: "13" }), /* @__PURE__ */ React.createElement("path", { d: "M16 8h4l3 5v3h-7" }), /* @__PURE__ */ React.createElement("circle", { cx: "5.5", cy: "18.5", r: "2.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "18.5", cy: "18.5", r: "2.5" }));
const Shield = () => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }));
const Repeat = () => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "17 1 21 5 17 9" }), /* @__PURE__ */ React.createElement("path", { d: "M3 11V9a4 4 0 0 1 4-4h14" }), /* @__PURE__ */ React.createElement("polyline", { points: "7 23 3 19 7 15" }), /* @__PURE__ */ React.createElement("path", { d: "M21 13v2a4 4 0 0 1-4 4H3" }));
const Lock = () => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }));
const Check = () => /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }));
function CheckoutPage() {
  const [items, setItems] = useState(() => window.NB_CART ? window.NB_CART.getItems() : []);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const emailRef = useRef(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMAIL_KEY);
      if (stored) setEmail(stored);
    } catch (e) {
    }
  }, []);
  useEffect(() => {
    if (!window.NB_CART) return;
    return window.NB_CART.onChange(() => setItems(window.NB_CART.getItems()));
  }, []);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const hasTrio = hasFreeShippingTrio(items);
  const freeShipping = hasTrio || subtotal >= FREE_SHIPPING;
  const remaining = freeShipping ? 0 : Math.max(FREE_SHIPPING - subtotal, 0);
  useEffect(() => {
    if (itemCount === 0 && !redirecting) {
      window.location.replace("/cart.html");
    }
  }, [itemCount, redirecting]);
  const delivery = useMemo(() => {
    const a = /* @__PURE__ */ new Date();
    a.setDate(a.getDate() + 5);
    const b = /* @__PURE__ */ new Date();
    b.setDate(b.getDate() + 7);
    return isoDate(a) + " \u2013 " + isoDate(b);
  }, []);
  const fallbackLinks = items.map((it) => ({
    slug: it.slug,
    name: it.name,
    qty: it.qty,
    url: NB_SITE_URLS[it.slug] || NB_SITE_URLS.shop
  }));
  const fallbackUrl = getShopifyCartPermalink(items);
  const emailValid = validEmail(email);
  const onEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    if (validEmail(v)) {
      try {
        localStorage.setItem(EMAIL_KEY, v);
      } catch (_) {
      }
    }
  };
  const proceed = () => {
    if (!emailValid) {
      setEmailTouched(true);
      if (emailRef.current) {
        try {
          emailRef.current.focus({ preventScroll: true });
        } catch (_) {
          emailRef.current.focus();
        }
        if (emailRef.current.scrollIntoView) emailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setRedirecting(true);
    if (window.NB_SHOPIFY_CHECKOUT && window.NB_SHOPIFY_CHECKOUT.isEnabled()) {
      window.NB_SHOPIFY_CHECKOUT.createCheckoutUrl(items).then((url) => {
        window.location.href = url;
      }).catch(() => {
        window.location.href = fallbackUrl;
      });
      return;
    }
    window.location.href = fallbackUrl;
  };
  if (itemCount === 0) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", { className: "crumb", href: "/cart.html" }, "\u2190 Back to cart"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("h1", { className: "page-title" }, /* @__PURE__ */ React.createElement("em", null, "Checkout.")), /* @__PURE__ */ React.createElement("div", { className: "steps" }, /* @__PURE__ */ React.createElement("span", { className: "dot done" }), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-40)" } }, "Cart"), /* @__PURE__ */ React.createElement("span", { className: "sep" }), /* @__PURE__ */ React.createElement("span", { className: "dot active" }), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)" } }, "Review"), /* @__PURE__ */ React.createElement("span", { className: "sep" }), /* @__PURE__ */ React.createElement("span", { className: "dot" }), /* @__PURE__ */ React.createElement("span", null, "Pay"))), /* @__PURE__ */ React.createElement("p", { className: "page-meta" }, "Tax + shipping calculated on the next step."), /* @__PURE__ */ React.createElement("div", { className: "layout" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "section-h" }, /* @__PURE__ */ React.createElement("span", { className: "icon" }, /* @__PURE__ */ React.createElement(Mail, null)), /* @__PURE__ */ React.createElement("span", { className: "label" }, "Contact")), /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "Email"), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: emailRef,
      className: "field" + (emailTouched && !emailValid ? " error" : ""),
      type: "email",
      value: email,
      onChange: onEmailChange,
      onBlur: () => setEmailTouched(true),
      placeholder: "you@example.com",
      autoComplete: "email",
      inputMode: "email",
      "aria-invalid": emailTouched && !emailValid,
      "aria-describedby": "checkout-email-error"
    }
  ), emailTouched && !emailValid && /* @__PURE__ */ React.createElement("div", { className: "field-error", id: "checkout-email-error", role: "alert" }, email.trim() === "" ? "Enter your email to continue." : "Please enter a valid email address."), /* @__PURE__ */ React.createElement("label", { className: "checkbox-row" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: marketing, onChange: (e) => setMarketing(e.target.checked) }), /* @__PURE__ */ React.createElement("span", null, "Email me product drops, recipes, and the occasional discount. Unsubscribe anytime."))), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "section-h", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "label" }, "Your order (", itemCount, ")")), /* @__PURE__ */ React.createElement("a", { href: "/cart.html", className: "mono", style: { color: "var(--accent)", textDecoration: "none" } }, "Edit")), /* @__PURE__ */ React.createElement("div", null, items.map((item, index) => /* @__PURE__ */ React.createElement("div", { key: lineKey(item, index), className: "review-row" }, /* @__PURE__ */ React.createElement("div", { className: "img" }, /* @__PURE__ */ React.createElement("img", { src: PRODUCT_IMAGES[item.slug] || PRODUCT_IMAGES.original, alt: item.name }), /* @__PURE__ */ React.createElement("span", { className: "qty-bubble" }, item.qty)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("p", { className: "name" }, item.name), bottleMix(item) && /* @__PURE__ */ React.createElement("div", { className: "meta", style: { marginTop: 4, color: "var(--accent)" } }, "Mix: ", bottleMix(item)), /* @__PURE__ */ React.createElement("div", { className: "meta" }, PRODUCT_TAGS[item.slug] || "", " \xB7 ", fmtUSD(item.price), " each")), /* @__PURE__ */ React.createElement("div", { className: "price" }, fmtUSD(item.price * item.qty)))))), /* @__PURE__ */ React.createElement("div", { className: "handoff" }, /* @__PURE__ */ React.createElement("div", { className: "ico" }, /* @__PURE__ */ React.createElement(Shield, null)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("h3", null, "You'll finish on our secure store."), /* @__PURE__ */ React.createElement("p", null, "Payment, shipping, and tax are handled through secure checkout. If checkout needs a backup, we'll keep you on a NoodleBomb product page.")))), /* @__PURE__ */ React.createElement("div", { className: "card summary" }, /* @__PURE__ */ React.createElement("h2", null, "Total"), /* @__PURE__ */ React.createElement("p", { className: "lede" }, "Tax + shipping at next step"), /* @__PURE__ */ React.createElement("div", { className: "row-line" }, /* @__PURE__ */ React.createElement("span", null, "Subtotal (", itemCount, ")"), /* @__PURE__ */ React.createElement("span", { className: "v" }, fmtUSD(subtotal))), /* @__PURE__ */ React.createElement("div", { className: "row-line" }, /* @__PURE__ */ React.createElement("span", null, "Shipping"), /* @__PURE__ */ React.createElement("span", { className: "v", style: freeShipping ? { color: "var(--accent)", fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 } : { color: "var(--ink-40)", fontSize: 12 } }, freeShipping ? "Free (US)" : "At checkout")), /* @__PURE__ */ React.createElement("div", { className: "row-line" }, /* @__PURE__ */ React.createElement("span", null, "Estimated tax"), /* @__PURE__ */ React.createElement("span", { className: "v", style: { color: "var(--ink-40)", fontSize: 12 } }, "At checkout")), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("div", { className: "row-line total" }, /* @__PURE__ */ React.createElement("span", { className: "label" }, "Subtotal"), /* @__PURE__ */ React.createElement("span", { className: "v" }, fmtUSD(subtotal))), !freeShipping && remaining > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, padding: "10px 12px", border: "1px solid var(--line)", fontSize: 11, color: "var(--ink-40)", fontFamily: "JetBrains Mono", letterSpacing: "0.1em", textTransform: "uppercase" } }, "Add ", fmtUSD(remaining), " for free shipping \xB7 ", /* @__PURE__ */ React.createElement("a", { href: "/cart.html", style: { color: "var(--accent)" } }, "edit cart \u2192")), /* @__PURE__ */ React.createElement("div", { className: "delivery" }, /* @__PURE__ */ React.createElement(Truck, null), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, "Estimated delivery"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink)", fontFamily: "Inter Tight", fontWeight: 600 } }, delivery)), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: proceed, disabled: redirecting }, redirecting ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Opening secure checkout\u2026") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Lock, null), " Pay ", fmtUSD(subtotal), " \u2192"))), redirecting && /* @__PURE__ */ React.createElement("div", { className: "redirect-confirm" }, /* @__PURE__ */ React.createElement("strong", null, "Opening secure checkout."), "If nothing happened, you can", " ", /* @__PURE__ */ React.createElement("a", { href: fallbackUrl }, "return to the NoodleBomb lineup"), " and keep shopping.", /* @__PURE__ */ React.createElement("button", { onClick: () => {
    window.NB_CART && window.NB_CART.clear();
    window.location.href = "/";
  } }, "I finished my order \u2014 clear my cart")), /* @__PURE__ */ React.createElement("div", { className: "trust" }, /* @__PURE__ */ React.createElement("div", { className: "trust-row" }, /* @__PURE__ */ React.createElement(Shield, null), " Secure SSL \xB7 PCI-compliant payment"), /* @__PURE__ */ React.createElement("div", { className: "trust-row" }, /* @__PURE__ */ React.createElement(Truck, null), " FREE US shipping at $32.99+ subtotal"), /* @__PURE__ */ React.createElement("div", { className: "trust-row" }, /* @__PURE__ */ React.createElement(Repeat, null), " 30-day satisfaction guarantee")), /* @__PURE__ */ React.createElement("div", { className: "payment" }, /* @__PURE__ */ React.createElement("div", { className: "lbl" }, "We accept"), /* @__PURE__ */ React.createElement("div", { className: "row" }, ["Visa", "Mastercard", "Amex", "Discover", "Apple Pay", "Google Pay"].map((m) => /* @__PURE__ */ React.createElement("span", { key: m, className: "pill" }, m)))))), /* @__PURE__ */ React.createElement("div", { className: "sticky-mobile" }, /* @__PURE__ */ React.createElement("div", { className: "total" }, /* @__PURE__ */ React.createElement("small", null, "Subtotal"), /* @__PURE__ */ React.createElement("strong", null, fmtUSD(subtotal))), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: proceed, disabled: redirecting }, /* @__PURE__ */ React.createElement(Lock, null), " Pay")));
}
ReactDOM.createRoot(document.getElementById("checkout-root")).render(/* @__PURE__ */ React.createElement(CheckoutPage, null));
