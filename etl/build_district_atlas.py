#!/usr/bin/env python3
"""
Nepal 2011 Census → District Atlas ETL

Demonstrates a reproducible census-geography workflow:
  1. Load VDC/municipality census micro-aggregates
  2. Normalize & alias district toponyms across sources
  3. Aggregate households / population / literacy numerators to districts
  4. Spatially join to district polygons and compute equal-area density
  5. Emit web-ready GeoJSON + flat indicator CSV
"""

from __future__ import annotations

import csv
import json
import math
import re
from collections import defaultdict
from pathlib import Path

from pyproj import Geod
from shapely.geometry import mapping, shape

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data" / "processed"

# Census CBS spellings → GADM / NepalMaps district names
DISTRICT_ALIASES = {
    "CHITWAN": "CHITAWAN",
    "DHANUSHA": "DHANUSA",
    "ILLAM": "ILAM",
    "KAVRE": "KAVREPALANCHOK",
    "MAKAWANPUR": "MAKWANPUR",
    "SINDHUPALCHOWK": "SINDHUPALCHOK",
    "TAHANUN": "TANAHU",
    "TEHRATHUM": "TERHATHUM",
}

SUM_FIELDS = [
    "HOUSEHOLD_POPULATION_SIZE_HOUSEHOLD",
    "HOUSEHOLD_POPULATION_SIZE_TOTAL_POPULATION",
    "HOUSEHOLD_POPULATION_SIZE_MALE_POPULATION",
    "HOUSEHOLD_POPULATION_SIZE_FEMALE_POPULATION",
    "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_POPULATION_5_AND_ABOVE_BOTH_SEX",
    "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_CAN_READ_WRITE_BOTH_SEX",
    "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_POPULATION_5_AND_ABOVE_FEMALE",
    "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_CAN_READ_WRITE_FEMALE",
    "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_POPULATION_5_AND_ABOVE_MALE",
    "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_CAN_READ_WRITE_MALE",
    "LIGHTING_FUEL_ELECTRICITY",
    "LIGHTING_FUEL_KEROSENE",
    "LIGHTING_FUEL_BIOGAS",
    "LIGHTING_FUEL_SOLAR",
    "LIGHTING_FUEL_OTHERS",
    "LIGHTING_FUEL_NOT_STATED",
    "TOILET_TYPE_NO_TOILET",
    "TOILET_TYPE_FLUSH_TOILET",
    "TOILET_TYPE_ORDINARY_TOILET",
    "TOILET_TYPE_NOT_STATED",
    "DRINKING_WATER_SOURCE_TAP_PIPED",
    "DRINKING_WATER_SOURCE_TUBEWELL",
    "DRINKING_WATER_SOURCE_COVERED_WELL",
    "DRINKING_WATER_SOURCE_UNCOVERED_WELL",
    "DRINKING_WATER_SOURCE_SPOUT_WATER",
    "DRINKING_WATER_SOURCE_RIVER_STREAM",
    "DRINKING_WATER_SOURCE_OTHERS",
    "DRINKING_WATER_SOURCE_NOT_STATED",
    "POPULATION_5_25_SCHOOL_ATTENDENCE_SEX_MALE_POPULATION_5_25",
    "POPULATION_5_25_SCHOOL_ATTENDENCE_SEX_FEMALE_POPULATION_5_25",
    "POPULATION_5_25_SCHOOL_ATTENDENCE_SEX_SCHOOL_GOING_MALE",
    "POPULATION_5_25_SCHOOL_ATTENDENCE_SEX_SCHOOL_GOING_FEMALE",
    "HOUSEHOLD_FACILITY_MOBILE_PHONE",
    "HOUSEHOLD_FACILITY_INTERNET",
    "COOKING_FUEL_LPG",
    "COOKING_FUEL_WOOD",
]

GEOD = Geod(ellps="WGS84")


def normalize_key(name: str) -> str:
    key = re.sub(r"[^A-Z]", "", name.upper())
    return DISTRICT_ALIASES.get(key, key)


def to_number(value: str | None) -> float:
    if value is None:
        return 0.0
    text = str(value).strip().replace(",", "")
    if not text or text.upper() in {"NA", "N/A", "-"}:
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


def safe_rate(numerator: float, denominator: float) -> float | None:
    if denominator <= 0:
        return None
    return round(100.0 * numerator / denominator, 2)


def quantile_breaks(values: list[float], classes: int = 5) -> list[float]:
    if not values:
        return []
    ordered = sorted(values)
    breaks = []
    for i in range(1, classes):
        rank = (len(ordered) - 1) * i / classes
        low = math.floor(rank)
        high = math.ceil(rank)
        if low == high:
            breaks.append(ordered[low])
        else:
            weight = rank - low
            breaks.append(ordered[low] * (1 - weight) + ordered[high] * weight)
    return [round(b, 4) for b in breaks]


def aggregate_census(csv_path: Path) -> dict[str, dict[str, float]]:
    totals: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    vdc_counts: dict[str, int] = defaultdict(int)

    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            key = normalize_key(row["DISTRICT"])
            vdc_counts[key] += 1
            for field in SUM_FIELDS:
                totals[key][field] += to_number(row.get(field))

    for key, metrics in totals.items():
        metrics["vdc_count"] = float(vdc_counts[key])
    return totals


def polygon_area_km2(geom) -> float:
    area_m2 = abs(GEOD.geometry_area_perimeter(geom)[0])
    return area_m2 / 1_000_000.0


def simplify_geometry(geom, tolerance: float = 0.005):
    simplified = geom.simplify(tolerance, preserve_topology=True)
    if simplified.is_empty:
        return geom
    return simplified


def build_indicators(raw: dict[str, float], area_km2: float) -> dict:
    households = raw["HOUSEHOLD_POPULATION_SIZE_HOUSEHOLD"]
    population = raw["HOUSEHOLD_POPULATION_SIZE_TOTAL_POPULATION"]
    male = raw["HOUSEHOLD_POPULATION_SIZE_MALE_POPULATION"]
    female = raw["HOUSEHOLD_POPULATION_SIZE_FEMALE_POPULATION"]

    lit_pop = raw[
        "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_POPULATION_5_AND_ABOVE_BOTH_SEX"
    ]
    lit_rw = raw[
        "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_CAN_READ_WRITE_BOTH_SEX"
    ]
    lit_pop_f = raw[
        "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_POPULATION_5_AND_ABOVE_FEMALE"
    ]
    lit_rw_f = raw[
        "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_CAN_READ_WRITE_FEMALE"
    ]
    lit_pop_m = raw[
        "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_POPULATION_5_AND_ABOVE_MALE"
    ]
    lit_rw_m = raw[
        "POPULATION_LITERACY_STATUS_AND_SEX_5_AND_ABOVE_CAN_READ_WRITE_MALE"
    ]

    lighting_total = sum(
        raw[f]
        for f in [
            "LIGHTING_FUEL_ELECTRICITY",
            "LIGHTING_FUEL_KEROSENE",
            "LIGHTING_FUEL_BIOGAS",
            "LIGHTING_FUEL_SOLAR",
            "LIGHTING_FUEL_OTHERS",
            "LIGHTING_FUEL_NOT_STATED",
        ]
    )
    toilet_total = sum(
        raw[f]
        for f in [
            "TOILET_TYPE_NO_TOILET",
            "TOILET_TYPE_FLUSH_TOILET",
            "TOILET_TYPE_ORDINARY_TOILET",
            "TOILET_TYPE_NOT_STATED",
        ]
    )
    water_total = sum(
        raw[f]
        for f in [
            "DRINKING_WATER_SOURCE_TAP_PIPED",
            "DRINKING_WATER_SOURCE_TUBEWELL",
            "DRINKING_WATER_SOURCE_COVERED_WELL",
            "DRINKING_WATER_SOURCE_UNCOVERED_WELL",
            "DRINKING_WATER_SOURCE_SPOUT_WATER",
            "DRINKING_WATER_SOURCE_RIVER_STREAM",
            "DRINKING_WATER_SOURCE_OTHERS",
            "DRINKING_WATER_SOURCE_NOT_STATED",
        ]
    )
    improved_water = (
        raw["DRINKING_WATER_SOURCE_TAP_PIPED"]
        + raw["DRINKING_WATER_SOURCE_TUBEWELL"]
        + raw["DRINKING_WATER_SOURCE_COVERED_WELL"]
    )
    school_pop = (
        raw["POPULATION_5_25_SCHOOL_ATTENDENCE_SEX_MALE_POPULATION_5_25"]
        + raw["POPULATION_5_25_SCHOOL_ATTENDENCE_SEX_FEMALE_POPULATION_5_25"]
    )
    school_going = (
        raw["POPULATION_5_25_SCHOOL_ATTENDENCE_SEX_SCHOOL_GOING_MALE"]
        + raw["POPULATION_5_25_SCHOOL_ATTENDENCE_SEX_SCHOOL_GOING_FEMALE"]
    )

    density = round(population / area_km2, 1) if area_km2 > 0 else None
    sex_ratio = round(100.0 * male / female, 1) if female > 0 else None

    return {
        "households": int(households),
        "population": int(population),
        "male_population": int(male),
        "female_population": int(female),
        "sex_ratio": sex_ratio,
        "area_km2": round(area_km2, 1),
        "pop_density": density,
        "literacy_rate": safe_rate(lit_rw, lit_pop),
        "female_literacy_rate": safe_rate(lit_rw_f, lit_pop_f),
        "male_literacy_rate": safe_rate(lit_rw_m, lit_pop_m),
        "electricity_lighting_pct": safe_rate(
            raw["LIGHTING_FUEL_ELECTRICITY"], lighting_total
        ),
        "flush_toilet_pct": safe_rate(raw["TOILET_TYPE_FLUSH_TOILET"], toilet_total),
        "improved_water_pct": safe_rate(improved_water, water_total),
        "school_attendance_pct": safe_rate(school_going, school_pop),
        "mobile_phone_hh_pct": safe_rate(
            raw["HOUSEHOLD_FACILITY_MOBILE_PHONE"], households
        ),
        "internet_hh_pct": safe_rate(raw["HOUSEHOLD_FACILITY_INTERNET"], households),
        "lpg_cooking_pct": safe_rate(raw["COOKING_FUEL_LPG"], households),
        "wood_cooking_pct": safe_rate(raw["COOKING_FUEL_WOOD"], households),
        "vdc_count": int(raw["vdc_count"]),
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    census_path = RAW / "districts_complete.csv"
    geo_path = RAW / "districts.geojson"
    if not census_path.exists() or not geo_path.exists():
        raise SystemExit(
            "Missing raw inputs. Expected data/raw/districts_complete.csv "
            "and data/raw/districts.geojson"
        )

    aggregates = aggregate_census(census_path)
    with geo_path.open(encoding="utf-8") as handle:
        collection = json.load(handle)

    features = []
    unmatched_geo = []
    matched_keys = set()

    for feature in collection["features"]:
        props = feature["properties"]
        district_name = props["District"]
        key = normalize_key(district_name)
        if key not in aggregates:
            unmatched_geo.append(district_name)
            continue

        geom = shape(feature["geometry"])
        area_km2 = polygon_area_km2(geom)
        indicators = build_indicators(aggregates[key], area_km2)
        matched_keys.add(key)

        out_props = {
            "district": district_name,
            "district_key": key,
            "zone": props.get("Zone"),
            "region": props.get("Region"),
            **indicators,
        }
        features.append(
            {
                "type": "Feature",
                "properties": out_props,
                "geometry": mapping(simplify_geometry(geom)),
            }
        )

    unmatched_census = sorted(set(aggregates) - matched_keys)
    if unmatched_geo or unmatched_census:
        raise SystemExit(
            f"Join failed. geo-only={unmatched_geo} census-only={unmatched_census}"
        )

    features.sort(key=lambda f: f["properties"]["district"])

    metric_fields = [
        "pop_density",
        "literacy_rate",
        "female_literacy_rate",
        "electricity_lighting_pct",
        "flush_toilet_pct",
        "improved_water_pct",
        "school_attendance_pct",
        "mobile_phone_hh_pct",
        "internet_hh_pct",
        "sex_ratio",
        "population",
    ]
    legend = {
        field: quantile_breaks(
            [
                f["properties"][field]
                for f in features
                if f["properties"].get(field) is not None
            ]
        )
        for field in metric_fields
    }

    national = {
        "districts": len(features),
        "population": sum(f["properties"]["population"] for f in features),
        "households": sum(f["properties"]["households"] for f in features),
        "area_km2": round(sum(f["properties"]["area_km2"] for f in features), 1),
    }
    national["pop_density"] = round(
        national["population"] / national["area_km2"], 1
    )
    lit_vals = [f["properties"]["literacy_rate"] for f in features]
    national["median_literacy_rate"] = sorted(lit_vals)[len(lit_vals) // 2]

    geojson = {
        "type": "FeatureCollection",
        "name": "nepal_districts_census_2011",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features,
    }

    geo_out = OUT / "districts_2011.geojson"
    csv_out = OUT / "districts_2011.csv"
    meta_out = OUT / "atlas_metadata.json"

    geo_out.write_text(json.dumps(geojson, separators=(",", ":")), encoding="utf-8")

    fieldnames = [
        "district",
        "district_key",
        "zone",
        "region",
        "households",
        "population",
        "male_population",
        "female_population",
        "sex_ratio",
        "area_km2",
        "pop_density",
        "literacy_rate",
        "female_literacy_rate",
        "male_literacy_rate",
        "electricity_lighting_pct",
        "flush_toilet_pct",
        "improved_water_pct",
        "school_attendance_pct",
        "mobile_phone_hh_pct",
        "internet_hh_pct",
        "lpg_cooking_pct",
        "wood_cooking_pct",
        "vdc_count",
    ]
    with csv_out.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for feature in features:
            writer.writerow({k: feature["properties"].get(k) for k in fieldnames})

    metadata = {
        "title": "Nepal 2011 Census District Atlas",
        "author": "Jonathan Witcoski",
        "census_year": 2011,
        "geography": "75 pre-federal districts (VDC-era)",
        "sources": {
            "attributes": (
                "Code for Nepal districts_complete.csv "
                "(derived from CBS National Population and Housing Census 2011)"
            ),
            "boundaries": (
                "anjesh/NepalMaps districts GeoJSON "
                "(GADM administrative boundaries, CC BY 3.0)"
            ),
        },
        "methods": [
            "Toponym normalization with explicit CBS↔GADM aliases",
            "VDC/municipality → district sum aggregation (never average of rates)",
            "WGS84 geodesic polygon area via pyproj.Geod",
            "Population density = population / area_km2",
            "Quantile (equal-count) class breaks for choropleth legends",
            "Topology-preserving geometry simplification for web delivery",
        ],
        "national": national,
        "quantile_breaks": legend,
        "skills_highlighted": [
            "Census geography ETL",
            "Spatial join / attribute join",
            "Toponym reconciliation",
            "Rate construction from micro-aggregates",
            "Equal-area density mapping",
            "Choropleth classification",
            "Web-map data engineering",
        ],
    }
    meta_out.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    print(f"Wrote {geo_out} ({len(features)} districts)")
    print(f"Wrote {csv_out}")
    print(f"Wrote {meta_out}")
    print(
        f"National population: {national['population']:,} across "
        f"{national['area_km2']:,.0f} km²"
    )


if __name__ == "__main__":
    main()
