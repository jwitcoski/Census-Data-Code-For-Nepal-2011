# Raw data sources

| File | Source | Notes |
| --- | --- | --- |
| `districts_complete.csv` | [Code for Nepal census-data](https://github.com/CodeforNepal/census-data) | VDC/municipality indicators derived from CBS NPHC 2011 |
| `districts.geojson` | [anjesh/NepalMaps](https://github.com/anjesh/NepalMaps) `geojson/districts.json` | 75 districts; GADM-derived; CC BY 3.0 |

Processed overlays:

| File | Source | Notes |
| --- | --- | --- |
| `gorkha_2015_mmi_contours.geojson` | [USGS ShakeMap](https://earthquake.usgs.gov/earthquakes/eventpage/us20002926/shakemap) `cont_mi.json` (event us20002926) | MMI ≥ 5 intensity contours for 25 Apr 2015 Gorkha quake |
| `gorkha_2015_epicenter.geojson` | USGS FDSN event `us20002926` | Epicenter point |
| `locator_china_india_nepal.geojson` | [Natural Earth](https://www.naturalearthdata.com/) `ne_110m_admin_0_countries` | China, India, Nepal country polygons (public domain) |
| `locator_inset.svg` | Built by `etl/build_locator_inset.py` from the GeoJSON above | Prologue inset map |

Census authority: Central Bureau of Statistics, Government of Nepal — National Population and Housing Census 2011.
