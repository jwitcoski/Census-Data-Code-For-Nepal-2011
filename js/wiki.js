/** Wikipedia side panel: inline fallbacks, fetch, show/hide. */

import { CHAPTERS } from "./chapters.js";
import { dom, state } from "./state.js";

const WIKI_INLINE = {
  April_2015_Nepal_earthquake: {
    title: "April 2015 Nepal earthquake",
    description: "Magnitude 7.8–7.9 earthquake in Nepal",
    extract:
      "The April 2015 Nepal earthquake killed nearly 9,000 people and injured more than 21,000 across Nepal and neighboring countries. It struck on 25 April 2015 with a magnitude of Mw 7.8–7.9, epicentered east of Gorkha District near Barpak — roughly 85 km northwest of Kathmandu — and reached a maximum Mercalli intensity of X (Extreme). It was Nepal’s worst natural disaster since the 1934 Nepal–India earthquake.",
    url: "https://en.wikipedia.org/wiki/April_2015_Nepal_earthquake",
  },
  Nepalese_Civil_War: {
    title: "Nepalese Civil War",
    description: "Maoist insurgency in Nepal (1996–2006)",
    extract:
      "The Nepalese Civil War (1996–2006) was a protracted armed conflict between the Kingdom of Nepal and the Communist Party of Nepal (Maoist). It began on 13 February 1996 and ended with the Comprehensive Peace Accord on 21 November 2006.",
    url: "https://en.wikipedia.org/wiki/Nepalese_Civil_War",
  },
  Remittances_to_Nepal: {
    title: "Remittances to Nepal",
    description: "Money transfers by Nepalese workers",
    extract:
      "Remittances to Nepal are money transfers from Nepalese workers employed outside the country to relatives at home. They are a major pillar of Nepal’s economy — in recent years amounting to well over US$10 billion and roughly a quarter of GDP.",
    url: "https://en.wikipedia.org/wiki/Remittances_to_Nepal",
  },
};

function renderWikiHtml(wiki, data) {
  const title = data.title || wiki.fallbackTitle;
  const description = data.description || wiki.fallbackTitle;
  const extract = data.extract || wiki.fallbackBlurb;
  const url =
    data.url ||
    data.content_urls?.desktop?.page ||
    `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.page)}`;
  const thumb = data.thumbnail?.source
    ? `<img class="wiki-thumb" src="${data.thumbnail.source}" alt="" />`
    : "";
  return `
    ${thumb}
    <h3 class="wiki-title">${title}</h3>
    <p class="wiki-desc">${description}</p>
    <p class="wiki-extract">${extract}</p>
    <a class="wiki-link" href="${url}" target="_blank" rel="noopener noreferrer">
      Read full article on Wikipedia
    </a>
    <p class="wiki-credit">Summary via Wikipedia · CC BY-SA</p>
  `;
}

async function loadWikiSummary(wiki) {
  if (!wiki?.page) return;
  state.activeWiki = wiki;

  const inline = WIKI_INLINE[wiki.page];
  if (inline && !state.wikiCache.has(wiki.page)) {
    dom.wikiBody.innerHTML = renderWikiHtml(wiki, inline);
  } else if (state.wikiCache.has(wiki.page)) {
    dom.wikiBody.innerHTML = state.wikiCache.get(wiki.page);
  } else {
    dom.wikiBody.innerHTML = `<p class="wiki-loading">Loading Wikipedia summary…</p>`;
  }
  dom.wikiPanel.setAttribute(
    "aria-label",
    `Wikipedia summary: ${wiki.fallbackTitle}`
  );

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wiki.page)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
    const data = await res.json();
    const html = renderWikiHtml(wiki, data);
    state.wikiCache.set(wiki.page, html);
    if (state.activeWiki?.page === wiki.page) dom.wikiBody.innerHTML = html;
  } catch (error) {
    console.error(error);
    if (inline && state.activeWiki?.page === wiki.page) {
      dom.wikiBody.innerHTML = renderWikiHtml(wiki, inline);
      return;
    }
    if (state.activeWiki?.page === wiki.page) {
      dom.wikiBody.innerHTML = renderWikiHtml(wiki, {
        title: wiki.fallbackTitle,
        description: wiki.fallbackTitle,
        extract: wiki.fallbackBlurb,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.page)}`,
      });
    }
  }
}

export function showWikiPanel(wiki) {
  if (!wiki) return;
  dom.wikiPanel.hidden = false;
  loadWikiSummary(wiki);
}

export function hideWikiPanel() {
  dom.wikiPanel.hidden = true;
}

function isMobileLayout() {
  return window.matchMedia("(max-width: 900px)").matches;
}

export function syncWikiPanel(chapter, previousChapterId) {
  const previousWiki = previousChapterId
    ? CHAPTERS[previousChapterId]?.wiki
    : null;
  if (chapter.wiki?.page !== previousWiki?.page) {
    state.wikiUserClosed = false;
  }

  /*
   * On mobile the sticky map is only ~half the viewport. Auto-opening the
   * Wikipedia panel covers the choropleth — wait for an explicit tap instead.
   */
  if (chapter.wiki) {
    if (!state.wikiUserClosed && !isMobileLayout()) {
      showWikiPanel(chapter.wiki);
    } else if (isMobileLayout() && !state.wikiUserClosed) {
      hideWikiPanel();
    }
  } else {
    hideWikiPanel();
  }
}
