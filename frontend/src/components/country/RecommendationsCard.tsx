// src/components/country/RecommendationsCard.tsx

import React, { useMemo } from "react";
import { buildRecommendations } from "@/lib/buildRecommendations";
import type { Front } from "@/lib/recommendationsBank";

function frontLabel(f: Front) {
  if (f === "economic") return "Economic";
  if (f === "social") return "Social";
  return "Physical";
}

function severityLabel(s: string) {
  if (s === "high") return "High";
  if (s === "middle") return "Middle";
  return "Low";
}

export function RecommendationsCard(props: {
  econPct: number | null;
  socPct: number | null;
  phyPct: number | null;
  countryName?: string;
  year?: number;
}) {
  const { econPct, socPct, phyPct, countryName, year } = props;

  const recData = useMemo(() => {
    if (econPct == null || socPct == null || phyPct == null) return null;

    return buildRecommendations({
      economic: econPct,
      social: socPct,
      physical: phyPct,
    });
  }, [econPct, socPct, phyPct, countryName, year]);

  return (
    <div className="stat-card">
      <h2 className="text-xl font-display font-semibold text-foreground mb-4">
        Recommendations
      </h2>

      <div className="space-y-3">
        {!recData ? (
          <div className="border border-border rounded-xl p-4 bg-card/50">
            <div className="font-medium text-foreground">No recommendations</div>
            <div className="text-sm text-muted-foreground mt-1">
              Missing front scores for this country/year.
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Based on the lowest front score:{" "}
              <span className="font-medium text-foreground">
                {frontLabel(recData.worstFront)}
              </span>{" "}
              ({severityLabel(recData.severity)} severity)
            </p>

            {recData.items.map((r) => (
              <div
                key={r.id}
                className="border border-border rounded-xl p-4 bg-card/50"
              >
                <div className="text-sm text-foreground">{r.text}</div>
              </div>
            ))}
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Data source: CSV predictions for {countryName ?? "—"} in {year ?? "—"}.
      </p>
    </div>
  );
}
