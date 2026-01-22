import { motion } from "framer-motion";
import { useState } from "react";

// Simplified SVG world map regions for demo
const regions = [
  { id: "na", name: "North America", score: 0.75, x: 100, y: 120, width: 150, height: 100 },
  { id: "sa", name: "South America", score: 0.68, x: 150, y: 250, width: 80, height: 120 },
  { id: "eu", name: "Europe", score: 0.82, x: 320, y: 80, width: 100, height: 80 },
  { id: "af", name: "Africa", score: 0.55, x: 320, y: 180, width: 100, height: 140 },
  { id: "as", name: "Asia", score: 0.62, x: 450, y: 100, width: 180, height: 140 },
  { id: "oc", name: "Oceania", score: 0.78, x: 550, y: 280, width: 100, height: 60 },
];

const getScoreColor = (score: number) => {
  if (score >= 0.75) return "hsl(var(--data-high))";
  if (score >= 0.6) return "hsl(var(--data-mid))";
  return "hsl(var(--data-low))";
};

interface WorldMapProps {
  onRegionClick: (region: { id: string; name: string; score: number }) => void;
}

export function WorldMap({ onRegionClick }: WorldMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full bg-secondary/30 rounded-3xl overflow-hidden">
      <svg viewBox="0 0 700 400" className="w-full h-full">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Regions */}
        {regions.map((region) => (
          <motion.g
            key={region.id}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => onRegionClick(region)}
            style={{ cursor: "pointer" }}
          >
            <motion.rect
              x={region.x}
              y={region.y}
              width={region.width}
              height={region.height}
              rx={12}
              fill={getScoreColor(region.score)}
              initial={{ opacity: 0.6 }}
              animate={{ 
                opacity: hoveredRegion === region.id ? 1 : 0.7,
                scale: hoveredRegion === region.id ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: "center" }}
            />
            <text
              x={region.x + region.width / 2}
              y={region.y + region.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="hsl(var(--foreground))"
              fontSize="12"
              fontWeight="500"
              style={{ pointerEvents: "none" }}
            >
              {region.name}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-card border border-border rounded-xl p-3 shadow-lg"
        >
          <p className="font-medium text-foreground">
            {regions.find(r => r.id === hoveredRegion)?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Score: {regions.find(r => r.id === hoveredRegion)?.score.toFixed(2)}
          </p>
        </motion.div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4">
        <p className="text-xs font-medium text-foreground mb-2">Gender Equality Score</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--data-low))" }} />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--data-mid))" }} />
            <span className="text-xs text-muted-foreground">Mid</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--data-high))" }} />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
