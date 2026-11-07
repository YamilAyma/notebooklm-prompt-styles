import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { validateStyle, validateAll } from '../validate-styles.js';

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
    expect(errors).toEqual(expect.arrayContaining([
      'global_style.theme must be a non-empty string',
      'slide_layout_templates must be a non-empty list',
    ]));
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
    const results = validateAll(MOCK_STYLES, MOCK_PREVIEW)
      .filter((r) => r.file === 'styles/style_a.yaml');
    expect(results[0].errors).toEqual([]);
  });
});
