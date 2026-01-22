import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  insights: string[];
  delay?: number;
}

export function InsightCard({ insights, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-accent-foreground" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground">
          Key Insights
        </h3>
      </div>
      
      <ul className="space-y-3">
        {insights.map((insight, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.1 * (index + 1) }}
            className="flex items-start gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span className="text-sm text-muted-foreground leading-relaxed">
              {insight}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
