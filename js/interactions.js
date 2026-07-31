/** DOM and map event wiring (metric picker, wiki buttons, district hover/click). */

import { CHAPTERS } from "./chapters.js";
import { applyMetric } from "./choropleth.js";
import { DETAIL_FIELDS, NEPAL_BOUNDS } from "./config.js";
import { setHover } from "./highlights.js";
import { map, popup } from "./map.js";
import { dom, state } from "./state.js";
import { activateChapter, fitChapterBounds, jumpToChapter } from "./story.js";
import { hideWikiPanel, showWikiPanel } from "./wiki.js";

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
  dom.detailEl.hidden = false;
  dom.detailTitle.textContent = props.district;
  dom.detailMeta.textContent =
    [props.zone, props.region].filter(Boolean).join(" · ") || "District";
  dom.detailStats.innerHTML = DETAIL_FIELDS.map(([key, label, fmt]) => {
    const value = props[key];
    if (value == null) return "";
    return `<div><dt>${label}</dt><dd>${fmt(value)}</dd></div>`;
  }).join("");
}

function popupHtml(props, value) {
  const neutral =
    CHAPTERS[state.activeChapter]?.regionMap ||
    CHAPTERS[state.activeChapter]?.neutral;
  if (neutral) {
    return `<strong>${props.district}</strong><br>${props.belt || "District"} belt`;
  }
  return `<strong>${props.district}</strong><br>${state.activeMetric.label}: ${
    value == null ? "—" : state.activeMetric.format(Number(value))
  }`;
}

export function bindUiControls() {
  document.querySelectorAll(".wiki-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      const chapterId = btn.closest(".step")?.dataset.chapter;
      const wiki = CHAPTERS[chapterId]?.wiki;
      if (!wiki) return;
      state.wikiUserClosed = false;
      showWikiPanel(wiki);
    });
  });

  document.getElementById("quake-wiki-btn")?.addEventListener("click", () => {
    const wiki = CHAPTERS["valley-quake"].wiki;
    state.wikiUserClosed = false;
    showWikiPanel(wiki);
  });

  dom.wikiCloseBtn?.addEventListener("click", () => {
    state.wikiUserClosed = true;
    hideWikiPanel();
  });

  dom.metricSelect.addEventListener("change", () => {
    if (!state.exploreMode) {
      activateChapter("explore");
    }
    applyMetric(dom.metricSelect.value, { syncSelect: false });
  });

  dom.chapterNav?.addEventListener("change", () => {
    jumpToChapter(dom.chapterNav.value);
  });

  dom.resetBtn.addEventListener("click", () => {
    fitChapterBounds(NEPAL_BOUNDS);
  });
}

export function bindMapInteractions() {
  map.on("click", "shake-epicenter", () => {
    const wiki = CHAPTERS["valley-quake"].wiki;
    state.wikiUserClosed = false;
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
    const value = props[state.activeMetric.id];
    popup.setLngLat(event.lngLat).setHTML(popupHtml(props, value)).addTo(map);
  });

  map.on("mouseleave", "districts-fill", () => {
    map.getCanvas().style.cursor = "";
    setHover(null);
    popup.remove();
  });

  map.on("click", "districts-fill", (event) => {
    if (!event.features?.length) return;
    const props = normalizeProps(event.features[0].properties);
    const value = props[state.activeMetric.id];

    if (state.exploreMode) {
      showDetail(props);
      return;
    }

    popup.setLngLat(event.lngLat).setHTML(popupHtml(props, value)).addTo(map);
  });
}
