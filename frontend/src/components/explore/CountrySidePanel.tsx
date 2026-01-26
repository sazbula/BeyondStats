import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Trend = "up" | "down" | "stable";

interface CountrySidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  country: {
    id: string; // ISO3
    name: string;
    year: number;
    total_score: number | null;
    econ_score: number | null;
    social_score: number | null;
    physical_score: number | null;
    econTrend: Trend;
    socTrend: Trend;
    phyTrend: Trend;
  } | null;
}

const clamp01 = (v: number) => Math.max(0, Math.min(100, v));

const getTrendIcon = (t: Trend) => {
  switch (t) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-stat-positive" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-stat-negative" />;
    default:
      return <Minus className="w-4 h-4 text-stat-neutral" />;
  }
};

export function CountrySidePanel({ isOpen, onClose, country }: CountrySidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && country && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {country.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">Year: {country.year}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              {/* Overall Score */}
              <div className="stat-card mb-6">
                <p className="text-sm text-muted-foreground mb-1">Total Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-primary">
                    {country.total_score != null ? Math.round(country.total_score) : "—"}
                  </span>
                  <span className="text-muted-foreground">/100</span>
                </div>
              </div>
              {/* Front Scores */}
              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Front Scores
                </h3>

                {[
                  {
                    label: "Economic",
                    value: country.econ_score,
                    t: country.econTrend,
                  },
                  {
                    label: "Social",
                    value: country.social_score,
                    t: country.socTrend,
                  },
                  {
                    label: "Physical",
                    value: country.physical_score,
                    t: country.phyTrend,
                  },
                ].map((m, i) => (
                  <div key={m.label} className="stat-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{m.label}</span>
                      {getTrendIcon(m.t)}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${clamp01(m.value ?? 0)}%` }}
                          transition={{ duration: 0.8, delay: 0.15 + i * 0.08 }}
                          className="h-full accent-gradient rounded-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {m.value != null ? `${Math.round(m.value)}` : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* CTA */}
              <Link to={`/country?id=${country.id}`}>
                <Button className="w-full group" size="lg">
                  View Full Profile
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
