import fs from "node:fs";
import path from "node:path";
import countries from "world-countries";

const meta = countries
  .map((c) => ({
    iso3: c.cca3,                  // ISO3
    iso2: c.cca2,                  // ISO2
    name: c.name?.common ?? c.cca3,
    region: c.region || "Other",   // Europe / Asia / Africa / Americas / Oceania / Other
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const outPath = path.resolve("public/data/country_meta.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(meta, null, 2), "utf-8");

console.log(`Wrote ${meta.length} countries to ${outPath}`);
