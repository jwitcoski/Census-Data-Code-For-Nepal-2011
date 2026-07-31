/** Choropleth coloring, legends, and belt-colored prologue map. */

import { BELT_COLORS, METRICS } from "./config.js";
import { map } from "./map.js";
import { dom, state } from "./state.js";

export function colorExpression(metric, breaks) {
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

export function renderLegend(metric, breaks) {
  const labels = [
    "Low",
    ...breaks.map((b) =>
      metric.id.includes("rate") || metric.id.includes("pct")
        ? b.toFixed(0)
        : Math.round(b).toLocaleString()
    ),
    "High",
  ];
  dom.legendEl.style.opacity = "0.55";
  window.setTimeout(() => {
    dom.legendEl.innerHTML = `
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
    dom.legendEl.style.opacity = "1";
  }, state.reduceMotion ? 0 : 120);
}

export function applyMetric(metricId, { syncSelect = true, colors = null } = {}) {
  state.activeMetric = METRICS.find((m) => m.id === metricId) || METRICS[0];
  if (syncSelect) dom.metricSelect.value = state.activeMetric.id;
  const breaks = state.metadata?.quantile_breaks?.[state.activeMetric.id] || [];
  const palette = colors || state.activeMetric.colors;
  const styledMetric = { ...state.activeMetric, colors: palette };
  if (map.getLayer("districts-fill")) {
    map.setPaintProperty(
      "districts-fill",
      "fill-color",
      colorExpression(styledMetric, breaks)
    );
  }
  renderLegend(styledMetric, breaks);
}

export function applyRegionMap() {
  if (map.getLayer("districts-fill")) {
    map.setPaintProperty("districts-fill", "fill-color", [
      "match",
      ["get", "belt"],
      "Mountains",
      BELT_COLORS.Mountains,
      "Hills",
      BELT_COLORS.Hills,
      "Tarai",
      BELT_COLORS.Tarai,
      "#9aa39c",
    ]);
  }
  dom.legendEl.innerHTML = `
    <p class="legend-title">Ecological belts</p>
    <div class="belt-legend">
      <span><i style="background:${BELT_COLORS.Mountains}"></i> Mountains</span>
      <span><i style="background:${BELT_COLORS.Hills}"></i> Hills</span>
      <span><i style="background:${BELT_COLORS.Tarai}"></i> Tarai</span>
    </div>
    <p class="legend-note">Hover China, India, Everest &amp; Kathmandu for why each matters.</p>
  `;
  dom.legendEl.style.opacity = "1";
}

export function formatNational(meta) {
  const values = [
    meta.districts.toLocaleString(),
    meta.population.toLocaleString(),
    `${meta.median_literacy_rate.toFixed(1)}%`,
  ];
  [...dom.nationalEl.querySelectorAll("dd")].forEach((dd, i) => {
    dd.textContent = values[i];
  });
}
