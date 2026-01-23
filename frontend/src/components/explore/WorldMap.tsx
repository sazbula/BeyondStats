import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function WorldMap() {
  useEffect(() => {
    // 1) Load loader.js once
    const existing = document.querySelector(
      'script[src="https://www.gstatic.com/charts/loader.js"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = init;
      document.body.appendChild(script);
    } else {
      // script already there
      if (window.google?.charts) init();
      else existing.addEventListener("load", init, { once: true });
    }

    function init() {
      window.google.charts.load("current", { packages: ["geochart"] });
      window.google.charts.setOnLoadCallback(draw);
    }

    function draw() {
      const data = window.google.visualization.arrayToDataTable([
        ["Country", "Score"],
        ["US", 35],
        ["FR", 42],
        ["SE", 18],
        ["IN", 62],
        ["JP", 44],
      ]);

      const chart = new window.google.visualization.GeoChart(
        document.getElementById("regions_div")
      );
      chart.draw(data, {
  legend: "none",
  backgroundColor: "transparent",
  datalessRegionColor: "#f2e9ef", // optional: soft pinkish empty land
});

    }
  }, []);

  return <div id="regions_div" style={{ width: "100%", height: "500px" }} />;
}
