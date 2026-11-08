/**
 * scripts/add-style.js
 *
 * Registers a new style in data/catalog.json (what the website reads) and
 * regenerates the style sections of README.md.
 *
 * Usage: node scripts/add-style.js --name "Style Name" --cat "Category" --yaml "styles/file.yaml"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadCatalog } from './build-data.js';
import { renderReadme } from './generate-readme.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const README_PATH = path.join(ROOT, 'README.md');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index !== -1 ? args[index + 1] : null;
};

const styleName = getArg('--name');
const categoryName = getArg('--cat');
const yamlPath = getArg('--yaml');

if (!styleName || !categoryName || !yamlPath) {
  console.error('❌ Missing arguments. Usage: node scripts/add-style.js --name "Name" --cat "Category" --yaml "styles/file.yaml"');
  process.exit(1);
}

const yamlFile = path.join(ROOT, yamlPath);
if (!fs.existsSync(yamlFile)) {
  console.error(`❌ ${yamlPath} does not exist.`);
  process.exit(1);
}

const catalog = loadCatalog(CATALOG_PATH);
const target = catalog.categories.find((c) => c.name.toLowerCase().includes(categoryName.toLowerCase()));
if (!target) {
  console.error(`❌ Category "${categoryName}" not found. Available: ${catalog.categories.map((c) => c.name).join(', ')}`);
  process.exit(1);
}

const id = path.basename(yamlPath, path.extname(yamlPath));
if (catalog.categories.some((c) => c.styles.some((s) => s.id === id))) {
  console.log(`ℹ️ "${id}" is already in data/catalog.json.`);
} else {
  const description = fs.readFileSync(yamlFile, 'utf-8').match(/^description:\s*"(.+?)"/m)?.[1] ?? '';
  target.styles.push({ id, name: styleName, description });
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf-8');
  console.log(`✅ "${styleName}" added to "${target.name}" in data/catalog.json.`);
}

const readme = fs.readFileSync(README_PATH, 'utf-8');
fs.writeFileSync(README_PATH, renderReadme(readme, loadCatalog(CATALOG_PATH), path.join(ROOT, 'preview')), 'utf-8');
console.log('✅ README.md regenerated.');
