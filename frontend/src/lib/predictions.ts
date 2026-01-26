export interface PredictionRow {
  countryCode: string; // ISO3
  year: number;
  econ_score: number | null;
  social_score: number | null;
  physical_score: number | null;
  total_score: number | null;
}

const parseNum = (v: string | undefined): number | null => {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const normKey = (k: string) => k.toLowerCase().replace(/[\s_]/g, "");

const splitCsvLine = (line: string): string[] => {
  const out: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // Handle escaped quote ""
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
      continue;
    }
    if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
};

export async function loadPredictionsCsv(
  path = "/data/country_year_scores.csv"
): Promise<PredictionRow[]> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  const text = await res.text();

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((h) => normKey(h));
  const idx = (name: string) => headers.indexOf(normKey(name));

  const iCountry =
    idx("countrycode") >= 0 ? idx("countrycode") : idx("country");
  const iYear = idx("year");
  const iEcon = idx("econscore");
  const iSocial = idx("socialscore");
  const iPhysical = idx("physicalscore");
  const iTotal = idx("totalscore");

  const out: PredictionRow[] = [];

  for (let li = 1; li < lines.length; li++) {
    const cols = splitCsvLine(lines[li]);

    const countryCode = (cols[iCountry] ?? "").trim();
    const year = parseNum(cols[iYear]);

    if (!countryCode || year == null) continue;

    out.push({
      countryCode,
      year: Math.trunc(year),
      econ_score: parseNum(cols[iEcon]),
      social_score: parseNum(cols[iSocial]),
      physical_score: parseNum(cols[iPhysical]),
      total_score: parseNum(cols[iTotal]),
    });
  }

  return out;
}

export function byCountryYear(rows: PredictionRow[]) {
  const index: Record<string, Record<number, PredictionRow>> = {};
  for (const r of rows) {
    if (!index[r.countryCode]) index[r.countryCode] = {};
    index[r.countryCode][r.year] = r;
  }
  return index;
}
export function fillMissingFronts(rows: PredictionRow[]) {
  return rows;
}
