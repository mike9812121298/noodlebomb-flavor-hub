import { motion } from "framer-motion";
import { Pipette, Utensils, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Pipette,
    title: "Pick Your Sauce",
    desc: "Choose your flavor profile — from bold umami to fiery chili heat.",
    color: "group-hover:text-primary group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]",
  },
  {
    icon: Utensils,
    title: "Drizzle on Anything",
    desc: "Ramen, wings, steak, rice, eggs — one drizzle transforms every dish.",
    color: "group-hover:text-accent group-hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.5)]",
  },
  {
    icon: Sparkles,
    title: "Instant Upgrade",
    desc: "Restaurant-level flavor in seconds. No prep. No stress. Just flavor.",
    color: "group-hover:text-primary group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]",
  },
];

const HowItWorks = () => (
  <section className="py-32">
    <div className="section-divider mb-32" />
    <div className="container">
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-20"
      >
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">
          Simple. Fast. Flavor.
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">How It Works</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
        <div className="hidden md:block absolute top-[3.5rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 1, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ y: -8 }}
            className="text-center group cursor-default relative"
          >
            <div className="relative mx-auto mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-secondary/80 border border-border group-hover:border-primary/30 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)] transition-all duration-500">
              <step.icon className={`h-7 w-7 text-foreground/50 transition-all duration-500 ${step.color}`} />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                <span className="text-[10px] font-display font-bold text-primary">{i + 1}</span>
              </div>
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2 tracking-tight">{step.title}</h3>
            <p className="text-sm text-foreground/50 leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
