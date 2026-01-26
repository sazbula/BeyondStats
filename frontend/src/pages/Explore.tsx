import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import WorldMap, { type WorldMapDatum } from "@/components/explore/WorldMap";
import { CountrySidePanel } from "@/components/explore/CountrySidePanel";
import { usePredictions } from "@/hooks/usePredictions";

type Trend = "up" | "down" | "stable";

const trend = (curr?: number | null, prev?: number | null): Trend => {
  if (curr == null || prev == null) return "stable";
  if (curr === prev) return "stable";
  return curr > prev ? "up" : "down";
};

type CountryMeta = {
  iso3: string;
  iso2: string;
  name: string;
  region: string;
};

const Explore = () => {
  const { rows, index, loading, error } = usePredictions();

  // meta for ISO mapping + names
  const [meta, setMeta] = useState<CountryMeta[]>([]);
  const [metaError, setMetaError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/data/country_meta.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load country_meta.json (${r.status})`);
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        setMeta(Array.isArray(data) ? data : []);
        setMetaError(null);
      })
      .catch((e) => {
        if (!alive) return;
        setMetaError(e?.message ?? "Failed to load country metadata");
      });

    return () => {
      alive = false;
    };
  }, []);

  const metaByIso3 = useMemo(() => {
    const m = new Map<string, CountryMeta>();
    for (const x of meta) m.set(x.iso3, x);
    return m;
  }, [meta]);
  const iso3ByIso2 = useMemo(() => {
    const m = new Map<string, string>();
    for (const x of meta) m.set(x.iso2, x.iso3);
    return m;
  }, [meta]);
  const years = useMemo(
    () => Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a),
    [rows]
  );

  const [year, setYear] = useState<number>(2023);
  const [selectedIso3, setSelectedIso3] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (!years.length) return;
    setYear((y) => (years.includes(y) ? y : years[0]));
  }, [years]);

  const options = useMemo(() => {
    return Array.from(
      new Set(rows.filter((r) => r.year === year).map((r) => r.countryCode))
    ).sort();
  }, [rows, year]);

  // map data uses ISO2 (GeoChart)
  const mapData: WorldMapDatum[] = useMemo(() => {
    const filtered = rows.filter((r) => r.year === year);
    return filtered
      .map((r) => {
        const metaRow = metaByIso3.get(r.countryCode);
        const iso2 = metaRow?.iso2 ?? "";
        return {
          iso2,
          score: r.total_score,
        };
      })
      .filter((d) => !!d.iso2);
  }, [rows, year, metaByIso3]);

  const row = selectedIso3 ? index?.[selectedIso3]?.[year] : undefined;
  const prev = selectedIso3 ? index?.[selectedIso3]?.[year - 1] : undefined;
  const selectedMeta = selectedIso3 ? metaByIso3.get(selectedIso3) : undefined;

  const country = row
    ? {
        id: row.countryCode, // ISO3
        name: selectedMeta?.name ?? row.countryCode,
        year: row.year,
        total_score: row.total_score,
        econ_score: row.econ_score,
        social_score: row.social_score,
        physical_score: row.physical_score,
        econTrend: trend(row.econ_score, prev?.econ_score),
        socTrend: trend(row.social_score, prev?.social_score),
        phyTrend: trend(row.physical_score, prev?.physical_score),
      }
    : null;

  const handleRegionClick = (region: { id: string }) => {
    const iso3 = iso3ByIso2.get(region.id) ?? region.id; // fallback
    setSelectedIso3(iso3);
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
            Explore scores (0–100). Higher is better.
          </p>
          {metaError && <p className="text-red-300 text-sm mt-2">{metaError}</p>}
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
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-[70vh] min-h-[520px]"
        >
          <div className="map-frame w-full h-full px-8 pt-6 pb-6 flex items-center justify-center">
            <div className="-mt-1 w-full h-full">
              <WorldMap data={mapData} onRegionClick={handleRegionClick} />
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
