/**
 * validate-styles.js
 *
 * Validates every YAML in /styles and its relation with /preview.
 *
 * Errors (exit code 1):
 *   - malformed YAML or missing required structure
 *   - style without at least one preview image
 *   - preview folder without a matching YAML
 *   - style with previews missing from data/catalog.json (hidden on the site),
 *     or catalog entry without a matching YAML
 * Warnings (do not fail):
 *   - primary_color / background / text_main missing or without a HEX code
 *
 * Usage: node scripts/validate-styles.js
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { loadCatalog } from './build-data.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMAGE_REGEX = /\.(png|jpe?g|webp)$/i;
const HEX_REGEX = /#[0-9a-f]{3,8}\b/i;
const REQUIRED_COLORS = ['primary_color', 'background', 'text_main'];

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isText = (v) => typeof v === 'string' && v.trim().length > 0;

export function validateStyle(parsed) {
  const errors = [];
  const warnings = [];

  const gs = parsed?.design_system?.global_style;
  if (!isObject(gs)) {
    errors.push('missing design_system.global_style');
    return { errors, warnings };
  }

  if (!isText(gs.theme)) errors.push('global_style.theme must be a non-empty string');
  if (!isObject(gs.typography) || Object.keys(gs.typography).length === 0) {
    errors.push('global_style.typography must be a non-empty object');
  }
  if (!Array.isArray(gs.key_visual_elements) || gs.key_visual_elements.length === 0) {
    errors.push('global_style.key_visual_elements must be a non-empty list');
  }

  if (!isObject(gs.color_palette)) {
    errors.push('global_style.color_palette must be an object');
  } else if (Object.keys(gs.color_palette).length === 0) {
    errors.push('global_style.color_palette must not be empty');
  } else {
    for (const key of REQUIRED_COLORS) {
      const value = gs.color_palette[key];
      if (!isText(value)) warnings.push(`color_palette.${key} is missing (used for site tokens)`);
      else if (!HEX_REGEX.test(value)) warnings.push(`color_palette.${key} has no HEX code`);
    }
  }

  const templates = parsed.slide_layout_templates;
  if (!Array.isArray(templates) || templates.length === 0) {
    errors.push('slide_layout_templates must be a non-empty list');
  } else {
    templates.forEach((t, i) => {
      if (!isText(t?.type)) errors.push(`slide_layout_templates[${i}].type is required`);
      if (!isText(t?.usage)) errors.push(`slide_layout_templates[${i}].usage is required`);
    });
  }

  return { errors, warnings };
}

export function validateAll(stylesDir, previewDir) {
  const results = [];
  const yamlFiles = fs
    .readdirSync(stylesDir)
    .filter((f) => /\.ya?ml$/.test(f))
    .sort();
  const styleIds = new Set();

  for (const file of yamlFiles) {
    const id = file.replace(/\.ya?ml$/, '');
    styleIds.add(id);
    let outcome;
    try {
      const parsed = yaml.load(fs.readFileSync(path.join(stylesDir, file), 'utf-8'));
      outcome = validateStyle(parsed);
    } catch (err) {
      outcome = { errors: [`invalid YAML: ${err.message.split('\n')[0]}`], warnings: [] };
    }

    const folder = path.join(previewDir, id);
    const images = fs.existsSync(folder)
      ? fs.readdirSync(folder).filter((f) => IMAGE_REGEX.test(f))
      : [];
    if (images.length === 0) outcome.errors.push('no preview images in preview/' + id);

    results.push({ file: `styles/${file}`, ...outcome });
  }

  if (fs.existsSync(previewDir)) {
    const folders = fs
      .readdirSync(previewDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    for (const dir of folders) {
      if (!styleIds.has(dir.name)) {
        results.push({
          file: `preview/${dir.name}`,
          errors: ['preview folder has no matching YAML in styles/'],
          warnings: [],
        });
      }
    }
  }

  return results;
}

/**
 * The site takes its categories from data/catalog.json, so a style that is not
 * listed there silently disappears.
 */
export function validateCatalog(stylesDir, previewDir, catalogPath) {
  const errors = [];
  let catalog;
  try {
    catalog = loadCatalog(catalogPath);
  } catch (err) {
    return [{ file: 'data/catalog.json', errors: [err.message], warnings: [] }];
  }

  const listed = new Map(); // id -> display name
  for (const category of catalog.categories) {
    for (const style of category.styles) listed.set(style.id, style.name);
  }

  const ids = fs
    .readdirSync(stylesDir)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => f.replace(/\.ya?ml$/, ''));

  for (const id of ids) {
    const folder = path.join(previewDir, id);
    const hasPreview =
      fs.existsSync(folder) && fs.readdirSync(folder).some((f) => IMAGE_REGEX.test(f));
    if (hasPreview && !listed.has(id)) {
      errors.push(
        `styles/${id}.yaml has previews but is not in data/catalog.json (it is hidden on the site)`,
      );
    }
  }
  for (const [id, name] of listed) {
    if (!ids.includes(id)) {
      errors.push(`catalog lists "${name}" but styles/${id}.yaml does not exist`);
    }
  }

  return [{ file: 'data/catalog.json', errors, warnings: [] }];
}

function main() {
  const results = [
    ...validateAll(path.join(ROOT, 'styles'), path.join(ROOT, 'preview')),
    ...validateCatalog(
      path.join(ROOT, 'styles'),
      path.join(ROOT, 'preview'),
      path.join(ROOT, 'data', 'catalog.json'),
    ),
  ];
  let errorCount = 0;
  let warningCount = 0;

  for (const { file, errors, warnings } of results) {
    errors.forEach((e) => console.error(`✖ ${file}: ${e}`));
    warnings.forEach((w) => console.warn(`⚠ ${file}: ${w}`));
    errorCount += errors.length;
    warningCount += warnings.length;
  }

  console.log(
    `\nChecked ${results.length} entries: ${errorCount} errors, ${warningCount} warnings`,
  );
  if (errorCount > 0) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main();
}
