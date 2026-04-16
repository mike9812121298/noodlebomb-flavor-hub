import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, Star, X, ChevronDown } from "lucide-react";

const faqs = [
  { q: "When does my box ship each month?", a: "Boxes ship on the 1st of each month. Order before the 1st to get that month's box." },
  { q: "Can I skip a month?", a: "Yes — log into your account and skip any upcoming month with one click, no questions asked." },
  { q: "What ramen brands are included?", a: "We curate a rotating selection of premium instant ramen from Japanese, Korean, and Taiwanese brands — things you won't find at a regular grocery store." },
  { q: "Can I choose my NoodleBomb flavor?", a: "Yes! When you subscribe, you'll choose your preferred flavor. You can change it anytime from your account." },
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
    meta.content = "Get NoodleBomb's bold ramen sauces delivered monthly. Cancel anytime.";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
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
            A curated box of premium instant ramen from around the world — plus a bottle of NoodleBomb sauce — every single month.
          </p>
          <a href="https://www.noodlebomb.co/ramenbox" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold text-lg tracking-wide shadow-lg hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105">
            Subscribe Now — Cancel Anytime
          </a>
          <p className="mt-4 text-sm text-muted-foreground">No contracts. No commitment. One click to cancel.</p>
        </motion.div>
      </div>

      {/* What's in the box */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">What's in the Box</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Package, title: "Premium Ramen Packs", desc: "Hand-picked instant ramen from top Japanese, Korean, and Taiwanese brands. A new rotating selection every month." },
              { icon: Star, title: "A Bottle of NoodleBomb", desc: "Your choice of flavor — Original, Spicy Tokyo, Citrus Shoyu, or whatever's newest. Changes anytime." },
              { icon: Truck, title: "Free Shipping", desc: "Every box ships free, every month. No minimums, no surprises on the invoice." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl border border-border p-6 text-center">
                <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { step: "1", title: "Subscribe", desc: "Pick your plan and check out in 60 seconds. Choose your NoodleBomb flavor preference." },
              { step: "2", title: "We Curate", desc: "We pack your box with new ramen finds + a fresh bottle of NoodleBomb every month." },
              { step: "3", title: "You Enjoy", desc: "Unbox, cook, and rate your favorites. Cancel or skip anytime with zero friction." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center font-display font-black text-white text-xl mx-auto mb-4">{step}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* Cancel guarantee */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center mb-16">
            <X className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">Cancel Anytime. We Mean It.</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">No contracts. No commitment. Log into your account and cancel with one click — no emails, no phone calls, no guilt.</p>
          </div>

          {/* FAQ */}
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
            <a href="https://www.noodlebomb.co/ramenbox" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold text-lg tracking-wide shadow-lg hover:shadow-orange-500/40 transition-all duration-300">
              Subscribe Now — Cancel Anytime
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RamenBox;
