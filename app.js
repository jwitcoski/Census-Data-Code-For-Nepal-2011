/**
 * Nepal 2011 census story map — entry point.
 *
 * Modules:
 *   config.js       metrics + district/belt constants
 *   chapters.js     scrollytelling chapter config
 *   state.js        shared runtime state + DOM refs
 *   map.js          MapLibre map + popup
 *   choropleth.js   colors, legend, national stats
 *   highlights.js   feature-state focus / dim / hover
 *   labels.js       landmark overlay + district labels
 *   wiki.js         Wikipedia panel
 *   story.js        chapter activation + scroll observer
 *   interactions.js UI + map event handlers
 *   boot.js         data load + layer registration
 */

import { METRICS } from "./js/config.js";
import { boot } from "./js/boot.js";
import { map } from "./js/map.js";
import { dom } from "./js/state.js";

METRICS.forEach((metric) => {
  const option = document.createElement("option");
  option.value = metric.id;
  option.textContent = metric.label;
  dom.metricSelect.appendChild(option);
});

map.on("load", () => {
  boot().catch((error) => {
    console.error(error);
    dom.legendEl.textContent = "Failed to load atlas data.";
  });
});
