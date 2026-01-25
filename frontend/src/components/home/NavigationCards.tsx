import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

interface ExplorationOption {
  emoji: string;
  title: string;
  subtitle: string;
  path: string;
  gradient: string;
  hoverColor: string;
}

const explorationOptions: ExplorationOption[] = [
  {
    emoji: "",
    title: "Explore the Map",
    subtitle:
      "Visualize gender inequality across 150+ countries. Compare scores, see patterns, and discover insights.",
    path: "/explore",
    gradient: "from-primary/5 via-primary/10 to-transparent",
    hoverColor: "group-hover:text-primary",
  },
  {
    emoji: "",
    title: "Country Insights",
    subtitle:
      "Deep dive into any country's data. See economic, physical, and social gaps with historical trends.",
    path: "/country",
    gradient: "from-transparent via-primary/8 to-primary/5",
    hoverColor: "group-hover:text-primary",
  },
  {
    emoji: "",
    title: "Mini-Games",
    subtitle:
      "Learn through play. Challenge your assumptions with interactive quizzes and simulations.",
    path: "/games",
    gradient: "from-primary/8 via-transparent to-primary/5",
    hoverColor: "group-hover:text-primary",
  },
];


export function NavigationCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep particle positions stable (prevents “jumping” on rerenders)
  const particles = useMemo(
    () =>
      [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 4 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    []
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2, 0.4], [60, 60, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen py-32 px-6 overflow-hidden">
      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Section header */}
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="text-center mb-24 max-w-3xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-16 h-px bg-primary/40 mx-auto mb-12"
        />
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-8 leading-tight">
          How do you want to explore inequality?
        </h2>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto">
          Choose your lens into the data
        </p>
      </motion.div>

      {/* 3D Layered exploration panels */}
      <div className="relative max-w-6xl mx-auto" style={{ perspective: "1200px" }}>
        <div className="relative flex flex-col gap-8 md:gap-12">
          {explorationOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 80, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
              style={{ zIndex: explorationOptions.length - index }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={option.path} className="group block relative">
                <motion.div
                  className={[
                    "relative overflow-hidden rounded-2xl md:rounded-3xl",
                    "border border-border/30 backdrop-blur-sm",
                    "transition-all duration-700 ease-out",
                    hoveredIndex === index ? "bg-card/80 border-primary/30" : "bg-card/40",
                  ].join(" ")}
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={{
                    scale: 1.02,
                    y: -8,
                    rotateX: -2,
                    transition: { duration: 0.4, ease: "easeOut" },
                  }}
                >
                  {/* Gradient overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 transition-opacity duration-700`}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  />

                  {/* Glow */}
                  <motion.div
                    className="absolute -inset-px rounded-2xl md:rounded-3xl opacity-0 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--primary) / 0.2), transparent, hsl(var(--primary) / 0.1))",
                    }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  />

                  {/* Content */}
                  <div className="relative z-10 p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">

                      <div className="flex items-start md:items-center gap-3 md:gap-5">

                        <motion.div
                          className="relative flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <span className="text-5xl md:text-6xl lg:text-7xl block" role="img" aria-label={option.title}>
                            {option.emoji}
                          </span>
                          <motion.div
                            className="absolute inset-0 blur-xl bg-primary/20 rounded-full -z-10"
                            animate={{
                              scale: hoveredIndex === index ? 1.5 : 1,
                              opacity: hoveredIndex === index ? 0.6 : 0,
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </motion.div>

                        <div className="text-left">
                          <motion.h3
                           className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground ${option.hoverColor} transition-colors duration-500`}

                          >
                            {option.title}
                          </motion.h3>
                          <motion.p
                            className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 md:mt-2 max-w-md"

                            animate={{ x: hoveredIndex === index ? 8 : 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            {option.subtitle}
                          </motion.p>
                        </div>
                      </div>

                      <motion.div
                        className="hidden md:flex items-center gap-4"
                        animate={{
                          x: hoveredIndex === index ? 12 : 0,
                          opacity: hoveredIndex === index ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="text-sm uppercase tracking-[0.2em] font-sans font-medium text-primary">
                          Enter
                        </span>
                        <motion.svg
                          className="w-6 h-6 text-primary"

                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ x: hoveredIndex === index ? 8 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </motion.svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative dots */}
                  <motion.div
                    className="absolute top-4 right-4 md:top-8 md:right-8 w-2 h-2 rounded-full bg-primary/30"
                    animate={{
                      scale: hoveredIndex === index ? [1, 1.5, 1] : 1,
                      opacity: hoveredIndex === index ? [0.3, 0.6, 0.3] : 0.3,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-1.5 h-1.5 rounded-full bg-primary/20"
                    animate={{ y: hoveredIndex === index ? [0, -10, 0] : 0 }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>

                {/* Soft shadow layer */}
                <motion.div
                  className="absolute inset-0 -z-10 rounded-2xl md:rounded-3xl"
                  style={{
                    background: "hsl(var(--primary) / 0.1)",
                    filter: "blur(30px)",
                    transform: "translateY(20px) scale(0.95)",
                  }}
                  animate={{
                    opacity: hoveredIndex === index ? 0.6 : 0.2,
                    scale: hoveredIndex === index ? 0.98 : 0.95,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom fade line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        viewport={{ once: true }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />
    </section>
  );
}