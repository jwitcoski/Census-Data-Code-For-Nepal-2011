"""Build prologue locator SVG from Natural Earth China/India/Nepal GeoJSON."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEOJSON = ROOT / "data" / "processed" / "locator_china_india_nepal.geojson"
OUT_SVG = ROOT / "data" / "processed" / "locator_inset.svg"

g = json.loads(GEOJSON.read_text(encoding="utf-8"))


def iter_rings(geom):
    if geom["type"] == "Polygon":
        yield from geom["coordinates"]
    elif geom["type"] == "MultiPolygon":
        for poly in geom["coordinates"]:
            yield from poly


xs, ys = [], []
for f in g["features"]:
    for ring in iter_rings(f["geometry"]):
        for x, y in ring:
            xs.append(x)
            ys.append(y)

minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
pad = 2.5
minx -= pad
maxx += pad
miny -= pad
maxy += pad

W, H = 420, 340
margin = 22


def project(lon, lat):
    x = margin + (lon - minx) / (maxx - minx) * (W - 2 * margin)
    y = margin + (maxy - lat) / (maxy - miny) * (H - 2 * margin)
    return x, y


def ring_to_path(ring, step=1):
    pts = [
        project(lon, lat)
        for i, (lon, lat) in enumerate(ring)
        if i % step == 0 or i == len(ring) - 1
    ]
    if len(pts) < 2:
        return ""
    d = f"M{pts[0][0]:.1f},{pts[0][1]:.1f}" + "".join(
        f"L{x:.1f},{y:.1f}" for x, y in pts[1:]
    )
    return d + "Z"


colors = {"China": "#2a5a4a", "India": "#3a6a52", "Nepal": "#c9852a"}
order = ["China", "India", "Nepal"]
centroids = {}
path_parts = []

for name in order:
    f = next(x for x in g["features"] if x["properties"]["name"] == name)
    rings = []
    for ring in iter_rings(f["geometry"]):
        area = 0
        for i in range(len(ring) - 1):
            area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
        rings.append((abs(area), ring))
    rings.sort(key=lambda item: item[0], reverse=True)

    # Keep the mainland (largest ring). For China also keep the next large mass if needed.
    keep = [rings[0][1]]
    if name == "China":
        for area, ring in rings[1:]:
            if area >= rings[0][0] * 0.15:
                keep.append(ring)

    parts = []
    for ring in keep:
        d = ring_to_path(ring, step=1 if name == "Nepal" else 2)
        if d:
            parts.append(d)

    main = rings[0][1]
    rx = [p[0] for p in main]
    ry = [p[1] for p in main]
    centroids[name] = project((min(rx) + max(rx)) / 2, (min(ry) + max(ry)) / 2)
    path_parts.append((name, " ".join(parts), colors[name]))

# Label anchors (nudged for readability at this scale)
labels = {
    "China": (centroids["China"][0] + 18, centroids["China"][1] - 6),
    "India": (centroids["India"][0] - 8, centroids["India"][1] + 8),
    "Nepal": (centroids["Nepal"][0] + 26, centroids["Nepal"][1] + 5),
}

lines = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Natural Earth map of China, India, and Nepal">',
    f'<rect width="{W}" height="{H}" fill="#0c221c" rx="14"/>',
    '<text x="18" y="28" fill="#e2b15a" font-size="11" font-family="Sora,sans-serif" letter-spacing="0.14em">NATURAL EARTH | CHINA | INDIA | NEPAL</text>',
]

for name, d, color in path_parts:
    stroke = "#fff8f0" if name == "Nepal" else "#6f8f82"
    sw = "1.8" if name == "Nepal" else "0.8"
    lines.append(
        f'<path fill="{color}" stroke="{stroke}" stroke-width="{sw}" d="{d}"/>'
    )

cx, cy = labels["China"]
ix, iy = labels["India"]
nx, ny = centroids["Nepal"]
lx, ly = labels["Nepal"]

lines.extend(
    [
        f'<text x="{cx:.0f}" y="{cy:.0f}" text-anchor="middle" fill="#d7ebe1" font-size="18" font-family="Fraunces,Georgia,serif" font-weight="700">CHINA</text>',
        f'<text x="{cx:.0f}" y="{cy + 16:.0f}" text-anchor="middle" fill="#a9c4b8" font-size="9" font-family="Sora,sans-serif" letter-spacing="0.08em">nuclear power</text>',
        f'<text x="{ix:.0f}" y="{iy:.0f}" text-anchor="middle" fill="#d7ebe1" font-size="18" font-family="Fraunces,Georgia,serif" font-weight="700">INDIA</text>',
        f'<text x="{ix:.0f}" y="{iy + 16:.0f}" text-anchor="middle" fill="#a9c4b8" font-size="9" font-family="Sora,sans-serif" letter-spacing="0.08em">nuclear power</text>',
        f'<circle cx="{nx:.1f}" cy="{ny:.1f}" r="3.5" fill="#9e1528"/>',
        f'<text x="{lx:.0f}" y="{ly:.0f}" fill="#fff8f0" font-size="12" font-family="Sora,sans-serif" font-weight="700">NEPAL</text>',
        f'<text x="18" y="{H - 16}" fill="#9eb5aa" font-size="10" font-family="Sora,sans-serif">Public domain boundaries · Natural Earth 110m</text>',
        "</svg>",
    ]
)

OUT_SVG.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {OUT_SVG} ({OUT_SVG.stat().st_size} bytes)")
