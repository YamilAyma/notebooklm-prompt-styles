import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import {
  planOptimize,
  optimizeFolder,
  optimizeAll,
  planNormalize,
  normalizeFolders,
  initPreviewFolder,
} from '../previews.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'previews-'));
const png = (file) =>
  sharp({ create: { width: 40, height: 20, channels: 3, background: '#336699' } })
    .png()
    .toFile(file);

describe('planOptimize', () => {
  it('numbers new images after the highest existing index (never overwrites)', () => {
    const plan = planOptimize('neon', ['neon_1.webp', 'neon_3.webp', 'b.png', 'a.jpg']);
    expect(plan).toEqual([
      { from: 'a.jpg', to: 'neon_4.webp', action: 'convert' },
      { from: 'b.png', to: 'neon_5.webp', action: 'convert' },
    ]);
  });

  it('renames WebP files that do not follow the pattern', () => {
    expect(planOptimize('neon', ['shot.webp'])).toEqual([
      { from: 'shot.webp', to: 'neon_1.webp', action: 'rename' },
    ]);
  });

  it('has nothing to do when everything follows the pattern or is not an image', () => {
    expect(planOptimize('neon', ['neon_1.webp', 'neon_2.webp', 'notes.txt'])).toEqual([]);
  });
});

describe('optimizeFolder / optimizeAll', () => {
  it('converts PNGs to WebP, removes the originals and keeps existing images', async () => {
    const dir = tmp();
    const folder = path.join(dir, 'neon');
    fs.mkdirSync(folder);
    fs.writeFileSync(path.join(folder, 'neon_1.webp'), 'existing');
    await png(path.join(folder, 'shot.png'));

    await optimizeAll(dir);

    expect(fs.readdirSync(folder).sort()).toEqual(['neon_1.webp', 'neon_2.webp']);
    expect(fs.readFileSync(path.join(folder, 'neon_1.webp'), 'utf-8')).toBe('existing');
    expect((await sharp(path.join(folder, 'neon_2.webp')).metadata()).format).toBe('webp');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('does not touch anything in dry-run mode', async () => {
    const dir = tmp();
    const folder = path.join(dir, 'neon');
    fs.mkdirSync(folder);
    await png(path.join(folder, 'shot.png'));

    const plan = await optimizeFolder(folder, { dryRun: true });

    expect(plan).toHaveLength(1);
    expect(fs.readdirSync(folder)).toEqual(['shot.png']);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe('normalize', () => {
  it('plans only the folders with hyphens', () => {
    expect(planNormalize(['a_b', 'c-d', 'e-f-g'])).toEqual([
      { from: 'c-d', to: 'c_d' },
      { from: 'e-f-g', to: 'e_f_g' },
    ]);
  });

  it('renames folders, and merges into an existing one without overwriting files', () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'solo-one'));
    fs.writeFileSync(path.join(dir, 'solo-one', 'a.webp'), '');
    fs.mkdirSync(path.join(dir, 'two-x'));
    fs.writeFileSync(path.join(dir, 'two-x', 'keep.webp'), 'old');
    fs.writeFileSync(path.join(dir, 'two-x', 'new.webp'), 'new');
    fs.mkdirSync(path.join(dir, 'two_x'));
    fs.writeFileSync(path.join(dir, 'two_x', 'keep.webp'), 'target');

    const { skipped } = normalizeFolders(dir);

    expect(fs.existsSync(path.join(dir, 'solo_one', 'a.webp'))).toBe(true);
    expect(fs.readFileSync(path.join(dir, 'two_x', 'keep.webp'), 'utf-8')).toBe('target');
    expect(fs.existsSync(path.join(dir, 'two_x', 'new.webp'))).toBe(true);
    expect(skipped).toEqual(['two-x/keep.webp']);
    expect(fs.existsSync(path.join(dir, 'two-x', 'keep.webp'))).toBe(true);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe('initPreviewFolder', () => {
  it('creates the folder for an existing style and is idempotent', () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'styles'));
    fs.writeFileSync(path.join(dir, 'styles', 'neon.yaml'), 'design_system: {}');

    expect(
      initPreviewFolder(path.join(dir, 'styles'), path.join(dir, 'preview'), 'neon').created,
    ).toBe(true);
    expect(
      initPreviewFolder(path.join(dir, 'styles'), path.join(dir, 'preview'), 'neon').created,
    ).toBe(false);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('refuses a style that has no YAML', () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'styles'));
    expect(() =>
      initPreviewFolder(path.join(dir, 'styles'), path.join(dir, 'preview'), 'ghost'),
    ).toThrow('styles/ghost.yaml does not exist');
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
