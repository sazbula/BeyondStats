import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import WorldMap from "@/components/explore/WorldMap";
import { CountrySidePanel } from "@/components/explore/CountrySidePanel";
import { usePredictions } from "@/hooks/usePredictions";

type Trend = "up" | "down" | "stable";
const closeness = (v: number) => 1 / (1 + Math.abs(v));
const trendToZero = (curr?: number, prev?: number): Trend => {
  if (curr == null || prev == null) return "stable";
  const dc = Math.abs(curr), dp = Math.abs(prev);
  if (Math.abs(dc - dp) < 1e-9) return "stable";
  return dc < dp ? "up" : "down";
};

const Explore = () => {
  const { rows, index, loading, error } = usePredictions();

  const years = useMemo(
    () => Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a),
    [rows]
  );

  const [year, setYear] = useState<number>(years[0] ?? 2023);
  const [selectedIso3, setSelectedIso3] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // country options for selected year
  const options = useMemo(() => {
    return Array.from(
      new Set(rows.filter((r) => r.year === year).map((r) => r.countryCode))
    ).sort();
  }, [rows, year]);

  const row = selectedIso3 ? index[selectedIso3]?.[year] : undefined;
  const prev = selectedIso3 ? index[selectedIso3]?.[year - 1] : undefined;

  const country = row
    ? {
        id: row.countryCode,
        name: row.countryCode,
        year: row.year,
        overall_score: row.overall_score,
        ineq_econ: row.ineq_econ,
        ineq_soc: row.ineq_soc,
        ineq_phy: row.ineq_phy,
        econNorm: closeness(row.ineq_econ),
        socNorm: closeness(row.ineq_soc),
        phyNorm: closeness(row.ineq_phy),
        econTrend: trendToZero(row.ineq_econ, prev?.ineq_econ),
        socTrend: trendToZero(row.ineq_soc, prev?.ineq_soc),
        phyTrend: trendToZero(row.ineq_phy, prev?.ineq_phy),
      }
    : null;

  const handleRegionClick = (region: { id: string }) => {
    // assumes WorldMap passes ISO3; if not, wire ISO2->ISO3 later
    setSelectedIso3(region.id);
    setIsPanelOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">Loading…</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Global Map Explorer
          </h1>
          <p className="text-muted-foreground">
            Explore predictions. (Lower raw values are better; bars show closeness to 0.)
          </p>
        </motion.div>

        <div className="mb-4 flex gap-3 items-center flex-wrap">
          <select
            className="border rounded px-3 py-2 bg-background"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2 bg-background"
            value={selectedIso3 ?? ""}
            onChange={(e) => {
              const v = e.target.value || null;
              setSelectedIso3(v);
              setIsPanelOpen(!!v);
            }}
          >
            <option value="">Select a country</option>
            {options.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-[70vh] min-h-[520px]"
        >
          <div className="map-frame w-full h-full px-8 pt-6 pb-6 flex items-center justify-center">
            <div className="-mt-1 w-full h-full">
              <WorldMap onRegionClick={handleRegionClick} />
            </div>
          </div>
        </motion.div>
      </div>

      <CountrySidePanel
        isOpen={isPanelOpen && !!country}
        onClose={() => setIsPanelOpen(false)}
        country={country}
      />
    </Layout>
  );
};

export default Explore;
