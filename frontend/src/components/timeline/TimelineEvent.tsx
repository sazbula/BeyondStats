import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TimelineEventData {
  id: string;
  year: number;
  title: string;
  description: string;
  type: "document" | "coins" | "factory" | "screen" | "landmark";
  era: "past" | "early" | "mid" | "modern";
  position: number; // horizontal position in the timeline
  scale?: number; // visual importance (1-3)
}

interface TimelineEventProps {
  event: TimelineEventData;
  isActive: boolean;
  onClick: () => void;
}

const DocumentIcon = () => (
  <div className="document w-16 h-20 flex flex-col items-center justify-center p-2 relative">
    <div className="absolute top-1 right-1 w-4 h-4 bg-primary/20 rounded-bl-lg" />
    <div className="space-y-1 w-full px-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-1 bg-document-ink/30 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
    <div className="absolute bottom-2 w-6 h-3 border-b-2 border-primary/40" />
  </div>
);

const CoinsIcon = ({ gap = 0.22 }: { gap?: number }) => (
  <div className="flex items-end gap-2">
    {/* Full stack (men) */}
    <div className="flex flex-col-reverse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="coin coin-gold w-8 h-3 -mb-1"
          style={{ marginBottom: i === 0 ? 0 : -6 }}
        />
      ))}
    </div>
    {/* Shorter stack (women - showing the gap) */}
    <div className="flex flex-col-reverse">
      {[...Array(Math.round(5 * (1 - gap)))].map((_, i) => (
        <div
          key={i}
          className="coin coin-silver w-8 h-3"
          style={{ marginBottom: i === 0 ? 0 : -6 }}
        />
      ))}
    </div>
  </div>
);

const FactoryIcon = () => (
  <div className="relative w-20 h-16">
    {/* Main building */}
    <div className="absolute bottom-0 left-0 w-12 h-10 bg-character-body rounded-t-sm" />
    {/* Chimney */}
    <div className="absolute bottom-10 left-2 w-4 h-8 bg-character-body" />
    {/* Smoke puffs */}
    <motion.div
      animate={{ y: [-2, -8], opacity: [0.8, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute top-0 left-3 w-3 h-3 bg-muted-foreground/30 rounded-full"
    />
    {/* Windows */}
    <div className="absolute bottom-2 left-2 grid grid-cols-2 gap-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-2 h-2 bg-coin-gold/60" />
      ))}
    </div>
    {/* Second building */}
    <div className="absolute bottom-0 right-0 w-8 h-6 bg-character-body/80 rounded-t-sm" />
  </div>
);

const ScreenIcon = () => (
  <div className="relative w-16 h-12 bg-foreground/90 rounded-lg p-1 shadow-lg">
    <div className="w-full h-full bg-accent/20 rounded overflow-hidden">
      {/* Chart bars */}
      <div className="flex items-end justify-around h-full p-1 gap-0.5">
        {[60, 80, 45, 90, 70].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="w-2 bg-accent rounded-t"
          />
        ))}
      </div>
    </div>
    {/* Stand */}
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-foreground/80 rounded-b" />
  </div>
);

const LandmarkIcon = () => (
  <div className="relative w-14 h-20">
    {/* Podium */}
    <div className="absolute bottom-0 w-full h-3 bg-muted-foreground/40 rounded-t" />
    {/* Figure */}
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
      <div className="w-6 h-8 bg-secondary rounded-t-full" />
      <div className="w-4 h-4 bg-document-cream rounded-full mx-auto -mt-10" />
    </div>
    {/* Flag */}
    <motion.div
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute top-0 right-0 w-6 h-4 bg-primary/80 rounded-sm origin-left"
    />
    <div className="absolute top-0 right-6 w-1 h-10 bg-character-body" />
  </div>
);

const eventIcons = {
  document: DocumentIcon,
  coins: CoinsIcon,
  factory: FactoryIcon,
  screen: ScreenIcon,
  landmark: LandmarkIcon,
};

const TimelineEvent = ({ event, isActive, onClick }: TimelineEventProps) => {
  const Icon = eventIcons[event.type];
  const scale = event.scale || 1;
  
  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer"
      style={{
        left: `${event.position}px`,
        bottom: "80px",
        transform: `scale(${0.8 + scale * 0.2})`,
      }}
      onClick={onClick}
    >
      {/* Floating object */}
      <motion.div
        className="floating-object"
        whileHover={{ scale: 1.1 }}
        animate={{
          y: isActive ? -10 : 0,
        }}
      >
        <Icon />
      </motion.div>
      
      {/* Year marker */}
      <div className="mt-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-muted-foreground">
        {event.year}
      </div>
      
      {/* Expanded card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="checkpoint-card absolute bottom-full mb-4 w-64 z-10"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
            <button className="mt-3 text-xs text-primary hover:text-primary/80 font-medium">
              Learn more →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimelineEvent;