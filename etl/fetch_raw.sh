#!/usr/bin/env bash
# Re-download public raw inputs into data/raw/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RAW="$ROOT/data/raw"
mkdir -p "$RAW"

curl -fsSL \
  "https://raw.githubusercontent.com/CodeforNepal/census-data/master/districts_complete.csv" \
  -o "$RAW/districts_complete.csv"

curl -fsSL \
  "https://raw.githubusercontent.com/anjesh/NepalMaps/master/geojson/districts.json" \
  -o "$RAW/districts.geojson"

echo "Fetched raw census CSV + district GeoJSON into $RAW"
