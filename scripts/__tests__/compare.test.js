import { describe, it, expect } from 'vitest';
import {
  MAX_COMPARE,
  compareUrl,
  parseCompareIds,
  compareSearch,
  canCompare,
} from '../../src/lib/compare.js';

const known = ['a', 'b', 'c', 'd'];

describe('parseCompareIds', () => {
  it('reads the ids of ?styles=', () => {
    expect(parseCompareIds('?styles=a,b', known)).toEqual(['a', 'b']);
  });

  it('drops unknown and repeated ids and keeps at most three', () => {
    expect(parseCompareIds('?styles=a,zzz,a,b,c,d', known)).toEqual(['a', 'b', 'c']);
    expect(MAX_COMPARE).toBe(3);
  });

  it('is empty without the parameter or with an empty one', () => {
    expect(parseCompareIds('', known)).toEqual([]);
    expect(parseCompareIds('?styles=', known)).toEqual([]);
  });
});

describe('urls', () => {
  it('builds the compare URL and the query string', () => {
    expect(compareUrl(['a', 'b'])).toBe('/compare/?styles=a,b');
    expect(compareSearch(['a', 'b'])).toBe('?styles=a,b');
    expect(compareSearch([])).toBe('');
  });
});

describe('canCompare', () => {
  it('needs two or three styles', () => {
    expect([0, 1, 2, 3, 4].map(canCompare)).toEqual([false, false, true, true, false]);
  });
});
