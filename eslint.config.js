import js from '@eslint/js';
import globals from 'globals';
import astro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  { ignores: ['dist/', '.astro/', 'public/data/', 'public/preview/', 'node_modules/'] },

  js.configs.recommended,
  ...astro.configs.recommended,

  // Astro frontmatter is TypeScript (props interfaces)
  {
    files: ['**/*.astro'],
    languageOptions: { parserOptions: { parser: tsParser } },
  },

  // Browser code (site scripts and Astro client scripts)
  {
    files: ['src/**/*.js', 'src/**/*.astro'],
    languageOptions: { globals: globals.browser },
  },

  // Node scripts and config files
  {
    files: ['scripts/**/*.js', '*.js', '*.mjs'],
    languageOptions: { globals: globals.node },
  },

  {
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },
];
