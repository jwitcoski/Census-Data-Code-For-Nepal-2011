# Nepal Census Atlas 2011

**Jonathan Witcoski** · GIS Architect · [witcoskitech.com](https://witcoskitech.com/)

Interactive **story dashboard** that turns Nepal’s **2011 National Population & Housing Census** into a modern spatial data product — reproducible Python ETL, geodesic density, linked MapLibre + Chart.js chapters, and quantile choropleths.

> This repository started in 2015 as a placeholder. The census year is historical; the workflow is the portfolio piece: **how a GIS developer makes old administrative data trustworthy and mappable.**

## Live dashboard

Open [`index.html`](./index.html) via any static server (GitHub Pages works from the repo root):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

Story chapters:

1. Where people are (top population bars → map)
2. Two Nepals — Kathmandu vs Humla radar contrast
3. Literacy ↔ flush toilets scatter (r ≈ 0.71)
4. Electricity gaps (lowest-access districts)
5. Gender literacy gap
6. Full district rank explorer

## What it demonstrates

| Skill | Where it shows up |
| --- | --- |
| Census geography ETL | `etl/build_district_atlas.py` |
| Toponym reconciliation | CBS ↔ GADM aliases (`Chitwan`/`Chitawan`, `Kavre`/`Kavrepalanchok`, …) |
| Aggregate-before-rate | VDC rows summed; literacy & service **rates rebuilt** at district scale |
| Spatial metrics | WGS84 geodesic area (`pyproj.Geod`) → people / km² |
| Cartographic classification | Quantile breaks in `data/processed/atlas_metadata.json` |
| Story dashboard / BI | Chart.js chapters with click-to-map brushing |
| Web GIS delivery | MapLibre choropleth, hover state, district inspector |

## Pipeline

```bash
pip install -r requirements.txt
python3 etl/build_district_atlas.py
```

Inputs (already vendored under `data/raw/`):

- `districts_complete.csv` — Code for Nepal VDC/municipality extracts from CBS NPHC 2011
- `districts.geojson` — 75 pre-federal district polygons (anjesh/NepalMaps / GADM, CC BY 3.0)

Outputs:

- `data/processed/districts_2011.geojson` — web-simplified joined features
- `data/processed/districts_2011.csv` — flat indicator table
- `data/processed/atlas_metadata.json` — national rollups + legend breaks

## Mapped indicators

Population · density · literacy · female literacy · electric lighting · flush toilets · improved drinking water · school attendance (5–25) · mobile-phone households · sex ratio

## Sources & credit

- Central Bureau of Statistics, Nepal — *National Population and Housing Census 2011*
- [Code for Nepal / census-data](https://github.com/CodeforNepal/census-data)
- [anjesh/NepalMaps](https://github.com/anjesh/NepalMaps) district GeoJSON (GADM-derived)

## Author

Jonathan Witcoski — geospatial engineer building enterprise GIS, spatial ETL, and lakehouse-friendly map products (ArcGIS, PostGIS, Python, GeoParquet/PMTiles, AWS).
