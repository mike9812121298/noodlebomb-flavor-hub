import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Mail, CheckCircle, ArrowRight, Clock } from "lucide-react";
import nbRyuGarlic from "@/assets/nb-ryu-garlic-clean.png";
import nbSoySauce from "@/assets/nb-review-photo-2.png";

// ── Target drop date ──────────────────────────────────────────────────────────
const DROP_DATE = new Date("2026-08-01T00:00:00");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ── Countdown digit ───────────────────────────────────────────────────────────
const Digit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-card rounded-xl border border-border flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 18, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="font-display text-2xl md:text-3xl font-bold text-primary tabular-nums"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-[10px] font-display font-semibold uppercase tracking-[0.25em] text-muted-foreground">
      {label}
    </span>
  </div>
);

// ── Drop card ─────────────────────────────────────────────────────────────────
interface DropCardProps {
  name: string;
  tagline: string;
  description: string;
  status: "coming-soon" | "preview";
  image: string;
  glowColor: string;
  cta: { label: string; to?: string; href?: string };
}

const DropCard = ({ name, tagline, description, status, image, glowColor, cta }: DropCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative bg-gradient-card rounded-2xl border border-border overflow-hidden group"
      style={{
        boxShadow: hovered
          ? `0 0 60px ${glowColor}22, 0 20px 60px -15px rgba(0,0,0,0.5)`
          : `0 4px 30px -10px rgba(0,0,0,0.4)`,
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* Status badge */}
      <div className="absolute top-4 left-4 z-10">
        {status === "preview" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/25 text-[10px] font-display font-bold uppercase tracking-wider text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Preview Live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-[10px] font-display font-bold uppercase tracking-wider text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            In Development
          </span>
        )}
      </div>

      {/* Image area */}
      <div className="relative flex items-center justify-center px-10 pt-16 pb-4" style={{ minHeight: 220 }}>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: hovered ? 0.25 : 0.12, transition: "opacity 0.4s ease" }}
        >
          <div className="w-52 h-52 rounded-full blur-3xl" style={{ background: glowColor }} />
        </div>
        <motion.img
          src={image}
          alt={name}
          animate={hovered ? { scale: 1.07, y: -6 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 h-44 w-auto object-contain drop-shadow-2xl"
        />
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground tracking-tight mb-1">
            {name}
          </h3>
          <p className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {tagline}
          </p>
        </div>

        <p className="text-sm text-foreground/70 leading-relaxed">
          {description}
        </p>

        {/* CTA */}
        {cta.to ? (
          <Link
            to={cta.to}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/40 px-4 py-2.5 rounded-full font-display text-sm font-semibold text-foreground/80 hover:text-primary transition-all duration-300 group/btn"
          >
            {cta.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        ) : cta.href ? (
          <a
            href={cta.href}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/40 px-4 py-2.5 rounded-full font-display text-sm font-semibold text-foreground/80 hover:text-primary transition-all duration-300 group/btn"
          >
            {cta.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </a>
        ) : (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-secondary border border-border px-4 py-2.5 rounded-full font-display text-sm font-semibold text-muted-foreground cursor-not-allowed opacity-50"
          >
            {cta.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ── Main section ──────────────────────────────────────────────────────────────
const ComingSoonDrop = () => {
  const { days, hours, minutes, seconds } = useCountdown(DROP_DATE);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-24 border-t border-border relative overflow-hidden">
      {/* Subtle ambient background — matches rest of site */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.07]"
          style={{ background: "hsl(var(--flame))" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05]"
          style={{ background: "hsl(var(--primary))" }} />
      </div>

      <div className="container relative z-10">

        {/* Header */}
        <motion.div
          initial={{ y: 16 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Flame className="h-3 w-3 text-primary animate-pulse" />
            <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-primary">
              2 Drops Incoming
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-3">
            What's Next
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Two new releases in the pipeline. One almost ready. One still under wraps.
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ y: 12 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-14"
        >
          <div className="inline-flex flex-col items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Drop Countdown
              </span>
            </div>
            <div className="flex items-start gap-3 md:gap-5">
              <Digit value={days} label="Days" />
              <span className="font-display text-2xl font-bold text-border mt-4 select-none">:</span>
              <Digit value={hours} label="Hours" />
              <span className="font-display text-2xl font-bold text-border mt-4 select-none">:</span>
              <Digit value={minutes} label="Min" />
              <span className="font-display text-2xl font-bold text-border mt-4 select-none">:</span>
              <Digit value={seconds} label="Sec" />
            </div>
          </div>
        </motion.div>

        {/* Drop cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-14">
          <DropCard
            name="Ryu Garlic"
            tagline="Bold, garlicky heat with deep umami"
            description="Roasted black garlic, chili oil, and deep umami. Built for steak, burgers, and anything that can take real heat."
            status="coming-soon"
            image={nbRyuGarlic}
            glowColor="hsl(var(--flame))"
            cta={{ label: "Coming Soon" }}
          />
          <DropCard
            name="NoodleBomb Soy"
            tagline="Premium Private Label Soy Sauce"
            description="Naturally fermented. 35% less sodium. No fillers, no shortcuts. 16.9 oz of the real thing."
            status="preview"
            image={nbSoySauce}
            glowColor="hsl(var(--accent))"
            cta={{ label: "Read More", to: "/soy-sauce" }}
          />
        </div>

        {/* Email capture */}
        <motion.div
          id="notify-me"
          initial={{ y: 12 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <p className="text-sm text-muted-foreground mb-5">
            Get notified before we launch. First batch will be limited.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-3"
              >
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-display text-sm font-semibold text-foreground">
                  You're on the list. We'll reach out first.
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-secondary border border-border rounded-full font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-fire hover:shadow-fire rounded-full font-display text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:scale-[1.02] whitespace-nowrap"
                >
                  Notify Me
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-[11px] text-muted-foreground/50 mt-3 font-display uppercase tracking-wider">
            No spam. Drop alerts only.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default ComingSoonDrop;
