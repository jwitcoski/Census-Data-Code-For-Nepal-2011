/** Chapter activation, camera fits, scroll observer, shake chrome. */

import { CHAPTERS, CHAPTER_TARGETS } from "./chapters.js";
import { applyMetric, applyRegionMap } from "./choropleth.js";
import { NEPAL_BOUNDS } from "./config.js";
import { setHighlights } from "./highlights.js";
import { clearAllLabels, setDistrictLabels } from "./labels.js";
import { map } from "./map.js";
import { dom, state } from "./state.js";
import { syncWikiPanel } from "./wiki.js";

function isMobileLayout() {
  return window.matchMedia("(max-width: 900px)").matches;
}

export function fitChapterBounds(bounds) {
  /* On mobile, step cards overlap the lower portion of the sticky map. */
  const padding = isMobileLayout()
    ? {
        top: 56,
        bottom: Math.round(window.innerHeight * 0.28),
        left: 20,
        right: 20,
      }
    : { top: 56, bottom: 120, left: 48, right: 48 };
  return new Promise((resolve) => {
    const done = () => resolve();
    if (state.reduceMotion) {
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

export function setShakeOverlay(visible) {
  const visibility = visible ? "visible" : "none";
  ["shake-mmi-halo", "shake-mmi", "shake-epicenter-glow", "shake-epicenter"].forEach(
    (id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", visibility);
      }
    }
  );
  const shakeLegend = document.getElementById("shake-legend");
  const quakeWikiBtn = document.getElementById("quake-wiki-btn");
  if (shakeLegend) shakeLegend.hidden = !visible;
  if (quakeWikiBtn) quakeWikiBtn.hidden = !visible;
}

export function activateChapter(chapterId) {
  if (!state.mapReady || !CHAPTERS[chapterId]) return;
  if (chapterId === state.activeChapter && chapterId !== "explore") return;

  const previousChapterId = state.activeChapter;
  state.activeChapter = chapterId;
  const chapter = CHAPTERS[chapterId];
  state.exploreMode = Boolean(chapter.explore);

  if (dom.chapterNav && dom.chapterNav.value !== chapterId) {
    dom.chapterNav.value = chapterId;
  }
  dom.steps.forEach((step) => {
    step.classList.toggle("is-active", step.dataset.chapter === chapterId);
  });

  if (chapter.regionMap || chapter.neutral) {
    applyRegionMap();
  } else if (chapter.metric) {
    applyMetric(chapter.metric, {
      syncSelect: true,
      colors: chapter.colors || null,
    });
  } else if (state.exploreMode) {
    applyMetric(dom.metricSelect.value || "literacy_rate", { syncSelect: false });
  }

  setHighlights(chapter.highlight || [], { focus: Boolean(chapter.focus) });
  setShakeOverlay(Boolean(chapter.shake));
  syncWikiPanel(chapter, previousChapterId);

  clearAllLabels();
  const labels = chapter.labels || [];
  const regionLabels = chapter.regionLabels || [];
  const chapterToken = chapterId;

  map.resize();
  fitChapterBounds(chapter.bounds || NEPAL_BOUNDS).then(() => {
    if (state.activeChapter !== chapterToken) return;
    map.resize();
    setDistrictLabels(labels, regionLabels);
  });
}

export function jumpToChapter(chapterId) {
  if (!CHAPTERS[chapterId]) return;
  const targetId = CHAPTER_TARGETS[chapterId];
  const target = targetId ? document.getElementById(targetId) : null;

  if (chapterId === state.activeChapter) {
    state.activeChapter = null;
  }
  activateChapter(chapterId);
  target?.scrollIntoView({
    behavior: state.reduceMotion ? "auto" : "smooth",
    /* Mobile cards sit under the sticky map; center keeps them readable. */
    block: isMobileLayout() ? "center" : "start",
  });
}

export function observeChapters() {
  const ratios = new Map();
  const mobile = isMobileLayout();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target, entry.intersectionRatio);
      });

      let bestStep = null;
      let bestRatio = 0;
      dom.steps.forEach((step) => {
        const ratio = ratios.get(step) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestStep = step;
        }
      });

      if (bestStep && bestRatio > 0.12) {
        activateChapter(bestStep.dataset.chapter);
      }
    },
    {
      root: null,
      threshold: [0.12, 0.25, 0.4, 0.55, 0.75],
      /* Mobile: bias toward the lower viewport where step cards float. */
      rootMargin: mobile ? "-8% 0px -42% 0px" : "-10% 0px -35% 0px",
    }
  );

  dom.steps.forEach((step) => observer.observe(step));
}
