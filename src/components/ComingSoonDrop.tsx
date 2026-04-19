import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Flame, Mail, CheckCircle, AlertTriangle, Radio } from "lucide-react";
import nbRyuGarlic from "@/assets/nb-ryu-garlic-clean.png";
import nbSoySauce from "@/assets/nb-review-photo-2.png";

// ── Target drop date ─────────────────────────────────────────────────────────
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

// ── Glitch text ───────────────────────────────────────────────────────────────
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#";
function useGlitch(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let frame = 0;
    const id = setInterval(() => {
      setDisplay(
        text.split("").map((ch, i) =>
          ch === " " ? " " : frame > i * 1.5
            ? ch
            : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join("")
      );
      if (++frame > text.length * 2) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [active, text]);
  return display;
}

// ── Countdown digit ───────────────────────────────────────────────────────────
const Digit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-black border border-[#c8a24a]/30 rounded-lg overflow-hidden flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_10px_rgba(200,162,74,0.15)]">
      {/* scan line */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,162,74,0.03) 2px, rgba(200,162,74,0.03) 4px)"
      }} />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-2xl md:text-3xl font-bold text-[#c8a24a] tabular-nums"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="mt-1.5 text-[9px] font-display font-bold uppercase tracking-[0.3em] text-[#c8a24a]/50">{label}</span>
  </div>
);

// ── Dossier card ──────────────────────────────────────────────────────────────
interface DossierProps {
  code: string;
  name: string;
  tagline: string;
  status: string;
  statusColor: string;
  image: string;
  imageGlow: string;
  briefLines: (string | "REDACTED")[];
  cta: { label: string; to?: string; href?: string };
  rotate: string;
  declassified?: boolean;
}

const DossierCard = ({
  code, name, tagline, status, statusColor, image, imageGlow,
  briefLines, cta, rotate, declassified,
}: DossierProps) => {
  const [hovered, setHovered] = useState(false);
  const glitchedName = useGlitch(name, hovered);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate === "left" ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotate === "left" ? -1.5 : 1.5 }}
      whileHover={{ rotate: 0, y: -8, scale: 1.02 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative bg-[#0a0a0a] border border-[#c8a24a]/25 rounded-2xl overflow-hidden cursor-default"
      style={{
        boxShadow: hovered
          ? `0 0 50px ${imageGlow}55, inset 0 0 40px rgba(0,0,0,0.6)`
          : `0 0 20px ${imageGlow}22, inset 0 0 40px rgba(0,0,0,0.6)`,
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,162,74,0.04) 3px, rgba(200,162,74,0.04) 4px)"
      }} />

      {/* corner marks */}
      {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((cls) => (
        <div key={cls} className={`absolute w-4 h-4 border-[#c8a24a]/40 ${cls}`} />
      ))}

      {/* top bar */}
      <div className="relative z-20 flex items-center justify-between px-5 py-3 border-b border-[#c8a24a]/15 bg-[#c8a24a]/[0.04]">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${declassified ? "bg-amber-400" : "bg-red-500"} animate-pulse`} />
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#c8a24a]/60">DOSSIER / {code}</span>
        </div>
        <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>{status}</span>
      </div>

      {/* image area */}
      <div className="relative flex items-center justify-center px-8 pt-6 pb-2 overflow-hidden" style={{ minHeight: 220 }}>
        {/* glow behind bottle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full blur-3xl opacity-30" style={{ background: imageGlow }} />
        </div>
        <motion.img
          src={image}
          alt={name}
          animate={hovered ? { scale: 1.08, filter: "brightness(1.1)" } : { scale: 1, filter: "brightness(0.85)" }}
          transition={{ duration: 0.4 }}
          className="relative z-10 h-44 w-auto object-contain drop-shadow-2xl"
        />
        {/* CLASSIFIED stamp — rotated */}
        {!declassified && (
          <motion.div
            initial={{ opacity: 0, scale: 1.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="absolute z-20 pointer-events-none select-none"
            style={{ rotate: "-22deg" }}
          >
            <div className="border-4 border-red-600/80 rounded px-4 py-1.5">
              <span className="font-mono text-xl font-black tracking-[0.4em] text-red-600/80">CLASSIFIED</span>
            </div>
          </motion.div>
        )}
        {declassified && (
          <motion.div
            initial={{ opacity: 0, scale: 1.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="absolute z-20 pointer-events-none select-none"
            style={{ rotate: "-18deg" }}
          >
            <div className="border-4 border-[#c8a24a]/70 rounded px-4 py-1.5">
              <span className="font-mono text-xl font-black tracking-[0.35em] text-[#c8a24a]/70">DECLASSIFIED</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* content */}
      <div className="relative z-20 px-6 pb-6">
        <h3 className="font-mono text-xl font-bold text-[#c8a24a] tracking-tight mb-0.5">
          {glitchedName}
        </h3>
        <p className="text-[11px] font-display font-bold uppercase tracking-[0.2em] text-[#c8a24a]/50 mb-4">{tagline}</p>

        {/* brief lines */}
        <div className="space-y-2 mb-5 font-mono text-xs text-[#c8a24a]/60">
          {briefLines.map((line, i) =>
            line === "REDACTED" ? (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#c8a24a]/30">►</span>
                <span className="inline-block bg-[#c8a24a]/20 rounded h-3 w-full max-w-[180px]" />
              </div>
            ) : (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#c8a24a]/30 mt-0.5">►</span>
                <span>{line}</span>
              </div>
            )
          )}
        </div>

        {/* CTA */}
        {cta.to ? (
          <Link
            to={cta.to}
            className="w-full flex items-center justify-center gap-2 border border-[#c8a24a]/40 hover:border-[#c8a24a] hover:bg-[#c8a24a]/10 px-4 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#c8a24a] transition-all duration-300"
          >
            {cta.label} →
          </Link>
        ) : (
          <a
            href={cta.href ?? "#early-access"}
            className="w-full flex items-center justify-center gap-2 border border-[#c8a24a]/40 hover:border-[#c8a24a] hover:bg-[#c8a24a]/10 px-4 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#c8a24a] transition-all duration-300"
          >
            {cta.label} →
          </a>
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
  const [titleHover, setTitleHover] = useState(false);
  const glitchedTitle = useGlitch("NEXT DROP", titleHover);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Append to email capture URL with source tag
    const url = new URL("https://noodlebomb.co");
    url.searchParams.set("source", "coming-soon");
    url.searchParams.set("email", email);
    setSubmitted(true);
  };

  return (
    <section className="py-32 border-t border-[#c8a24a]/10 bg-[#050505] relative overflow-hidden">
      {/* ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-[100px]" />
        {/* grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(rgba(200,162,74,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,162,74,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="container relative z-10">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-red-600/30 bg-red-600/5">
            <Radio className="h-3 w-3 text-red-500 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-red-400/80">
              Classified Intel — 2 Drops Incoming
            </span>
          </div>

          <h2
            className="font-mono text-5xl md:text-7xl font-black tracking-tight text-[#c8a24a] mb-3 cursor-default select-none"
            onMouseEnter={() => setTitleHover(true)}
            onMouseLeave={() => { setTitleHover(false); }}
            style={{ textShadow: "0 0 40px rgba(200,162,74,0.3), 0 0 80px rgba(200,162,74,0.1)" }}
          >
            {glitchedTitle}
          </h2>
          <p className="font-mono text-sm text-[#c8a24a]/40 tracking-[0.2em] uppercase">
            Two new weapons. One declassified. One still in development.
          </p>
        </motion.div>

        {/* countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex flex-col items-center gap-4">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="h-3 w-3 text-red-500/70" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#c8a24a]/30">Time Remaining Until Drop</span>
              <AlertTriangle className="h-3 w-3 text-red-500/70" />
            </div>
            <div className="flex items-center gap-3 md:gap-5">
              <Digit value={days} label="Days" />
              <span className="font-mono text-2xl font-bold text-[#c8a24a]/40 -mt-5 select-none">:</span>
              <Digit value={hours} label="Hours" />
              <span className="font-mono text-2xl font-bold text-[#c8a24a]/40 -mt-5 select-none">:</span>
              <Digit value={minutes} label="Min" />
              <span className="font-mono text-2xl font-bold text-[#c8a24a]/40 -mt-5 select-none">:</span>
              <Digit value={seconds} label="Sec" />
            </div>
          </div>
        </motion.div>

        {/* dossier cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
          <DossierCard
            code="NB-004"
            name="RYU GARLIC"
            tagline="Fire-Breathing Umami King"
            status="STATUS: DEVELOPMENT"
            statusColor="text-red-400/80"
            image={nbRyuGarlic}
            imageGlow="#c8390c"
            rotate="left"
            briefLines={[
              "Roasted black garlic. Chili oil.",
              "REDACTED",
              "Best for: Steak, burgers, anything bold.",
              "REDACTED",
              "Spice level: ████████░░",
            ]}
            cta={{ label: "Join Waitlist", href: "#early-access" }}
          />
          <DossierCard
            code="NB-005"
            name="NOODLE BOMB SOY"
            tagline="Premium Private Label Soy Sauce"
            status="STATUS: PREVIEW LIVE"
            statusColor="text-[#c8a24a]/80"
            image={nbSoySauce}
            imageGlow="#c8a24a"
            rotate="right"
            declassified
            briefLines={[
              "Traditionally brewed. 16.9 oz.",
              "Cleaner than anything on your shelf.",
              "REDACTED",
              "Less sodium. Full umami. No compromise.",
            ]}
            cta={{ label: "Read the Brief", to: "/soy-sauce" }}
          />
        </div>

        {/* email capture */}
        <motion.div
          id="early-access"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="flex items-center gap-2 justify-center mb-3">
            <Lock className="h-3.5 w-3.5 text-[#c8a24a]/50" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8a24a]/40">
              Clearance Required
            </span>
          </div>
          <p className="font-mono text-sm text-[#c8a24a]/60 mb-5 leading-relaxed">
            Get early access before public launch. First batch is limited.
          </p>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-3"
              >
                <CheckCircle className="h-5 w-5 text-[#c8a24a]" />
                <span className="font-mono text-sm text-[#c8a24a] tracking-wider">Access Granted. We'll be in touch.</span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c8a24a]/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-black border border-[#c8a24a]/25 rounded-lg font-mono text-sm text-[#c8a24a] placeholder:text-[#c8a24a]/20 focus:outline-none focus:border-[#c8a24a]/60 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c8a24a] hover:bg-[#d4ad55] rounded-lg font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors whitespace-nowrap"
                >
                  Get Access
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          <p className="font-mono text-[9px] text-[#c8a24a]/20 mt-3 tracking-wider uppercase">
            No spam. Drop alerts only. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonDrop;
