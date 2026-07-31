/** Landmark overlay + district HTML labels. */

import { clearBeltFocus, focusBelt } from "./highlights.js";
import { map } from "./map.js";
import { state } from "./state.js";

export function polygonLabelPoint(geometry) {
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

function clearLandmarkOverlay() {
  if (!state.landmarkOverlay) return;
  map.off("move", state.landmarkOverlay.update);
  map.off("zoom", state.landmarkOverlay.update);
  map.off("resize", state.landmarkOverlay.update);
  state.landmarkOverlay.root.remove();
  state.landmarkOverlay = null;
}

export function clearAllLabels() {
  clearLandmarkOverlay();
  state.labelMarkers.forEach((marker) => marker.remove());
  state.labelMarkers = [];
  clearBeltFocus();
}

export function updateLandmarkOverlay() {
  state.landmarkOverlay?.update();
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
  state.landmarkOverlay = { root, update, items };
}

export function setDistrictLabels(districtNames, regionLabels = []) {
  clearAllLabels();
  setLandmarkOverlay(regionLabels);

  if (!state.geojson || !districtNames.length) return;

  const regionNames = new Set(regionLabels.map((r) => r.text));
  const wanted = new Set(districtNames.filter((name) => !regionNames.has(name)));
  state.geojson.features.forEach((feature) => {
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

    state.labelMarkers.push(marker);
  });
}
