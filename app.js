const METRICS = [
  {
    id: "pop_density",
    label: "Population density",
    unit: "people / km²",
    format: (v) => `${Math.round(v).toLocaleString()} / km²`,
    colors: ["#f6e8c3", "#dfc27d", "#bf812d", "#8c510a", "#543005"],
  },
  {
    id: "literacy_rate",
    label: "Literacy rate (5+)",
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
  },
  {
    id: "female_literacy_rate",
    label: "Female literacy rate",
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#fee8c8", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
  },
  {
    id: "electricity_lighting_pct",
    label: "Electric lighting",
    unit: "% of households",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
  },
  {
    id: "flush_toilet_pct",
    label: "Flush toilet access",
    unit: "% of households",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
  },
  {
    id: "improved_water_pct",
    label: "Improved drinking water",
    unit: "% of households",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
  },
  {
    id: "school_attendance_pct",
    label: "School attendance (ages 5–25)",
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#f7fcb9", "#addd8e", "#78c679", "#31a354", "#006837"],
  },
  {
    id: "mobile_phone_hh_pct",
    label: "Mobile phone households",
    unit: "% of households",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#fff5eb", "#fdd0a2", "#fdae6b", "#e6550d", "#a63603"],
  },
  {
    id: "sex_ratio",
    label: "Sex ratio",
    unit: "males / 100 females",
    format: (v) => `${v.toFixed(1)}`,
    colors: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
  },
];

const DETAIL_FIELDS = [
  ["population", "Population", (v) => v.toLocaleString()],
  ["households", "Households", (v) => v.toLocaleString()],
  ["pop_density", "Density", (v) => `${Math.round(v).toLocaleString()} / km²`],
  ["literacy_rate", "Literacy", (v) => `${v.toFixed(1)}%`],
  ["female_literacy_rate", "Female literacy", (v) => `${v.toFixed(1)}%`],
  ["electricity_lighting_pct", "Electric light", (v) => `${v.toFixed(1)}%`],
  ["flush_toilet_pct", "Flush toilet", (v) => `${v.toFixed(1)}%`],
  ["improved_water_pct", "Improved water", (v) => `${v.toFixed(1)}%`],
  ["school_attendance_pct", "School attendance", (v) => `${v.toFixed(1)}%`],
  ["mobile_phone_hh_pct", "Mobile phone HH", (v) => `${v.toFixed(1)}%`],
  ["sex_ratio", "Sex ratio", (v) => v.toFixed(1)],
  ["area_km2", "Area", (v) => `${v.toLocaleString()} km²`],
];

const metricSelect = document.getElementById("metric");
const legendEl = document.getElementById("legend");
const nationalEl = document.getElementById("national");
const detailEl = document.getElementById("detail");
const detailTitle = document.getElementById("detail-title");
const detailMeta = document.getElementById("detail-meta");
const detailStats = document.getElementById("detail-stats");
const resetBtn = document.getElementById("reset-view");

let metadata = null;
let activeMetric = METRICS[0];
let hoveredId = null;

METRICS.forEach((metric) => {
  const option = document.createElement("option");
  option.value = metric.id;
  option.textContent = metric.label;
  metricSelect.appendChild(option);
});

const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      terrain: {
        type: "raster",
        tiles: [
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    },
    layers: [
      {
        id: "terrain",
        type: "raster",
        source: "terrain",
        paint: {
          "raster-saturation": -0.55,
          "raster-contrast": -0.1,
          "raster-opacity": 0.55,
        },
      },
    ],
  },
  center: [84.1, 28.2],
  zoom: 6.35,
  maxZoom: 10,
  minZoom: 5,
  attributionControl: true,
});

map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "bottom-right");

const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false,
  offset: 12,
});

function formatNational(meta) {
  const values = [
    meta.districts.toLocaleString(),
    meta.population.toLocaleString(),
    `${meta.median_literacy_rate.toFixed(1)}%`,
  ];
  [...nationalEl.querySelectorAll("dd")].forEach((dd, i) => {
    dd.textContent = values[i];
  });
}

function colorExpression(metric, breaks) {
  const stops = [];
  metric.colors.forEach((color, index) => {
    if (index === 0) {
      stops.push(color);
      return;
    }
    stops.push(breaks[index - 1], color);
  });
  return [
    "step",
    ["coalesce", ["get", metric.id], 0],
    ...stops,
  ];
}

function renderLegend(metric, breaks) {
  const labels = [
    "Low",
    ...breaks.map((b) =>
      metric.id.includes("rate") || metric.id.includes("pct")
        ? b.toFixed(0)
        : Math.round(b).toLocaleString()
    ),
    "High",
  ];
  legendEl.innerHTML = `
    <p class="legend-title">${metric.label} · ${metric.unit}</p>
    <div class="legend-scale" aria-hidden="true">
      ${metric.colors
        .map((color) => `<span class="legend-swatch" style="background:${color}"></span>`)
        .join("")}
    </div>
    <div class="legend-labels">
      <span>${labels[0]}</span>
      <span>${labels[Math.floor(labels.length / 2)]}</span>
      <span>${labels[labels.length - 1]}</span>
    </div>
  `;
}

function applyMetric(metricId) {
  activeMetric = METRICS.find((m) => m.id === metricId) || METRICS[0];
  const breaks = metadata.quantile_breaks[activeMetric.id] || [];
  if (map.getLayer("districts-fill")) {
    map.setPaintProperty(
      "districts-fill",
      "fill-color",
      colorExpression(activeMetric, breaks)
    );
  }
  renderLegend(activeMetric, breaks);
}

function showDetail(props) {
  detailEl.hidden = false;
  detailTitle.textContent = props.district;
  detailMeta.textContent = [props.zone, props.region].filter(Boolean).join(" · ") ||
    "District";
  detailStats.innerHTML = DETAIL_FIELDS.map(([key, label, fmt]) => {
    const value = props[key];
    if (value == null) return "";
    return `<div><dt>${label}</dt><dd>${fmt(value)}</dd></div>`;
  }).join("");
}

function setHover(id) {
  if (hoveredId !== null) {
    map.setFeatureState({ source: "districts", id: hoveredId }, { hover: false });
  }
  hoveredId = id;
  if (hoveredId !== null) {
    map.setFeatureState({ source: "districts", id: hoveredId }, { hover: true });
  }
}

async function boot() {
  const [metaRes, geoRes] = await Promise.all([
    fetch("data/processed/atlas_metadata.json"),
    fetch("data/processed/districts_2011.geojson"),
  ]);
  metadata = await metaRes.json();
  const geojson = await geoRes.json();

  geojson.features.forEach((feature, index) => {
    feature.id = index;
  });

  formatNational(metadata.national);

  map.addSource("districts", {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: "districts-fill",
    type: "fill",
    source: "districts",
    paint: {
      "fill-color": "#bf812d",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.92,
        0.78,
      ],
    },
  });

  map.addLayer({
    id: "districts-line",
    type: "line",
    source: "districts",
    paint: {
      "line-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#7c0f1e",
        "#2a3532",
      ],
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1.8,
        0.7,
      ],
      "line-opacity": 0.85,
    },
  });

  applyMetric(activeMetric.id);

  map.on("mousemove", "districts-fill", (event) => {
    if (!event.features?.length) return;
    map.getCanvas().style.cursor = "pointer";
    const feature = event.features[0];
    setHover(feature.id);
    const props = feature.properties;
    const value = props[activeMetric.id];
    popup
      .setLngLat(event.lngLat)
      .setHTML(
        `<strong>${props.district}</strong><br>${activeMetric.label}: ${
          value == null ? "—" : activeMetric.format(Number(value))
        }`
      )
      .addTo(map);
  });

  map.on("mouseleave", "districts-fill", () => {
    map.getCanvas().style.cursor = "";
    setHover(null);
    popup.remove();
  });

  map.on("click", "districts-fill", (event) => {
    if (!event.features?.length) return;
    const props = event.features[0].properties;
    // GeoJSON properties arrive as primitives; coerce numbers
    const normalized = Object.fromEntries(
      Object.entries(props).map(([key, value]) => {
        if (typeof value === "string" && value !== "" && !Number.isNaN(Number(value))) {
          return [key, Number(value)];
        }
        return [key, value];
      })
    );
    showDetail(normalized);
  });

  map.fitBounds(
    [
      [80.05, 26.35],
      [88.2, 30.45],
    ],
    { padding: { top: 40, bottom: 40, left: 40, right: 40 }, duration: 1200 }
  );
}

metricSelect.addEventListener("change", () => applyMetric(metricSelect.value));
resetBtn.addEventListener("click", () => {
  map.fitBounds(
    [
      [80.05, 26.35],
      [88.2, 30.45],
    ],
    { padding: 40, duration: 800 }
  );
});

map.on("load", () => {
  boot().catch((error) => {
    console.error(error);
    legendEl.textContent = "Failed to load atlas data.";
  });
});
