/** Shared runtime state for the story map. */

import { METRICS } from "./config.js";

export const state = {
  metadata: null,
  geojson: null,
  districtIdByName: new Map(),
  allDistrictIds: [],
  activeMetric: METRICS.find((m) => m.id === "literacy_rate"),
  activeChapter: null,
  hoveredId: null,
  highlightedIds: [],
  dimmedIds: [],
  exploreMode: false,
  focusMode: false,
  mapReady: false,
  wikiCache: new Map(),
  activeWiki: null,
  wikiUserClosed: false,
  labelMarkers: [],
  landmarkOverlay: null,
  beltFocusActive: false,
  reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

export const dom = {
  metricSelect: document.getElementById("metric"),
  legendEl: document.getElementById("legend"),
  nationalEl: document.getElementById("national"),
  detailEl: document.getElementById("detail"),
  detailTitle: document.getElementById("detail-title"),
  detailMeta: document.getElementById("detail-meta"),
  detailStats: document.getElementById("detail-stats"),
  resetBtn: document.getElementById("reset-view"),
  chapterNav: document.getElementById("chapter-nav"),
  wikiPanel: document.getElementById("wiki-panel"),
  wikiBody: document.getElementById("wiki-panel-body"),
  wikiCloseBtn: document.getElementById("wiki-close"),
  steps: [...document.querySelectorAll(".step[data-chapter]")],
};
