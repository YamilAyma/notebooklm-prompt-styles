/**
 * build-data.js
 *
 * Reads YAML style files, the catalog (data/catalog.json: categories, order,
 * display names and descriptions) and preview images to produce a consolidated
 * styles.json for the showcase website.
 *
 * Usage: node scripts/build-data.js
 *
 * Styles without preview images are excluded from output.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import sharp from 'sharp';
import { extractHex } from '../src/lib/stylePage.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const STYLES_DIR = path.join(ROOT, 'styles');
const PREVIEW_DIR = path.join(ROOT, 'preview');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const ADDED_PATH = path.join(ROOT, 'data', 'added.json');
const OUTPUT_PATH = path.join(ROOT, 'public', 'data', 'styles.json');

export const THUMB_WIDTH = 480;

// ─── Exports for testing ────────────────────────────────────────────

/** Lowercase and strip accents so searches match 'cafe' with 'Café'. */
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Normalized text the site search runs against: name, category, description,
 * theme, typography and key visual elements.
 */
export function buildSearchText(
  { name, description, theme, typography, keyElements },
  categoryName = '',
) {
  const strings = (list) => list.filter((v) => typeof v === 'string');
  const parts = [
    name,
    categoryName,
    description,
    theme,
    ...strings(Object.values(typography || {})),
    ...strings(keyElements || []),
  ];
  return normalizeText(parts.join(' ')).replace(/\s+/g, ' ').trim();
}

/** '/preview/x/x_1.webp' -> '/preview/x/thumbs/x_1.webp' */
export function toThumbPath(previewPath) {
  const { dir, name } = path.posix.parse(previewPath);
  return `${dir}/thumbs/${name}.webp`;
}

/**
 * Generates a WebP thumbnail for every preview path ('/preview/<folder>/<file>')
 * under destRoot, keeping the same structure plus a 'thumbs' subfolder.
 * Originals are read from srcRoot and never modified.
 */
export async function generateThumbnails(previewPaths, srcRoot, destRoot, width = THUMB_WIDTH) {
  await Promise.all(
    previewPaths.map(async (previewPath) => {
      const relative = previewPath.replace(/^\/preview\//, '');
      const dest = path.join(destRoot, toThumbPath(previewPath).replace(/^\/preview\//, ''));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      await sharp(path.join(srcRoot, relative))
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(dest);
    }),
  );
}

export function parseYamlFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = yaml.load(raw);
  return { raw, parsed };
}

/**
 * Palette keys that can hold each site color, in order of preference. Styles name
 * their colors differently (`primary_color`, `primary`, `accent`...), and values are
 * often descriptive text ("Warm Cream (#F9F7F2)"), so the first one with a HEX wins.
 */
export const COLOR_KEYS = {
  primary: ['primary_color', 'primary', 'accent_color', 'accent'],
  background: ['background', 'background_main', 'background_light', 'background_dark', 'surface'],
  text: ['text_main', 'text', 'text_primary', 'text_dark', 'text_secondary'],
};

/** HEX colors of a palette for the site (null where the palette has none). */
export function resolveColors(palette = {}) {
  const colors = {};
  for (const [name, keys] of Object.entries(COLOR_KEYS)) {
    colors[name] = keys.map((key) => extractHex(palette[key])).find(Boolean) ?? null;
  }
  return colors;
}

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
};

/** HSL lightness (0-1) and chroma (0-1) of a HEX color. */
function lightnessAndChroma(hex) {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return { lightness: (max + min) / 2, chroma: max - min };
}

/**
 * Overall look of a style, from its palette:
 *   'dark'     - dark background
 *   'colorful' - at least two strongly saturated mid-tone colors, or a saturated /
 *                mid-tone background
 *   'light'    - everything else (light, mostly neutral or pastel)
 * Without a background HEX the style is dark when its text color is light. Returns
 * null when the palette has no HEX code at all.
 */
export function colorTone(palette = {}) {
  const { background, text } = resolveColors(palette);
  const all = JSON.stringify(palette).match(/#(?:[0-9a-f]{6}|[0-9a-f]{3})\b/gi) ?? [];
  if (all.length === 0) return null;

  const bg = background ? lightnessAndChroma(background) : null;

  const dark = bg ? bg.lightness < 0.3 : text ? lightnessAndChroma(text).lightness > 0.6 : false;
  if (dark) return 'dark';

  const saturated = all
    .map(lightnessAndChroma)
    .filter((c) => c.chroma >= 0.35 && c.lightness > 0.2 && c.lightness < 0.85).length;
  if (saturated >= 2 || (bg && (bg.chroma >= 0.3 || bg.lightness < 0.6))) return 'colorful';

  return 'light';
}

export function extractDesignTokens(parsed) {
  const gs = parsed?.design_system?.global_style;
  if (!gs) return null;

  return {
    theme: gs.theme || '',
    colors: resolveColors(gs.color_palette),
    tone: colorTone(gs.color_palette),
    typography: gs.typography || {},
    keyElements: gs.key_visual_elements || [],
  };
}

/**
 * Loads and checks data/catalog.json:
 * { featured: [styleId, ...], categories: [{ id, name, emoji, styles: [{ id, name, description }] }] }
 */
export function loadCatalog(catalogPath) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  if (!Array.isArray(catalog.categories)) {
    throw new Error(`${catalogPath}: "categories" must be a list`);
  }

  const seen = new Set();
  for (const category of catalog.categories) {
    for (const key of ['id', 'name']) {
      if (typeof category[key] !== 'string' || !category[key]) {
        throw new Error(`${catalogPath}: every category needs a "${key}"`);
      }
    }
    if (!Array.isArray(category.styles)) {
      throw new Error(`${catalogPath}: category "${category.id}" needs a "styles" list`);
    }
    for (const style of category.styles) {
      if (
        typeof style.id !== 'string' ||
        typeof style.name !== 'string' ||
        !style.id ||
        !style.name
      ) {
        throw new Error(
          `${catalogPath}: category "${category.id}" has a style without "id" or "name"`,
        );
      }
      if (seen.has(style.id)) {
        throw new Error(`${catalogPath}: style "${style.id}" is listed more than once`);
      }
      seen.add(style.id);
    }
  }

  catalog.featured ??= [];
  if (!Array.isArray(catalog.featured)) {
    throw new Error(`${catalogPath}: "featured" must be a list of style ids`);
  }
  for (const id of catalog.featured) {
    if (!seen.has(id))
      throw new Error(`${catalogPath}: featured style "${id}" is not in any category`);
  }
  return catalog;
}

export function scanPreviews(previewDir) {
  const previews = {};
  if (!fs.existsSync(previewDir)) return previews;

  const dirs = fs.readdirSync(previewDir, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const dir of dirs) {
    const normalizedName = dir.name.replace(/-/g, '_');
    const files = fs
      .readdirSync(path.join(previewDir, dir.name))
      .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .map((f) => `/preview/${dir.name}/${f}`); // Path relative to root

    if (files.length > 0) {
      previews[normalizedName] = {
        folder: dir.name,
        files,
      };
    }
  }

  return previews;
}

/** data/added.json: { styleId: ISO date of the first commit that added the style }. */
export function loadAdded(addedPath) {
  if (!addedPath || !fs.existsSync(addedPath)) return {};
  return JSON.parse(fs.readFileSync(addedPath, 'utf-8'));
}

export function buildStylesData(stylesDir, previewDir, catalogPath, addedPath = null) {
  // 1. Load the catalog (categories, order, names and descriptions)
  const catalog = loadCatalog(catalogPath);
  const added = loadAdded(addedPath);

  // 2. Scan previews (from source preview dir)
  const allPreviews = scanPreviews(previewDir);

  // 3. Read and parse all YAML files
  const yamlFiles = fs
    .readdirSync(stylesDir)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

  const styleMap = {};
  const usedPreviewFolders = new Set();

  for (const file of yamlFiles) {
    const id = file.replace(/\.(yaml|yml)$/, '');
    try {
      const { raw, parsed } = parseYamlFile(path.join(stylesDir, file));
      const tokens = extractDesignTokens(parsed);
      if (!tokens) {
        console.warn(`⚠ Skipping ${file}: no design_system.global_style found`);
        continue;
      }

      const previewData = allPreviews[id];
      const previews = previewData ? previewData.files : [];

      // Skip styles without preview images
      if (previews.length === 0) {
        console.log(`⊘ Skipping ${file}: no preview images found`);
        continue;
      }

      usedPreviewFolders.add(previewData.folder);

      styleMap[id] = {
        id,
        yamlContent: raw,
        previews,
        thumbs: previews.map(toThumbPath),
        ...tokens,
      };
    } catch (err) {
      console.warn(`⚠ Error parsing ${file}: ${err.message}`);
    }
  }

  // 4. Build categories with only visible styles
  const categories = [];
  for (const cat of catalog.categories) {
    const styles = [];
    for (const entry of cat.styles) {
      const style = styleMap[entry.id];
      if (!style) continue;

      const description = entry.description || '';
      styles.push({
        ...style,
        name: entry.name,
        description,
        added: added[entry.id] ?? null,
        featured: catalog.featured.includes(entry.id),
        searchText: buildSearchText({ ...style, name: entry.name, description }, cat.name),
      });
    }

    // Only include categories that have at least one visible style
    if (styles.length > 0) {
      categories.push({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji || '',
        styles,
      });
    }
  }

  // Featured styles that are visible, in the order of the catalog's `featured` list
  const visible = new Map(categories.flatMap((c) => c.styles).map((s) => [s.id, s]));
  const featured = catalog.featured.filter((id) => visible.has(id));

  const totalStyles = categories.reduce((sum, c) => sum + c.styles.length, 0);

  return {
    featured,
    categories,
    meta: {
      totalStyles,
      generatedAt: new Date().toISOString(),
    },
    usedPreviewFolders: Array.from(usedPreviewFolders),
  };
}

// ─── CLI execution ──────────────────────────────────────────────────

async function main() {
  console.log('🔨 Building styles data...');
  console.log(`   Styles dir: ${STYLES_DIR}`);
  console.log(`   Preview dir: ${PREVIEW_DIR}`);
  console.log(`   Catalog: ${CATALOG_PATH}`);

  const data = buildStylesData(STYLES_DIR, PREVIEW_DIR, CATALOG_PATH, ADDED_PATH);

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(outputDir, { recursive: true });

  // Clear and copy used preview folders to public/preview
  const webPreviewDir = path.join(ROOT, 'public', 'preview');
  if (fs.existsSync(webPreviewDir)) {
    fs.rmSync(webPreviewDir, { recursive: true, force: true });
  }
  fs.mkdirSync(webPreviewDir, { recursive: true });

  for (const folder of data.usedPreviewFolders) {
    const src = path.join(PREVIEW_DIR, folder);
    const dest = path.join(webPreviewDir, folder);
    fs.cpSync(src, dest, { recursive: true });
    // console.log(`   Copied preview: ${folder}`);
  }

  // Generate thumbnails for the grid (originals stay untouched)
  const allPreviews = data.categories.flatMap((c) => c.styles.flatMap((s) => s.previews));
  await generateThumbnails(allPreviews, PREVIEW_DIR, webPreviewDir);
  console.log(`   ${allPreviews.length} thumbnails generated (${THUMB_WIDTH}px)`);

  // Remove helper from final JSON
  delete data.usedPreviewFolders;

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`\n✅ Generated ${OUTPUT_PATH}`);
  console.log(`   ${data.meta.totalStyles} styles across ${data.categories.length} categories`);

  for (const cat of data.categories) {
    console.log(`   ${cat.emoji} ${cat.name}: ${cat.styles.length} styles`);
  }
}

// Run when executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
