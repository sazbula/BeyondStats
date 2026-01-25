export type PredictionRow = {
    countryCode: string;   // ISO3
    year: number;
  
    ineq_econ: number;
    ineq_soc: number;
    ineq_phy: number;
  
    // raw overall (GII-like)
    overall_score: number;
  
    // raw values from CSV
    ineq_econ_raw: number;
    ineq_soc_raw: number;
    ineq_phy_raw: number;
  };
  
  const toNum = (x: string) => {
    const n = Number(String(x).trim().replace(/^\uFEFF/, ""));
    return Number.isFinite(n) ? n : 0;
  };
  
  export async function loadPredictionsCsv(
    url = "/data/app_future_2022_2026.csv"
  ): Promise<PredictionRow[]> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
    const text = await res.text();
  
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
  
    // Parse by position (stable with your file):
    // 0: Country Code, 1: year, 2: ineq_econ, 3: ineq_soc, 4: ineq_phy, 5: overall_score
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const econ = toNum(cols[2]);
      const soc  = toNum(cols[3]);
      const phy  = toNum(cols[4]);
  
      return {
        countryCode: cols[0],
        year: toNum(cols[1]),
        overall_score: toNum(cols[5]),
  
        ineq_econ: econ,
        ineq_soc: soc,
        ineq_phy: phy,
          ineq_econ_raw: econ,
        ineq_soc_raw: soc,
        ineq_phy_raw: phy,
      };
    });
  }
  
   // Treat exact 0.0 as "missing" for fronts, and forward-fill from earlier years per country.
  export function fillMissingFronts(rows: PredictionRow[]): PredictionRow[] {
    const byC: Record<string, PredictionRow[]> = {};
    for (const r of rows) (byC[r.countryCode] ??= []).push({ ...r });
  
    for (const iso3 of Object.keys(byC)) {
      const arr = byC[iso3].sort((a, b) => a.year - b.year);
  
      let lastE: number | null = null;
      let lastS: number | null = null;
      let lastP: number | null = null;
  
      for (const r of arr) {

        if (r.ineq_econ_raw === 0.0) {
          if (lastE != null) r.ineq_econ = lastE;
        } else {
          r.ineq_econ = r.ineq_econ_raw;
          lastE = r.ineq_econ_raw;
        }
  
        if (r.ineq_soc_raw === 0.0) {
          if (lastS != null) r.ineq_soc = lastS;
        } else {
          r.ineq_soc = r.ineq_soc_raw;
          lastS = r.ineq_soc_raw;
        }
  
        if (r.ineq_phy_raw === 0.0) {
          if (lastP != null) r.ineq_phy = lastP;
        } else {
          r.ineq_phy = r.ineq_phy_raw;
          lastP = r.ineq_phy_raw;
        }
      }
    }
  
    // flatten back
    return Object.values(byC).flat();
  }
  
  export function byCountryYear(rows: PredictionRow[]) {
    const out: Record<string, Record<number, PredictionRow>> = {};
    for (const r of rows) {
      (out[r.countryCode] ??= {})[r.year] = r;
    }
    return out;
  }
  
  /**
   * Helper for "discount 0 values" in any calculation:
   * - if raw is 0.0 AND no earlier year existed, we may still be 0.0; exclude it
   * - otherwise include filled value
   */
  export function availableFrontValues(r: PredictionRow): number[] {
    const vals: number[] = [];
  
    // Include if it wasn't missing OR we successfully filled it.
    if (!(r.ineq_econ_raw === 0.0 && r.ineq_econ === 0.0)) vals.push(r.ineq_econ);
    if (!(r.ineq_soc_raw === 0.0 && r.ineq_soc === 0.0)) vals.push(r.ineq_soc);
    if (!(r.ineq_phy_raw === 0.0 && r.ineq_phy === 0.0)) vals.push(r.ineq_phy);
  
    return vals;
  }
  