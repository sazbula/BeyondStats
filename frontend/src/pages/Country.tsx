import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, GraduationCap, Heart, Users } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/country/StatCard";
import { InsightCard } from "@/components/country/InsightCard";
import { usePredictions } from "@/hooks/usePredictions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Trend = "up" | "down" | "stable";

type CountryMeta = {
  iso3: string;
  iso2: string;
  name: string;
  region: string; // Europe / Asia / Africa / Americas / Oceania / Other
};

const closenessPct = (v: number) => Math.round((1 / (1 + Math.abs(v))) * 100);

const trendToZero = (curr?: number, prev?: number): Trend => {
  if (curr == null || prev == null) return "stable";
  const dc = Math.abs(curr);
  const dp = Math.abs(prev);
  if (Math.abs(dc - dp) < 1e-9) return "stable";
  return dc < dp ? "up" : "down";
};

const REGION_ORDER = ["Europe", "Americas", "Asia", "Africa", "Oceania", "Other"] as const;

const Country = () => {
  const { rows, index, loading, error } = usePredictions();

  // Load ISO3->name->region mapping
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

  // Countries available in predictions CSV
  const iso3WithData = useMemo(() => new Set(rows.map((r) => r.countryCode)), [rows]);

  // Meta filtered to only those present in CSV
  const metaWithData = useMemo(() => {
    if (!meta.length) return [];
    return meta.filter((m) => iso3WithData.has(m.iso3));
  }, [meta, iso3WithData]);

  // Regions present (from metaWithData)
  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const m of metaWithData) set.add(m.region || "Other");
    const inOrder = REGION_ORDER.filter((r) => set.has(r));
    const rest = Array.from(set).filter((r) => !inOrder.includes(r as any)).sort();
    return ["All", ...inOrder, ...rest];
  }, [metaWithData]);

  const [region, setRegion] = useState<string>("All");
  const [countryIso3, setCountryIso3] = useState<string>("");
  const [year, setYear] = useState<number>(2023);

  // Countries for current region
  const countryOptions = useMemo(() => {
    const list =
      region === "All"
        ? metaWithData
        : metaWithData.filter((m) => (m.region || "Other") === region);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [metaWithData, region]);

  // Ensure selected country exists
  useEffect(() => {
    if (!countryOptions.length) return;
    if (!countryIso3 || !countryOptions.some((c) => c.iso3 === countryIso3)) {
      setCountryIso3(countryOptions[0].iso3);
    }
  }, [countryOptions, countryIso3]);

  const selectedCountry = useMemo(() => {
    return countryOptions.find((c) => c.iso3 === countryIso3) ?? null;
  }, [countryOptions, countryIso3]);

  // Available years for selected country (from predictions index)
  const availableYears = useMemo(() => {
    if (!countryIso3) return [];
    const byYear = index?.[countryIso3];
    if (!byYear) return [];
    return Object.keys(byYear).map(Number).sort((a, b) => b - a);
  }, [index, countryIso3]);

  // Keep year valid
  useEffect(() => {
    if (!availableYears.length) return;
    if (!availableYears.includes(year)) setYear(availableYears[0]);
  }, [availableYears, year]);

  const row = countryIso3 ? index?.[countryIso3]?.[year] : undefined;
  const prev = countryIso3 ? index?.[countryIso3]?.[year - 1] : undefined;

  // overall_score is predicted GII-like: lower is better -> convert to "higher is better"
  const overallScore = row ? Math.round((1 - row.overall_score) * 100) : null;

  const econPct = row ? closenessPct(row.ineq_econ) : null;
  const socPct = row ? closenessPct(row.ineq_soc) : null;
  const phyPct = row ? closenessPct(row.ineq_phy) : null;

  const overallTrend: Trend =
    row && prev ? trendToZero(row.overall_score, prev.overall_score) : "stable";
  const econTrend: Trend =
    row && prev ? trendToZero(row.ineq_econ, prev.ineq_econ) : "stable";
  const socTrend: Trend =
    row && prev ? trendToZero(row.ineq_soc, prev.ineq_soc) : "stable";
  const phyTrend: Trend =
    row && prev ? trendToZero(row.ineq_phy, prev.ineq_phy) : "stable";

  const insights = useMemo(() => {
    if (!row) return ["No prediction available for this country/year (filtered out or missing)."];

    const parts = [
      { name: "Economic", v: Math.abs(row.ineq_econ) },
      { name: "Social", v: Math.abs(row.ineq_soc) },
      { name: "Physical", v: Math.abs(row.ineq_phy) },
    ].sort((a, b) => b.v - a.v);

    return [
      `Overall is derived from predicted GII. Lower is better; displayed score is (1 − GII) × 100.`,
      `Largest deviation from 0 is in the ${parts[0].name.toLowerCase()} front.`,
      `Most balanced front (closest to 0) is ${parts[2].name.toLowerCase()}.`,
    ];
  }, [row]);

  // Trend series (last 5 available years, ascending)
  const trendSeries = useMemo(() => {
    if (!countryIso3 || !availableYears.length) return [];
    const yearsAsc = [...availableYears].sort((a, b) => a - b).slice(-5);
    return yearsAsc.map((y) => {
      const r = index?.[countryIso3]?.[y];
      const score = r ? Math.round((1 - r.overall_score) * 100) : 0;
      return { year: y, score };
    });
  }, [availableYears, index, countryIso3]);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
              {selectedCountry?.name ?? countryIso3 ?? "Country"}
            </h1>
            <p className="text-muted-foreground">
              Deep dive into gender equality metrics and trends
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {countryIso3 ? `ISO3: ${countryIso3}` : ""}{selectedCountry?.region ? ` • Region: ${selectedCountry.region}` : ""}{availableYears.length ? ` • Year: ${year}` : ""}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* Region dropdown */}
            <Select value={region} onValueChange={setRegion} disabled={!regions.length}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Country dropdown (ALL countries from CSV, with names) */}
            <Select
              value={countryIso3}
              onValueChange={setCountryIso3}
              disabled={!countryOptions.length}
            >
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder={loading ? "Loading…" : "Select country"} />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((c) => (
                  <SelectItem key={c.iso3} value={c.iso3}>
                    {c.name} ({c.iso3})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year dropdown */}
            <Select
              value={availableYears.length ? year.toString() : ""}
              onValueChange={(v) => setYear(Number(v))}
              disabled={!availableYears.length}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {(loading || error || metaError) && (
          <div className="mb-6 text-sm">
            {loading && <div className="text-muted-foreground">Loading predictions…</div>}
            {error && <div className="text-red-300">{error}</div>}
            {metaError && <div className="text-red-300">{metaError}</div>}
          </div>
        )}

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            label="Overall Score"
            value={overallScore != null ? String(overallScore) : "—"}
            subValue="/100"
            icon={Users}
            trend={overallTrend}
            delay={0.1}
          />
          <StatCard
            label="Economic Equality"
            value={econPct != null ? `${econPct}%` : "—"}
            icon={DollarSign}
            trend={econTrend}
            delay={0.2}
          />
          <StatCard
            label="Education Equality"
            value={socPct != null ? `${socPct}%` : "—"}
            icon={GraduationCap}
            trend={socTrend}
            delay={0.3}
          />
          <StatCard
            label="Health Equality"
            value={phyPct != null ? `${phyPct}%` : "—"}
            icon={Heart}
            trend={phyTrend}
            delay={0.4}
          />
        </motion.div>

        {/* Detailed Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gender Gaps Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="stat-card"
            >
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">
                Gender Gaps Breakdown
              </h2>

              <div className="space-y-6">
                {[
                  { label: "Economic front", pct: econPct, raw: row?.ineq_econ },
                  { label: "Social front", pct: socPct, raw: row?.ineq_soc },
                  { label: "Physical front", pct: phyPct, raw: row?.ineq_phy },
                ].map((item, i) => {
                  const v = item.pct ?? 0;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.pct != null ? `${item.pct}%` : "—"}
                          {item.raw != null ? ` • raw ${item.raw.toFixed(2)}` : ""}
                        </span>
                      </div>

                      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${v}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                          className="h-full accent-gradient rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Change Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="stat-card"
            >
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">
                Change Over Time
              </h2>

              <div className="flex items-end justify-between h-40 gap-2">
                {trendSeries.length ? (
                  trendSeries.map((d, i) => (
                    <div key={d.year} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${d.score}%` }}
                        transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                        className="w-full accent-gradient rounded-t-lg min-h-[20px]"
                      />
                      <span className="text-xs text-muted-foreground">{d.year}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No trend data available.</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-1">
            <InsightCard insights={insights} delay={0.4} />

            <div className="stat-card mt-6">
              <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                Recommendations
              </h2>

              <div className="space-y-3">
                <div className="border border-border rounded-xl p-4 bg-card/50">
                  <div className="font-medium text-foreground">Placeholder</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Hook your model-driven recommendations here later.
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Data source: CSV predictions for {selectedCountry?.name ?? countryIso3 ?? "—"} in{" "}
                {availableYears.length ? year : "—"}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Country;
