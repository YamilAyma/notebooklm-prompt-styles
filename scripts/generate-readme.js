/**
 * generate-readme.js
 *
 * Generates the style index and the style sections of README.md from
 * data/catalog.json and the preview folders. Everything between the
 * <!-- TOC:START/END --> and <!-- STYLES:START/END --> markers is generated;
 * the rest of the README is written by hand.
 *
 * Usage:
 *   node scripts/generate-readme.js           # rewrite README.md
 *   node scripts/generate-readme.js --check   # exit 1 if README.md is out of date
 */

import fs from 'fs';
import path from 'path';
import { loadCatalog } from './build-data.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMAGE_REGEX = /\.(webp|png|jpe?g)$/i;

/** GitHub heading anchor: lowercase, drop punctuation/emoji, spaces -> hyphens. */
export function slugify(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

const categoryHeading = (category) => [category.emoji, category.name].filter(Boolean).join(' ');

export function generateToc(catalog) {
  return catalog.categories
    .map((category) => {
      const lines = [`- [${categoryHeading(category)}](#${slugify(categoryHeading(category))})`];
      for (const style of category.styles) lines.push(`  - [${style.name}](#${slugify(style.name)})`);
      return lines.join('\n');
    })
    .join('\n');
}

export function firstPreview(previewDir, id) {
  const folder = path.join(previewDir, id);
  if (!fs.existsSync(folder)) return null;
  return fs.readdirSync(folder).filter((f) => IMAGE_REGEX.test(f)).sort()[0] ?? null;
}

export function generateStyles(catalog, previewDir) {
  return catalog.categories
    .map((category) => {
      const sections = category.styles.map((style) => {
        const lines = [`#### ${style.name}`, ''];
        if (style.description) lines.push(style.description, '');
        const preview = firstPreview(previewDir, style.id);
        if (preview) lines.push(`![${style.name} Preview](preview/${style.id}/${preview})`, '');
        lines.push(`[View Full YAML](styles/${style.id}.yaml)`);
        return lines.join('\n');
      });
      return [`### ${categoryHeading(category)}`, '', ...sections.flatMap((s) => [s, ''])].join('\n').trimEnd();
    })
    .join('\n\n');
}

function replaceBetween(text, name, content) {
  const start = `<!-- ${name}:START -->`;
  const end = `<!-- ${name}:END -->`;
  const from = text.indexOf(start);
  const to = text.indexOf(end);
  if (from === -1 || to === -1 || to < from) {
    throw new Error(`README.md needs the markers ${start} and ${end}`);
  }
  return `${text.slice(0, from + start.length)}\n${content}\n${text.slice(to)}`;
}

export function renderReadme(readme, catalog, previewDir) {
  let result = replaceBetween(readme, 'TOC', generateToc(catalog));
  result = replaceBetween(result, 'STYLES', generateStyles(catalog, previewDir));
  return result;
}

function main() {
  const readmePath = path.join(ROOT, 'README.md');
  const catalog = loadCatalog(path.join(ROOT, 'data', 'catalog.json'));
  const current = fs.readFileSync(readmePath, 'utf-8');
  const next = renderReadme(current, catalog, path.join(ROOT, 'preview'));

  if (process.argv.includes('--check')) {
    if (next !== current) {
      console.error('✖ README.md is out of date. Run `npm run readme` and commit the result.');
      process.exit(1);
    }
    console.log('✔ README.md is up to date.');
    return;
  }

  fs.writeFileSync(readmePath, next, 'utf-8');
  console.log(`✅ README.md generated (${catalog.categories.reduce((n, c) => n + c.styles.length, 0)} styles).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main();
}
