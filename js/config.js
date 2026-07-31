/** Metric definitions, geography constants, and district belt membership. */

export const METRICS = [
  {
    id: "pop_density",
    label: "Population density",
    unit: "people / km²",
    format: (v) => `${Math.round(v).toLocaleString()} / km²`,
    colors: ["#f6e8c3", "#dfc27d", "#bf812d", "#8c510a", "#543005"],
  },
  {
    id: "literacy_rate",
    label: "Literacy rate (5+)",
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
  },
  {
    id: "female_literacy_rate",
    label: "Female literacy rate",
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#fee8c8", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
  },
  {
    id: "electricity_lighting_pct",
    label: "Electric lighting",
    unit: "% of households",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
  },
  {
    id: "flush_toilet_pct",
    label: "Flush toilet access",
    unit: "% of households",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
  },
  {
    id: "improved_water_pct",
    label: "Improved drinking water",
    unit: "% of households",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
  },
  {
    id: "school_attendance_pct",
    label: "School attendance (ages 5–25)",
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#f7fcb9", "#addd8e", "#78c679", "#31a354", "#006837"],
  },
  {
    id: "mobile_phone_hh_pct",
    label: "Mobile phone households",
    unit: "% of households",
    format: (v) => `${v.toFixed(1)}%`,
    colors: ["#fff5eb", "#fdd0a2", "#fdae6b", "#e6550d", "#a63603"],
  },
  {
    id: "sex_ratio",
    label: "Sex ratio",
    unit: "males / 100 females",
    format: (v) => `${v.toFixed(1)}`,
    colors: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
  },
];

export const DETAIL_FIELDS = [
  ["population", "Population", (v) => v.toLocaleString()],
  ["households", "Households", (v) => v.toLocaleString()],
  ["pop_density", "Density", (v) => `${Math.round(v).toLocaleString()} / km²`],
  ["literacy_rate", "Literacy", (v) => `${v.toFixed(1)}%`],
  ["female_literacy_rate", "Female literacy", (v) => `${v.toFixed(1)}%`],
  ["electricity_lighting_pct", "Electric light", (v) => `${v.toFixed(1)}%`],
  ["flush_toilet_pct", "Flush toilet", (v) => `${v.toFixed(1)}%`],
  ["improved_water_pct", "Improved water", (v) => `${v.toFixed(1)}%`],
  ["school_attendance_pct", "School attendance", (v) => `${v.toFixed(1)}%`],
  ["mobile_phone_hh_pct", "Mobile phone HH", (v) => `${v.toFixed(1)}%`],
  ["sex_ratio", "Sex ratio", (v) => v.toFixed(1)],
  ["area_km2", "Area", (v) => `${v.toLocaleString()} km²`],
];

export const NEPAL_BOUNDS = [
  [80.05, 26.35],
  [88.2, 30.45],
];

export const MID_WESTERN_HILLS = [
  "Rolpa",
  "Rukum",
  "Jajarkot",
  "Salyan",
  "Pyuthan",
  "Dailekh",
  "Surkhet",
  "Dang",
  "Kalikot",
  "Jumla",
  "Dolpa",
  "Humla",
  "Mugu",
];

export const WAR_CORE_LABELS = ["Rolpa", "Rukum", "Jajarkot"];

export const MOUNTAIN_DISTRICTS = [
  "Taplejung",
  "Sankhuwasabha",
  "Solukhumbu",
  "Dolakha",
  "Sindhupalchok",
  "Rasuwa",
  "Manang",
  "Mustang",
  "Dolpa",
  "Mugu",
  "Humla",
  "Jumla",
  "Kalikot",
  "Bajhang",
  "Bajura",
  "Darchula",
];

export const TARAI_DISTRICTS = [
  "Jhapa",
  "Morang",
  "Sunsari",
  "Saptari",
  "Siraha",
  "Dhanusa",
  "Mahottari",
  "Sarlahi",
  "Rautahat",
  "Bara",
  "Parsa",
  "Chitawan",
  "Nawalparasi",
  "Rupandehi",
  "Kapilbastu",
  "Dang",
  "Banke",
  "Bardiya",
  "Kailali",
  "Kanchanpur",
];

export const BELT_COLORS = {
  Mountains: "#4f6f8f",
  Hills: "#2f6b4f",
  Tarai: "#c9a24a",
};

export function districtBelt(name) {
  if (MOUNTAIN_DISTRICTS.includes(name)) return "Mountains";
  if (TARAI_DISTRICTS.includes(name)) return "Tarai";
  return "Hills";
}
