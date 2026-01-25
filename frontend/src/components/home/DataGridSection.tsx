import { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  type: "primary" | "secondary" | "accent" | "glow";
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const DataGridSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth the scroll signal to avoid jitter / “glitchy” motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    mass: 0.2,
  });

  // Transform values based on scroll (driven by smoothed progress)
  const rotateX = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [70, 30, 15, 0]);
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [-5, 0, 5]);
  const scale = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [0.6, 1, 1.08, 1.12]);
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.25]);
  const y = useTransform(smoothProgress, [0, 1], ["30%", "-20%"]);
  const blur = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [10, 0, 0, 5]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  // Generate particles ONCE (reduced count + more stable motion)
  const particles = useMemo<Particle[]>(() => {
    const pts: Particle[] = [];

    // Fewer particles = smoother. Keep the “wow” by biasing to glow/primary.
    const MAIN = 200;
    const ACCENT = 60;

    for (let i = 0; i < MAIN; i++) {
      const r = Math.random();
      const type: Particle["type"] =
        r > 0.78 ? "glow" : r > 0.45 ? "primary" : "secondary";

      const baseSize =
        type === "glow" ? Math.random() * 10 + 6 : type === "primary" ? Math.random() * 5 + 2.5 : Math.random() * 3 + 1.5;

      pts.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: baseSize,
        delay: Math.random() * 1.2, // less delay spread = less chaotic popping
        duration: Math.random() * 5 + 6, // longer cycles = smoother
        opacity:
          type === "glow" ? 0.70 : type === "primary" ? 0.6 : Math.random() * 0.25 + 0.18,
        type,
      });
    }

    for (let i = MAIN; i < MAIN + ACCENT; i++) {
      pts.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.6 + 0.6,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 4.5,
        opacity: Math.random() * 0.3 + 0.1,
        type: "accent",
      });
    }

    return pts;
  }, []);

  // Grid configuration (slightly fewer lines = less work)
  const gridLines = useMemo(() => {
    const lines: { start: { x: number; y: number }; end: { x: number; y: number }; delay: number }[] = [];
    const rows = 16;
    const cols = 24;

    for (let i = 0; i <= rows; i++) {
      const yy = (i / rows) * 100;
      lines.push({
        start: { x: 0, y: yy },
        end: { x: 100, y: yy },
        delay: i * 0.02,
      });
    }

    for (let i = 0; i <= cols; i++) {
      const xx = (i / cols) * 100;
      lines.push({
        start: { x: xx, y: 0 },
        end: { x: xx, y: 100 },
        delay: i * 0.015 + 0.35,
      });
    }

    return lines;
  }, []);

  // Connections: avoid O(n^2) across many particles (sample a subset)
  const connections = useMemo(() => {
    const candidates = particles.filter((p) => p.type === "glow" || p.type === "primary");
    const subset = candidates.slice(0, 36); // small subset keeps it smooth

    const conns: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    const MAX = 28;

    for (let i = 0; i < subset.length && conns.length < MAX; i++) {
      for (let j = i + 1; j < subset.length && conns.length < MAX; j++) {
        const dx = subset[i].x - subset[j].x;
        const dy = subset[i].y - subset[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 14 && distance > 4) {
          conns.push({
            x1: subset[i].x,
            y1: subset[i].y,
            x2: subset[j].x,
            y2: subset[j].y,
            opacity: clamp(((14 - distance) / 14) * 0.28, 0.05, 0.28),
          });
        }
      }
    }
    return conns;
  }, [particles]);

  // Sparkles: DO NOT use Math.random() inside render (causes “glitch” on re-render)
  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.8,
      duration: 2.2 + Math.random() * 2.2,
      delay: Math.random() * 4.5,
      opacity: 0.9,
    }));
  }, []);

  // Text reveal
  const textOpacity = useTransform(smoothProgress, [0.25, 0.4, 0.6, 0.75], [0, 1, 1, 0]);
  const textY = useTransform(smoothProgress, [0.25, 0.4, 0.6, 0.75], [40, 0, 0, -40]);
  const textScale = useTransform(smoothProgress, [0.25, 0.4, 0.6, 0.75], [0.97, 1, 1, 1.01]);

  const getParticleStyle = (particle: Particle) => {
    switch (particle.type) {
      case "glow":
        return {
          backgroundColor: "hsl(var(--primary))",
          boxShadow: `
            0 0 40px hsl(var(--primary) / 0.9),
            0 0 80px hsl(var(--primary) / 0.5),
            0 0 140px hsl(var(--primary) / 0.25)
            `,
        };
      case "primary":
        return {
          backgroundColor: "hsl(var(--primary))",
          boxShadow: "0 0 12px hsl(var(--primary) / 0.45)",
        };
      case "secondary":
        return {
          backgroundColor: "hsl(var(--primary) / 0.6)",
          boxShadow: "0 0 7px hsl(var(--primary) / 0.25)",
        };
      case "accent":
        return {
          backgroundColor: "hsl(var(--primary) / 0.35)",
          boxShadow: "none",
        };
      default:
        return {};
    }
  };

  // Motion presets (reused, fewer objects allocated each render)
  const particleEase = "easeInOut";
  const repeat = reduceMotion ? 0 : Infinity;

  return (
    <section ref={containerRef} className="relative min-h-[200vh] overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none z-20" />

      {/* Main visual container */}
      <motion.div
        style={{ opacity, y, filter }}
        className="sticky top-0 h-screen w-full flex items-center justify-center"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          className="relative w-full max-w-7xl aspect-[16/10] [perspective:1200px]"
        >
          {/* Warped grid mesh */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.25" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {gridLines.map((line, i) => (
              <motion.line
                key={i}
                x1={`${line.start.x}%`}
                y1={`${line.start.y}%`}
                x2={`${line.end.x}%`}
                y2={`${line.end.y}%`}
                stroke="url(#gridGradient)"
                strokeWidth="0.11"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: line.delay, ease: "easeOut" }}
                viewport={{ once: true }}
                filter="url(#glow)"
              />
            ))}

            {connections.map((conn, i) => (
              <motion.line
                key={`conn-${i}`}
                x1={`${conn.x1}%`}
                y1={`${conn.y1}%`}
                x2={`${conn.x2}%`}
                y2={`${conn.y2}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="0.14"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: conn.opacity }}
                transition={{ duration: 1.2, delay: 0.8 + i * 0.04 }}
                viewport={{ once: true }}
              />
            ))}
          </svg>

          {/* Background blur layer */}
          <div className="absolute inset-0 blur-md opacity-35 [transform:translateZ(-1px)]">
            {particles
              .filter((p) => p.type === "glow")
              .slice(0, 22)
              .map((p) => (
                <motion.div
                  key={`blur-${p.id}`}
                  className="absolute rounded-full bg-primary/30"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.size * 3,
                    height: p.size * 3,
                    willChange: "transform, opacity",
                  }}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, -18, 10, -12, 0],
                          x: [0, 12, -8, 6, 0],
                          scale: [1, 1.15, 0.95, 1.08, 1],
                        }
                  }
                  transition={{
                    duration: p.duration * 1.2,
                    delay: p.delay,
                    repeat,
                    repeatType: "mirror",
                    ease: particleEase,
                  }}
                />
              ))}
          </div>

          {/* Main particles */}
          <div className="absolute inset-0">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  opacity: p.opacity, // stable, avoids re-triggering in-view logic
                  ...getParticleStyle(p),
                  willChange: "transform, opacity",
                  transform: "translateZ(0)",
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y:
                          p.type === "glow"
                            ? [0, -18, 10, -12, 4, 0]
                            : p.type === "primary"
                            ? [0, -12, 7, -8, 0]
                            : [0, -7, 4, -5, 0],
                        x:
                          p.type === "glow"
                            ? [0, 10, -6, 12, -4, 0]
                            : p.type === "primary"
                            ? [0, 7, -4, 5, 0]
                            : [0, 3, -2, 2, 0],
                        scale:
                          p.type === "glow"
                            ? [1, 1.15, 0.95, 1.1, 0.98, 1]
                            : [1, 1.06, 0.97, 1.03, 1],
                      }
                }
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat,
                  repeatType: "mirror",
                  ease: particleEase,
                }}
              />
            ))}
          </div>

          {/* Sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {sparkles.map((s) => (
              <motion.div
                key={`sparkle-${s.id}`}
                className="absolute rounded-full bg-primary"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  boxShadow: "0 0 6px hsl(var(--primary))",
                  willChange: "transform, opacity",
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: [0, s.opacity, 0],
                        scale: [0.7, 1.6, 0.7],
                      }
                }
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Bottom label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            viewport={{ once: true }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground font-sans whitespace-nowrap"
          >
            170 Countries · 35 Years of Data
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Text overlay */}
      <motion.div
        style={{ opacity: textOpacity, y: textY, scale: textScale }}
        className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
      >
        <p className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground text-center max-w-3xl px-6 leading-relaxed">
          Every point represents a story.
        </p>
        <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary/80 text-center max-w-2xl px-6 mt-4">
          Every gap, a challenge.
        </p>
      </motion.div>
    </section>
  );
};

export default DataGridSection;