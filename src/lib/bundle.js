/**
 * bundle.js — Several styles in one text (pure function).
 */

/**
 * Valid multi-document YAML: each style starts with `---` and a comment with its name,
 * so several `design_system:` blocks can live in one paste.
 */
export function buildYamlBundle(styles) {
  return styles.map((s) => `---\n# ${s.name}\n${s.yamlContent.trim()}\n`).join('\n');
}
