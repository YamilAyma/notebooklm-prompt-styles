import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { validateStyle, validateAll, validateCatalog } from '../validate-styles.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MOCK_STYLES = path.join(__dirname, 'fixtures', 'mock-styles');
const MOCK_PREVIEW = path.join(__dirname, 'fixtures', 'mock-preview');

const loadMock = (name) => yaml.load(fs.readFileSync(path.join(MOCK_STYLES, name), 'utf-8'));

describe('validateStyle', () => {
  it('accepts a valid style', () => {
    const { errors, warnings } = validateStyle(loadMock('style_a.yaml'));
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('rejects empty input', () => {
    expect(validateStyle(null).errors).toContain('missing design_system.global_style');
  });

  it('reports each missing required field', () => {
    const parsed = loadMock('style_a.yaml');
    delete parsed.design_system.global_style.theme;
    delete parsed.slide_layout_templates;
    const { errors } = validateStyle(parsed);
    expect(errors).toEqual(
      expect.arrayContaining([
        'global_style.theme must be a non-empty string',
        'slide_layout_templates must be a non-empty list',
      ]),
    );
  });

  it('warns (not errors) when a site color token is missing', () => {
    const parsed = loadMock('style_a.yaml');
    delete parsed.design_system.global_style.color_palette.background;
    const { errors, warnings } = validateStyle(parsed);
    expect(errors).toEqual([]);
    expect(warnings).toEqual(['color_palette.background is missing (used for site tokens)']);
  });

  it('warns (not errors) when a color has no HEX code', () => {
    const parsed = loadMock('style_a.yaml');
    parsed.design_system.global_style.color_palette.primary_color = 'Warm Cream';
    const { errors, warnings } = validateStyle(parsed);
    expect(errors).toEqual([]);
    expect(warnings).toEqual(['color_palette.primary_color has no HEX code']);
  });

  it('accepts descriptive colors that include a HEX code', () => {
    const parsed = loadMock('style_a.yaml');
    parsed.design_system.global_style.color_palette.primary_color = 'Warm Cream (#F9F7F2)';
    expect(validateStyle(parsed).warnings).toEqual([]);
  });
});

describe('validateAll', () => {
  const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'validate-styles-'));

  it('flags invalid YAML, styles without preview and orphan preview folders', () => {
    const dir = tmp();
    const styles = path.join(dir, 'styles');
    const preview = path.join(dir, 'preview');
    fs.mkdirSync(styles);
    fs.mkdirSync(path.join(preview, 'orphan'), { recursive: true });
    fs.copyFileSync(path.join(MOCK_STYLES, 'style_a.yaml'), path.join(styles, 'style_a.yaml'));
    fs.copyFileSync(path.join(MOCK_STYLES, 'invalid.yaml'), path.join(styles, 'invalid.yaml'));
    fs.writeFileSync(path.join(preview, 'orphan', 'orphan_1.webp'), '');

    const results = validateAll(styles, preview);
    const byFile = Object.fromEntries(results.map((r) => [r.file, r.errors.join(' | ')]));

    expect(byFile['styles/invalid.yaml']).toContain('invalid YAML');
    expect(byFile['styles/style_a.yaml']).toContain('no preview images');
    expect(byFile['preview/orphan']).toContain('no matching YAML');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('passes a style with a preview image', () => {
    const results = validateAll(MOCK_STYLES, MOCK_PREVIEW).filter(
      (r) => r.file === 'styles/style_a.yaml',
    );
    expect(results[0].errors).toEqual([]);
  });
});

describe('validateCatalog', () => {
  const setup = (catalogStyleIds, styleIds, previewIds) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-catalog-'));
    const styles = path.join(dir, 'styles');
    const preview = path.join(dir, 'preview');
    fs.mkdirSync(styles);
    for (const id of styleIds)
      fs.writeFileSync(path.join(styles, `${id}.yaml`), 'design_system: {}');
    for (const id of previewIds) {
      fs.mkdirSync(path.join(preview, id), { recursive: true });
      fs.writeFileSync(path.join(preview, id, `${id}_1.webp`), '');
    }
    const catalogPath = path.join(dir, 'catalog.json');
    fs.writeFileSync(
      catalogPath,
      JSON.stringify({
        categories: [
          {
            id: 'cat',
            name: 'Cat',
            styles: catalogStyleIds.map((id) => ({ id, name: id.toUpperCase() })),
          },
        ],
      }),
    );
    return { dir, styles, preview, catalogPath };
  };
  const run = (...args) => {
    const ctx = setup(...args);
    const { errors } = validateCatalog(ctx.styles, ctx.preview, ctx.catalogPath)[0];
    fs.rmSync(ctx.dir, { recursive: true, force: true });
    return errors;
  };

  it('passes when the catalog and styles match', () => {
    expect(
      run(
        ['neon_glow', 'hand_drawn_scrapbook'],
        ['neon_glow', 'hand_drawn_scrapbook'],
        ['neon_glow', 'hand_drawn_scrapbook'],
      ),
    ).toEqual([]);
  });

  it('flags a style with previews that is missing from the catalog', () => {
    const errors = run(['neon_glow'], ['neon_glow', 'pop_retro'], ['neon_glow', 'pop_retro']);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('styles/pop_retro.yaml');
  });

  it('ignores styles without previews (they are reported by validateAll)', () => {
    expect(run(['neon_glow'], ['neon_glow', 'draft'], ['neon_glow'])).toEqual([]);
  });

  it('flags a catalog entry without a YAML file', () => {
    expect(run(['neon_glow', 'ghost_style'], ['neon_glow'], ['neon_glow'])).toEqual([
      'catalog lists "GHOST_STYLE" but styles/ghost_style.yaml does not exist',
    ]);
  });

  it('reports an invalid catalog instead of crashing', () => {
    const ctx = setup(['a'], ['a'], ['a']);
    fs.writeFileSync(ctx.catalogPath, '{ broken');
    const { errors } = validateCatalog(ctx.styles, ctx.preview, ctx.catalogPath)[0];
    expect(errors).toHaveLength(1);
    fs.rmSync(ctx.dir, { recursive: true, force: true });
  });
});
