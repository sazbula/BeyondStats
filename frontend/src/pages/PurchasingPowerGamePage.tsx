import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PurchasingPowerGame } from "@/components/games/PurchasingPowerGame";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { id: "us", name: "United States", incomeRatio: 0.82 },
  { id: "uk", name: "United Kingdom", incomeRatio: 0.85 },
  { id: "de", name: "Germany", incomeRatio: 0.84 },
  { id: "jp", name: "Japan", incomeRatio: 0.77 },
  { id: "br", name: "Brazil", incomeRatio: 0.79 },
];

const PurchasingPowerGamePage = () => {
  const [showResults, setShowResults] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to="/games">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          
        </motion.div>

        {/* Game Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="stat-card mb-8 max-w-4xl mx-auto"
        >
          <h2 className="font-display font-semibold text-foreground mb-2">
            How to Play
          </h2>
          <p className="text-sm text-muted-foreground">
            Toggle between "Man" and "Woman" to see how the same monthly income differs. 
            Try to purchase essential items and observe how the income gap affects daily choices.
          </p>
        </motion.div>

        {/* Game Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PurchasingPowerGame onComplete={() => setShowResults(true)} />
        </motion.div>
      </div>
    </Layout>
  );
};

export default PurchasingPowerGamePage;
