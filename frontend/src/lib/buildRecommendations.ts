// src/lib/buildRecommendations.ts

import { REC_BANK, Front, Severity, RecItem } from "./recommendationsBank";

export function getWorstFront(scores: Record<Front, number>): Front {
  return (Object.entries(scores) as [Front, number][])
    .sort((a, b) => a[1] - b[1])[0][0]; // lowest score = worst
}

export function severityFromScore(score: number): Severity {
  if (score < 30) return "high";
  if (score < 60) return "middle";
  return "low";
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildRecommendations(scores: Record<Front, number>): {
  worstFront: Front;
  severity: Severity;
  items: RecItem[];
} {
  const worstFront = getWorstFront(scores);
  const severity = severityFromScore(scores[worstFront]);

  const pool = REC_BANK.filter(
    (r) => r.front === worstFront && r.severity === severity
  );

  // show 2 out of 3 so it changes
  return {
    worstFront,
    severity,
    items: shuffle(pool).slice(0, 2),
  };
}
