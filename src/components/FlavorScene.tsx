import { motion, AnimatePresence } from "framer-motion";

type FlavorKey = "Original" | "Spicy Tokyo" | "Citrus Shoyu";

/* ═══════════════════════════════════════════════════════
   SPICY TOKYO — Tokyo alley at night
   Neon signs, chili heat, rain-slicked streets, lanterns
   ═══════════════════════════════════════════════════════ */

const SpicyTokyoScene = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Night sky base */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0618] via-[#120825] to-[#0d0d1a]" />

    {/* Distant city glow — horizon line */}
    <div className="absolute bottom-[25%] left-0 right-0 h-[30%] bg-[radial-gradient(ellipse_120%_50%_at_50%_100%,_rgba(255,50,80,0.08)_0%,_transparent_70%)]" />

    {/* Building silhouettes — layered rectangles */}
    {[
      { l: "2%", w: "8%", h: "55%", bg: "#0a0a12" },
      { l: "8%", w: "6%", h: "48%", bg: "#08080f" },
      { l: "14%", w: "10%", h: "62%", bg: "#0c0c16" },
      { l: "30%", w: "7%", h: "50%", bg: "#0a0a14" },
      { l: "38%", w: "5%", h: "58%", bg: "#08080e" },
      { l: "55%", w: "9%", h: "54%", bg: "#0b0b15" },
      { l: "65%", w: "6%", h: "65%", bg: "#090912" },
      { l: "72%", w: "8%", h: "52%", bg: "#0a0a14" },
      { l: "82%", w: "7%", h: "60%", bg: "#0c0c18" },
      { l: "90%", w: "10%", h: "56%", bg: "#080810" },
    ].map((b, i) => (
      <div
        key={`bldg-${i}`}
        className="absolute bottom-0"
        style={{ left: b.l, width: b.w, height: b.h, background: b.bg }}
      />
    ))}

    {/* Neon signs — glowing rectangles with flicker */}
    {[
      { l: "16%", b: "42%", w: 28, h: 8, color: "rgba(255,40,80,0.7)", blur: 20, delay: 0 },
      { l: "17%", b: "38%", w: 20, h: 5, color: "rgba(0,200,255,0.5)", blur: 15, delay: 1.2 },
      { l: "67%", b: "50%", w: 22, h: 6, color: "rgba(255,100,200,0.6)", blur: 18, delay: 0.5 },
      { l: "70%", b: "44%", w: 16, h: 4, color: "rgba(255,200,50,0.4)", blur: 12, delay: 2 },
      { l: "35%", b: "46%", w: 18, h: 5, color: "rgba(0,255,180,0.4)", blur: 14, delay: 0.8 },
      { l: "84%", b: "48%", w: 24, h: 7, color: "rgba(255,60,60,0.5)", blur: 16, delay: 1.5 },
    ].map((n, i) => (
      <motion.div
        key={`neon-${i}`}
        className="absolute rounded-sm"
        style={{
          left: n.l,
          bottom: n.b,
          width: n.w,
          height: n.h,
          background: n.color,
          boxShadow: `0 0 ${n.blur}px ${n.color}, 0 0 ${n.blur * 2}px ${n.color}`,
        }}
        animate={{
          opacity: [0.6, 1, 0.7, 1, 0.6],
          scale: [1, 1, 1.02, 1, 1],
        }}
        transition={{
          duration: 3 + i * 0.3,
          repeat: Infinity,
          ease: "linear",
          delay: n.delay,
        }}
      />
    ))}

    {/* Hanging lanterns — warm red orbs along a string */}
    <div className="absolute top-[22%] left-[10%] right-[10%] h-px bg-white/[0.03]" />
    {[15, 25, 35, 45, 55, 65, 75, 85].map((x, i) => (
      <motion.div
        key={`lantern-${i}`}
        className="absolute rounded-full"
        style={{
          left: `${x}%`,
          top: `${21 + (i % 2) * 1.5}%`,
          width: 6,
          height: 8,
          background: "radial-gradient(circle, rgba(255,80,40,0.8) 30%, rgba(255,40,20,0.3) 70%)",
          boxShadow: "0 0 12px rgba(255,60,30,0.4), 0 4px 8px rgba(255,40,20,0.2)",
        }}
        animate={{
          opacity: [0.6, 0.9, 0.6],
          y: [0, (i % 2 ? 2 : -2), 0],
        }}
        transition={{
          duration: 3 + i * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.3,
        }}
      />
    ))}

    {/* Steam rising from street level */}
    {[20, 45, 70].map((x, i) => (
      <motion.div
        key={`steam-${i}`}
        className="absolute rounded-full blur-2xl"
        style={{
          left: `${x}%`,
          bottom: "8%",
          width: 60 + i * 20,
          height: 80,
          background: "rgba(200,180,220,0.03)",
        }}
        animate={{
          y: [0, -40, -80],
          opacity: [0, 0.06, 0],
          scale: [0.8, 1.3, 1.8],
        }}
        transition={{
          duration: 5 + i,
          repeat: Infinity,
          ease: "easeOut",
          delay: i * 2,
        }}
      />
    ))}

    {/* Rain streaks */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`rain-${i}`}
        className="absolute bg-white/[0.04] rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: "-5%",
          width: 1,
          height: 15 + Math.random() * 20,
        }}
        animate={{ y: ["0vh", "110vh"] }}
        transition={{
          duration: 0.8 + Math.random() * 0.4,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2,
        }}
      />
    ))}

    {/* Wet street reflection — mirror glow at bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-[rgba(255,50,80,0.04)] to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/10 to-transparent" />

    {/* Drifting chili flakes */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={`chili-${i}`}
        className="absolute rounded-sm"
        style={{
          width: 3,
          height: 4,
          background: `hsl(${350 + i * 5} 80% ${45 + i * 5}%)`,
          left: `${15 + i * 14}%`,
          top: `${30 + (i % 3) * 18}%`,
          opacity: 0.3,
        }}
        animate={{
          y: [0, 30, 0],
          x: [0, (i % 2 ? 10 : -8), 0],
          rotate: [0, 180, 360],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 5 + i * 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.8,
        }}
      />
    ))}

    {/* Heat shimmer overlay */}
    <motion.div
      className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_70%,_rgba(255,40,60,0.04)_0%,_transparent_60%)]"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

/* ═══════════════════════════════════════════════════════
   CITRUS SHOYU — Fresh citrus grove
   Blue sky, sunlight, fruit trees, falling oranges, tall grass
   ═══════════════════════════════════════════════════════ */

const CitrusShoyuScene = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Bright sky gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0c2a4a] via-[#143d5e] to-[#0a1e30]" />

    {/* Sun — large warm orb, top right */}
    <div
      className="absolute top-[8%] right-[18%] w-20 h-20 rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(255,230,150,0.25) 0%, rgba(255,200,80,0.08) 50%, transparent 70%)",
        boxShadow: "0 0 80px rgba(255,220,120,0.15), 0 0 160px rgba(255,200,80,0.08)",
      }}
    />

    {/* Sunlight rays — diagonal streaks */}
    {[
      { r: "12%", t: "5%", rot: 25, w: 2, h: 200, opacity: 0.03 },
      { r: "22%", t: "3%", rot: 30, w: 3, h: 250, opacity: 0.025 },
      { r: "30%", t: "0%", rot: 35, w: 2, h: 280, opacity: 0.02 },
    ].map((ray, i) => (
      <motion.div
        key={`ray-${i}`}
        className="absolute bg-yellow-200 blur-sm"
        style={{
          right: ray.r,
          top: ray.t,
          width: ray.w,
          height: ray.h,
          transform: `rotate(${ray.rot}deg)`,
          opacity: ray.opacity,
          transformOrigin: "top right",
        }}
        animate={{ opacity: [ray.opacity, ray.opacity * 2, ray.opacity] }}
        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i }}
      />
    ))}

    {/* Tree silhouettes — organic shapes */}
    {[
      { l: "3%", w: 80, trunk: 40 },
      { l: "78%", w: 90, trunk: 45 },
      { l: "88%", w: 70, trunk: 35 },
    ].map((tree, i) => (
      <div key={`tree-${i}`} className="absolute bottom-[15%]" style={{ left: tree.l }}>
        {/* Trunk */}
        <div
          className="absolute bottom-0 rounded-sm"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: 4,
            height: tree.trunk,
            background: "rgba(30,50,30,0.6)",
          }}
        />
        {/* Canopy */}
        <motion.div
          className="absolute rounded-full"
          style={{
            bottom: tree.trunk - 15,
            left: "50%",
            transform: "translateX(-50%)",
            width: tree.w,
            height: tree.w * 0.8,
            background: "radial-gradient(ellipse, rgba(30,80,40,0.35) 0%, rgba(20,60,30,0.15) 60%, transparent 80%)",
          }}
          animate={{ scale: [1, 1.02, 1], x: [0, 3, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      </div>
    ))}

    {/* Falling oranges / citrus fruits */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`orange-${i}`}
        className="absolute rounded-full"
        style={{
          width: 6 + (i % 3) * 2,
          height: 6 + (i % 3) * 2,
          background: `radial-gradient(circle at 35% 35%, hsl(${35 + i * 5} 90% ${55 + i * 3}%), hsl(${25 + i * 5} 85% ${40 + i * 2}%))`,
          left: `${8 + i * 11}%`,
          boxShadow: `0 0 6px hsl(${35 + i * 5} 80% 50% / 0.3)`,
        }}
        animate={{
          y: ["-10vh", "90vh"],
          x: [0, (i % 2 ? 15 : -15), (i % 2 ? -5 : 5)],
          rotate: [0, 360],
        }}
        transition={{
          duration: 8 + i * 1.5,
          repeat: Infinity,
          ease: "easeIn",
          delay: i * 1.2,
        }}
      />
    ))}

    {/* Tall grass at bottom — thin blades swaying */}
    <div className="absolute bottom-0 left-0 right-0 h-[18%]">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`grass-${i}`}
          className="absolute bottom-0 rounded-t-full"
          style={{
            left: `${i * 3.4}%`,
            width: 2,
            height: 25 + Math.random() * 30,
            background: `linear-gradient(to top, rgba(${20 + i * 2},${60 + i * 3},${25 + i},0.4), transparent)`,
            transformOrigin: "bottom center",
          }}
          animate={{
            rotate: [
              -3 + (i % 5),
              5 - (i % 3),
              -3 + (i % 5),
            ],
          }}
          transition={{
            duration: 3 + (i % 4) * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>

    {/* Ground */}
    <div className="absolute bottom-0 left-0 right-0 h-[6%] bg-gradient-to-t from-[rgba(15,40,20,0.5)] to-transparent" />

    {/* Citrus zest particles — tiny bright dots drifting */}
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={`zest-${i}`}
        className="absolute rounded-full"
        style={{
          width: 2,
          height: 2,
          background: `hsl(${45 + i * 8} 85% 65%)`,
          left: `${10 + i * 8}%`,
          top: `${20 + (i % 4) * 18}%`,
          boxShadow: `0 0 4px hsl(${45 + i * 8} 80% 60% / 0.5)`,
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, (i % 2 ? 8 : -8), 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 4 + i * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5,
        }}
      />
    ))}

    {/* Atmospheric haze */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,_rgba(100,180,255,0.04)_0%,_transparent_60%)]" />
  </div>
);

/* ═══════════════════════════════════════════════════════
   ORIGINAL — Cozy ramen bar
   Warm amber light, wooden counter, hanging lanterns, steam
   ═══════════════════════════════════════════════════════ */

const OriginalScene = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Warm dark interior base */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e05] via-[#1c1008] to-[#0f0a04]" />

    {/* Warm ambient glow — center of the bar */}
    <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[radial-gradient(ellipse,_rgba(255,160,60,0.08)_0%,_transparent_70%)]" />

    {/* Hanging pendant lights */}
    {[25, 45, 65, 80].map((x, i) => (
      <div key={`pendant-${i}`} className="absolute" style={{ left: `${x}%` }}>
        {/* Wire */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-white/[0.04]" style={{ height: `${12 + i * 3}%` }} />
        {/* Bulb glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: `${12 + i * 3}%`,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 12,
            background: "radial-gradient(circle, rgba(255,180,80,0.7) 20%, rgba(255,140,40,0.3) 60%, transparent 80%)",
            boxShadow: "0 0 25px rgba(255,160,60,0.2), 0 8px 30px rgba(255,140,40,0.1)",
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
        {/* Light cone down */}
        <div
          className="absolute"
          style={{
            top: `${14 + i * 3}%`,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: "50px solid rgba(255,160,60,0.02)",
          }}
        />
      </div>
    ))}

    {/* Wooden counter bar — bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-[#1a0d04] via-[#2a1508] to-transparent" />
    <div className="absolute bottom-[14%] left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-transparent via-amber-800/20 to-transparent" />

    {/* Bowls / counter objects — simple silhouettes */}
    {[20, 50, 75].map((x, i) => (
      <div
        key={`bowl-${i}`}
        className="absolute rounded-b-full"
        style={{
          bottom: `${14 + i * 0.5}%`,
          left: `${x}%`,
          width: 16 + i * 2,
          height: 8,
          background: "rgba(60,30,10,0.4)",
          borderBottom: "1px solid rgba(255,160,60,0.06)",
        }}
      />
    ))}

    {/* Rising steam columns */}
    {[22, 42, 52, 76].map((x, i) => (
      <motion.div
        key={`barsteam-${i}`}
        className="absolute blur-xl rounded-full"
        style={{
          left: `${x}%`,
          bottom: "18%",
          width: 30 + i * 10,
          height: 60,
          background: "rgba(255,200,140,0.02)",
        }}
        animate={{
          y: [0, -50, -100],
          opacity: [0, 0.05, 0],
          scale: [0.6, 1.2, 1.8],
        }}
        transition={{
          duration: 5 + i * 0.8,
          repeat: Infinity,
          ease: "easeOut",
          delay: i * 1.5,
        }}
      />
    ))}

    {/* Floating sesame seeds */}
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={`sesame-${i}`}
        className="absolute rounded-full bg-amber-300/20"
        style={{
          width: 2 + (i % 2),
          height: 3 + (i % 2),
          left: `${10 + i * 8}%`,
          top: `${25 + (i % 4) * 15}%`,
        }}
        animate={{
          y: [0, -15, 0],
          x: [0, (i % 2 ? 5 : -5), 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 5 + i * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.6,
        }}
      />
    ))}

    {/* Warm golden light wash */}
    <motion.div
      className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(255,140,40,0.04)_0%,_transparent_70%)]"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Garlic / ingredient particles — warm dots */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`garlic-${i}`}
        className="absolute rounded-full"
        style={{
          width: 3,
          height: 3,
          background: "rgba(255,220,160,0.15)",
          left: `${20 + i * 15}%`,
          top: `${35 + (i % 3) * 15}%`,
          boxShadow: "0 0 6px rgba(255,180,80,0.1)",
        }}
        animate={{
          y: [0, -12, 0],
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 4 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 1,
        }}
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT — animates scene in/out with slide changes
   ═══════════════════════════════════════════════════════ */

const sceneMap: Record<FlavorKey, React.FC> = {
  Original: OriginalScene,
  "Spicy Tokyo": SpicyTokyoScene,
  "Citrus Shoyu": CitrusShoyuScene,
};

interface FlavorSceneProps {
  activeFlavor: FlavorKey;
}

export default function FlavorScene({ activeFlavor }: FlavorSceneProps) {
  const Scene = sceneMap[activeFlavor];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeFlavor}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Scene />
      </motion.div>
    </AnimatePresence>
  );
}
