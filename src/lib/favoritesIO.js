/**
 * favoritesIO.js — Export / import format of the favorites (pure functions).
 */

const FORMAT = 'notebooklm-styles-favorites';

/** JSON text for a file with the favorite style ids. */
export function serializeFavorites(ids, now = new Date()) {
  return JSON.stringify(
    { format: FORMAT, version: 1, exportedAt: now.toISOString(), favorites: [...new Set(ids)] },
    null,
    2,
  );
}

/**
 * Reads an exported file. Returns the ids that exist in `knownIds` and how many were
 * ignored. Throws if the text is not a favorites file.
 */
export function parseFavorites(text, knownIds) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Not valid JSON');
  }

  // Also accept a plain list of ids
  const list = Array.isArray(data) ? data : data?.favorites;
  if (!Array.isArray(list) || !list.every((id) => typeof id === 'string')) {
    throw new Error('Not a favorites file');
  }

  const known = new Set(knownIds);
  const unique = [...new Set(list)];
  return {
    ids: unique.filter((id) => known.has(id)),
    ignored: unique.filter((id) => !known.has(id)).length,
  };
}

/** Current favorites followed by the imported ones that were not there yet. */
export function mergeFavorites(current, imported) {
  const merged = [...current];
  for (const id of imported) if (!merged.includes(id)) merged.push(id);
  return merged;
}
