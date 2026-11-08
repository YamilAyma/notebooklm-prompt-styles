import { describe, it, expect } from 'vitest';
import { stylePath, extractHex, getPalette, getRelatedStyles } from '../../src/lib/stylePage.js';

describe('stylePath', () => {
  it('builds the page URL of a style', () => {
    expect(stylePath('neon_pulsar')).toBe('/style/neon_pulsar/');
  });
});

describe('extractHex', () => {
  it('finds a HEX code inside descriptive text', () => {
    expect(extractHex('Warm Cream (#F9F7F2)')).toBe('#F9F7F2');
    expect(extractHex('#fff')).toBe('#fff');
  });

  it('returns null when there is no HEX code or the value is not text', () => {
    expect(extractHex('Deep forest green')).toBeNull();
    expect(extractHex(undefined)).toBeNull();
    expect(extractHex('#12345')).toBeNull();
  });
});

describe('getPalette', () => {
  it('keeps only the colors that have a HEX code', () => {
    const palette = getPalette({
      primary: 'Cream (#F9F7F2)',
      background: 'Soft gradient',
      text: '#111111',
    });
    expect(palette).toEqual([
      { key: 'primary', label: 'Primary', hex: '#F9F7F2' },
      { key: 'text', label: 'Text', hex: '#111111' },
    ]);
  });

  it('handles missing colors', () => {
    expect(getPalette()).toEqual([]);
  });
});

describe('getRelatedStyles', () => {
  const style = (id) => ({ id });
  const categories = [
    { id: 'a', styles: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'].map(style) },
    { id: 'b', styles: ['b1', 'b2'].map(style) },
    { id: 'c', styles: [style('c1')] },
  ];
  const ids = (list) => list.map((s) => s.id);

  it('returns the next styles of the category, wrapping around', () => {
    expect(ids(getRelatedStyles(categories, 'a5'))).toEqual(['a6', 'a1', 'a2', 'a3']);
  });

  it('never includes the style itself and respects small categories', () => {
    expect(ids(getRelatedStyles(categories, 'b1'))).toEqual(['b2']);
    expect(getRelatedStyles(categories, 'c1')).toEqual([]);
  });

  it('returns nothing for an unknown style', () => {
    expect(getRelatedStyles(categories, 'zzz')).toEqual([]);
  });
});
