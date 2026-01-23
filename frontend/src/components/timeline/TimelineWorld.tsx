import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Character from "./Character";
import TimelineEvent, { TimelineEventData } from "./TimelineEvent";
import ParallaxLayer from "./ParallaxLayer";
import YearMarker from "./YearMarker";

const TIMELINE_EVENTS: TimelineEventData[] = [
  {
    id: "seneca",
    year: 1848,
    title: "Seneca Falls Convention",
    description: "The first women's rights convention in the US, where the Declaration of Sentiments demanded equal rights including suffrage.",
    type: "document",
    era: "past",
    position: 600,
    scale: 2,
  },
  {
    id: "industrial",
    year: 1880,
    title: "Women Enter Factories",
    description: "The Industrial Revolution brings women into the workforce, though under harsh conditions and for lower wages.",
    type: "factory",
    era: "past",
    position: 1400,
    scale: 2,
  },
  {
    id: "suffrage",
    year: 1920,
    title: "19th Amendment",
    description: "Women gain the constitutional right to vote in the United States after decades of activism.",
    type: "document",
    era: "early",
    position: 2400,
    scale: 3,
  },
  {
    id: "ww2",
    year: 1943,
    title: "Rosie the Riveter",
    description: "World War II sees women taking on industrial jobs en masse, proving their capability in traditionally male roles.",
    type: "landmark",
    era: "early",
    position: 3000,
    scale: 2,
  },
  {
    id: "equal-pay",
    year: 1963,
    title: "Equal Pay Act",
    description: "The first federal law aimed at abolishing wage disparity based on sex. Yet the gap persists.",
    type: "coins",
    era: "mid",
    position: 3800,
    scale: 2,
  },
  {
    id: "title-ix",
    year: 1972,
    title: "Title IX",
    description: "Prohibits sex-based discrimination in education, revolutionizing women's access to sports and academics.",
    type: "document",
    era: "mid",
    position: 4400,
    scale: 2,
  },
  {
    id: "gap-2024",
    year: 2024,
    title: "The Persistent Gap",
    description: "Women still earn 84 cents for every dollar earned by men. Progress has slowed in recent decades.",
    type: "coins",
    era: "modern",
    position: 5800,
    scale: 3,
  },
  {
    id: "data-era",
    year: 2024,
    title: "The Data Age",
    description: "Technology enables unprecedented tracking of inequality, but also reveals how far we still have to go.",
    type: "screen",
    era: "modern",
    position: 6400,
    scale: 2,
  },
];

const TIMELINE_WIDTH = 7500;
const CHARACTER_X_POSITION = 200; // Character stays at this X position on screen

const TimelineWorld = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Calculate which era we're in based on scroll position
  const currentEra = (): "past" | "early" | "mid" | "modern" => {
    const progress = scrollProgress * TIMELINE_WIDTH;
    if (progress < 2000) return "past";
    if (progress < 3500) return "early";
    if (progress < 5000) return "mid";
    return "modern";
  };
  
  // Handle horizontal scroll via wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (containerRef.current) {
      const delta = e.deltaY || e.deltaX;
      const newProgress = Math.max(0, Math.min(1, scrollProgress + delta / TIMELINE_WIDTH));
      setScrollProgress(newProgress);
      
      // Track scrolling state for character animation
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
    }
  }, [scrollProgress]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);
  
  // Check if character is near an event
  useEffect(() => {
    const characterWorldPosition = scrollProgress * TIMELINE_WIDTH + CHARACTER_X_POSITION;
    
    let nearestEvent: TimelineEventData | null = null;
    let nearestDistance = Infinity;
    
    TIMELINE_EVENTS.forEach(event => {
      const distance = Math.abs(event.position - characterWorldPosition);
      if (distance < 100 && distance < nearestDistance) {
        nearestDistance = distance;
        nearestEvent = event;
      }
    });
    
    setActiveEventId(nearestEvent?.id || null);
  }, [scrollProgress]);
  
  const worldOffset = -scrollProgress * TIMELINE_WIDTH;
  
  return (
    <div 
      ref={containerRef}
      className="timeline-world h-screen w-screen overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* Era background transition */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 ${
          currentEra() === "past" ? "era-past" :
          currentEra() === "early" ? "era-early" :
          currentEra() === "mid" ? "era-mid" : "era-modern"
        }`}
      />
      
      {/* Parallax background layers */}
      <ParallaxLayer
        offset={worldOffset * 0.1}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Distant mountains/clouds */}
        <div className="absolute bottom-40 left-0 w-full h-32 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-foreground/10"
              style={{
                left: `${i * 400}px`,
                bottom: `${Math.sin(i) * 20}px`,
                width: `${150 + Math.random() * 100}px`,
                height: `${80 + Math.random() * 40}px`,
              }}
            />
          ))}
        </div>
      </ParallaxLayer>
      
      {/* Mid-ground decorations */}
      <ParallaxLayer
        offset={worldOffset * 0.4}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Trees/buildings silhouettes */}
        <div className="absolute bottom-20 left-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-foreground/5 rounded-t-lg"
              style={{
                left: `${i * 250 + Math.random() * 100}px`,
                bottom: 0,
                width: `${20 + Math.random() * 30}px`,
                height: `${40 + Math.random() * 60}px`,
              }}
            />
          ))}
        </div>
      </ParallaxLayer>
      
      {/* Main timeline layer */}
      <div
        className="absolute bottom-0 left-0 h-full"
        style={{
          width: `${TIMELINE_WIDTH}px`,
          transform: `translateX(${worldOffset}px)`,
        }}
      >
        {/* Ground */}
        <div className="ground-layer absolute bottom-0 left-0 right-0 h-20" />
        
        {/* Timeline track */}
        <div className="timeline-track absolute bottom-16 left-0 right-0 h-1 rounded-full" />
        
        {/* Year markers */}
        {[1840, 1860, 1880, 1900, 1920, 1940, 1960, 1980, 2000, 2020].map((year, i) => (
          <YearMarker key={year} year={year} position={300 + i * 600} />
        ))}
        
        {/* Events */}
        {TIMELINE_EVENTS.map(event => (
          <TimelineEvent
            key={event.id}
            event={event}
            isActive={activeEventId === event.id}
            onClick={() => setActiveEventId(activeEventId === event.id ? null : event.id)}
          />
        ))}
      </div>
      
      {/* Character (fixed position on screen) */}
      <div 
        className="absolute z-20"
        style={{
          left: `${CHARACTER_X_POSITION}px`,
          bottom: "80px",
        }}
      >
        <Character isWalking={isScrolling} era={currentEra()} />
      </div>
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Walk Through Time
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            A journey through the history of gender equality
          </p>
        </motion.div>
      </div>
      
      {/* Scroll hint */}
      {scrollProgress < 0.05 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Scroll to explore</span>
          <div className="scroll-hint flex gap-1">
            <span>→</span>
            <span>→</span>
            <span>→</span>
          </div>
        </motion.div>
      )}
      
      {/* Progress bar */}
      <div className="absolute bottom-4 left-8 right-8 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
      
      {/* Era indicator */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {currentEra() === "past" && "1840s - 1890s"}
          {currentEra() === "early" && "1900s - 1940s"}
          {currentEra() === "mid" && "1950s - 1980s"}
          {currentEra() === "modern" && "1990s - Present"}
        </span>
      </div>
    </div>
  );
};

export default TimelineWorld;