/** Load atlas GeoJSON and register MapLibre sources / layers. */

import { applyMetric, formatNational } from "./choropleth.js";
import { districtBelt } from "./config.js";
import { updateLandmarkOverlay } from "./labels.js";
import { map } from "./map.js";
import { state } from "./state.js";
import { activateChapter, observeChapters } from "./story.js";
import { bindMapInteractions, bindUiControls } from "./interactions.js";

function addDistrictLayers() {
  map.addLayer({
    id: "districts-fill",
    type: "fill",
    source: "districts",
    paint: {
      "fill-color": "#bf812d",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.96,
        ["boolean", ["feature-state", "story"], false],
        0.94,
        ["boolean", ["feature-state", "dim"], false],
        0.04,
        0.72,
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
        "#6e101c",
        [
          "case",
          ["boolean", ["feature-state", "story"], false],
          "#9e1528",
          [
            "case",
            ["boolean", ["feature-state", "dim"], false],
            "#6a7571",
            "#2a3532",
          ],
        ],
      ],
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        2.4,
        ["case", ["boolean", ["feature-state", "story"], false], 2, 0.55],
      ],
      "line-opacity": [
        "case",
        ["boolean", ["feature-state", "dim"], false],
        0.35,
        0.9,
      ],
    },
  });
}

function addShakeLayers() {
  map.addLayer({
    id: "shake-mmi-halo",
    type: "line",
    source: "shake-mmi",
    layout: {
      visibility: "none",
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#fff8f0",
      "line-width": [
        "interpolate",
        ["linear"],
        ["get", "value"],
        5,
        4,
        6.5,
        6,
        8,
        8,
      ],
      "line-opacity": 0.9,
    },
  });

  map.addLayer({
    id: "shake-mmi",
    type: "line",
    source: "shake-mmi",
    layout: {
      visibility: "none",
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": [
        "interpolate",
        ["linear"],
        ["get", "value"],
        5,
        "#fca5a5",
        6,
        "#ef4444",
        7,
        "#b91c1c",
        8,
        "#7f1d1d",
      ],
      "line-width": [
        "interpolate",
        ["linear"],
        ["get", "value"],
        5,
        2,
        6.5,
        3.2,
        8,
        4.5,
      ],
      "line-opacity": 0.95,
    },
  });

  map.addLayer({
    id: "shake-epicenter-glow",
    type: "circle",
    source: "shake-epicenter",
    layout: { visibility: "none" },
    paint: {
      "circle-radius": 22,
      "circle-color": "#9e1528",
      "circle-opacity": 0.35,
      "circle-blur": 0.55,
    },
  });

  map.addLayer({
    id: "shake-epicenter",
    type: "circle",
    source: "shake-epicenter",
    layout: { visibility: "none" },
    paint: {
      "circle-radius": 8,
      "circle-color": "#9e1528",
      "circle-stroke-width": 2.5,
      "circle-stroke-color": "#fff8f0",
    },
  });
}

export async function boot() {
  const [metaRes, geoRes, shakeRes, epiRes] = await Promise.all([
    fetch("data/processed/atlas_metadata.json"),
    fetch("data/processed/districts_2011.geojson"),
    fetch("data/processed/gorkha_2015_mmi_contours.geojson"),
    fetch("data/processed/gorkha_2015_epicenter.geojson"),
  ]);
  state.metadata = await metaRes.json();
  state.geojson = await geoRes.json();
  const shakeGeojson = await shakeRes.json();
  const epicenterGeojson = await epiRes.json();

  state.geojson.features.forEach((feature, index) => {
    feature.id = index;
    feature.properties.belt = districtBelt(feature.properties.district);
    state.districtIdByName.set(feature.properties.district, index);
    state.allDistrictIds.push(index);
  });

  formatNational(state.metadata.national);

  map.addSource("districts", {
    type: "geojson",
    data: state.geojson,
  });
  map.addSource("shake-mmi", {
    type: "geojson",
    data: shakeGeojson,
  });
  map.addSource("shake-epicenter", {
    type: "geojson",
    data: epicenterGeojson,
  });

  addDistrictLayers();
  addShakeLayers();

  state.mapReady = true;
  applyMetric("literacy_rate");
  observeChapters();
  map.resize();
  activateChapter("hero");

  window.addEventListener("resize", () => {
    map.resize();
    updateLandmarkOverlay();
  });

  bindUiControls();
  bindMapInteractions();
}
