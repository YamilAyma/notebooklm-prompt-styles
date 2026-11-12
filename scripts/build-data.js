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
import * as yaml from 'js-yaml';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const STYLES_DIR = path.join(ROOT, 'styles');
const PREVIEW_DIR = path.join(ROOT, 'preview');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
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

export function extractDesignTokens(parsed) {
  const gs = parsed?.design_system?.global_style;
  if (!gs) return null;

  const colors = {};
  if (gs.color_palette) {
    colors.primary = gs.color_palette.primary_color || null;
    colors.background = gs.color_palette.background || null;
    colors.text = gs.color_palette.text_main || null;
  }

  return {
    theme: gs.theme || '',
    colors,
    typography: gs.typography || {},
    keyElements: gs.key_visual_elements || [],
  };
}

/**
 * Loads and checks data/catalog.json:
 * { categories: [{ id, name, emoji, styles: [{ id, name, description }] }] }
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

export function buildStylesData(stylesDir, previewDir, catalogPath) {
  // 1. Load the catalog (categories, order, names and descriptions)
  const catalog = loadCatalog(catalogPath);

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

  const totalStyles = categories.reduce((sum, c) => sum + c.styles.length, 0);

  return {
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

  const data = buildStylesData(STYLES_DIR, PREVIEW_DIR, CATALOG_PATH);

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
