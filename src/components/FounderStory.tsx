import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const badges = [
  { label: "Small Batch", icon: "🏺" },
  { label: "All Natural", icon: "🌿" },
  { label: "No Preservatives", icon: "✨" },
  { label: "Vegan Friendly", icon: "🌱" },
];

const FounderStory = () => (
  <section className="py-32">
    <div className="section-divider mb-32" />
    <div className="container">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 1, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <Flame className="h-9 w-9 text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]" />
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">A Note From Ashley</h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-8" />
          <p className="text-foreground/90 font-display font-semibold text-xl mb-6 tracking-tight">Honest flavor. No shortcuts.</p>
          <div className="space-y-4 text-foreground/60 leading-relaxed">
            <p>I started Noodle Bomb because I was tired of overpaying for 'premium' sauces that were full of fillers and short on flavor.</p>
            <p>We don't do outrageous markups, and we don't do shortcuts. Just small batches, honest ingredients, and enough heat to keep things interesting.</p>
            <p>If it's on this site, it's because it's exactly what I serve at my own table.</p>
          </div>
          <p className="mt-8 text-foreground/50 font-display font-semibold text-sm tracking-wide">— Ashley March, Owner &amp; Founder</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {badges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border/60 bg-secondary/50 hover:border-primary/20 hover:bg-secondary/80 transition-all">
                <span className="text-2xl drop-shadow-[0_0_10px_hsl(30_90%_55%/0.5)]">{badge.icon}</span>
                <span className="text-[10px] font-display font-bold uppercase tracking-[0.15em] text-foreground/70">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default FounderStory;
