import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  extractFeatures,
  jaccard,
  computePairs,
  findSimilar,
  closestTo,
} from '../check-similarity.js';

const style = (theme, color, elements = ['Grid lines']) => `
design_system:
  global_style:
    theme: "${theme}"
    typography:
      primary_heading: "Serif"
    color_palette:
      primary_color: "${color}"
    key_visual_elements:
${elements.map((e) => `      - "${e}"`).join('\n')}
`;

describe('jaccard', () => {
  it('is 1 for equal sets, 0 for disjoint or empty sets', () => {
    expect(jaccard(new Set(['a', 'b']), new Set(['a', 'b']))).toBe(1);
    expect(jaccard(new Set(['a']), new Set(['b']))).toBe(0);
    expect(jaccard(new Set(), new Set())).toBe(0);
  });

  it('computes intersection over union', () => {
    expect(jaccard(new Set(['a', 'b', 'c']), new Set(['b', 'c', 'd']))).toBe(0.5);
  });
});

describe('extractFeatures', () => {
  it('collects meaningful words (no stopwords, 4+ letters) and lowercase HEX colors', () => {
    const { words, colors } = extractFeatures(style('Bold modern theme with neon glow', '#FF00AA'));
    expect(words.has('neon')).toBe(true);
    expect(words.has('with')).toBe(false);
    expect(colors).toEqual(new Set(['#ff00aa']));
  });
});

describe('computePairs / findSimilar / closestTo', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'similarity-'));
  fs.writeFileSync(path.join(dir, 'a.yaml'), style('Neon cyber glow city', '#FF00AA'));
  fs.writeFileSync(path.join(dir, 'b.yaml'), style('Neon cyber glow city', '#FF00AA'));
  fs.writeFileSync(
    path.join(dir, 'c.yaml'),
    style('Quiet pastel meadow', '#AABBCC', ['Soft clouds']),
  );
  fs.writeFileSync(path.join(dir, 'broken.yaml'), 'a: [unclosed');
  const pairs = computePairs(dir);

  it('compares every valid pair and skips malformed YAML', () => {
    expect(pairs).toHaveLength(3);
  });

  it('flags only the near-identical pair', () => {
    const similar = findSimilar(pairs);
    expect(similar).toHaveLength(1);
    expect([similar[0].a, similar[0].b]).toEqual(['a', 'b']);
    expect(similar[0].text).toBe(1);
    expect(similar[0].colors).toBe(1);
  });

  it('respects custom thresholds', () => {
    expect(findSimilar(pairs, { text: 1.1, colors: 1.1 })).toEqual([]);
  });

  it('lists the closest styles to one style', () => {
    const closest = closestTo(pairs, 'a');
    expect(closest[0].other).toBe('b');
    expect(closest).toHaveLength(2);
  });
});
