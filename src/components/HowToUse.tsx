import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const uses = [
  { emoji: "🍜", label: "Slurp-Worthy Ramen", tagline: "The Perfect Ramen Finisher", category: "Ramen" },
  { emoji: "🍗", label: "Crispy Glazed Wings", tagline: "The Ultimate Wing Glaze", category: "Grilling" },
  { emoji: "🥩", label: "Seared Umami Steak", tagline: "A Savory Umami Crust", category: "Grilling" },
  { emoji: "🍳", label: "Runny-Yolk Eggs", tagline: "A Rich Morning Upgrade", category: "Quick Meals" },
  { emoji: "🥟", label: "Juicy Dumplings", tagline: "The Ultimate Dipping Sauce", category: "Quick Meals" },
  { emoji: "🍚", label: "Loaded Rice Bowls", tagline: "Your Rice Bowl's Best Friend", category: "Rice Bowls" },
  { emoji: "🦐", label: "Buttery Garlic Shrimp", tagline: "A Bright Citrus Kiss", category: "Seafood" },
  { emoji: "🥗", label: "Bold Marinades", tagline: "The Deep Flavor Marinade", category: "Quick Meals" },
];

const HowToUse = () => (
  <section className="py-32 overflow-hidden">
    <div className="section-divider mb-32" />
    <div className="container text-center">
      <motion.div
        initial={{ opacity: 1, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-14"
      >
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary/70 mb-3 block">
          The Perfect Ramen Finisher
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          One Sauce. <span className="text-gradient-fire">Infinite</span> Possibilities.
        </h2>
      </motion.div>
      <div className="flex flex-wrap justify-center gap-4 md:gap-5">
        {uses.map((use, i) => (
          <Link key={use.label} to={`/recipes?category=${encodeURIComponent(use.category)}`}>
            <motion.div
              initial={{ opacity: 1, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.08, y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-2.5 px-7 py-5 rounded-2xl border border-border/60 bg-gradient-card hover:border-primary/30 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.12)] transition-all cursor-pointer group"
            >
              <span className="text-4xl brightness-110 group-hover:scale-110 transition-transform duration-300">{use.emoji}</span>
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-foreground/50 group-hover:text-foreground/80 transition-colors">{use.label}</span>
              <span className="text-[9px] font-display italic text-primary/50 group-hover:text-primary/70 transition-colors leading-tight">{use.tagline}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default HowToUse;
