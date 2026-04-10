import { motion } from "framer-motion";
import { useMemo } from "react";

const EmberParticles = ({ count = 18 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 5,
        opacity: 0.15 + Math.random() * 0.35,
        drift: -30 + Math.random() * 60,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "-5%",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsl(var(--flame)) 0%, hsl(var(--ember)) 60%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 2}px hsl(var(--flame) / 0.4)`,
          }}
          animate={{
            y: [0, -600 - Math.random() * 300],
            x: [0, p.drift],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0.5, 1, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default EmberParticles;
