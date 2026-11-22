import { describe, it, expect } from 'vitest';
import { escapeHtml, normalizeText } from '../../src/scripts/utils.js';
import { normalizeText as buildNormalizeText } from '../build-data.js';

describe('escapeHtml', () => {
  it('escapes the characters that can break out of HTML', () => {
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe(
      '&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;',
    );
  });

  it('keeps plain text and emoji untouched and tolerates null', () => {
    expect(escapeHtml('Business 👔')).toBe('Business 👔');
    expect(escapeHtml(null)).toBe('');
  });
});

describe('normalizeText (client and build must agree)', () => {
  it.each(['Café Épico', 'MINIMÁL', 'Scholar’s Journal', 'ñandú  Ünïcode', ''])(
    'same result for %j',
    (value) => {
      expect(normalizeText(value)).toBe(buildNormalizeText(value));
    },
  );
});
