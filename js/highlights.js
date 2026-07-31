/** District feature-state highlights and ecological-belt focus. */

import { CHAPTERS } from "./chapters.js";
import { map } from "./map.js";
import { state } from "./state.js";

export function clearHighlights() {
  state.highlightedIds.forEach((id) => {
    map.setFeatureState({ source: "districts", id }, { story: false });
  });
  state.highlightedIds = [];
  state.dimmedIds.forEach((id) => {
    map.setFeatureState({ source: "districts", id }, { dim: false });
  });
  state.dimmedIds = [];
  state.focusMode = false;
}

export function setHighlights(districtNames, { focus = false } = {}) {
  clearHighlights();
  state.focusMode = focus && districtNames.length > 0;

  if (state.focusMode) {
    const highlightSet = new Set(
      districtNames
        .map((name) => state.districtIdByName.get(name))
        .filter((id) => id != null)
    );
    state.allDistrictIds.forEach((id) => {
      if (highlightSet.has(id)) return;
      map.setFeatureState({ source: "districts", id }, { dim: true });
      state.dimmedIds.push(id);
    });
  }

  districtNames.forEach((name) => {
    const id = state.districtIdByName.get(name);
    if (id == null) return;
    map.setFeatureState({ source: "districts", id }, { story: true, dim: false });
    state.highlightedIds.push(id);
  });
}

export function focusBelt(belt) {
  if (!state.geojson || !map.getSource("districts")) return;
  state.beltFocusActive = true;

  state.highlightedIds.forEach((id) => {
    map.setFeatureState({ source: "districts", id }, { story: false });
  });
  state.dimmedIds.forEach((id) => {
    map.setFeatureState({ source: "districts", id }, { dim: false });
  });
  state.highlightedIds = [];
  state.dimmedIds = [];

  state.geojson.features.forEach((feature) => {
    const id = feature.id;
    const match = feature.properties.belt === belt;
    map.setFeatureState(
      { source: "districts", id },
      { story: match, dim: !match }
    );
    if (match) state.highlightedIds.push(id);
    else state.dimmedIds.push(id);
  });
}

export function clearBeltFocus() {
  if (!state.beltFocusActive) return;
  state.beltFocusActive = false;
  const chapter = CHAPTERS[state.activeChapter];
  if (!chapter) return;
  setHighlights(chapter.highlight || [], { focus: Boolean(chapter.focus) });
}

export function setHover(id) {
  if (state.hoveredId !== null) {
    map.setFeatureState(
      { source: "districts", id: state.hoveredId },
      { hover: false }
    );
  }
  state.hoveredId = id;
  if (state.hoveredId !== null) {
    map.setFeatureState(
      { source: "districts", id: state.hoveredId },
      { hover: true }
    );
  }
}
