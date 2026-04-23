/**
 * build-data.js
 * 
 * Reads YAML style files, README TOC, and preview images to produce
 * a consolidated styles.json for the showcase website.
 * 
 * Usage: node scripts/build-data.js
 * 
 * Styles without preview images are excluded from output.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const STYLES_DIR = path.join(ROOT, 'styles');
const PREVIEW_DIR = path.join(ROOT, 'preview');
const README_PATH = path.join(ROOT, 'README.md');
const OUTPUT_PATH = path.join(ROOT, 'public', 'data', 'styles.json');

// ─── Exports for testing ────────────────────────────────────────────

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

export function parseTocFromReadme(readmePath) {
  const content = fs.readFileSync(readmePath, 'utf-8');
  return parseTocContent(content);
}

export function parseTocContent(content) {
  const lines = content.split('\n');
  const categories = [];
  let currentCategory = null;

  // Category headers: lines like "- [🏷️ Brand Inspired](#-brand-inspired)"
  // Style entries: lines like "  - [Editorial Essence](#editorial-essence)"
  const categoryRegex = /^- \[(?:[\p{Emoji}\p{Emoji_Presentation}\uFE0F\s]*)?(.+?)\]\(#[^)]+\)/u;
  const styleRegex = /^\s+- \[(.+?)\]\(#([^)]+)\)/;

  let inToc = false;

  for (const line of lines) {
    // Detect TOC start
    if (line.includes('Table of Contents')) {
      inToc = true;
      continue;
    }

    // Detect TOC end (next heading or horizontal rule after styles listed)
    if (inToc && (line.startsWith('## ') || line.startsWith('---'))) {
      // Check if we already have categories — if so, TOC is done
      if (categories.length > 0) break;
      continue;
    }

    if (!inToc) continue;

    // Skip non-category top-level entries like "How to Use", "Contribution"
    const catMatch = line.match(categoryRegex);
    if (catMatch && !line.includes('How to Use') && !line.includes('Contribution')) {
      const name = catMatch[1].trim();
      const id = name.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '-');
      // Extract emoji if present
      const emojiMatch = line.match(/\[([\p{Emoji}\p{Emoji_Presentation}\uFE0F]+)\s/u);
      currentCategory = {
        id,
        name,
        emoji: emojiMatch ? emojiMatch[1] : '',
        styleNames: [],
      };
      categories.push(currentCategory);
      continue;
    }

    const styleMatch = line.match(styleRegex);
    if (styleMatch && currentCategory) {
      currentCategory.styleNames.push(styleMatch[1].trim());
    }
  }

  return categories;
}

export function nameToId(name) {
  return name
    .toLowerCase()
    .replace(/&#39;/g, '') // Handle common HTML entity
    .replace(/[^a-z0-9\s]/g, '') // Remove everything except alphanumeric and spaces
    .trim()
    .replace(/\s+/g, '_'); // Replace spaces with underscores
}

export function scanPreviews(previewDir) {
  const previews = {};
  if (!fs.existsSync(previewDir)) return previews;

  const dirs = fs.readdirSync(previewDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of dirs) {
    const normalizedName = dir.name.replace(/-/g, '_');
    const files = fs.readdirSync(path.join(previewDir, dir.name))
      .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .map(f => `/preview/${dir.name}/${f}`); // Path relative to root

    if (files.length > 0) {
      previews[normalizedName] = {
        folder: dir.name,
        files
      };
    }
  }

  return previews;
}

export function buildStylesData(stylesDir, previewDir, readmePath) {
  // 1. Parse README TOC for category mappings
  const tocCategories = parseTocFromReadme(readmePath);

  // 2. Scan previews (from source preview dir)
  const allPreviews = scanPreviews(previewDir);

  // 3. Read and parse all YAML files
  const yamlFiles = fs.readdirSync(stylesDir)
    .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

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
        ...tokens,
      };
    } catch (err) {
      console.warn(`⚠ Error parsing ${file}: ${err.message}`);
    }
  }

  // 4. Build categories with only visible styles
  const categories = [];
  for (const cat of tocCategories) {
    const styles = [];
    for (const styleName of cat.styleNames) {
      const id = nameToId(styleName);
      if (styleMap[id]) {
        styles.push({
          ...styleMap[id],
          name: styleName,
        });
      }
    }

    // Only include categories that have at least one visible style
    if (styles.length > 0) {
      categories.push({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
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

function main() {
  console.log('🔨 Building styles data...');
  console.log(`   Styles dir: ${STYLES_DIR}`);
  console.log(`   Preview dir: ${PREVIEW_DIR}`);
  console.log(`   README: ${README_PATH}`);

  const data = buildStylesData(STYLES_DIR, PREVIEW_DIR, README_PATH);

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
  main();
}
