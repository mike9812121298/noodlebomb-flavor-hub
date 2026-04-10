import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, Clock, Gift, Flame, Truck, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import nbRamenBox from "@/assets/nb-ramen-box.png";
import nb3pack from "@/assets/nb-3pack-original.png";

const plans = [
  {
    id: "standard",
    name: "Standard Box",
    price: "$25",
    period: "/month",
    popular: false,
    features: [
      "1 Exclusive Sauce Drop",
      "2 Chef Recipe Cards",
      "Early Access to New Flavors",
      "Free Shipping",
    ],
  },
  {
    id: "great",
    name: "Great Room Box",
    price: "$39",
    period: "/month",
    popular: true,
    features: [
      "2 Exclusive Sauce Drops",
      "4 Chef Recipe Cards",
      "Bonus Surprise Item",
      "Members-Only Flavor Access",
      "15% Off All Store Purchases",
      "Free Shipping",
    ],
  },
];

const testimonials = [
  { quote: "Every month feels like Christmas for my kitchen. The exclusive drops are insane.", name: "Taylor R.", rating: 5 },
  { quote: "The Great Room Box is worth every penny. The surprise items alone make it special.", name: "Jordan K.", rating: 5 },
  { quote: "I've tried every sauce subscription out there. Nothing comes close to Noodle Bomb.", name: "Sam D.", rating: 5 },
];

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getEndOfMonth = () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    };

    const update = () => {
      const now = new Date();
      const end = getEndOfMonth();
      const diff = Math.max(0, end.getTime() - now.getTime());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

const RamenBox = () => {
  const countdown = useCountdown();

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero */}
      <section className="py-20 border-b border-border">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4 block">
              Monthly Flavor Drop
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              The Noodle Bomb<br />
              <span className="text-gradient-fire">Ramen Box</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              A monthly box of exclusive small-batch sauces, chef recipes, and surprises — delivered to your door. Once a drop is gone, it's gone.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Free Shipping</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Cancel Anytime</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /> Skip Any Month</span>
            </div>
            <a href="#plans" className="inline-flex items-center gap-2 bg-gradient-fire px-10 py-4 rounded-full font-display text-base font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--flame)/0.5)] hover:scale-105 transition-all animate-pulse-glow">
              Choose Your Plan <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <img src={nbRamenBox} alt="Monthly Ramen Box" className="max-w-xs w-full object-contain drop-shadow-[0_0_40px_hsl(var(--flame)/0.2)]" />
          </motion.div>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-16 border-b border-border bg-gradient-card">
        <div className="container text-center">
          <motion.div initial={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                This Month's Drop Closes Soon
              </span>
            </div>
            <div className="flex justify-center gap-4 md:gap-6">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.minutes, label: "Min" },
                { value: countdown.seconds, label: "Sec" },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="font-display text-4xl md:text-5xl font-bold text-foreground">
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-20 border-b border-border">
        <div className="container text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Why This Is Different</h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              This isn't a subscription box stuffed with random products. Every Noodle Bomb drop is a limited small-batch flavor — once it's gone, it's gone forever. You're not just getting sauce. You're getting access.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Flame, title: "Limited Drops", desc: "Small-batch flavors you can't buy in stores. Each month is unique." },
                { icon: Gift, title: "Curated Experience", desc: "Chef recipes, surprise items, and members-only perks in every box." },
                { icon: ShieldCheck, title: "Zero Risk", desc: "Cancel or skip anytime. No contracts, no commitments." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-card rounded-2xl border border-border p-6"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20 border-b border-border">
        <div className="container">
          <motion.div initial={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4 block">Choose Your Plan</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Pick Your Box</h2>
            <p className="text-muted-foreground mt-3">Cancel or skip anytime. No commitments.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-gradient-card rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-primary shadow-glow scale-[1.03]"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-fire text-primary-foreground text-xs font-display font-bold uppercase tracking-wider">
                      🔥 Most Popular
                    </span>
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-wider transition-all ${
                    plan.popular
                      ? "bg-gradient-fire text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--flame)/0.5)] hover:scale-[1.02] animate-pulse-glow"
                      : "border border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  Subscribe Now <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Testimonials */}
      <section className="py-20 border-b border-border">
        <div className="container">
          <motion.div initial={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Members Are Saying</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-card rounded-2xl border border-border p-6 text-center"
              >
                <div className="flex justify-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">"{t.quote}"</p>
                <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">— {t.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-gradient-card rounded-3xl border border-border p-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Join the Drop?
            </h2>
            <p className="text-muted-foreground mb-8">Limited small-batch flavors, delivered monthly. Once they're gone, they're gone.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#plans"
                className="inline-flex items-center gap-2 bg-gradient-fire px-10 py-4 rounded-full font-display text-base font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--flame)/0.5)] hover:scale-105 transition-all animate-pulse-glow"
              >
                Choose Your Plan <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border border-border px-8 py-4 rounded-full font-display text-sm font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-all"
              >
                Shop Individual Bottles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RamenBox;
