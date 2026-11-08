import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  slugify,
  generateToc,
  generateStyles,
  firstPreview,
  renderReadme,
} from '../generate-readme.js';

const catalog = {
  categories: [
    {
      id: 'cat-a',
      name: 'Business & Executive',
      emoji: '👔',
      styles: [
        { id: 'style_a', name: 'Style A', description: 'A bold style.' },
        { id: 'no_preview', name: "Scholar's Journal", description: '' },
      ],
    },
  ],
};

const makePreviews = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-'));
  fs.mkdirSync(path.join(dir, 'style_a'));
  fs.writeFileSync(path.join(dir, 'style_a', 'style_a_2.webp'), '');
  fs.writeFileSync(path.join(dir, 'style_a', 'style_a_1.webp'), '');
  return dir;
};

describe('slugify', () => {
  it('matches GitHub heading anchors', () => {
    expect(slugify('👔 Business & Executive')).toBe('-business--executive');
    expect(slugify("Scholar's Journal")).toBe('scholars-journal');
    expect(slugify('Hand-Drawn Scrapbook')).toBe('hand-drawn-scrapbook');
  });
});

describe('generateToc', () => {
  it('lists categories and their styles with anchors', () => {
    expect(generateToc(catalog)).toBe(
      [
        '- [👔 Business & Executive](#-business--executive)',
        '  - [Style A](#style-a)',
        "  - [Scholar's Journal](#scholars-journal)",
      ].join('\n'),
    );
  });
});

describe('generateStyles', () => {
  const previews = makePreviews();

  it('writes description, first preview and YAML link', () => {
    const out = generateStyles(catalog, previews);
    expect(out).toContain('### 👔 Business & Executive');
    expect(out).toContain(
      '#### Style A\n\nA bold style.\n\n![Style A Preview](preview/style_a/style_a_1.webp)\n\n[View Full YAML](styles/style_a.yaml)',
    );
  });

  it('omits the image and empty description when missing', () => {
    const out = generateStyles(catalog, previews);
    expect(out).toContain("#### Scholar's Journal\n\n[View Full YAML](styles/no_preview.yaml)");
  });

  it('picks the first preview alphabetically', () => {
    expect(firstPreview(previews, 'style_a')).toBe('style_a_1.webp');
    expect(firstPreview(previews, 'missing')).toBeNull();
  });
});

describe('renderReadme', () => {
  const previews = makePreviews();
  const readme =
    'intro\n<!-- TOC:START -->\nold\n<!-- TOC:END -->\nmiddle\n<!-- STYLES:START -->\nold\n<!-- STYLES:END -->\noutro';

  it('replaces only the content between markers', () => {
    const out = renderReadme(readme, catalog, previews);
    expect(out.startsWith('intro\n<!-- TOC:START -->\n- [👔')).toBe(true);
    expect(out).toContain('<!-- TOC:END -->\nmiddle\n<!-- STYLES:START -->\n### 👔');
    expect(out.endsWith('<!-- STYLES:END -->\noutro')).toBe(true);
    expect(out).not.toContain('\nold\n');
  });

  it('is idempotent', () => {
    const once = renderReadme(readme, catalog, previews);
    expect(renderReadme(once, catalog, previews)).toBe(once);
  });

  it('fails when the markers are missing', () => {
    expect(() => renderReadme('no markers', catalog, previews)).toThrow('needs the markers');
  });
});
