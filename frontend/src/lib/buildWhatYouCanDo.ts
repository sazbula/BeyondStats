// src/lib/buildWhatYouCanDo.ts
import type { Severity, ActionItem } from "./whatYouCanDoBank";
import { WHAT_YOU_CAN_DO } from "./whatYouCanDoBank";

export function severityFromScore(score: number): Severity {
  if (score < 60) return "high";
  if (score < 75) return "middle";
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

export function buildWhatYouCanDo(input: {
  economic: number;
  social: number;
  physical: number;
  k?: number;
}): { severity: Severity; items: ActionItem[] } {
  const { economic, social, physical, k = 2 } = input;

  const worst = Math.min(economic, social, physical);
  const severity = severityFromScore(worst);

  const pool = WHAT_YOU_CAN_DO.filter((x) => x.severity === severity);

  return {
    severity,
    items: shuffle(pool).slice(0, k),
  };
}