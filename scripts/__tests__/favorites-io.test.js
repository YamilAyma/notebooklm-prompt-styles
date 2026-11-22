import { describe, it, expect } from 'vitest';
import { serializeFavorites, parseFavorites, mergeFavorites } from '../../src/lib/favoritesIO.js';

describe('serializeFavorites', () => {
  it('writes a versioned file with unique ids', () => {
    const data = JSON.parse(serializeFavorites(['a', 'b', 'a'], new Date('2026-11-22T10:00:00Z')));
    expect(data).toEqual({
      format: 'notebooklm-styles-favorites',
      version: 1,
      exportedAt: '2026-11-22T10:00:00.000Z',
      favorites: ['a', 'b'],
    });
  });
});

describe('parseFavorites', () => {
  const known = ['a', 'b', 'c'];

  it('round-trips an export', () => {
    expect(parseFavorites(serializeFavorites(['c', 'a']), known)).toEqual({
      ids: ['c', 'a'],
      ignored: 0,
    });
  });

  it('drops unknown ids and counts them', () => {
    expect(parseFavorites(JSON.stringify({ favorites: ['a', 'zzz', 'zzz', 'b'] }), known)).toEqual({
      ids: ['a', 'b'],
      ignored: 1,
    });
  });

  it('accepts a plain list of ids', () => {
    expect(parseFavorites('["b"]', known)).toEqual({ ids: ['b'], ignored: 0 });
  });

  it('rejects invalid files', () => {
    expect(() => parseFavorites('{ nope', known)).toThrow('Not valid JSON');
    expect(() => parseFavorites('{"favorites": "a"}', known)).toThrow('Not a favorites file');
    expect(() => parseFavorites('{"favorites": [1, 2]}', known)).toThrow('Not a favorites file');
    expect(() => parseFavorites('null', known)).toThrow('Not a favorites file');
  });
});

describe('mergeFavorites', () => {
  it('keeps the current order and appends only the new ones', () => {
    expect(mergeFavorites(['b', 'a'], ['a', 'c', 'd'])).toEqual(['b', 'a', 'c', 'd']);
  });
});
