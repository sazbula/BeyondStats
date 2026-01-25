import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ✅ Canva icon workflow for this file
 *
 * 1) In Canva, design/export each icon as:
 *    - SVG (best) OR PNG with transparent background
 * 2) Put them in: /public/icons/
 *    Example paths:
 *    /public/icons/document.svg
 *    /public/icons/coins.svg
 *    /public/icons/factory.svg
 *    ...
 * 3) Update ICON_SRC below to match your filenames.
 *
 * Then this component will render your Canva icons automatically.
 */

export interface TimelineEventData {
  id: string;
  year: number;
  title: string;
  description: string;
  type:
    | "document"
    | "coins"
    | "factory"
    | "screen"
    | "landmark"
    | "ballot"
    | "gavel"
    | "bookLock"
    | "steeringWheel"
    | "megaphone"
    | "fist"
    | "shieldAlert"
    | "podium"
    | "care"
    | "scales"
    | "shield"
    | "family"
    | "unlock"
    | "brokenGavel"
    | "brokenCoins"
    | "warningBook"
    | "brokenShield"
    | "warningRing";
  era: "past" | "early" | "mid" | "modern";
  position: number;
  scale?: number;
}

interface TimelineEventProps {
  event: TimelineEventData;
  isActive: boolean;
  onClick: () => void;
}

/* ------------------------------------
   ✅ Map each type -> Canva asset path
   ------------------------------------ */
const ICON_SRC: Record<TimelineEventData["type"], string> = {
  document: "/icons/document.svg",
  coins: "/icons/coins.svg",
  factory: "/icons/factory.svg",
  screen: "/icons/screen.svg",
  landmark: "/icons/landmark.svg",

  ballot: "/icons/ballot.svg",
  gavel: "/icons/gavel.png",
  bookLock: "/icons/book-lock.svg",
  steeringWheel: "/icons/steering-wheel.svg",
  megaphone: "/icons/megaphone.svg",
  fist: "/icons/fist.svg",
  shieldAlert: "/icons/shield-alert.svg",

  podium: "/icons/podium.svg",
  care: "/icons/care.svg",
  scales: "/icons/scales.svg",
  shield: "/icons/shield.svg",
  family: "/icons/family.svg",
  unlock: "/icons/unlock.svg",

  brokenGavel: "/icons/broken-gavel.svg",
  brokenCoins: "/icons/broken-coins.svg",
  warningBook: "/icons/warning-book.svg",
  brokenShield: "/icons/broken-shield.svg",
  warningRing: "/icons/warning-ring.svg",
};

/* ------------------------------------
   CanvaIcon: renders SVG/PNG from /public
   ------------------------------------ */
const CanvaIcon = ({
  type,
  size = 72,
  alt,
}: {
  type: TimelineEventData["type"];
  size?: number;
  alt?: string;
}) => {
  const src = ICON_SRC[type];

  return (
    <img
      src={src}
      alt={alt ?? type}
      width={size}
      height={size}
      draggable={false}
      className="select-none"
      style={{
        // helps make PNGs look less jaggy + keeps transparency clean
        imageRendering: "auto",
      }}
    />
  );
};

/* ------------------------------------
   Main component
   ------------------------------------ */
const TimelineEvent = ({ event, isActive, onClick }: TimelineEventProps) => {
  const scale = event.scale || 1;

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer"
      style={{
        left: `${event.position}px`,
        bottom: "80px",
        transform: `scale(${0.85 + scale * 0.15})`,
      }}
      onClick={onClick}
    >
      {/* Icon bubble (makes any Canva icon look consistent) */}
      <motion.div
        className="floating-object bg-transparent border-none rounded-none shadow-none"
        whileHover={{ scale: 1.08, rotate: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 450, damping: 22 }}
        animate={{ y: isActive ? -10 : 0 }}
      >
        <CanvaIcon type={event.type} size={200} alt={event.title} />
      </motion.div>

      {/* Year marker */}
      <div className="mt-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-muted-foreground">
        {event.year === 0 ? "Ongoing" : event.year}
      </div>

      {/* Expanded card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
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