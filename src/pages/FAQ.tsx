import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";

const faqGroups = [
  {
    category: "Shipping & Orders",
    items: [
      { q: "How long does shipping take?", a: "Orders ship within 1–2 business days. Most U.S. customers receive their order within 3–5 business days after it ships." },
      { q: "Do you offer free shipping?", a: "Yes! Every single order ships free — no minimum purchase required." },
    ],
  },
  {
    category: "Product & Ingredients",
    items: [
      { q: "How do I use NoodleBomb?", a: "Cook your noodles as normal. Pour half a bottle over your cooked noodles, toss to coat, and eat. One bottle = 2 servings. Also great as a stir-fry sauce, wing glaze, rice bowl drizzle, dumpling dipping sauce, or marinade for steak and seafood." },
      { q: "How much sauce is one serving?", a: "One serving is approximately half a bottle (roughly 3.5 fl oz). Each bottle contains 2 servings." },
      { q: "Where is NoodleBomb made?", a: "NoodleBomb is crafted in small batches in the Pacific Northwest." },
      { q: "How long does NoodleBomb stay fresh?", a: "NoodleBomb has an 18-month shelf life from the production date. Once opened, refrigerate and use within 30 days for best flavor." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return/refund policy?", a: "We offer a 100% money-back guarantee. If you don't absolutely love NoodleBomb for any reason, contact us and we'll give you a full refund. No return shipping needed." },
    ],
  },
  {
    category: "Subscription",
    items: [
      { q: "Can I subscribe and save?", a: "Yes! Check out the Monthly Ramen Box — a subscription that delivers a curated box of top-tier instant ramen plus a bottle of NoodleBomb every month. Cancel anytime, no hassle." },
    ],
  },
  {
    category: "Contact & General",
    items: [
      { q: "I have a wholesale or retail inquiry. Who do I contact?", a: "Email us at hello@noodlebomb.co with 'Wholesale' in the subject line. We love working with restaurants, retailers, and food subscription boxes." },
      { q: "How do I contact you?", a: "Email: hello@noodlebomb.co — We respond to all emails within 24 hours, Monday–Friday." },
    ],
  },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-display font-semibold text-foreground text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  useEffect(() => {
    document.title = "FAQ | NoodleBomb Ramen Sauce";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Common questions about NoodleBomb ramen sauce — ingredients, shipping, and more.";
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-4xl font-black text-foreground mb-3">FAQ</h1>
          <p className="text-muted-foreground text-lg mb-12">Everything you need to know about NoodleBomb.</p>
          <div className="bg-card rounded-2xl border border-border px-6 mb-12">
            {faqGroups.map((group, gi) => (
              <div key={group.category} className={gi > 0 ? "border-t border-border/50 mt-1 pt-1" : ""}>
                <p className="text-[10px] font-display font-semibold uppercase tracking-[0.3em] text-muted-foreground/50 pt-5 pb-0">
                  {group.category}
                </p>
                {group.items.map((item, i) => (
                  <FAQItem key={i} {...item} />
                ))}
              </div>
            ))}
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">We respond within 24 hours, Monday–Friday.</p>
            <a href="mailto:hello@noodlebomb.co" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold tracking-wide shadow-lg hover:shadow-orange-500/40 transition-all duration-300">
              <Mail className="w-4 h-4" />
              hello@noodlebomb.co
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
