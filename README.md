# Nepal Census Atlas 2011 · Between War and Quake

**Jonathan Witcoski** · GIS Architect · [witcoskitech.com](https://witcoskitech.com/)

A scrollytelling district story map of Nepal’s **2011 National Population & Housing Census** — the country between civil war and earthquake, told through literacy, electricity, migration, and density.

The census year is frozen history. The craft is not: turn imperfect administrative tables into trustworthy geography, then pace the map so a reader understands a place.

> This repository started in 2015 as a placeholder. In 2026 it is a portfolio piece for **spatial ETL + narrative cartography**.

## Live map

Serve the repo root with any static server (GitHub Pages works from root):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

Hard-refresh after pulls — the app loads ES modules under `js/` and CSS partials under `css/`.

## Story arc

| Chapter | Map focus |
| --- | --- |
| Prologue | Ecological belts · China / India / Everest / Kathmandu |
| 1 · War hills | Mid-Western hills · electric lighting |
| 2 · Three Nepals | Literacy · Mountains / Hills / Tarai |
| 3 · Tarai | School attendance in dense plains districts |
| 4 · Absent men | Sex ratio · remittance geography |
| 5 · The Valley | Density + USGS ShakeMap MMI · pre-quake context |
| Explore | Free metric picker + district inspector |

Census indicators never pretend to prove causation for war or quake — they supply honest geographic context beside Wikipedia / USGS references.

## Project layout

```
index.html          Story markup + inlined locator inset
app.js              ES module entry
js/                 Map logic (chapters, choropleth, labels, wiki, boot…)
css/                Styles split by concern; styles.css imports them
etl/                Atlas builder + locator inset script
data/raw/           Vendored CBS extracts + district polygons
data/processed/     Joined GeoJSON, metadata, shake overlays, locator
```

## What it demonstrates

| Skill | Where it shows up |
| --- | --- |
| Census geography ETL | `etl/build_district_atlas.py` |
| Toponym reconciliation | CBS ↔ GADM aliases (`Chitwan`/`Chitawan`, `Kavre`/`Kavrepalanchok`, …) |
| Aggregate-before-rate | VDC rows summed; literacy & service **rates rebuilt** at district scale |
| Spatial metrics | WGS84 geodesic area (`pyproj.Geod`) → people / km² |
| Cartographic classification | Quantile breaks in `data/processed/atlas_metadata.json` |
| Narrative web GIS | MapLibre scrollytelling, belt focus, landmark overlay, district inspector |
| Multi-source context | USGS ShakeMap MMI · Natural Earth locator · Wikipedia summaries |

## Pipeline

```bash
pip install -r requirements.txt
python3 etl/build_district_atlas.py
python3 etl/build_locator_inset.py   # optional: rebuild China/India/Nepal inset SVG
```

**Inputs** (vendored under `data/raw/`):

- `districts_complete.csv` — Code for Nepal VDC/municipality extracts from CBS NPHC 2011
- `districts.geojson` — 75 pre-federal district polygons (anjesh/NepalMaps / GADM, CC BY 3.0)

**Outputs** (`data/processed/`):

- `districts_2011.geojson` — web-simplified joined features
- `districts_2011.csv` — flat indicator table
- `atlas_metadata.json` — national rollups + legend breaks
- `gorkha_2015_mmi_contours.geojson` / `gorkha_2015_epicenter.geojson` — USGS ShakeMap
- `locator_china_india_nepal.geojson` / `locator_inset.svg` — Natural Earth inset

See [`data/raw/SOURCES.md`](./data/raw/SOURCES.md) for provenance notes.

## Mapped indicators

Population density · literacy · female literacy · electric lighting · flush toilets · improved drinking water · school attendance (5–25) · mobile-phone households · sex ratio

## Sources & credit

- Central Bureau of Statistics, Nepal — *National Population and Housing Census 2011*
- [Code for Nepal / census-data](https://github.com/CodeforNepal/census-data)
- [anjesh/NepalMaps](https://github.com/anjesh/NepalMaps) district GeoJSON (GADM-derived)
- [USGS ShakeMap](https://earthquake.usgs.gov/earthquakes/eventpage/us20002926/shakemap) — 25 Apr 2015 Gorkha earthquake
- [Natural Earth](https://www.naturalearthdata.com/) — country polygons for the prologue locator

## Author

Jonathan Witcoski — geospatial engineer building enterprise GIS, spatial ETL, and lakehouse-friendly map products (ArcGIS, PostGIS, Python, GeoParquet/PMTiles, AWS).
