/** MapLibre map instance and hover popup. */

export const map = new maplibregl.Map({
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

map.addControl(
  new maplibregl.NavigationControl({ visualizePitch: false }),
  "bottom-right"
);

export const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false,
  offset: 12,
});
