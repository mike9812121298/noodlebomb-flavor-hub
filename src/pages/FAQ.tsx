import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";

const faqGroups = [
  {
    category: "General",
    items: [
      {
        q: "What is NoodleBomb?",
        a: "NoodleBomb is a premium ramen sauce crafted in small batches in the Pacific Northwest. It's designed to transform any bowl of noodles into a restaurant-quality meal in under 10 minutes. We currently offer three SKUs: Original, Spicy Tokyo, and Citrus Shoyu.",
      },
      {
        q: "How is NoodleBomb different from other sauces?",
        a: "Most sauces are built around one flavor note. NoodleBomb is layered — umami-forward, balanced with depth from fermented ingredients, and finished to coat noodles rather than pool at the bottom. It's also versatile enough to work as a marinade, glaze, or stir-fry sauce.",
      },
      {
        q: "Is NoodleBomb gluten-free?",
        a: "No. NoodleBomb contains soy sauce and wheat-derived ingredients. It is not suitable for those with celiac disease or a gluten intolerance. See the Ingredients & Allergens section for the full allergen list.",
      },
      {
        q: "Does NoodleBomb contain MSG?",
        a: "Yes. Monosodium glutamate (MSG) is listed as an ingredient. We use it intentionally — it enhances the umami backbone of the sauce and is safe for the vast majority of people.",
      },
    ],
  },
  {
    category: "Shipping & Orders",
    items: [
      {
        q: "When will my order ship?",
        a: "NoodleBomb is currently in pre-order. All orders are scheduled to ship in May 2025. You'll receive a shipping confirmation email with tracking information as soon as your order is on its way.",
      },
      {
        q: "Do you ship internationally?",
        a: "At launch we're shipping within the United States only. International shipping is on our roadmap — sign up for the newsletter to be notified when it becomes available.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order ships, you'll get a confirmation email with a tracking link. You can also log into your account at noodlebomb.co to check order status. If you have any issues, email hello@noodlebomb.co.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes — every order ships free, no minimum purchase required.",
      },
    ],
  },
  {
    category: "Ingredients & Allergens",
    items: [
      {
        q: "What allergens are present in NoodleBomb?",
        a: "NoodleBomb contains soy, wheat, milk, sesame, and sulphites. It is produced in a facility that also handles tree nuts. Always check the label if you have a severe allergy.",
      },
      {
        q: "Does NoodleBomb contain preservatives?",
        a: "We use a small amount of naturally-derived preservatives to maintain shelf stability. NoodleBomb has an 18-month shelf life from the production date. Once opened, refrigerate and use within 30 days for best flavor.",
      },
      {
        q: "Is MSG in NoodleBomb?",
        a: "Yes — monosodium glutamate is listed on the label. Decades of research support its safety for the general population, and it's a key part of what makes the sauce taste deeply savory.",
      },
      {
        q: "Where is NoodleBomb made?",
        a: "NoodleBomb is crafted in small batches in the Pacific Northwest, USA.",
      },
    ],
  },
  {
    category: "Product Usage",
    items: [
      {
        q: "How do I use NoodleBomb sauce?",
        a: "Cook your noodles as normal, drain, then pour NoodleBomb directly over the hot noodles and toss to coat. It also works as a stir-fry sauce, wing glaze, rice bowl drizzle, dumpling dipping sauce, or marinade for steak and seafood.",
      },
      {
        q: "How much sauce should I use per serving?",
        a: "One serving is approximately half a bottle — roughly 3.5 fl oz. Each bottle contains 2 servings. Start there and adjust to taste; Spicy Tokyo users often go a little lighter on their first try.",
      },
      {
        q: "Can I cook with NoodleBomb?",
        a: "Absolutely. It holds up well to heat, making it ideal as a stir-fry base or protein marinade. For best flavor, add it in the last 2–3 minutes of cooking rather than at the very start to preserve the aromatic layers.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 100% satisfaction guarantee. If you don't love NoodleBomb for any reason, contact us at hello@noodlebomb.co and we'll issue a full refund — no return shipping required.",
      },
      {
        q: "What if my order arrives damaged?",
        a: "Send us a photo of the damaged item to hello@noodlebomb.co within 7 days of delivery. We'll ship a replacement at no charge or issue a full refund, whichever you prefer.",
      },
    ],
  },
  {
    category: "Subscription",
    items: [
      {
        q: "How does the subscription box work?",
        a: "The Monthly Ramen Box is a recurring subscription that delivers a curated selection of premium instant ramen plus a bottle of NoodleBomb sauce every month. It's the easiest way to keep your pantry stocked and discover new noodle formats.",
      },
      {
        q: "Can I pause or cancel my subscription?",
        a: "Yes — pause or cancel anytime from your account dashboard, no questions asked. Changes made before your monthly billing date take effect that cycle. There are no cancellation fees.",
      },
      {
        q: "Can I choose which NoodleBomb flavor comes in my box?",
        a: "Subscribers can set a flavor preference in their account settings. If no preference is set, we'll rotate through all three SKUs — Original, Spicy Tokyo, and Citrus Shoyu — so you can try them all.",
      },
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
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
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
    meta.content =
      "Common questions about NoodleBomb ramen sauce — ingredients, allergens, shipping, subscriptions, and more.";
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-black text-foreground mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg mb-12">
            Everything you need to know about NoodleBomb.
          </p>

          <div className="space-y-6 mb-12">
            {faqGroups.map((group, gi) => (
              <div key={group.category}>
                <p className="text-[10px] font-display font-semibold uppercase tracking-[0.3em] text-muted-foreground/50 mb-1">
                  {group.category}
                </p>
                <div className="bg-card rounded-2xl border border-border px-6">
                  {group.items.map((item, i) => (
                    <FAQItem key={i} {...item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Email us at{" "}
              <a
                href="mailto:hello@noodlebomb.co"
                className="text-primary font-semibold hover:underline"
              >
                hello@noodlebomb.co
              </a>{" "}
              — we respond within 24 hours, Monday–Friday.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
