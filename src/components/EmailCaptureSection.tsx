import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";

const EmailCaptureSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-32">
      <div className="section-divider mb-32" />
      <div className="container">
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          {!submitted ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-6"
              >
                <Flame className="h-9 w-9 text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.4)]" />
              </motion.div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
                Unlock <span className="text-gradient-fire">15% Off</span> Your First Drop
              </h2>
              <p className="text-foreground/70 font-display text-sm mb-1">
                Join the NoodleBomb kitchen crew.
              </p>
              <p className="text-foreground/50 text-sm mb-10 max-w-md mx-auto leading-relaxed">
                Get exclusive recipes, early drops, and 15% off your first bottle.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-3.5 rounded-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                />
                <button
                  type="submit"
                  className="bg-gradient-fire px-8 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-wider text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--flame)/0.45)] hover:scale-105 transition-all whitespace-nowrap flex items-center justify-center gap-2"
                >
                  Get My 15% <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              <p className="text-[10px] text-foreground/30 font-display mt-5 tracking-[0.2em] uppercase">No spam. Just flavor.</p>
            </>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <span className="text-5xl mb-5 block">🔥</span>
              <h3 className="font-display text-3xl font-bold text-foreground mb-3">You're In!</h3>
              <p className="text-sm text-muted-foreground">Check your inbox for your 15% off code.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default EmailCaptureSection;
