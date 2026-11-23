/**
 * compare.js — Which styles the compare page shows (pure functions).
 */

export const MAX_COMPARE = 3;

export const compareUrl = (ids) => `/compare/?styles=${ids.join(',')}`;

/** Ids of `?styles=a,b,c`: only known ones, no repeats, at most MAX_COMPARE. */
export function parseCompareIds(search, knownIds, max = MAX_COMPARE) {
  const known = new Set(knownIds);
  const raw = new URLSearchParams(search).get('styles') ?? '';
  return [...new Set(raw.split(',').map((id) => id.trim()))]
    .filter((id) => known.has(id))
    .slice(0, max);
}

/** Query string for the chosen ids ('' when there are none). */
export function compareSearch(ids) {
  return ids.length ? `?styles=${ids.join(',')}` : '';
}

/** The compare button needs two or three styles. */
export const canCompare = (count) => count >= 2 && count <= MAX_COMPARE;
