import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export type WorldMapDatum = {
  iso2: string; // GeoChart wants ISO2 or country name
  score: number | null; // 0–100
};

export default function WorldMap(props: {
  data: WorldMapDatum[];
  onRegionClick?: (region: { id: string }) => void; // id will be ISO2 (e.g., "US")
}) {
  const { data, onRegionClick } = props;
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const container = document.getElementById("regions_div");
    if (!container) return;
    const existing = document.querySelector(
      'script[src="https://www.gstatic.com/charts/loader.js"]'
    );
    const load = () => {
      window.google.charts.load("current", { packages: ["geochart"] });
      window.google.charts.setOnLoadCallback(draw);
    };
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = load;
      document.body.appendChild(script);
    } else {
      if (window.google?.charts) load();
      else existing.addEventListener("load", load, { once: true });
    }
    function draw() {
      if (!window.google?.visualization) return;

      const table = [
        ["Country", "Total Score"],
        ...data
          .filter((d) => d.iso2 && d.score != null)
          .map((d) => [d.iso2, d.score]),
      ];

      const dt = window.google.visualization.arrayToDataTable(table);
      const chart = new window.google.visualization.GeoChart(container);
      chartRef.current = chart;
      if (onRegionClick) {
        window.google.visualization.events.removeAllListeners(chart);
        window.google.visualization.events.addListener(chart, "regionClick", (e: any) => {
          const id = e?.region;
          if (id) onRegionClick({ id });
        });
      }

      chart.draw(dt, {
        legend: "none",
        backgroundColor: "transparent",
        datalessRegionColor: "#f2e9ef",
        colorAxis: { minValue: 0, maxValue: 100 },
      });
    }
  }, [data, onRegionClick]);

  return <div id="regions_div" style={{ width: "100%", height: "500px" }} />;
}
