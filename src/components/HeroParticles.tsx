import { useEffect, useRef } from "react";

type ParticleType = "sesame" | "chili" | "soy";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: ParticleType;
  phase: number;
  driftFreq: number;
  angle: number;
  r: number;
  g: number;
  b: number;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createParticle(w: number, h: number): Particle {
  // Weighted distribution: more sesame, some chili, few soy droplets
  const typeDist: ParticleType[] = [
    "sesame", "sesame", "sesame",
    "chili", "chili",
    "soy",
  ];
  const type = typeDist[Math.floor(Math.random() * typeDist.length)];

  let r = 0, g = 0, b = 0;
  if (type === "sesame") {
    // Cream / tan tones
    r = Math.floor(rand(195, 222));
    g = Math.floor(rand(178, 202));
    b = Math.floor(rand(142, 168));
  } else if (type === "chili") {
    // Deep red / burnt orange
    r = Math.floor(rand(158, 212));
    g = Math.floor(rand(26, 58));
    b = Math.floor(rand(8, 28));
  } else {
    // Dark soy-sauce brown
    r = Math.floor(rand(26, 48));
    g = Math.floor(rand(12, 22));
    b = Math.floor(rand(4, 12));
  }

  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: rand(-0.05, 0.05),
    vy: rand(-0.26, -0.07), // upward drift — slow, like heat shimmer
    size: rand(2, 5.5),
    opacity: rand(0.15, 0.42),
    type,
    phase: rand(0, Math.PI * 2),
    driftFreq: rand(0.007, 0.024),
    angle: rand(0, Math.PI * 2),
    r,
    g,
    b,
  };
}

const HeroParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const COUNT = 52;
    const particles: Particle[] = Array.from({ length: COUNT }, () =>
      createParticle(width, height)
    );

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let frame = 0;

    function drawParticle(p: Particle) {
      const { x, y, size, opacity, type, r, g, b } = p;
      const color = `rgba(${r},${g},${b},${opacity})`;

      ctx!.save();
      ctx!.translate(x, y);

      if (type === "sesame") {
        // Small oval — rotates slowly
        ctx!.rotate(p.angle + frame * 0.0025);
        ctx!.beginPath();
        ctx!.ellipse(0, 0, size * 0.38, size, 0, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
      } else if (type === "chili") {
        // Tiny irregular triangle fragment
        ctx!.rotate(p.angle + frame * 0.004);
        ctx!.beginPath();
        ctx!.moveTo(0, -size);
        ctx!.lineTo(size * 0.52, size * 0.38);
        ctx!.lineTo(-size * 0.52, size * 0.38);
        ctx!.closePath();
        ctx!.fillStyle = color;
        ctx!.fill();
      } else {
        // Soy droplet — small circle
        ctx!.beginPath();
        ctx!.arc(0, 0, size * 0.5, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
      }

      ctx!.restore();
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);
      frame++;

      for (const p of particles) {
        // Gentle horizontal shimmer via sine wave
        p.x += p.vx + Math.sin(frame * p.driftFreq + p.phase) * 0.16;
        p.y += p.vy;

        // Wrap top → reset to bottom with new x
        if (p.y < -10) {
          p.y = height + 10;
          p.x = rand(0, width);
        }
        // Wrap sides
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        drawParticle(p);
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, opacity: 0.28 }}
    />
  );
};

export default HeroParticles;
