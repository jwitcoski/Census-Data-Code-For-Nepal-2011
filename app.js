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

const NEPAL_BOUNDS = [
  [80.05, 26.35],
  [88.2, 30.45],
];

const MID_WESTERN_HILLS = [
  "Rolpa",
  "Rukum",
  "Jajarkot",
  "Salyan",
  "Pyuthan",
  "Dailekh",
  "Surkhet",
  "Dang",
  "Kalikot",
  "Jumla",
  "Dolpa",
  "Humla",
  "Mugu",
];

const WAR_CORE_LABELS = ["Rolpa", "Rukum", "Jajarkot"];

const MOUNTAIN_DISTRICTS = [
  "Taplejung",
  "Sankhuwasabha",
  "Solukhumbu",
  "Dolakha",
  "Sindhupalchok",
  "Rasuwa",
  "Manang",
  "Mustang",
  "Dolpa",
  "Mugu",
  "Humla",
  "Jumla",
  "Kalikot",
  "Bajhang",
  "Bajura",
  "Darchula",
];

const TARAI_DISTRICTS = [
  "Jhapa",
  "Morang",
  "Sunsari",
  "Saptari",
  "Siraha",
  "Dhanusa",
  "Mahottari",
  "Sarlahi",
  "Rautahat",
  "Bara",
  "Parsa",
  "Chitawan",
  "Nawalparasi",
  "Rupandehi",
  "Kapilbastu",
  "Dang",
  "Banke",
  "Bardiya",
  "Kailali",
  "Kanchanpur",
];

const BELT_COLORS = {
  Mountains: "#4f6f8f",
  Hills: "#2f6b4f",
  Tarai: "#c9a24a",
};

function districtBelt(name) {
  if (MOUNTAIN_DISTRICTS.includes(name)) return "Mountains";
  if (TARAI_DISTRICTS.includes(name)) return "Tarai";
  return "Hills";
}

const CHAPTERS = {
  hero: {
    label: "Prologue",
    metric: null,
    regionMap: true,
    bounds: [
      [80.0, 26.2],
      [88.4, 30.6],
    ],
    highlight: [],
    labels: [],
    regionLabels: [
      {
        text: "China",
        lngLat: [84.4, 30.28],
        kind: "neighbor",
        title: "China",
        blurb:
          "Nepal’s northern neighbor across the Himalaya. A nuclear power and major trade partner; the border shapes security, hydropower politics, and Himalayan geopolitics.",
      },
      {
        text: "India",
        lngLat: [84.5, 26.18],
        kind: "neighbor",
        title: "India",
        blurb:
          "Nepal’s southern neighbor across the open Tarai frontier. Another nuclear power; India dominates trade, fuel supply, labor migration routes, and much of Nepal’s lowland economy.",
      },
      {
        text: "Mt. Everest",
        lngLat: [86.83, 27.92],
        kind: "peak",
        title: "Mount Everest (Sagarmatha)",
        blurb:
          "Earth’s highest peak (8,849 m) on the Nepal–China border in Solukhumbu. A global icon of Nepal, central to tourism, Sherpa livelihoods, and the mountain identity of the country.",
      },
      {
        text: "Kathmandu",
        lngLat: [85.324, 27.717],
        kind: "place",
        title: "Kathmandu",
        blurb:
          "The capital in the central Valley — political, economic, and cultural core. By 2011 it was already Nepal’s densest district, concentrating power far from the hills and Tarai.",
      },
    ],
    focus: false,
    explore: false,
    wiki: false,
  },
  "civil-war": {
    label: "Chapter 1 · Mid-Western hills",
    metric: "electricity_lighting_pct",
    bounds: [
      [80.85, 27.6],
      [83.55, 30.15],
    ],
    highlight: MID_WESTERN_HILLS,
    labels: WAR_CORE_LABELS,
    focus: true,
    explore: false,
    wiki: {
      page: "Nepalese_Civil_War",
      button: "Wikipedia · Nepalese Civil War",
      fallbackTitle: "Nepalese Civil War",
      fallbackBlurb:
        "Could not load the Wikipedia summary. Open the article for the 1996–2006 Maoist conflict overview.",
    },
  },
  "three-nepals": {
    label: "Chapter 2 · Three Nepals",
    metric: "literacy_rate",
    bounds: NEPAL_BOUNDS,
    highlight: [],
    labels: [],
    regionLabels: [
      {
        text: "Mountains",
        lngLat: [83.9, 29.15],
        kind: "belt",
        belt: "Mountains",
        title: "Mountain belt",
        blurb:
          "High Himalaya — sparse settlement, pastoral and tourism economies, hardest to reach with roads and power. Hover to isolate these districts.",
      },
      {
        text: "Hills",
        lngLat: [84.2, 28.05],
        kind: "belt",
        belt: "Hills",
        title: "Hill belt",
        blurb:
          "The Mid Hills — historic heartland of the Nepali state, terraced farming, and many remittance villages. Hover to isolate these districts.",
      },
      {
        text: "Tarai",
        lngLat: [85.35, 26.85],
        kind: "belt",
        belt: "Tarai",
        title: "Tarai belt",
        blurb:
          "The southern plains — densest farmland and trade corridor with India, yet among the lowest literacy scores. Hover to isolate these districts.",
      },
    ],
    focus: false,
    explore: false,
    wiki: false,
  },
  "tarai-literacy": {
    label: "Chapter 3 · Dense & left behind",
    metric: "school_attendance_pct",
    bounds: [
      [84.0, 26.4],
      [87.6, 27.55],
    ],
    highlight: ["Rautahat", "Mahottari", "Sarlahi", "Dhanusa", "Siraha"],
    labels: ["Rautahat", "Mahottari", "Sarlahi", "Dhanusa", "Siraha"],
    focus: true,
    explore: false,
    wiki: false,
  },
  "absent-men": {
    label: "Chapter 4 · Absent men",
    metric: "sex_ratio",
    bounds: [
      [81.8, 27.4],
      [85.0, 29.2],
    ],
    highlight: ["Gulmi", "Syangja", "Arghakhanchi", "Rolpa", "Pyuthan"],
    labels: ["Gulmi", "Syangja", "Arghakhanchi", "Rolpa", "Pyuthan"],
    focus: true,
    explore: false,
    wiki: {
      page: "Remittances_to_Nepal",
      button: "Wikipedia · Remittances to Nepal",
      fallbackTitle: "Remittances to Nepal",
      fallbackBlurb:
        "Could not load the Wikipedia summary. Open the article on money sent home by Nepali workers abroad.",
    },
  },
  "valley-quake": {
    label: "Chapter 5 · Valley before the quake",
    metric: "pop_density",
    colors: ["#fecaca", "#f87171", "#ef4444", "#b91c1c", "#7f1d1d"],
    bounds: [
      [84.2, 27.35],
      [86.1, 28.55],
    ],
    highlight: ["Kathmandu", "Bhaktapur", "Lalitpur", "Gorkha", "Dhading", "Nuwakot", "Rasuwa", "Sindhupalchok", "Kavrepalanchok"],
    labels: ["Kathmandu", "Bhaktapur", "Lalitpur", "Gorkha"],
    focus: true,
    explore: false,
    shake: true,
    wiki: {
      page: "April_2015_Nepal_earthquake",
      button: "Wikipedia · April 2015 Nepal earthquake",
      fallbackTitle: "April 2015 Nepal earthquake",
      fallbackBlurb:
        "Could not load the Wikipedia summary. Open the article on the Mw 7.8 Gorkha earthquake of 25 April 2015.",
    },
  },
  explore: {
    label: "Explore",
    metric: null,
    bounds: NEPAL_BOUNDS,
    highlight: [],
    labels: [],
    focus: false,
    explore: true,
    wiki: false,
  },
};

const metricSelect = document.getElementById("metric");
const legendEl = document.getElementById("legend");
const nationalEl = document.getElementById("national");
const detailEl = document.getElementById("detail");
const detailTitle = document.getElementById("detail-title");
const detailMeta = document.getElementById("detail-meta");
const detailStats = document.getElementById("detail-stats");
const resetBtn = document.getElementById("reset-view");
const chapterNav = document.getElementById("chapter-nav");
const wikiPanel = document.getElementById("wiki-panel");
const wikiBody = document.getElementById("wiki-panel-body");
const wikiCloseBtn = document.getElementById("wiki-close");
const steps = [...document.querySelectorAll(".step[data-chapter]")];

const CHAPTER_TARGETS = {
  hero: "chapter-0",
  "civil-war": "chapter-1",
  "three-nepals": "chapter-2",
  "tarai-literacy": "chapter-3",
  "absent-men": "chapter-4",
  "valley-quake": "chapter-5",
  explore: "chapter-explore",
};

let metadata = null;
let geojson = null;
let districtIdByName = new Map();
let allDistrictIds = [];
let activeMetric = METRICS.find((m) => m.id === "literacy_rate");
let activeChapter = null;
let hoveredId = null;
let highlightedIds = [];
let dimmedIds = [];
let exploreMode = false;
let focusMode = false;
let mapReady = false;
let wikiCache = new Map();
let activeWiki = null;
let wikiUserClosed = false;
let labelMarkers = [];
let landmarkOverlay = null;
let beltFocusActive = false;
let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
          "raster-opacity": 0.55,
        },
      },
    ],
  },
  center: [84.1, 28.2],
  zoom: 6.35,
  maxZoom: 11,
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
  return ["step", ["coalesce", ["get", metric.id], 0], ...stops];
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
  legendEl.style.opacity = "0.55";
  window.setTimeout(() => {
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
    legendEl.style.opacity = "1";
  }, reduceMotion ? 0 : 120);
}

function applyMetric(metricId, { syncSelect = true, colors = null } = {}) {
  activeMetric = METRICS.find((m) => m.id === metricId) || METRICS[0];
  if (syncSelect) metricSelect.value = activeMetric.id;
  const breaks = metadata?.quantile_breaks?.[activeMetric.id] || [];
  const palette = colors || activeMetric.colors;
  const styledMetric = { ...activeMetric, colors: palette };
  if (map.getLayer("districts-fill")) {
    map.setPaintProperty(
      "districts-fill",
      "fill-color",
      colorExpression(styledMetric, breaks)
    );
  }
  renderLegend(styledMetric, breaks);
}

function applyNeutralMap() {
  applyRegionMap();
}

function applyRegionMap() {
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
  legendEl.innerHTML = `
    <p class="legend-title">Ecological belts</p>
    <div class="belt-legend">
      <span><i style="background:${BELT_COLORS.Mountains}"></i> Mountains</span>
      <span><i style="background:${BELT_COLORS.Hills}"></i> Hills</span>
      <span><i style="background:${BELT_COLORS.Tarai}"></i> Tarai</span>
    </div>
    <p class="legend-note">Hover China, India, Everest &amp; Kathmandu for why each matters.</p>
  `;
  legendEl.style.opacity = "1";
}

function focusBelt(belt) {
  if (!geojson || !map.getSource("districts")) return;
  beltFocusActive = true;

  highlightedIds.forEach((id) => {
    map.setFeatureState({ source: "districts", id }, { story: false });
  });
  dimmedIds.forEach((id) => {
    map.setFeatureState({ source: "districts", id }, { dim: false });
  });
  highlightedIds = [];
  dimmedIds = [];

  geojson.features.forEach((feature) => {
    const id = feature.id;
    const match = feature.properties.belt === belt;
    map.setFeatureState(
      { source: "districts", id },
      { story: match, dim: !match }
    );
    if (match) highlightedIds.push(id);
    else dimmedIds.push(id);
  });
}

function clearBeltFocus() {
  if (!beltFocusActive) return;
  beltFocusActive = false;
  const chapter = CHAPTERS[activeChapter];
  if (!chapter) return;
  setHighlights(chapter.highlight || [], { focus: Boolean(chapter.focus) });
}

function clearLandmarkOverlay() {
  if (!landmarkOverlay) return;
  map.off("move", landmarkOverlay.update);
  map.off("zoom", landmarkOverlay.update);
  map.off("resize", landmarkOverlay.update);
  landmarkOverlay.root.remove();
  landmarkOverlay = null;
}

function clearAllLabels() {
  clearLandmarkOverlay();
  labelMarkers.forEach((marker) => marker.remove());
  labelMarkers = [];
  clearBeltFocus();
}

function setLandmarkOverlay(regionLabels = []) {
  clearLandmarkOverlay();
  if (!regionLabels.length) return;

  const root = document.createElement("div");
  root.className = "landmark-overlay";
  map.getCanvasContainer().appendChild(root);

  const items = regionLabels.map((region) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `region-label region-label--${region.kind || "region"}`;
    el.setAttribute(
      "aria-label",
      `${region.title || region.text}. ${region.blurb || ""}`
    );
    el.innerHTML = `
      <span class="region-label-text">${region.text}</span>
      <span class="region-tooltip" role="tooltip">
        <strong>${region.title || region.text}</strong>
        <span>${region.blurb || ""}</span>
      </span>
    `;

    if (region.belt) {
      const show = () => focusBelt(region.belt);
      const hide = () => clearBeltFocus();
      el.addEventListener("mouseenter", show);
      el.addEventListener("focus", show);
      el.addEventListener("mouseleave", hide);
      el.addEventListener("blur", hide);
    }

    root.appendChild(el);
    return { el, lngLat: region.lngLat };
  });

  const update = () => {
    items.forEach((item) => {
      const point = map.project(item.lngLat);
      item.el.style.transform = `translate(-50%, -50%) translate(${point.x}px, ${point.y}px)`;
    });
  };

  map.on("move", update);
  map.on("zoom", update);
  map.on("resize", update);
  update();
  landmarkOverlay = { root, update, items };
}

function setDistrictLabels(districtNames, regionLabels = []) {
  clearAllLabels();
  setLandmarkOverlay(regionLabels);

  if (!geojson || !districtNames.length) return;

  const regionNames = new Set(regionLabels.map((r) => r.text));
  const wanted = new Set(districtNames.filter((name) => !regionNames.has(name)));
  geojson.features.forEach((feature) => {
    const name = feature.properties.district;
    if (!wanted.has(name)) return;
    const center = polygonLabelPoint(feature.geometry);
    if (!center) return;

    const el = document.createElement("div");
    el.className = "district-label";
    el.textContent = name;

    const marker = new maplibregl.Marker({
      element: el,
      anchor: "center",
    })
      .setLngLat(center)
      .addTo(map);

    labelMarkers.push(marker);
  });
}

function clearHighlights() {
  highlightedIds.forEach((id) => {
    map.setFeatureState({ source: "districts", id }, { story: false });
  });
  highlightedIds = [];
  dimmedIds.forEach((id) => {
    map.setFeatureState({ source: "districts", id }, { dim: false });
  });
  dimmedIds = [];
  focusMode = false;
}

function setHighlights(districtNames, { focus = false } = {}) {
  clearHighlights();
  focusMode = focus && districtNames.length > 0;

  if (focusMode) {
    const highlightSet = new Set(
      districtNames
        .map((name) => districtIdByName.get(name))
        .filter((id) => id != null)
    );
    allDistrictIds.forEach((id) => {
      if (highlightSet.has(id)) return;
      map.setFeatureState({ source: "districts", id }, { dim: true });
      dimmedIds.push(id);
    });
  }

  districtNames.forEach((name) => {
    const id = districtIdByName.get(name);
    if (id == null) return;
    map.setFeatureState({ source: "districts", id }, { story: true, dim: false });
    highlightedIds.push(id);
  });
}

function polygonLabelPoint(geometry) {
  const rings =
    geometry.type === "Polygon"
      ? [geometry.coordinates[0]]
      : geometry.type === "MultiPolygon"
        ? geometry.coordinates.map((poly) => poly[0])
        : [];

  let best = null;
  let bestArea = -1;

  rings.forEach((ring) => {
    let area = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [x1, y1] = ring[j];
      const [x2, y2] = ring[i];
      const f = x1 * y2 - x2 * y1;
      area += f;
      cx += (x1 + x2) * f;
      cy += (y1 + y2) * f;
    }
    const absArea = Math.abs(area);
    if (absArea > bestArea && absArea > 0) {
      bestArea = absArea;
      best = [cx / (3 * area), cy / (3 * area)];
    }
  });

  if (best) return best;

  // Fallback: bbox center
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  rings.forEach((ring) => {
    ring.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });
  if (!Number.isFinite(minX)) return null;
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

const WIKI_INLINE = {
  April_2015_Nepal_earthquake: {
    title: "April 2015 Nepal earthquake",
    description: "Magnitude 7.8–7.9 earthquake in Nepal",
    extract:
      "The April 2015 Nepal earthquake killed nearly 9,000 people and injured more than 21,000 across Nepal and neighboring countries. It struck on 25 April 2015 with a magnitude of Mw 7.8–7.9, epicentered east of Gorkha District near Barpak — roughly 85 km northwest of Kathmandu — and reached a maximum Mercalli intensity of X (Extreme). It was Nepal’s worst natural disaster since the 1934 Nepal–India earthquake.",
    url: "https://en.wikipedia.org/wiki/April_2015_Nepal_earthquake",
  },
  Nepalese_Civil_War: {
    title: "Nepalese Civil War",
    description: "Maoist insurgency in Nepal (1996–2006)",
    extract:
      "The Nepalese Civil War (1996–2006) was a protracted armed conflict between the Kingdom of Nepal and the Communist Party of Nepal (Maoist). It began on 13 February 1996 and ended with the Comprehensive Peace Accord on 21 November 2006.",
    url: "https://en.wikipedia.org/wiki/Nepalese_Civil_War",
  },
  Remittances_to_Nepal: {
    title: "Remittances to Nepal",
    description: "Money transfers by Nepalese workers",
    extract:
      "Remittances to Nepal are money transfers from Nepalese workers employed outside the country to relatives at home. They are a major pillar of Nepal’s economy — in recent years amounting to well over US$10 billion and roughly a quarter of GDP.",
    url: "https://en.wikipedia.org/wiki/Remittances_to_Nepal",
  },
};

function renderWikiHtml(wiki, data) {
  const title = data.title || wiki.fallbackTitle;
  const description = data.description || wiki.fallbackTitle;
  const extract = data.extract || wiki.fallbackBlurb;
  const url =
    data.url ||
    data.content_urls?.desktop?.page ||
    `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.page)}`;
  const thumb = data.thumbnail?.source
    ? `<img class="wiki-thumb" src="${data.thumbnail.source}" alt="" />`
    : "";
  return `
    ${thumb}
    <h3 class="wiki-title">${title}</h3>
    <p class="wiki-desc">${description}</p>
    <p class="wiki-extract">${extract}</p>
    <a class="wiki-link" href="${url}" target="_blank" rel="noopener noreferrer">
      Read full article on Wikipedia
    </a>
    <p class="wiki-credit">Summary via Wikipedia · CC BY-SA</p>
  `;
}

async function loadWikiSummary(wiki) {
  if (!wiki?.page) return;
  activeWiki = wiki;

  const inline = WIKI_INLINE[wiki.page];
  if (inline && !wikiCache.has(wiki.page)) {
    wikiBody.innerHTML = renderWikiHtml(wiki, inline);
  } else if (wikiCache.has(wiki.page)) {
    wikiBody.innerHTML = wikiCache.get(wiki.page);
  } else {
    wikiBody.innerHTML = `<p class="wiki-loading">Loading Wikipedia summary…</p>`;
  }
  wikiPanel.setAttribute("aria-label", `Wikipedia summary: ${wiki.fallbackTitle}`);

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wiki.page)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
    const data = await res.json();
    const html = renderWikiHtml(wiki, data);
    wikiCache.set(wiki.page, html);
    if (activeWiki?.page === wiki.page) wikiBody.innerHTML = html;
  } catch (error) {
    console.error(error);
    if (inline && activeWiki?.page === wiki.page) {
      wikiBody.innerHTML = renderWikiHtml(wiki, inline);
      return;
    }
    if (activeWiki?.page === wiki.page) {
      wikiBody.innerHTML = renderWikiHtml(wiki, {
        title: wiki.fallbackTitle,
        description: wiki.fallbackTitle,
        extract: wiki.fallbackBlurb,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.page)}`,
      });
    }
  }
}

function showWikiPanel(wiki) {
  if (!wiki) return;
  wikiPanel.hidden = false;
  loadWikiSummary(wiki);
}

function hideWikiPanel() {
  wikiPanel.hidden = true;
}

function syncWikiPanel(chapter, previousChapterId) {
  const previousWiki = previousChapterId
    ? CHAPTERS[previousChapterId]?.wiki
    : null;
  if (chapter.wiki?.page !== previousWiki?.page) {
    wikiUserClosed = false;
  }

  if (chapter.wiki) {
    // Always reopen when entering a wiki chapter (unless user just closed it).
    if (!wikiUserClosed) showWikiPanel(chapter.wiki);
  } else {
    hideWikiPanel();
  }
}

function fitChapterBounds(bounds) {
  const padding = window.matchMedia("(max-width: 900px)").matches
    ? { top: 48, bottom: 24, left: 24, right: 24 }
    : { top: 56, bottom: 120, left: 48, right: 48 };
  return new Promise((resolve) => {
    const done = () => resolve();
    if (reduceMotion) {
      map.fitBounds(bounds, { padding, duration: 0, essential: true });
      map.once("idle", done);
      return;
    }
    map.once("moveend", done);
    map.fitBounds(bounds, {
      padding,
      duration: 1100,
      essential: true,
    });
  });
}

function activateChapter(chapterId) {
  if (!mapReady || !CHAPTERS[chapterId]) return;
  if (chapterId === activeChapter && chapterId !== "explore") return;

  const previousChapterId = activeChapter;
  activeChapter = chapterId;
  const chapter = CHAPTERS[chapterId];
  exploreMode = Boolean(chapter.explore);

  if (chapterNav && chapterNav.value !== chapterId) {
    chapterNav.value = chapterId;
  }
  steps.forEach((step) => {
    step.classList.toggle("is-active", step.dataset.chapter === chapterId);
  });

  if (chapter.regionMap || chapter.neutral) {
    applyRegionMap();
  } else if (chapter.metric) {
    applyMetric(chapter.metric, {
      syncSelect: true,
      colors: chapter.colors || null,
    });
  } else if (exploreMode) {
    applyMetric(metricSelect.value || "literacy_rate", { syncSelect: false });
  }

  setHighlights(chapter.highlight || [], { focus: Boolean(chapter.focus) });
  setShakeOverlay(Boolean(chapter.shake));
  syncWikiPanel(chapter, previousChapterId);

  // Clear labels during the fly, then place them after the camera settles.
  clearAllLabels();
  const labels = chapter.labels || [];
  const regionLabels = chapter.regionLabels || [];
  const chapterToken = chapterId;

  map.resize();
  fitChapterBounds(chapter.bounds || NEPAL_BOUNDS).then(() => {
    if (activeChapter !== chapterToken) return;
    map.resize();
    setDistrictLabels(labels, regionLabels);
  });
}

function setShakeOverlay(visible) {
  const visibility = visible ? "visible" : "none";
  ["shake-mmi-halo", "shake-mmi", "shake-epicenter-glow", "shake-epicenter"].forEach((id) => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, "visibility", visibility);
    }
  });
  const shakeLegend = document.getElementById("shake-legend");
  const quakeWikiBtn = document.getElementById("quake-wiki-btn");
  if (shakeLegend) shakeLegend.hidden = !visible;
  if (quakeWikiBtn) quakeWikiBtn.hidden = !visible;
}

function jumpToChapter(chapterId) {
  if (!CHAPTERS[chapterId]) return;
  const targetId = CHAPTER_TARGETS[chapterId];
  const target = targetId ? document.getElementById(targetId) : null;

  // Allow re-activating the current chapter when jumping from the nav.
  if (chapterId === activeChapter) {
    activeChapter = null;
  }
  activateChapter(chapterId);
  target?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

function showDetail(props) {
  detailEl.hidden = false;
  detailTitle.textContent = props.district;
  detailMeta.textContent =
    [props.zone, props.region].filter(Boolean).join(" · ") || "District";
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

function observeChapters() {
  const ratios = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target, entry.intersectionRatio);
      });

      let bestStep = null;
      let bestRatio = 0;
      steps.forEach((step) => {
        const ratio = ratios.get(step) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestStep = step;
        }
      });

      if (bestStep && bestRatio > 0.15) {
        activateChapter(bestStep.dataset.chapter);
      }
    },
    {
      root: null,
      threshold: [0.15, 0.35, 0.55, 0.75],
      rootMargin: "-10% 0px -35% 0px",
    }
  );

  steps.forEach((step) => observer.observe(step));
}

async function boot() {
  const [metaRes, geoRes, shakeRes, epiRes] = await Promise.all([
    fetch("data/processed/atlas_metadata.json"),
    fetch("data/processed/districts_2011.geojson"),
    fetch("data/processed/gorkha_2015_mmi_contours.geojson"),
    fetch("data/processed/gorkha_2015_epicenter.geojson"),
  ]);
  metadata = await metaRes.json();
  geojson = await geoRes.json();
  const shakeGeojson = await shakeRes.json();
  const epicenterGeojson = await epiRes.json();

  geojson.features.forEach((feature, index) => {
    feature.id = index;
    feature.properties.belt = districtBelt(feature.properties.district);
    districtIdByName.set(feature.properties.district, index);
    allDistrictIds.push(index);
  });

  formatNational(metadata.national);

  map.addSource("districts", {
    type: "geojson",
    data: geojson,
  });

  map.addSource("shake-mmi", {
    type: "geojson",
    data: shakeGeojson,
  });

  map.addSource("shake-epicenter", {
    type: "geojson",
    data: epicenterGeojson,
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
        [
          "case",
          ["boolean", ["feature-state", "story"], false],
          2,
          0.55,
        ],
      ],
      "line-opacity": [
        "case",
        ["boolean", ["feature-state", "dim"], false],
        0.35,
        0.9,
      ],
    },
  });

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

  mapReady = true;
  applyMetric("literacy_rate");
  observeChapters();
  map.resize();
  activateChapter("hero");

  window.addEventListener("resize", () => {
    map.resize();
    landmarkOverlay?.update();
  });

  document.querySelectorAll(".wiki-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      const chapterId = btn.closest(".step")?.dataset.chapter;
      const wiki = CHAPTERS[chapterId]?.wiki;
      if (!wiki) return;
      wikiUserClosed = false;
      showWikiPanel(wiki);
    });
  });

  document.getElementById("quake-wiki-btn")?.addEventListener("click", () => {
    const wiki = CHAPTERS["valley-quake"].wiki;
    wikiUserClosed = false;
    showWikiPanel(wiki);
  });

  wikiCloseBtn?.addEventListener("click", () => {
    wikiUserClosed = true;
    hideWikiPanel();
  });

  map.on("click", "shake-epicenter", () => {
    const wiki = CHAPTERS["valley-quake"].wiki;
    wikiUserClosed = false;
    showWikiPanel(wiki);
  });

  map.on("mouseenter", "shake-epicenter", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "shake-epicenter", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mousemove", "districts-fill", (event) => {
    if (!event.features?.length) return;
    map.getCanvas().style.cursor = "pointer";
    const feature = event.features[0];
    setHover(feature.id);
    const props = feature.properties;
    const neutral = CHAPTERS[activeChapter]?.regionMap || CHAPTERS[activeChapter]?.neutral;
    const value = props[activeMetric.id];
    popup
      .setLngLat(event.lngLat)
      .setHTML(
        neutral
          ? `<strong>${props.district}</strong><br>${props.belt || "District"} belt`
          : `<strong>${props.district}</strong><br>${activeMetric.label}: ${
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
    const props = normalizeProps(event.features[0].properties);
    const value = props[activeMetric.id];

    // Stay in the current chapter; only fill the inspector in Explore.
    if (exploreMode) {
      showDetail(props);
      return;
    }

    const neutral = CHAPTERS[activeChapter]?.regionMap || CHAPTERS[activeChapter]?.neutral;
    popup
      .setLngLat(event.lngLat)
      .setHTML(
        neutral
          ? `<strong>${props.district}</strong><br>${props.belt || "District"} belt`
          : `<strong>${props.district}</strong><br>${activeMetric.label}: ${
              value == null ? "—" : activeMetric.format(Number(value))
            }`
      )
      .addTo(map);
  });
}

metricSelect.addEventListener("change", () => {
  if (!exploreMode) {
    activateChapter("explore");
  }
  applyMetric(metricSelect.value, { syncSelect: false });
});

chapterNav?.addEventListener("change", () => {
  jumpToChapter(chapterNav.value);
});

resetBtn.addEventListener("click", () => {
  fitChapterBounds(NEPAL_BOUNDS);
});

map.on("load", () => {
  boot().catch((error) => {
    console.error(error);
    legendEl.textContent = "Failed to load atlas data.";
  });
});
