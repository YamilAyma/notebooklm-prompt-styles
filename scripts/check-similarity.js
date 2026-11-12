/**
 * check-similarity.js
 *
 * Compares every pair of styles in /styles to keep the collection distinct.
 * Two metrics (Jaccard, 0-1):
 *   - text:   words of theme, typography and key visual elements
 *   - colors: HEX codes found anywhere in the YAML
 *
 * It only warns (exit code 0): similar styles can be legitimate variants.
 *
 * Usage:
 *   node scripts/check-similarity.js                  # pairs over the thresholds
 *   node scripts/check-similarity.js --style my_style # 5 closest styles to one
 *   node scripts/check-similarity.js --text 0.4 --colors 0.5
 */

import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
export const DEFAULT_TEXT_THRESHOLD = 0.45;
export const DEFAULT_COLOR_THRESHOLD = 0.6;

const STOPWORDS = new Set(
  'the a an and of with in for to on by or is as at from that this its it be are into over under high low style design'.split(
    ' ',
  ),
);

export function extractFeatures(raw) {
  const parsed = yaml.load(raw);
  const gs = parsed?.design_system?.global_style ?? {};
  const text =
    [gs.theme, JSON.stringify(gs.typography ?? {}), ...(gs.key_visual_elements ?? [])]
      .join(' ')
      .toLowerCase()
      .match(/[a-z]{4,}/g) ?? [];

  return {
    words: new Set(text.filter((w) => !STOPWORDS.has(w))),
    colors: new Set((raw.match(/#[0-9a-f]{6}\b/gi) ?? []).map((c) => c.toLowerCase())),
  };
}

export function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  let shared = 0;
  for (const item of a) if (b.has(item)) shared++;
  return shared / (a.size + b.size - shared);
}

export function computePairs(stylesDir) {
  const features = {};
  for (const file of fs
    .readdirSync(stylesDir)
    .filter((f) => /\.ya?ml$/.test(f))
    .sort()) {
    try {
      features[file.replace(/\.ya?ml$/, '')] = extractFeatures(
        fs.readFileSync(path.join(stylesDir, file), 'utf-8'),
      );
    } catch {
      // Malformed YAML is reported by `npm run validate`
    }
  }

  const ids = Object.keys(features);
  const pairs = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      pairs.push({
        a: ids[i],
        b: ids[j],
        text: jaccard(features[ids[i]].words, features[ids[j]].words),
        colors: jaccard(features[ids[i]].colors, features[ids[j]].colors),
      });
    }
  }
  return pairs;
}

export function findSimilar(
  pairs,
  { text = DEFAULT_TEXT_THRESHOLD, colors = DEFAULT_COLOR_THRESHOLD } = {},
) {
  return pairs
    .filter((p) => p.text >= text || p.colors >= colors)
    .sort((x, y) => Math.max(y.text, y.colors) - Math.max(x.text, x.colors));
}

export function closestTo(pairs, id, limit = 5) {
  return pairs
    .filter((p) => p.a === id || p.b === id)
    .sort((x, y) => y.text + y.colors - (x.text + x.colors))
    .slice(0, limit)
    .map((p) => ({ ...p, other: p.a === id ? p.b : p.a }));
}

const pct = (n) => `${Math.round(n * 100)}%`;

function main() {
  const args = process.argv.slice(2);
  const arg = (name) => {
    const i = args.indexOf(name);
    return i !== -1 ? args[i + 1] : null;
  };

  const pairs = computePairs(path.join(ROOT, 'styles'));
  const styleId = arg('--style');

  if (styleId) {
    const closest = closestTo(pairs, styleId);
    if (closest.length === 0) {
      console.error(`No style "${styleId}" found in styles/`);
      process.exit(1);
    }
    console.log(`Closest styles to ${styleId}:`);
    closest.forEach((p) =>
      console.log(`  ${p.other}: text ${pct(p.text)}, colors ${pct(p.colors)}`),
    );
    return;
  }

  const thresholds = {
    text: Number(arg('--text') ?? DEFAULT_TEXT_THRESHOLD),
    colors: Number(arg('--colors') ?? DEFAULT_COLOR_THRESHOLD),
  };
  const similar = findSimilar(pairs, thresholds);

  if (similar.length === 0) {
    console.log(
      `✔ No similar styles (text ≥ ${pct(thresholds.text)} or colors ≥ ${pct(thresholds.colors)}).`,
    );
    return;
  }
  console.warn(
    `⚠ ${similar.length} pair(s) similar (text ≥ ${pct(thresholds.text)} or colors ≥ ${pct(thresholds.colors)}):`,
  );
  similar.forEach((p) =>
    console.warn(`  ${p.a} ↔ ${p.b}: text ${pct(p.text)}, colors ${pct(p.colors)}`),
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main();
}
