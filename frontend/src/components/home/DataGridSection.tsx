import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  type: 'primary' | 'secondary' | 'accent' | 'glow';
}

const DataGridSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform values based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [70, 30, 15, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.6, 1, 1.1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.2]);
  const y = useTransform(scrollYProgress, [0, 1], ["30%", "-20%"]);
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [8, 0, 0, 4]);

  // Generate many floating particles with variety
  const particles = useMemo<Particle[]>(() => {
    const pts: Particle[] = [];
    
    // Primary layer - main visible particles (many)
    for (let i = 0; i < 200; i++) {
      const type = Math.random() > 0.85 ? 'glow' : Math.random() > 0.6 ? 'primary' : 'secondary';
      pts.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100,
        size: type === 'glow' ? Math.random() * 12 + 6 : 
              type === 'primary' ? Math.random() * 6 + 3 : 
              Math.random() * 3 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 6 + 4,
        opacity: type === 'glow' ? 0.9 : type === 'primary' ? 0.7 : Math.random() * 0.4 + 0.15,
        type,
      });
    }
    
    // Accent layer - tiny sparkling dots
    for (let i = 200; i < 350; i++) {
      pts.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 50,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.1,
        type: 'accent',
      });
    }
    
    return pts;
  }, []);

  // Grid configuration for warped mesh
  const gridLines = useMemo(() => {
    const lines: { start: { x: number; y: number }; end: { x: number; y: number }; delay: number }[] = [];
    const rows = 20;
    const cols = 30;
    
    for (let i = 0; i <= rows; i++) {
      const y = (i / rows) * 100;
      lines.push({
        start: { x: 0, y },
        end: { x: 100, y },
        delay: i * 0.02,
      });
    }
    
    for (let i = 0; i <= cols; i++) {
      const x = (i / cols) * 100;
      lines.push({
        start: { x, y: 0 },
        end: { x, y: 100 },
        delay: i * 0.015 + 0.4,
      });
    }
    
    return lines;
  }, []);

  // Generate connection lines between nearby glow particles
  const connections = useMemo(() => {
    const glowParticles = particles.filter(p => p.type === 'glow' || p.type === 'primary');
    const conns: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    
    for (let i = 0; i < glowParticles.length; i++) {
      for (let j = i + 1; j < glowParticles.length; j++) {
        const dx = glowParticles[i].x - glowParticles[j].x;
        const dy = glowParticles[i].y - glowParticles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 15 && distance > 3) {
          conns.push({
            x1: glowParticles[i].x,
            y1: glowParticles[i].y,
            x2: glowParticles[j].x,
            y2: glowParticles[j].y,
            opacity: (15 - distance) / 15 * 0.3,
          });
        }
      }
    }
    return conns.slice(0, 40); // Limit connections for performance
  }, [particles]);

  // Text reveal based on scroll
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [40, 0, 0, -40]);
  const textScale = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0.95, 1, 1, 1.02]);

  const getParticleStyle = (particle: Particle) => {
    switch (particle.type) {
      case 'glow':
        return {
          backgroundColor: "hsl(var(--primary))",
          boxShadow: "0 0 30px hsl(var(--primary) / 0.8), 0 0 60px hsl(var(--primary) / 0.4), 0 0 90px hsl(var(--primary) / 0.2)",
        };
      case 'primary':
        return {
          backgroundColor: "hsl(var(--primary))",
          boxShadow: "0 0 15px hsl(var(--primary) / 0.5)",
        };
      case 'secondary':
        return {
          backgroundColor: "hsl(var(--primary) / 0.6)",
          boxShadow: "0 0 8px hsl(var(--primary) / 0.3)",
        };
      case 'accent':
        return {
          backgroundColor: "hsl(var(--primary) / 0.4)",
          boxShadow: "none",
        };
      default:
        return {};
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[200vh] overflow-hidden"
    >
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none z-20" />
      
      {/* Main visual container */}
      <motion.div
        style={{ opacity, y, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
        className="perspective-container sticky top-0 h-screen w-full flex items-center justify-center"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full max-w-7xl aspect-[16/10]"
        >
          {/* Warped grid mesh */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Grid lines */}
            {gridLines.map((line, i) => (
              <motion.line
                key={i}
                x1={`${line.start.x}%`}
                y1={`${line.start.y}%`}
                x2={`${line.end.x}%`}
                y2={`${line.end.y}%`}
                stroke="url(#gridGradient)"
                strokeWidth="0.1"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: line.delay, ease: "easeOut" }}
                viewport={{ once: true }}
                filter="url(#glow)"
              />
            ))}

            {/* Connection lines between particles */}
            {connections.map((conn, i) => (
              <motion.line
                key={`conn-${i}`}
                x1={`${conn.x1}%`}
                y1={`${conn.y1}%`}
                x2={`${conn.x2}%`}
                y2={`${conn.y2}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="0.15"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: conn.opacity }}
                transition={{ duration: 1.5, delay: 1 + i * 0.05 }}
                viewport={{ once: true }}
              />
            ))}
          </svg>

          {/* Background blur layer - creates depth */}
          <div className="absolute inset-0 blur-md opacity-40">
            {particles.filter(p => p.type === 'glow').map((particle) => (
              <motion.div
                key={`blur-${particle.id}`}
                className="absolute rounded-full bg-primary/30"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size * 3,
                  height: particle.size * 3,
                }}
                animate={{
                  y: [0, -20, 10, -15, 0],
                  x: [0, 15, -10, 8, 0],
                  scale: [1, 1.2, 0.9, 1.1, 1],
                }}
                transition={{
                  duration: particle.duration * 1.5,
                  delay: particle.delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Main floating particles layer */}
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  ...getParticleStyle(particle),
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: particle.opacity, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: particle.delay * 0.3,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                animate={{
                  y: particle.type === 'glow' 
                    ? [0, -25, 12, -18, 5, 0] 
                    : particle.type === 'primary'
                    ? [0, -15, 8, -10, 0]
                    : [0, -8, 4, -6, 0],
                  x: particle.type === 'glow'
                    ? [0, 12, -8, 15, -5, 0]
                    : particle.type === 'primary'
                    ? [0, 8, -5, 6, 0]
                    : [0, 4, -3, 2, 0],
                  scale: particle.type === 'glow'
                    ? [1, 1.2, 0.9, 1.15, 0.95, 1]
                    : [1, 1.1, 0.95, 1.05, 1],
                  opacity: [
                    particle.opacity,
                    particle.opacity * 1.2,
                    particle.opacity * 0.8,
                    particle.opacity * 1.1,
                    particle.opacity,
                  ],
                }}
                // @ts-ignore - framer-motion transition type
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Foreground sparkle layer */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-primary"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: "0 0 6px hsl(var(--primary))",
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Axis labels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            viewport={{ once: true }}
            className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground font-sans -rotate-90 origin-center whitespace-nowrap"
          >
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7 }}
            viewport={{ once: true }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground font-sans whitespace-nowrap"
          >
            170 Countries · 35 Years of Data
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Poetic text overlay */}
      <motion.div
        style={{ 
          opacity: textOpacity, 
          y: textY,
          scale: textScale,
        }}
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