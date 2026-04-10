import { motion } from "framer-motion";
import { Flame, Leaf, Sparkles, HandMetal, ShieldCheck } from "lucide-react";

const signals = [
  { icon: Flame, label: "Small Batch" },
  { icon: Sparkles, label: "Premium Ingredients" },
  { icon: HandMetal, label: "Japanese-Inspired" },
  { icon: Leaf, label: "No Fillers" },
  { icon: ShieldCheck, label: "Handcrafted" },
];

const PressBar = () => (
  <section className="py-10 border-t border-border overflow-hidden">
    <div className="container">
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {signals.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center gap-2"
          >
            {i > 0 && <span className="hidden md:block w-px h-4 bg-border/50 -ml-3 md:-ml-5 mr-1 md:mr-0" />}
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <s.icon className="h-4 w-4 text-primary/60" />
            </motion.div>
            <span className="font-display text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PressBar;
