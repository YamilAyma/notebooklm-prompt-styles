import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import { buildYamlBundle } from '../../src/lib/bundle.js';

const styles = [
  { name: 'Style A', yamlContent: 'design_system:\n  global_style:\n    theme: "A"\n' },
  { name: 'Style B', yamlContent: '\ndesign_system:\n  global_style:\n    theme: "B"\n\n' },
];

describe('buildYamlBundle', () => {
  it('writes each style as a document with its name in a comment', () => {
    const text = buildYamlBundle(styles);
    expect(text).toBe(
      '---\n# Style A\ndesign_system:\n  global_style:\n    theme: "A"\n\n---\n# Style B\ndesign_system:\n  global_style:\n    theme: "B"\n',
    );
  });

  it('is a valid multi-document YAML stream with every style intact', () => {
    const docs = yaml.loadAll(buildYamlBundle(styles));
    expect(docs.map((d) => d.design_system.global_style.theme)).toEqual(['A', 'B']);
  });

  it('is empty for no styles', () => {
    expect(buildYamlBundle([])).toBe('');
  });
});
