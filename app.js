const METRICS = [
  {
    id: "pop_density",
    label: "Population density",
    unit: "people / km²",
    format: (v) => `${Math.round(v).toLocaleString()} / km²`,
    colors: ["#f6e8c3", "#dfc27d", "#bf812d", "#8c510a", "#543005"],
  },
  {
    id: "population",
    label: "Total population",
    unit: "people",
    format: (v) => Math.round(v).toLocaleString(),
    colors: ["#f7fcb9", "#addd8e", "#78c679", "#31a354", "#006837"],
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
    colors: ["#e8f5e9", "#a5d6a7", "#66bb6a", "#2e7d32", "#1b5e20"],
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
  ["male_literacy_rate", "Male literacy", (v) => `${v.toFixed(1)}%`],
  ["electricity_lighting_pct", "Electric light", (v) => `${v.toFixed(1)}%`],
  ["flush_toilet_pct", "Flush toilet", (v) => `${v.toFixed(1)}%`],
  ["improved_water_pct", "Improved water", (v) => `${v.toFixed(1)}%`],
  ["internet_hh_pct", "Internet HH", (v) => `${v.toFixed(1)}%`],
  ["area_km2", "Area", (v) => `${v.toLocaleString()} km²`],
];

const CHART_INK = "#17211f";
const CHART_SOFT = "#5a6863";
const CHART_CRIMSON = "#a51428";
const CHART_FOREST = "#1f4d3f";
const CHART_GOLD = "#c9852a";

const metricSelect = document.getElementById("metric");
const rankSelect = document.getElementById("rank-metric");
const legendEl = document.getElementById("legend");
const detailEl = document.getElementById("detail");
const detailTitle = document.getElementById("detail-title");
const detailMeta = document.getElementById("detail-meta");
const detailStats = document.getElementById("detail-stats");
const metricLabelBtn = document.getElementById("toggle-metric-label");

let metadata = null;
let districts = [];
let featureByName = new Map();
let activeMetric = METRICS[0];
let hoveredId = null;
let selectedDistrict = null;
let rankChart = null;

Chart.defaults.font.family = "'Sora', sans-serif";
Chart.defaults.color = CHART_SOFT;

METRICS.forEach((metric) => {
  const option = document.createElement("option");
  option.value = metric.id;
  option.textContent = metric.label;
  metricSelect.appendChild(option);

  const rankOption = option.cloneNode(true);
  rankSelect.appendChild(rankOption);
});
metricSelect.value = "pop_density";
rankSelect.value = "literacy_rate";

const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      terrain: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
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
          "raster-opacity": 0.5,
        },
      },
    ],
  },
  center: [84.1, 28.2],
  zoom: 6.2,
  maxZoom: 10,
  minZoom: 5,
});

map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "bottom-right");

const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false,
  offset: 12,
});

function metricById(id) {
  return METRICS.find((m) => m.id === id) || METRICS[0];
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
  return ["step", ["coalesce", ["get", metric.id], 0], ...stops];
}

function renderLegend(metric, breaks) {
  legendEl.innerHTML = `
    <p class="legend-title">${metric.label}</p>
    <div class="legend-scale" aria-hidden="true">
      ${metric.colors
        .map((color) => `<span class="legend-swatch" style="background:${color}"></span>`)
        .join("")}
    </div>
    <div class="legend-labels"><span>Low</span><span>High</span></div>
  `;
  metricLabelBtn.textContent = `Map: ${metric.label.toLowerCase()}`;
}

function applyMetric(metricId, { syncSelect = true } = {}) {
  activeMetric = metricById(metricId);
  if (syncSelect) metricSelect.value = activeMetric.id;
  const breaks = metadata?.quantile_breaks?.[activeMetric.id] || [];
  if (map.getLayer("districts-fill")) {
    map.setPaintProperty(
      "districts-fill",
      "fill-color",
      colorExpression(activeMetric, breaks)
    );
  }
  renderLegend(activeMetric, breaks);
}

function normalizeProps(props) {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => {
      if (typeof value === "string" && value !== "" && !Number.isNaN(Number(value))) {
        return [key, Number(value)];
      }
      return [key, value];
    })
  );
}

function showDetail(props) {
  selectedDistrict = props.district;
  detailEl.hidden = false;
  detailTitle.textContent = props.district;
  detailMeta.textContent = [props.zone, props.region].filter(Boolean).join(" · ") || "District";
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

function focusDistrict(name, metricId) {
  const feature = featureByName.get(name);
  if (!feature) return;
  if (metricId) applyMetric(metricId);
  const props = normalizeProps(feature.properties);
  showDetail(props);
  setHover(feature.id);

  const bounds = new maplibregl.LngLatBounds();
  const geom = feature.geometry;
  const push = (coord) => bounds.extend(coord);
  const walk = (coords) => {
    if (typeof coords[0] === "number") push(coords);
    else coords.forEach(walk);
  };
  walk(geom.coordinates);
  map.fitBounds(bounds, { padding: 80, maxZoom: 8, duration: 900 });
}

function chartOptions(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#17211f",
        titleFont: { family: "Fraunces", size: 14 },
        padding: 12,
      },
    },
    ...extra,
  };
}

function buildCharts() {
  const byPop = [...districts]
    .sort((a, b) => b.population - a.population)
    .slice(0, 10);

  new Chart(document.getElementById("chart-population"), {
    type: "bar",
    data: {
      labels: byPop.map((d) => d.district),
      datasets: [
        {
          data: byPop.map((d) => d.population),
          backgroundColor: byPop.map((_, i) =>
            i === 0 ? CHART_CRIMSON : "rgba(31, 77, 63, 0.75)"
          ),
          borderRadius: 8,
        },
      ],
    },
    options: chartOptions({
      indexAxis: "y",
      onClick: (_, elements) => {
        if (!elements.length) return;
        focusDistrict(byPop[elements[0].index].district, "population");
      },
      scales: {
        x: {
          ticks: {
            callback: (v) =>
              v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1000)}k`,
          },
          grid: { color: "rgba(23,33,31,0.06)" },
        },
        y: { grid: { display: false } },
      },
    }),
  });

  const ktm = districts.find((d) => d.district === "Kathmandu");
  const humla = districts.find((d) => d.district === "Humla");
  const contrastHost = document.getElementById("contrast-cards");
  contrastHost.innerHTML = `
    <figure>
      <h3>Kathmandu</h3>
      <p>${ktm.population.toLocaleString()} people · ${Math.round(ktm.pop_density).toLocaleString()}/km² · ${ktm.literacy_rate}% literate</p>
    </figure>
    <figure>
      <h3>Humla</h3>
      <p>${humla.population.toLocaleString()} people · ${humla.pop_density}/km² · ${humla.literacy_rate}% literate</p>
    </figure>
  `;

  new Chart(document.getElementById("chart-contrast"), {
    type: "radar",
    data: {
      labels: ["Literacy", "Female lit.", "Electricity", "Flush toilet", "Improved water", "Mobile phone"],
      datasets: [
        {
          label: "Kathmandu",
          data: [
            ktm.literacy_rate,
            ktm.female_literacy_rate,
            ktm.electricity_lighting_pct,
            ktm.flush_toilet_pct,
            ktm.improved_water_pct,
            ktm.mobile_phone_hh_pct,
          ],
          borderColor: CHART_CRIMSON,
          backgroundColor: "rgba(165, 20, 40, 0.18)",
          pointBackgroundColor: CHART_CRIMSON,
        },
        {
          label: "Humla",
          data: [
            humla.literacy_rate,
            humla.female_literacy_rate,
            humla.electricity_lighting_pct,
            humla.flush_toilet_pct,
            humla.improved_water_pct,
            humla.mobile_phone_hh_pct,
          ],
          borderColor: CHART_FOREST,
          backgroundColor: "rgba(31, 77, 63, 0.16)",
          pointBackgroundColor: CHART_FOREST,
        },
      ],
    },
    options: chartOptions({
      plugins: {
        legend: { display: true, labels: { color: CHART_INK } },
        tooltip: {
          backgroundColor: "#17211f",
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%` },
        },
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false },
          grid: { color: "rgba(23,33,31,0.08)" },
          angleLines: { color: "rgba(23,33,31,0.08)" },
          pointLabels: { color: CHART_INK, font: { size: 11 } },
        },
      },
      onClick: () => focusDistrict("Kathmandu", "pop_density"),
    }),
  });

  new Chart(document.getElementById("chart-scatter"), {
    type: "scatter",
    data: {
      datasets: [
        {
          data: districts.map((d) => ({
            x: d.literacy_rate,
            y: d.flush_toilet_pct,
            district: d.district,
          })),
          backgroundColor: "rgba(31, 77, 63, 0.55)",
          borderColor: CHART_FOREST,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    },
    options: chartOptions({
      parsing: false,
      onClick: (_, elements, chart) => {
        if (!elements.length) return;
        const point = chart.data.datasets[0].data[elements[0].index];
        focusDistrict(point.district, "literacy_rate");
      },
      scales: {
        x: {
          title: { display: true, text: "Literacy rate (%)", color: CHART_INK },
          grid: { color: "rgba(23,33,31,0.06)" },
        },
        y: {
          title: { display: true, text: "Flush toilet (%)", color: CHART_INK },
          grid: { color: "rgba(23,33,31,0.06)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#17211f",
          callbacks: {
            label: (ctx) => {
              const p = ctx.raw;
              return `${p.district}: lit ${p.x}% · toilet ${p.y}%`;
            },
          },
        },
      },
    }),
  });

  const lowPower = [...districts]
    .sort((a, b) => a.electricity_lighting_pct - b.electricity_lighting_pct)
    .slice(0, 10);

  new Chart(document.getElementById("chart-electricity"), {
    type: "bar",
    data: {
      labels: lowPower.map((d) => d.district),
      datasets: [
        {
          data: lowPower.map((d) => d.electricity_lighting_pct),
          backgroundColor: lowPower.map((_, i) =>
            i === 0 ? CHART_CRIMSON : CHART_GOLD
          ),
          borderRadius: 8,
        },
      ],
    },
    options: chartOptions({
      indexAxis: "y",
      onClick: (_, elements) => {
        if (!elements.length) return;
        focusDistrict(lowPower[elements[0].index].district, "electricity_lighting_pct");
      },
      scales: {
        x: {
          max: 100,
          ticks: { callback: (v) => `${v}%` },
          grid: { color: "rgba(23,33,31,0.06)" },
        },
        y: { grid: { display: false } },
      },
    }),
  });

  const genderGap = [...districts]
    .map((d) => ({
      ...d,
      gap: d.male_literacy_rate - d.female_literacy_rate,
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 12);

  new Chart(document.getElementById("chart-gender"), {
    type: "bar",
    data: {
      labels: genderGap.map((d) => d.district),
      datasets: [
        {
          label: "Female",
          data: genderGap.map((d) => d.female_literacy_rate),
          backgroundColor: CHART_CRIMSON,
          borderRadius: 6,
        },
        {
          label: "Male",
          data: genderGap.map((d) => d.male_literacy_rate),
          backgroundColor: CHART_FOREST,
          borderRadius: 6,
        },
      ],
    },
    options: chartOptions({
      indexAxis: "y",
      plugins: {
        legend: { display: true, labels: { color: CHART_INK } },
        tooltip: {
          backgroundColor: "#17211f",
          callbacks: {
            afterBody: (items) => {
              const d = genderGap[items[0].dataIndex];
              return `Gap: ${d.gap.toFixed(1)} pts`;
            },
          },
        },
      },
      onClick: (_, elements) => {
        if (!elements.length) return;
        focusDistrict(genderGap[elements[0].index].district, "female_literacy_rate");
      },
      scales: {
        x: {
          max: 100,
          ticks: { callback: (v) => `${v}%` },
          grid: { color: "rgba(23,33,31,0.06)" },
        },
        y: { grid: { display: false } },
      },
    }),
  });

  renderRankChart(rankSelect.value);
}

function renderRankChart(metricId) {
  const metric = metricById(metricId);
  const ranked = [...districts].sort((a, b) => (b[metricId] ?? 0) - (a[metricId] ?? 0));
  const ctx = document.getElementById("chart-rank");
  if (rankChart) rankChart.destroy();
  rankChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ranked.map((d) => d.district),
      datasets: [
        {
          data: ranked.map((d) => d[metricId]),
          backgroundColor: ranked.map((d) =>
            d.district === selectedDistrict
              ? CHART_CRIMSON
              : "rgba(31, 77, 63, 0.65)"
          ),
          borderRadius: 4,
        },
      ],
    },
    options: chartOptions({
      onClick: (_, elements) => {
        if (!elements.length) return;
        focusDistrict(ranked[elements[0].index].district, metricId);
      },
      scales: {
        x: {
          ticks: { maxRotation: 90, minRotation: 90, font: { size: 9 } },
          grid: { display: false },
        },
        y: {
          grid: { color: "rgba(23,33,31,0.06)" },
          ticks: {
            callback: (v) =>
              metric.unit.includes("%") ? `${v}%` : Number(v).toLocaleString(),
          },
        },
      },
    }),
  });
  applyMetric(metricId);
}

function wireStoryObserver() {
  const chapters = document.querySelectorAll(".chapter");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        chapters.forEach((c) => c.classList.remove("is-active"));
        entry.target.classList.add("is-active");
        const metric = entry.target.dataset.metric;
        if (metric) applyMetric(metric);
      });
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 }
  );
  chapters.forEach((chapter) => observer.observe(chapter));
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
    const props = normalizeProps(feature.properties);
    feature.properties = props;
    districts.push(props);
    featureByName.set(props.district, feature);
  });

  document.getElementById("kpi-pop").textContent =
    metadata.national.population.toLocaleString();
  document.getElementById("kpi-dens").textContent =
    `${metadata.national.pop_density.toFixed(0)} / km²`;
  document.getElementById("kpi-lit").textContent =
    `${metadata.national.median_literacy_rate.toFixed(1)}%`;

  map.addSource("districts", { type: "geojson", data: geojson });
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
    },
  });

  applyMetric("pop_density");
  buildCharts();
  wireStoryObserver();

  map.on("mousemove", "districts-fill", (event) => {
    if (!event.features?.length) return;
    map.getCanvas().style.cursor = "pointer";
    const feature = event.features[0];
    setHover(feature.id);
    const props = normalizeProps(feature.properties);
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
    showDetail(normalizeProps(event.features[0].properties));
  });

  map.fitBounds(
    [
      [80.05, 26.35],
      [88.2, 30.45],
    ],
    { padding: { top: 40, bottom: 40, left: 30, right: 30 }, duration: 1400 }
  );
}

metricSelect.addEventListener("change", () => applyMetric(metricSelect.value));
rankSelect.addEventListener("change", () => renderRankChart(rankSelect.value));
metricLabelBtn.addEventListener("click", () => {
  document.getElementById("map").scrollIntoView({ behavior: "smooth", block: "center" });
});

map.on("load", () => {
  boot().catch((error) => {
    console.error(error);
    legendEl.textContent = "Failed to load atlas data.";
  });
});
