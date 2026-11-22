/**
 * previews.js
 *
 * One tool for the preview images in /preview (replaces the old Python scripts):
 *
 *   node scripts/previews.js init <style_id>   create preview/<style_id> for an existing style
 *   node scripts/previews.js optimize          convert new PNG/JPG to WebP and number every image
 *                                              as <style_id>_<n>.webp (originals are removed)
 *   node scripts/previews.js normalize         rename preview folders with hyphens to underscores
 *
 * Add --dry-run to optimize or normalize to see what would change.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const WEBP_QUALITY = 85;
const IMAGE_REGEX = /\.(png|jpe?g|webp)$/i;

// ─── Optimize ───────────────────────────────────────────────────────

/**
 * Plans how the images of one folder become <folder>_<n>.webp. Images that already
 * follow the pattern are kept; the rest are numbered after the highest existing
 * index, so nothing is ever overwritten.
 */
export function planOptimize(folderName, files) {
  const pattern = new RegExp(`^${folderName}_(\\d+)\\.webp$`);
  const images = files.filter((f) => IMAGE_REGEX.test(f)).sort();

  let next = images.reduce((max, f) => Math.max(max, Number(f.match(pattern)?.[1] ?? 0)), 0);

  return images
    .filter((f) => !pattern.test(f))
    .map((from) => ({
      from,
      to: `${folderName}_${++next}.webp`,
      action: /\.webp$/i.test(from) ? 'rename' : 'convert',
    }));
}

export async function optimizeFolder(folderPath, { dryRun = false } = {}) {
  const folderName = path.basename(folderPath);
  const plan = planOptimize(folderName, fs.readdirSync(folderPath));

  for (const { from, to, action } of plan) {
    if (dryRun) continue;
    const source = path.join(folderPath, from);
    const target = path.join(folderPath, to);
    if (action === 'convert') {
      await sharp(source).webp({ quality: WEBP_QUALITY }).toFile(target);
      fs.rmSync(source); // only after the WebP was written
    } else {
      fs.renameSync(source, target);
    }
  }
  return plan;
}

export async function optimizeAll(previewDir, options) {
  const result = {};
  const folders = fs
    .readdirSync(previewDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());
  for (const dir of folders) {
    const plan = await optimizeFolder(path.join(previewDir, dir.name), options);
    if (plan.length > 0) result[dir.name] = plan;
  }
  return result;
}

// ─── Normalize ──────────────────────────────────────────────────────

/** Folders whose name has hyphens, with the name they should have. */
export function planNormalize(folderNames) {
  return folderNames
    .filter((name) => name.includes('-'))
    .map((name) => ({ from: name, to: name.replace(/-/g, '_') }));
}

export function normalizeFolders(previewDir, { dryRun = false } = {}) {
  const folders = fs
    .readdirSync(previewDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());
  const plan = planNormalize(folders.map((d) => d.name));
  const skipped = [];

  for (const { from, to } of plan) {
    if (dryRun) continue;
    const source = path.join(previewDir, from);
    const target = path.join(previewDir, to);

    if (!fs.existsSync(target)) {
      fs.renameSync(source, target);
      continue;
    }

    // Target exists: merge, never overwrite a file
    for (const file of fs.readdirSync(source)) {
      if (fs.existsSync(path.join(target, file))) {
        skipped.push(`${from}/${file}`);
      } else {
        fs.renameSync(path.join(source, file), path.join(target, file));
      }
    }
    if (fs.readdirSync(source).length === 0) fs.rmdirSync(source);
  }
  return { plan, skipped };
}

// ─── Init ───────────────────────────────────────────────────────────

export function initPreviewFolder(stylesDir, previewDir, styleId) {
  if (!fs.existsSync(path.join(stylesDir, `${styleId}.yaml`))) {
    throw new Error(`styles/${styleId}.yaml does not exist. Create the style first.`);
  }
  const folder = path.join(previewDir, styleId);
  const created = !fs.existsSync(folder);
  fs.mkdirSync(folder, { recursive: true });
  return { folder, created };
}

// ─── CLI ────────────────────────────────────────────────────────────

const USAGE = `Usage:
  node scripts/previews.js init <style_id>
  node scripts/previews.js optimize [--dry-run]
  node scripts/previews.js normalize [--dry-run]`;

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const dryRun = rest.includes('--dry-run');
  const previewDir = path.join(ROOT, 'preview');
  const prefix = dryRun ? '[dry run] ' : '';

  if (command === 'init') {
    const id = rest.find((a) => !a.startsWith('--'));
    if (!id) throw new Error(USAGE);
    const { folder, created } = initPreviewFolder(path.join(ROOT, 'styles'), previewDir, id);
    console.log(
      created
        ? `✅ Created ${path.relative(ROOT, folder)}`
        : `ℹ️ ${path.relative(ROOT, folder)} already exists.`,
    );
  } else if (command === 'optimize') {
    const result = await optimizeAll(previewDir, { dryRun });
    const folders = Object.keys(result);
    if (folders.length === 0) console.log('✨ Everything is already optimized.');
    for (const folder of folders) {
      console.log(`${prefix}${folder}`);
      for (const { from, to, action } of result[folder])
        console.log(`  ${action}: ${from} -> ${to}`);
    }
  } else if (command === 'normalize') {
    const { plan, skipped } = normalizeFolders(previewDir, { dryRun });
    if (plan.length === 0) console.log('✨ All folder names are already normalized.');
    for (const { from, to } of plan) console.log(`${prefix}${from} -> ${to}`);
    for (const file of skipped) console.warn(`⚠ Not moved (already exists in the target): ${file}`);
  } else {
    console.log(USAGE);
    process.exit(command ? 1 : 0);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main().catch((err) => {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  });
}
