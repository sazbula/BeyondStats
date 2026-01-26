// src/components/country/WhatYouCanDoCard.tsx
import React, { useMemo } from "react";
import { buildWhatYouCanDo } from "@/lib/buildWhatYouCanDo";

function severityLabel(s: string) {
  if (s === "high") return "High";
  if (s === "middle") return "Middle";
  return "Low";
}

export function WhatYouCanDoCard(props: {
  econScore: number | null;
  socScore: number | null;
  phyScore: number | null;
  refreshKey?: string; // reroll when country/year changes
}) {
  const { econScore, socScore, phyScore, refreshKey } = props;

  const data = useMemo(() => {
    if (econScore == null || socScore == null || phyScore == null) return null;

    return buildWhatYouCanDo({
      economic: econScore,
      social: socScore,
      physical: phyScore,
      k: 2,
    });
  }, [econScore, socScore, phyScore, refreshKey]);

  return (
    <div className="stat-card">
      <h2 className="text-xl font-display font-semibold text-foreground mb-2">
        What you can do
      </h2>

      {!data ? (
        <p className="text-sm text-muted-foreground">No actions available.</p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-3">
            Suggested actions 
          </p>

          <div className="space-y-3">
            {data.items.map((it) => (
              <div key={it.id} className="border border-border rounded-xl p-4 bg-card/50">
                <div className="text-sm text-foreground">{it.text}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}