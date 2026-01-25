export type PredictionRow = {
    countryCode: string; // ISO3
    year: number;
    ineq_econ: number;
    ineq_soc: number;
    ineq_phy: number;
    overall_score: number;
  };
  
  const toNum = (x: string) => {
    const n = Number(String(x).trim().replace(/^\uFEFF/, ""));
    return Number.isFinite(n) ? n : 0;
  };
  
  export async function loadPredictionsCsv(
    url = "/data/app_future_2022_2026_filtered.csv"
  ): Promise<PredictionRow[]> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
    const text = await res.text();
  
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
  
    // Parse by position (stable with your file)
    // 0: Country Code, 1: year, 2: ineq_econ, 3: ineq_soc, 4: ineq_phy, 5: overall_score
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      return {
        countryCode: cols[0],
        year: toNum(cols[1]),
        ineq_econ: toNum(cols[2]),
        ineq_soc: toNum(cols[3]),
        ineq_phy: toNum(cols[4]),
        overall_score: toNum(cols[5]),
      };
    });
  }
  
  export function byCountryYear(rows: PredictionRow[]) {
    const out: Record<string, Record<number, PredictionRow>> = {};
    for (const r of rows) (out[r.countryCode] ??= {})[r.year] = r;
    return out;
  }
  