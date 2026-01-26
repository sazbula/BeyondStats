import { useEffect, useMemo, useState } from "react";
import {
  byCountryYear,
  loadPredictionsCsv,
  type PredictionRow,
  fillMissingFronts,
} from "@/lib/predictions";

export function usePredictions() {
  const [rows, setRows] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const r = await loadPredictionsCsv("/data/country_year_scores.csv");
        if (!alive) return;
        setRows(fillMissingFronts(r));
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load scores");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const index = useMemo(() => byCountryYear(rows), [rows]);

  return { rows, index, loading, error };
}
