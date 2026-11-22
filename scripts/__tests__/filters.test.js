import { describe, it, expect } from 'vitest';
import {
  defaultState,
  parseState,
  toSearchParams,
  filterStyles,
  searchTerms,
} from '../../src/lib/filters.js';

const style = (id, searchText, tone = 'light') => ({ id, searchText, tone });
const categories = [
  { id: 'a', styles: [style('a1', 'neon glow dark', 'dark'), style('a2', 'calm paper light')] },
  { id: 'b', styles: [style('b1', 'neon pastel', 'colorful'), style('b2', 'forest green')] },
];
const ids = (list) => list.map((s) => s.id);

describe('state in the URL', () => {
  it('parses q and cat, with defaults for everything else', () => {
    expect(parseState('?q=neon+glow&cat=b')).toEqual({
      q: 'neon glow',
      category: 'b',
      tone: 'all',
    });
    expect(parseState('?tone=dark').tone).toBe('dark');
    expect(parseState('?tone=sparkly').tone).toBe('all');
    expect(parseState('')).toEqual(defaultState());
  });

  it('leaves default values out of the query string', () => {
    expect(toSearchParams(defaultState()).toString()).toBe('');
    expect(toSearchParams({ q: ' neon ', category: 'b', tone: 'all' }).toString()).toBe(
      'q=neon&cat=b',
    );
    expect(toSearchParams({ ...defaultState(), tone: 'dark' }).toString()).toBe('tone=dark');
  });

  it('round-trips', () => {
    const state = { q: 'café & té', category: 'creative-&-playful', tone: 'colorful' };
    expect(parseState(`?${toSearchParams(state)}`)).toEqual(state);
  });
});

describe('searchTerms', () => {
  it('splits and normalizes', () => {
    expect(searchTerms('  Café  ÉPICO ')).toEqual(['cafe', 'epico']);
    expect(searchTerms('')).toEqual([]);
  });
});

describe('filterStyles on the all-styles page', () => {
  it('shows everything by default and filters by the chosen category', () => {
    expect(ids(filterStyles(categories, defaultState()))).toEqual(['a1', 'a2', 'b1', 'b2']);
    expect(ids(filterStyles(categories, { ...defaultState(), category: 'b' }))).toEqual([
      'b1',
      'b2',
    ]);
  });

  it('combines the category chip with the search (AND)', () => {
    expect(ids(filterStyles(categories, { ...defaultState(), q: 'neon', category: 'b' }))).toEqual([
      'b1',
    ]);
    expect(ids(filterStyles(categories, { ...defaultState(), q: 'neon' }))).toEqual(['a1', 'b1']);
  });
});

describe('filterStyles on a category page', () => {
  it('uses the page category, but searches the whole catalog while searching', () => {
    expect(ids(filterStyles(categories, defaultState(), { pageCategory: 'b' }))).toEqual([
      'b1',
      'b2',
    ]);
    expect(
      ids(filterStyles(categories, { ...defaultState(), q: 'neon' }, { pageCategory: 'b' })),
    ).toEqual(['a1', 'b1']);
  });
});

describe('favorites', () => {
  it('keeps only favorites when asked', () => {
    const isFavorite = (id) => id === 'a2';
    expect(
      ids(filterStyles(categories, defaultState(), { favoritesOnly: true, isFavorite })),
    ).toEqual(['a2']);
  });
});

describe('tone', () => {
  it('keeps only the styles with the chosen tone, together with the other filters', () => {
    expect(ids(filterStyles(categories, { ...defaultState(), tone: 'dark' }))).toEqual(['a1']);
    expect(
      ids(filterStyles(categories, { ...defaultState(), tone: 'colorful', category: 'a' })),
    ).toEqual([]);
    expect(
      ids(filterStyles(categories, { ...defaultState(), tone: 'colorful', q: 'neon' })),
    ).toEqual(['b1']);
  });
});
