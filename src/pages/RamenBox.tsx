import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, Star, X, ChevronDown, Check } from "lucide-react";

const plans = [
  {
    name: "Monthly Box",
    price: "$29.99",
    href: "/monthly-box",
    desc: "Curated ramen packs, a fast recipe idea, and a free full bottle of NoodleBomb sauce every month.",
    features: ["Premium instant ramen selection", "Free full 7 oz bottle of sauce", "Choose or rotate your sauce flavor", "Billed monthly, cancel anytime"],
  },
  {
    name: "Premium Box",
    price: "$39.99",
    href: "/monthly-box",
    desc: "A bigger pantry box with more ramen discovery, surprise extras, and a free full bottle of NoodleBomb sauce every month.",
    features: ["Larger premium ramen selection", "Free full 7 oz bottle of sauce", "Surprise extras and special drops", "Billed monthly, cancel anytime"],
  },
];

const faqs = [
  { q: "When does my box ship each month?", a: "Boxes ship on the 1st of each month. Order before the 1st to get that month's box." },
  { q: "Can I skip a month?", a: "Yes. Log into your account and skip any upcoming month with one click, no questions asked." },
  { q: "What ramen brands are included?", a: "We curate a rotating selection of premium instant ramen from Japanese, Korean, and Taiwanese brands, including things you will not find at a regular grocery store." },
  { q: "Does every box include a free full bottle of sauce?", a: "Yes. Every monthly subscription box includes a free full 7 oz bottle of NoodleBomb sauce. You can choose your preferred flavor or rotate through the lineup." },
  { q: "Can I choose my NoodleBomb flavor?", a: "Yes. When you subscribe, you can choose your preferred flavor. You can change it anytime from your account." },
];

const RamenBox = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Monthly Ramen Box | NoodleBomb";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Get premium ramen plus a free full bottle of NoodleBomb sauce delivered monthly. Choose $29.99/mo or $39.99/mo. Cancel anytime.";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-32 pb-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-display font-bold uppercase tracking-wider mb-6">
            Monthly Subscription
          </span>
          <h1 className="font-display text-5xl font-black text-foreground mb-6 leading-tight">
            Your Monthly Ramen<br />
            <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">Obsession, Delivered.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10">
            Premium instant ramen, fast recipe ideas, and a free full 7 oz bottle of NoodleBomb sauce every single month.
          </p>
          <a
            href="#plans"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold text-lg tracking-wide shadow-lg hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
          >
            Choose a Monthly Plan
          </a>
          <p className="mt-4 text-sm text-primary font-display font-bold uppercase tracking-wider">
            Every subscription includes a free full bottle of sauce.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">What's in the Box</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Package, title: "Premium Ramen Packs", desc: "Hand-picked instant ramen from top Japanese, Korean, and Taiwanese brands. A new rotating selection every month." },
              { icon: Star, title: "Free Full Bottle", desc: "A full 7 oz bottle of NoodleBomb sauce is included free in every box. Choose a flavor or rotate the lineup." },
              { icon: Truck, title: "Monthly Delivery", desc: "Billed monthly, shipped monthly, and easy to skip or cancel from your account." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl border border-border p-6 text-center">
                <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <h2 id="plans" className="font-display text-3xl font-bold text-foreground text-center mb-10">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {plans.map((plan) => (
              <div key={plan.name} className="bg-card rounded-2xl border border-border p-8">
                <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary mb-3">{plan.name}</p>
                <h3 className="font-display text-4xl font-black text-foreground mb-2">
                  {plan.price} <span className="text-base font-semibold text-muted-foreground">/ month</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className="w-full inline-flex justify-center px-6 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold uppercase tracking-wider shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
                >
                  Subscribe {plan.price}/mo
                </a>
              </div>
            ))}
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { step: "1", title: "Subscribe", desc: "Pick the $29.99 or $39.99 monthly plan and choose your NoodleBomb flavor preference." },
              { step: "2", title: "We Curate", desc: "We pack your box with new ramen finds, a fast recipe idea, and a free full bottle of NoodleBomb every month." },
              { step: "3", title: "You Enjoy", desc: "Unbox, cook, and rate your favorites. Cancel or skip anytime with zero friction." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center font-display font-black text-white text-xl mx-auto mb-4">{step}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center mb-16">
            <X className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">Cancel Anytime. We Mean It.</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">No contracts. No commitment. Log into your account and cancel with one click.</p>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">Box FAQ</h2>
          <div className="bg-card rounded-2xl border border-border px-6 mb-12">
            {faqs.map((item, i) => (
              <div key={i} className="border-b border-border last:border-0">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4">
                  <span className="font-display font-semibold text-foreground">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="pb-5 text-muted-foreground leading-relaxed">{item.a}</p>}
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold text-lg tracking-wide shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
            >
              Choose a Monthly Plan
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RamenBox;
