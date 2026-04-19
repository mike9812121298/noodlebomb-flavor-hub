import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import SpiceLevel from "./SpiceLevel";

type FlavorTheme = "original" | "spicy-tokyo" | "citrus-shoyu";

interface FlavorWorldCardProps {
  name: string;
  tagline: string;
  desc: string;
  price: string;
  spice: number;
  bestFor: string;
  image: string;
  buyUrl: string;
  ctaLabel: string;
  proTip?: string | null;
  badge?: string | null;
  comingSoon?: boolean;
  theme: FlavorTheme;
}

/* ── Particle layer for each flavor ── */

const OriginalParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Warm golden radial glow */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(30_80%_40%/0.12)_0%,_transparent_70%)]" />
    {/* Drifting sesame seeds */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`sesame-${i}`}
        className="absolute w-[3px] h-[5px] rounded-full bg-amber-300/25"
        style={{
          left: `${12 + i * 11}%`,
          top: `${20 + (i % 3) * 25}%`,
        }}
        animate={{
          y: [0, -18, 0],
          x: [0, (i % 2 ? 6 : -6), 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 4 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.6,
        }}
      />
    ))}
    {/* Steam wisps */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`steam-${i}`}
        className="absolute bottom-[30%] rounded-full bg-amber-200/[0.04] blur-xl"
        style={{
          left: `${25 + i * 20}%`,
          width: `${40 + i * 15}px`,
          height: `${50 + i * 10}px`,
        }}
        animate={{
          y: [0, -30, -50],
          opacity: [0, 0.08, 0],
          scale: [0.8, 1.2, 1.5],
        }}
        transition={{
          duration: 5 + i,
          repeat: Infinity,
          ease: "easeOut",
          delay: i * 1.8,
        }}
      />
    ))}
    {/* Soy ripple shimmer */}
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-amber-700/[0.06] to-transparent"
      animate={{ opacity: [0.03, 0.08, 0.03] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const SpicyTokyoParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Neon red/pink ambient glow */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(350_90%_50%/0.1)_0%,_transparent_65%)]" />
    {/* Secondary neon accent — top corner */}
    <motion.div
      className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-rose-500/[0.06] blur-3xl"
      animate={{ opacity: [0.04, 0.1, 0.04], scale: [1, 1.15, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Drifting chili flakes */}
    {[...Array(7)].map((_, i) => (
      <motion.div
        key={`chili-${i}`}
        className="absolute rounded-sm"
        style={{
          width: `${2 + (i % 2)}px`,
          height: `${3 + (i % 3)}px`,
          background: `hsl(${350 + i * 5} 80% ${50 + i * 3}%)`,
          left: `${10 + i * 12}%`,
          top: `${15 + (i % 4) * 20}%`,
          opacity: 0.3,
        }}
        animate={{
          y: [0, 20, 0],
          x: [0, (i % 2 ? 8 : -5), 0],
          rotate: [0, (i % 2 ? 45 : -30), 0],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 3.5 + i * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5,
        }}
      />
    ))}
    {/* Heat shimmer — horizontal wave */}
    <motion.div
      className="absolute bottom-[25%] left-0 right-0 h-px"
      style={{
        background: "linear-gradient(90deg, transparent 0%, hsl(350 90% 55% / 0.15) 50%, transparent 100%)",
      }}
      animate={{ opacity: [0, 0.3, 0], scaleX: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Neon flicker glow — bottom edge */}
    <motion.div
      className="absolute bottom-0 left-[10%] right-[10%] h-[2px] rounded-full blur-sm bg-rose-500/30"
      animate={{
        opacity: [0.1, 0.5, 0.2, 0.45, 0.1],
        scaleX: [0.95, 1, 0.97, 1, 0.95],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const CitrusShoyuParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Bright citrus radial glow */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(55_85%_55%/0.08)_0%,_transparent_60%)]" />
    {/* Sunlight streak */}
    <motion.div
      className="absolute -top-10 right-[20%] w-24 h-64 rotate-[25deg] bg-gradient-to-b from-yellow-300/[0.04] to-transparent blur-2xl"
      animate={{ opacity: [0.02, 0.07, 0.02], x: [0, 8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Zest curls / citrus droplets */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={`zest-${i}`}
        className="absolute rounded-full"
        style={{
          width: `${2 + (i % 2)}px`,
          height: `${2 + (i % 2)}px`,
          background: `hsl(${50 + i * 8} ${75 + i * 3}% ${55 + i * 4}%)`,
          left: `${15 + i * 13}%`,
          top: `${18 + (i % 3) * 22}%`,
        }}
        animate={{
          y: [0, -14, 0],
          opacity: [0.1, 0.35, 0.1],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 3.8 + i * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.7,
        }}
      />
    ))}
    {/* Broth shimmer — soft horizontal light */}
    <motion.div
      className="absolute top-[40%] left-0 right-0 h-[1px]"
      style={{
        background: "linear-gradient(90deg, transparent 0%, hsl(48 80% 60% / 0.12) 50%, transparent 100%)",
      }}
      animate={{ opacity: [0, 0.2, 0], scaleX: [0.5, 1, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Citrus glow — bottom warmth */}
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-yellow-500/[0.04] to-transparent"
      animate={{ opacity: [0.02, 0.06, 0.02] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const particleMap: Record<FlavorTheme, React.FC> = {
  original: OriginalParticles,
  "spicy-tokyo": SpicyTokyoParticles,
  "citrus-shoyu": CitrusShoyuParticles,
};

/* ── Hover glow color per flavor ── */
const hoverGlowMap: Record<FlavorTheme, string> = {
  original: "0 0 32px hsl(30 80% 45% / 0.2), 0 24px 60px hsl(0 0% 0% / 0.35)",
  "spicy-tokyo": "0 0 32px hsl(350 90% 50% / 0.25), 0 24px 60px hsl(0 0% 0% / 0.35)",
  "citrus-shoyu": "0 0 32px hsl(48 80% 50% / 0.2), 0 24px 60px hsl(0 0% 0% / 0.35)",
};

/* ── Border accent per flavor ── */
const borderAccentMap: Record<FlavorTheme, string> = {
  original: "border-amber-600/10 hover:border-amber-500/20",
  "spicy-tokyo": "border-rose-600/10 hover:border-rose-500/25",
  "citrus-shoyu": "border-yellow-500/10 hover:border-yellow-400/20",
};

export default function FlavorWorldCard({
  name,
  tagline,
  desc,
  price,
  spice,
  bestFor,
  image,
  buyUrl,
  ctaLabel,
  proTip,
  badge,
  comingSoon,
  theme,
}: FlavorWorldCardProps) {
  const Particles = particleMap[theme];

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: hoverGlowMap[theme],
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[hsl(0_0%_9%)] to-[hsl(0_0%_5%)] border transition-colors duration-500 ${borderAccentMap[theme]}`}
      style={{ willChange: "transform" }}
    >
      {/* ── Image area with flavor world ── */}
      <div className="relative aspect-[4/5] overflow-hidden flex items-center justify-center px-4 pt-6">
        {/* Layer 1: background mood */}
        <Particles />

        {/* Layer 3: subtle shimmer overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.02] to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Bottle — hero layer */}
        <motion.img
          src={image}
          alt={name}
          className={`relative z-10 h-full w-auto object-contain object-bottom drop-shadow-2xl ${comingSoon ? "opacity-60" : ""}`}
          style={{ willChange: "transform" }}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        {/* Coming Soon overlay */}
        {comingSoon && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <span className="px-6 py-2.5 rounded-full bg-background/90 border border-border text-foreground font-display text-xs font-bold uppercase tracking-[0.2em]">
              Coming Soon
            </span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <motion.div
            className="absolute top-3 left-3 z-20"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="px-3 py-1.5 rounded-full bg-gradient-fire text-primary-foreground text-[10px] font-display font-bold uppercase tracking-wider shadow-fire">
              {badge}
            </span>
          </motion.div>
        )}

        {/* Bottom fade to card body */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(0_0%_5%)] to-transparent pointer-events-none z-10" />
      </div>

      {/* ── Card body ── */}
      <div className="relative z-10 p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-1 tracking-tight transition-colors duration-300 group-hover:text-primary/90">
          {name}
        </h3>
        <p className="text-[10px] font-display font-bold uppercase tracking-[0.15em] text-primary/80 mb-1.5">
          {tagline}
        </p>
        {price && (
          <p className="font-display text-2xl font-bold text-primary mb-2">{price}</p>
        )}
        <p className="text-xs text-foreground/50 mb-3">{desc}</p>
        <div className="mb-4">
          <SpiceLevel level={spice} />
        </div>
        <p className="text-[10px] font-display uppercase tracking-[0.15em] text-foreground/40 mb-3">
          Best for: {bestFor}
        </p>
        {proTip && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-[11px] text-foreground/60 leading-relaxed">
              <span className="font-display font-bold text-primary uppercase tracking-wider text-[10px]">
                Pro Tip:{" "}
              </span>
              {proTip}
            </p>
          </div>
        )}
        {comingSoon ? (
          <div className="w-full text-center">
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 bg-secondary/60 px-4 py-3 rounded-full text-sm font-display font-bold uppercase tracking-wider text-foreground/30 cursor-not-allowed"
            >
              Notify Me
            </button>
            <p className="text-[11px] font-display text-muted-foreground mt-2 tracking-wide">
              Coming Soon
            </p>
          </div>
        ) : (
          <div className="w-full text-center">
            <Link
              to={buyUrl}
              className="w-full flex items-center justify-center gap-2 bg-gradient-fire px-4 py-3 rounded-full text-sm font-display font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(var(--flame)/0.4)] hover:scale-[1.02]"
            >
              <ShoppingCart className="h-4 w-4" /> {ctaLabel}
            </Link>
            <p className="text-[11px] font-display text-muted-foreground mt-2 tracking-wide">
              Ships May 2026
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
