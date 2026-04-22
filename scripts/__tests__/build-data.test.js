import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  parseYamlFile,
  extractDesignTokens,
  parseTocContent,
  nameToId,
  scanPreviews,
  buildStylesData,
} from '../build-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, 'fixtures');
const MOCK_STYLES = path.join(FIXTURES, 'mock-styles');
const MOCK_PREVIEW = path.join(FIXTURES, 'mock-preview');
const MOCK_README = path.join(FIXTURES, 'mock-readme.md');

// ─── parseYamlFile ──────────────────────────────────────────────────

describe('parseYamlFile', () => {
  it('parses a valid YAML file and returns raw + parsed', () => {
    const result = parseYamlFile(path.join(MOCK_STYLES, 'style_a.yaml'));
    expect(result.raw).toContain('design_system:');
    expect(result.parsed).toHaveProperty('design_system');
    expect(result.parsed.design_system.global_style.theme).toContain('bold and modern');
  });

  it('throws on malformed YAML', () => {
    expect(() => parseYamlFile(path.join(MOCK_STYLES, 'invalid.yaml'))).toThrow();
  });
});

// ─── extractDesignTokens ────────────────────────────────────────────

describe('extractDesignTokens', () => {
  it('extracts colors, typography, theme, and key elements', () => {
    const { parsed } = parseYamlFile(path.join(MOCK_STYLES, 'style_a.yaml'));
    const tokens = extractDesignTokens(parsed);

    expect(tokens).not.toBeNull();
    expect(tokens.colors.primary).toBe('#FF0000');
    expect(tokens.colors.background).toBe('#FFFFFF');
    expect(tokens.colors.text).toBe('#111111');
    expect(tokens.theme).toContain('bold and modern');
    expect(tokens.keyElements).toHaveLength(3);
    expect(tokens.keyElements[0]).toBe('Element one');
  });

  it('returns null for objects without global_style', () => {
    const tokens = extractDesignTokens({ something_else: {} });
    expect(tokens).toBeNull();
  });

  it('returns null for null input', () => {
    const tokens = extractDesignTokens(null);
    expect(tokens).toBeNull();
  });
});

// ─── parseTocContent ────────────────────────────────────────────────

describe('parseTocContent', () => {
  it('extracts categories and their styles from README TOC', () => {
    const content = `
## 📖 Table of Contents
- [🏷️ Category A](#-category-a)
  - [Style A](#style-a)
- [🌿 Category B](#-category-b)
  - [Style B](#style-b)
- [🚀 How to Use](#-how-to-use)

---
`;
    const categories = parseTocContent(content);
    expect(categories).toHaveLength(2);
    expect(categories[0].name).toBe('Category A');
    expect(categories[0].styleNames).toEqual(['Style A']);
    expect(categories[1].name).toBe('Category B');
    expect(categories[1].styleNames).toEqual(['Style B']);
  });

  it('excludes non-category entries like How to Use and Contribution', () => {
    const content = `
## 📖 Table of Contents
- [🏷️ Real Category](#-real-category)
  - [My Style](#my-style)
- [🚀 How to Use](#-how-to-use)
- [🛠️ Contribution](#-contribution)

---
`;
    const categories = parseTocContent(content);
    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe('Real Category');
  });
});

// ─── nameToId ───────────────────────────────────────────────────────

describe('nameToId', () => {
  it('converts style names to underscore IDs', () => {
    expect(nameToId('Editorial Essence')).toBe('editorial_essence');
    expect(nameToId('Neon Pulsar')).toBe('neon_pulsar');
    expect(nameToId("Scholar's Journal")).toBe('scholars_journal');
  });
});

// ─── scanPreviews ───────────────────────────────────────────────────

describe('scanPreviews', () => {
  it('scans preview directories and normalizes names', () => {
    const previews = scanPreviews(MOCK_PREVIEW);
    expect(previews).toHaveProperty('style_a');
    expect(previews.style_a.files).toHaveLength(3);
    previews.style_a.files.forEach(p => {
      expect(p).toMatch(/\.png$/);
      expect(p).toContain('preview/');
    });
  });

  it('returns empty object for non-existent directory', () => {
    const previews = scanPreviews('/nonexistent/path');
    expect(previews).toEqual({});
  });

  it('normalizes hyphens to underscores in folder names', () => {
    // The style_a folder uses underscores, so it should be accessible as style_a
    const previews = scanPreviews(MOCK_PREVIEW);
    expect(Object.keys(previews).every(k => !k.includes('-'))).toBe(true);
  });
});

// ─── buildStylesData (integration) ─────────────────────────────────

describe('buildStylesData', () => {
  let data;

  beforeAll(() => {
    data = buildStylesData(MOCK_STYLES, MOCK_PREVIEW, MOCK_README);
  });

  it('excludes styles without preview images', () => {
    const allStyleIds = data.categories.flatMap(c => c.styles.map(s => s.id));
    expect(allStyleIds).toContain('style_a');
    expect(allStyleIds).not.toContain('style_b');
  });

  it('excludes malformed YAML files gracefully', () => {
    const allStyleIds = data.categories.flatMap(c => c.styles.map(s => s.id));
    expect(allStyleIds).not.toContain('invalid');
  });

  it('filters out categories with zero visible styles', () => {
    // Category B only has style_b which has no previews → excluded
    const catIds = data.categories.map(c => c.id);
    expect(catIds).toContain('category-a');
    expect(catIds).not.toContain('category-b');
  });

  it('embeds full raw YAML content (not minified)', () => {
    const styleA = data.categories[0].styles[0];
    expect(styleA.yamlContent).toContain('design_system:');
    expect(styleA.yamlContent).toContain('color_palette:');
    // Must contain actual newlines (not one-line minified)
    expect(styleA.yamlContent.split('\n').length).toBeGreaterThan(5);
  });

  it('includes correct preview paths', () => {
    const styleA = data.categories[0].styles[0];
    expect(styleA.previews).toHaveLength(3);
    styleA.previews.forEach(p => expect(p).toMatch(/\.png$/));
  });

  it('includes meta with totalStyles and generatedAt', () => {
    expect(data.meta).toHaveProperty('totalStyles');
    expect(data.meta).toHaveProperty('generatedAt');
    expect(data.meta.totalStyles).toBe(1);
  });

  it('outputs valid JSON-serializable data', () => {
    const json = JSON.stringify(data);
    const reparsed = JSON.parse(json);
    expect(reparsed.categories).toEqual(data.categories);
    expect(reparsed.meta.totalStyles).toBe(data.meta.totalStyles);
  });
});
