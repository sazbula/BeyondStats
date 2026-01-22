import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "stable";
  delay?: number;
}

export function StatCard({ label, value, subValue, icon: Icon, trend, delay = 0 }: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-stat-positive" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-stat-negative" />;
      default:
        return <Minus className="w-4 h-4 text-stat-neutral" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Icon className="w-5 h-5 text-accent-foreground" />
            </div>
          )}
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        {trend && getTrendIcon()}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-foreground">
          {value}
        </span>
        {subValue && (
          <span className="text-sm text-muted-foreground">{subValue}</span>
        )}
      </div>
    </motion.div>
  );
}
