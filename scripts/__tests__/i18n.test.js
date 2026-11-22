import { describe, it, expect, beforeAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LANGS = ['en', 'es', 'pt'];

let translations;

beforeAll(async () => {
  // i18n.js reads localStorage when it is imported
  vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} });
  ({ translations } = await import('../../src/scripts/i18n.js'));
});

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(astro|js)$/.test(entry.name) ? [full] : [];
  });
}

describe('translations', () => {
  it('has the same keys in every language', () => {
    const reference = Object.keys(translations.en).sort();
    for (const lang of LANGS.filter((l) => l !== 'en')) {
      const keys = Object.keys(translations[lang]).sort();
      expect({ lang, missing: reference.filter((k) => !keys.includes(k)) }).toEqual({
        lang,
        missing: [],
      });
      expect({ lang, extra: keys.filter((k) => !reference.includes(k)) }).toEqual({
        lang,
        extra: [],
      });
    }
  });

  it('has no empty translations', () => {
    for (const lang of LANGS) {
      const empty = Object.entries(translations[lang]).filter(
        ([, v]) => typeof v !== 'string' || !v.trim(),
      );
      expect({ lang, empty: empty.map(([k]) => k) }).toEqual({ lang, empty: [] });
    }
  });

  it('defines every key used by data-i18n, data-i18n-aria and t()', () => {
    const used = new Set();
    for (const file of sourceFiles(path.join(ROOT, 'src'))) {
      const text = fs.readFileSync(file, 'utf-8');
      for (const m of text.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)) used.add(m[1]);
      for (const m of text.matchAll(/\bt\('([^']+)'\)/g)) used.add(m[1]);
    }
    const missing = [...used].filter((key) => !(key in translations.en)).sort();
    expect(missing).toEqual([]);
  });

  it('has a navigation label for every catalog category', () => {
    const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'catalog.json'), 'utf-8'));
    const missing = catalog.categories
      .flatMap((c) => LANGS.map((lang) => ({ lang, key: `nav-${c.id}` })))
      .filter(({ lang, key }) => !translations[lang][key]);
    expect(missing).toEqual([]);
  });
});
