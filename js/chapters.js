/** Story chapter camera, metric, highlight, and label configuration. */

import {
  MID_WESTERN_HILLS,
  NEPAL_BOUNDS,
  WAR_CORE_LABELS,
} from "./config.js";

export const CHAPTERS = {
  hero: {
    label: "Prologue",
    metric: null,
    regionMap: true,
    bounds: [
      [80.0, 26.2],
      [88.4, 30.6],
    ],
    highlight: [],
    labels: [],
    regionLabels: [
      {
        text: "China",
        lngLat: [84.4, 30.28],
        kind: "neighbor",
        title: "China",
        blurb:
          "Nepal’s northern neighbor across the Himalaya. A nuclear power and major trade partner; the border shapes security, hydropower politics, and Himalayan geopolitics.",
      },
      {
        text: "India",
        lngLat: [84.5, 26.18],
        kind: "neighbor",
        title: "India",
        blurb:
          "Nepal’s southern neighbor across the open Tarai frontier. Another nuclear power; India dominates trade, fuel supply, labor migration routes, and much of Nepal’s lowland economy.",
      },
      {
        text: "Mt. Everest",
        lngLat: [86.83, 27.92],
        kind: "peak",
        title: "Mount Everest (Sagarmatha)",
        blurb:
          "Earth’s highest peak (8,849 m) on the Nepal–China border in Solukhumbu. A global icon of Nepal, central to tourism, Sherpa livelihoods, and the mountain identity of the country.",
      },
      {
        text: "Kathmandu",
        lngLat: [85.324, 27.717],
        kind: "place",
        title: "Kathmandu",
        blurb:
          "The capital in the central Valley — political, economic, and cultural core. By 2011 it was already Nepal’s densest district, concentrating power far from the hills and Tarai.",
      },
    ],
    focus: false,
    explore: false,
    wiki: false,
  },
  "civil-war": {
    label: "Chapter 1 · Mid-Western hills",
    metric: "electricity_lighting_pct",
    bounds: [
      [80.85, 27.6],
      [83.55, 30.15],
    ],
    highlight: MID_WESTERN_HILLS,
    labels: WAR_CORE_LABELS,
    focus: true,
    explore: false,
    wiki: {
      page: "Nepalese_Civil_War",
      button: "Wikipedia · Nepalese Civil War",
      fallbackTitle: "Nepalese Civil War",
      fallbackBlurb:
        "Could not load the Wikipedia summary. Open the article for the 1996–2006 Maoist conflict overview.",
    },
  },
  "three-nepals": {
    label: "Chapter 2 · Three Nepals",
    metric: "literacy_rate",
    bounds: NEPAL_BOUNDS,
    highlight: [],
    labels: [],
    regionLabels: [
      {
        text: "Mountains",
        lngLat: [83.9, 29.15],
        kind: "belt",
        belt: "Mountains",
        title: "Mountain belt",
        blurb:
          "High Himalaya — sparse settlement, pastoral and tourism economies, hardest to reach with roads and power. Hover to isolate these districts.",
      },
      {
        text: "Hills",
        lngLat: [84.2, 28.05],
        kind: "belt",
        belt: "Hills",
        title: "Hill belt",
        blurb:
          "The Mid Hills — historic heartland of the Nepali state, terraced farming, and many remittance villages. Hover to isolate these districts.",
      },
      {
        text: "Tarai",
        lngLat: [85.35, 26.85],
        kind: "belt",
        belt: "Tarai",
        title: "Tarai belt",
        blurb:
          "The southern plains — densest farmland and trade corridor with India, yet among the lowest literacy scores. Hover to isolate these districts.",
      },
    ],
    focus: false,
    explore: false,
    wiki: false,
  },
  "tarai-literacy": {
    label: "Chapter 3 · Dense & left behind",
    metric: "school_attendance_pct",
    bounds: [
      [84.0, 26.4],
      [87.6, 27.55],
    ],
    highlight: ["Rautahat", "Mahottari", "Sarlahi", "Dhanusa", "Siraha"],
    labels: ["Rautahat", "Mahottari", "Sarlahi", "Dhanusa", "Siraha"],
    focus: true,
    explore: false,
    wiki: false,
  },
  "absent-men": {
    label: "Chapter 4 · Absent men",
    metric: "sex_ratio",
    bounds: [
      [81.8, 27.4],
      [85.0, 29.2],
    ],
    highlight: ["Gulmi", "Syangja", "Arghakhanchi", "Rolpa", "Pyuthan"],
    labels: ["Gulmi", "Syangja", "Arghakhanchi", "Rolpa", "Pyuthan"],
    focus: true,
    explore: false,
    wiki: {
      page: "Remittances_to_Nepal",
      button: "Wikipedia · Remittances to Nepal",
      fallbackTitle: "Remittances to Nepal",
      fallbackBlurb:
        "Could not load the Wikipedia summary. Open the article on money sent home by Nepali workers abroad.",
    },
  },
  "valley-quake": {
    label: "Chapter 5 · Valley before the quake",
    metric: "pop_density",
    colors: ["#fecaca", "#f87171", "#ef4444", "#b91c1c", "#7f1d1d"],
    bounds: [
      [84.2, 27.35],
      [86.1, 28.55],
    ],
    highlight: [
      "Kathmandu",
      "Bhaktapur",
      "Lalitpur",
      "Gorkha",
      "Dhading",
      "Nuwakot",
      "Rasuwa",
      "Sindhupalchok",
      "Kavrepalanchok",
    ],
    labels: ["Kathmandu", "Bhaktapur", "Lalitpur", "Gorkha"],
    focus: true,
    explore: false,
    shake: true,
    wiki: {
      page: "April_2015_Nepal_earthquake",
      button: "Wikipedia · April 2015 Nepal earthquake",
      fallbackTitle: "April 2015 Nepal earthquake",
      fallbackBlurb:
        "Could not load the Wikipedia summary. Open the article on the Mw 7.8 Gorkha earthquake of 25 April 2015.",
    },
  },
  explore: {
    label: "Explore",
    metric: null,
    bounds: NEPAL_BOUNDS,
    highlight: [],
    labels: [],
    focus: false,
    explore: true,
    wiki: false,
  },
};

export const CHAPTER_TARGETS = {
  hero: "chapter-0",
  "civil-war": "chapter-1",
  "three-nepals": "chapter-2",
  "tarai-literacy": "chapter-3",
  "absent-men": "chapter-4",
  "valley-quake": "chapter-5",
  explore: "chapter-explore",
};
