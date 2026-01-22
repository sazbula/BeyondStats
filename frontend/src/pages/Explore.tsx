import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import WorldMap from "@/components/explore/WorldMap"; // ✅ default import
import { CountrySidePanel } from "@/components/explore/CountrySidePanel";

interface SelectedRegion {
  id: string;
  name: string;
  score: number;
}

const Explore = () => {
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleRegionClick = (region: SelectedRegion) => {
    setSelectedRegion(region);
    setIsPanelOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Global Map Explorer
          </h1>
          <p className="text-muted-foreground">
            Click on a region to explore gender equality data. Darker colors indicate higher equality scores.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-[60vh] min-h-[400px]"
        >
          <WorldMap onRegionClick={handleRegionClick} />
        </motion.div>
      </div>

      <CountrySidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        country={selectedRegion}
      />
    </Layout>
  );
};

export default Explore;
