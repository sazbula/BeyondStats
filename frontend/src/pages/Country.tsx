import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, GraduationCap, Heart, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/country/StatCard";
import { RecommendationsCard } from "@/components/country/RecommendationsCard";
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

const trend = (curr?: number | null, prev?: number | null): Trend => {
  if (curr == null || prev == null) return "stable";
  if (curr === prev) return "stable";
  return curr > prev ? "up" : "down";
};
const clamp01 = (v: number) => Math.max(0, Math.min(100, v));
const REGION_ORDER = ["Europe", "Americas", "Asia", "Africa", "Oceania", "Other"] as const;

const Country = () => {
  const { rows, index, loading, error } = usePredictions();

  // ✅ read /country?id=USA&year=2019
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id"); // ISO3
  const yearFromUrlRaw = searchParams.get("year"); // e.g. "2019"

  // ✅ prevents URL-sync from overwriting the incoming URL year
  const appliedUrlYearRef = useRef(false);

  // Reset "applied URL year" when URL params change (new navigation)
  useEffect(() => {
    appliedUrlYearRef.current = false;
    initializedRef.current = false; // Also reset country initialization
  }, [idFromUrl, yearFromUrlRaw]);

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

  const iso3WithData = useMemo(() => new Set(rows.map((r) => r.countryCode)), [rows]);

  const metaWithData = useMemo(() => {
    if (!meta.length) return [];
    return meta.filter((m) => iso3WithData.has(m.iso3));
  }, [meta, iso3WithData]);

  // Regions present
  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const m of metaWithData) set.add(m.region || "Other");
    const inOrder = REGION_ORDER.filter((r) => set.has(r));
    const rest = Array.from(set)
      .filter((r) => !inOrder.includes(r as any))
      .sort();
    return ["All", ...inOrder, ...rest];
  }, [metaWithData]);

  const [region, setRegion] = useState<string>("All");
  const [countryIso3, setCountryIso3] = useState<string>("");
  const [year, setYear] = useState<number | null>(null);

  // Track if we've done initial setup
  const initializedRef = useRef(false);

  // Countries for current region
  const countryOptions = useMemo(() => {
    const list =
      region === "All"
        ? metaWithData
        : metaWithData.filter((m) => (m.region || "Other") === region);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [metaWithData, region]);

  // ✅ Ensure selected country exists + prioritize URL param (?id=ISO3)
  useEffect(() => {
    if (!countryOptions.length) return;

    const wanted = idFromUrl ? idFromUrl.toUpperCase() : null;

    // If this is initial load and we haven't set anything yet
    if (!initializedRef.current) {
      initializedRef.current = true;
      
      // 1) If URL has an id and it exists in current options, select it
      if (wanted && countryOptions.some((c) => c.iso3 === wanted)) {
        setCountryIso3(wanted);
        return;
      }
      
      // 2) Otherwise, select first option
      setCountryIso3(countryOptions[0].iso3);
      return;
    }

    // After initialization, only update if current selection is invalid
    if (countryIso3 && countryOptions.some((c) => c.iso3 === countryIso3)) {
      return; // Current selection is valid, keep it
    }
    
    // Current selection is invalid, pick new one
    if (wanted && countryOptions.some((c) => c.iso3 === wanted)) {
      setCountryIso3(wanted);
    } else {
      setCountryIso3(countryOptions[0].iso3);
    }
  }, [countryOptions, countryIso3, idFromUrl]);

  const selectedCountry = useMemo(() => {
    return countryOptions.find((c) => c.iso3 === countryIso3) ?? null;
  }, [countryOptions, countryIso3]);

  // Available years for selected country
  const availableYears = useMemo(() => {
    if (!countryIso3) return [];
    const byYear = index?.[countryIso3];
    if (!byYear) return [];
    return Object.keys(byYear).map(Number).sort((a, b) => b - a);
  }, [index, countryIso3]);

  // ✅ Pick year from URL ONCE (if valid), then fall back to latest
  useEffect(() => {
    if (!availableYears.length) return;

    const urlYear =
      yearFromUrlRaw && Number.isFinite(Number(yearFromUrlRaw))
        ? Number(yearFromUrlRaw)
        : null;

    // Apply URL year only once (per navigation)
    if (!appliedUrlYearRef.current) {
      appliedUrlYearRef.current = true;

      if (urlYear != null && availableYears.includes(urlYear)) {
        setYear(urlYear);
        return;
      }
      
      // No valid URL year, set to latest
      setYear(availableYears[0]);
      return;
    }

    // After initial application, keep current if valid, else default to latest
    if (year !== null && availableYears.includes(year)) return;
    setYear(availableYears[0]);
  }, [availableYears, yearFromUrlRaw, year]);

  const row = countryIso3 && year !== null ? index?.[countryIso3]?.[year] : undefined;
  const prev = countryIso3 && year !== null ? index?.[countryIso3]?.[year - 1] : undefined;

  const overallScore = row?.total_score ?? null;
  const econScore = row?.econ_score ?? null;
  const socScore = row?.social_score ?? null;
  const phyScore = row?.physical_score ?? null;

  const overallTrend: Trend = trend(overallScore, prev?.total_score);
  const econTrend: Trend = trend(econScore, prev?.econ_score);
  const socTrend: Trend = trend(socScore, prev?.social_score);
  const phyTrend: Trend = trend(phyScore, prev?.physical_score);

  // Trend series (last 5 available years, ascending)
  const trendSeries = useMemo(() => {
    if (!countryIso3 || !availableYears.length) return [];
    const yearsAsc = [...availableYears].sort((a, b) => a - b).slice(-5);
    return yearsAsc.map((y) => {
      const r = index?.[countryIso3]?.[y];
      const score = r?.total_score ?? null;
      return { year: y, score };
    });
  }, [availableYears, index, countryIso3]);

  // ✅ Keep URL in sync (but DON'T overwrite an incoming ?year=... before we apply it)
  useEffect(() => {
    if (!countryIso3) return;
    if (!availableYears.length) return;
    if (year === null) return; // Don't sync until year is set

    // If URL had a year and we haven't applied it yet, do not replace URL
    if (yearFromUrlRaw && !appliedUrlYearRef.current) return;

    const wantedId = countryIso3.toUpperCase();
    const wantedYear = String(year);

    const currentId = (searchParams.get("id") || "").toUpperCase();
    const currentYear = searchParams.get("year") || "";

    if (currentId !== wantedId || currentYear !== wantedYear) {
      setSearchParams({ id: wantedId, year: wantedYear }, { replace: true });
    }
  }, [countryIso3, year, availableYears.length, yearFromUrlRaw, searchParams, setSearchParams]);

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
            <p className="text-muted-foreground">Deep dive into equality scores and trends</p>
            <p className="text-xs text-muted-foreground mt-1">
              {countryIso3 ? `ISO3: ${countryIso3}` : ""}
              {selectedCountry?.region ? ` • Region: ${selectedCountry.region}` : ""}
              {year !== null ? ` • Year: ${year}` : ""}
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

            {/* Country dropdown */}
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
              value={year !== null ? year.toString() : ""}
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
            {loading && <div className="text-muted-foreground">Loading scores…</div>}
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
            label="Total Score"
            value={overallScore != null ? String(Math.round(overallScore)) : "—"}
            subValue="/100"
            icon={Users}
            trend={overallTrend}
            delay={0.1}
          />
          <StatCard
            label="Economic"
            value={econScore != null ? `${Math.round(econScore)}` : "—"}
            subValue="/100"
            icon={DollarSign}
            trend={econTrend}
            delay={0.2}
          />
          <StatCard
            label="Social"
            value={socScore != null ? `${Math.round(socScore)}` : "—"}
            subValue="/100"
            icon={GraduationCap}
            trend={socTrend}
            delay={0.3}
          />
          <StatCard
            label="Physical"
            value={phyScore != null ? `${Math.round(phyScore)}` : "—"}
            subValue="/100"
            icon={Heart}
            trend={phyTrend}
            delay={0.4}
          />
        </motion.div>

        {/* Detailed Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Front Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="stat-card"
            >
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">
                Front Breakdown
              </h2>

              <div className="space-y-6">
                {[
                  { label: "Economic front", value: econScore },
                  { label: "Social front", value: socScore },
                  { label: "Physical front", value: phyScore },
                ].map((item, i) => {
                  const v = clamp01(item.value ?? 0);
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
                          {item.value != null ? `${Math.round(item.value)}/100` : "—"}
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
                Change Over Time (Total Score)
              </h2>

              <div className="flex items-end justify-between h-40 gap-2">
                {trendSeries.length ? (
                  trendSeries.map((d, i) => {
                    const h = clamp01(d.score ?? 0);
                    return (
                      <div key={d.year} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                          className="w-full accent-gradient rounded-t-lg min-h-[20px]"
                        />
                        <span className="text-xs text-muted-foreground">{d.year}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-muted-foreground">No trend data available.</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-1 space-y-6">
            <RecommendationsCard
              econPct={econScore}
              socPct={socScore}
              phyPct={phyScore}
              countryName={selectedCountry?.name ?? countryIso3 ?? "—"}
              year={year !== null ? year : undefined}
            />
          </div>
        </div>

        {/* Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="stat-card mt-6"
        >
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            How this is calculated
          </h2>

          <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div className="space-y-1">
              <p className="text-foreground font-medium">Total score</p>
              <p>
                Uses <code>total_score</code> from the CSV (0–100). Higher is better.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-foreground font-medium">Front scores</p>
              <p>
                Uses <code>econ_score</code>, <code>social_score</code>,{" "}
                <code>physical_score</code> (0–100). Higher is better.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-foreground font-medium">Recommendations</p>
              <p>
                Based on the lowest available front score. If a front is missing, it's skipped.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-foreground font-medium">Trends</p>
              <p>
                Compares selected year vs previous year. Up = higher score, down = lower score.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Country;