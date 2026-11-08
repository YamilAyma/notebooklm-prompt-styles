/**
 * stylePage.js — Helpers for the per-style pages (/style/<id>/).
 */

export const stylePath = (id) => `/style/${id}/`;

/** First HEX color found in a free-text value such as "Warm Cream (#F9F7F2)". */
export function extractHex(value) {
  if (typeof value !== 'string') return null;
  return value.match(/#(?:[0-9a-f]{6}|[0-9a-f]{3})\b/i)?.[0] ?? null;
}

/** Swatches for the colors of a style that contain a usable HEX code. */
export function getPalette(colors = {}) {
  const labels = { primary: 'Primary', background: 'Background', text: 'Text' };
  return Object.entries(labels)
    .map(([key, label]) => ({ key, label, hex: extractHex(colors[key]) }))
    .filter((swatch) => swatch.hex);
}

/** Neighbours of a style inside its category (wrapping around), excluding itself. */
export function getRelatedStyles(categories, id, limit = 4) {
  const category = categories.find((c) => c.styles.some((s) => s.id === id));
  if (!category) return [];

  const index = category.styles.findIndex((s) => s.id === id);
  const others = category.styles.length - 1;
  const count = Math.min(limit, others);
  return Array.from(
    { length: count },
    (_, i) => category.styles[(index + 1 + i) % category.styles.length],
  );
}
