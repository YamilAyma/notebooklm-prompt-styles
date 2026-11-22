/**
 * filters.js — Filter state of the style lists and the logic that applies it.
 * Pure functions (no DOM) so they can be tested.
 */

import { normalizeText } from '../scripts/utils.js';

export const TONES = ['light', 'dark', 'colorful'];

export const defaultState = () => ({ q: '', category: 'all', tone: 'all' });

/** Words of a query, normalized (lowercase, no accents). */
export const searchTerms = (q) => normalizeText(q).split(/\s+/).filter(Boolean);

/** Reads the filter state from a URL query string; unknown values fall back to defaults. */
export function parseState(search) {
  const params = new URLSearchParams(search);
  return {
    ...defaultState(),
    q: (params.get('q') ?? '').trim(),
    category: params.get('cat') || 'all',
    tone: TONES.includes(params.get('tone')) ? params.get('tone') : 'all',
  };
}

/** Query string for a state (defaults are left out so URLs stay clean). */
export function toSearchParams(state) {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set('q', state.q.trim());
  if (state.category !== 'all') params.set('cat', state.category);
  if (state.tone !== 'all') params.set('tone', state.tone);
  return params;
}

/**
 * Applies the state to the catalog.
 *
 * Category: the chip selection on the "all styles" page; on a category page that
 * category — except while searching, because the search is global.
 */
export function filterStyles(
  categories,
  state,
  { pageCategory = 'all', favoritesOnly = false, isFavorite = () => false } = {},
) {
  const terms = searchTerms(state.q);
  const searching = terms.length > 0;

  let activeCategory = pageCategory === 'all' ? state.category : pageCategory;
  if (searching && pageCategory !== 'all') activeCategory = 'all';

  let styles = categories
    .filter((c) => activeCategory === 'all' || c.id === activeCategory)
    .flatMap((c) => c.styles);

  if (searching) styles = styles.filter((s) => terms.every((term) => s.searchText.includes(term)));
  if (state.tone !== 'all') styles = styles.filter((s) => s.tone === state.tone);
  if (favoritesOnly) styles = styles.filter((s) => isFavorite(s.id));

  return styles;
}
