/**
 * scripts/add-style.js
 * 
 * Automates the addition of a new style: registers it in data/catalog.json
 * (what the website reads) and in README.md (TOC and document body).
 * 
 * Usage: node scripts/add-style.js --name "Style Name" --cat "Category" --yaml "path/to/file.yaml"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const README_PATH = path.join(ROOT, 'README.md');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');

// 1. Get Arguments
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

// 2. Read Files
let readme = fs.readFileSync(README_PATH, 'utf-8');

// --- TOC UPDATE LOGIC ---
function updateTOC(content, name, category) {
  const lines = content.split('\n');
  const catRegex = new RegExp(`^- \\[.*${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*\\]\\(#.+\\)`, 'i');
  
  let catIndex = -1;
  let nextCatIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (catRegex.test(lines[i])) {
      catIndex = i;
      continue;
    }
    if (catIndex !== -1 && lines[i].startsWith('- [') && i > catIndex) {
      nextCatIndex = i;
      break;
    }
  }

  // If no next category is found, look for the end of the TOC list
  if (nextCatIndex === -1 && catIndex !== -1) {
    for (let i = catIndex + 1; i < lines.length; i++) {
      if (lines[i].trim() === '' || lines[i].startsWith('#')) {
        nextCatIndex = i;
        break;
      }
    }
  }

  if (catIndex === -1) {
    console.warn(`⚠️ Category "${category}" not found in TOC.`);
    return content;
  }

  const anchor = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  const tocEntry = `  - [${name}](#${anchor})`;
  
  // Check if entry already exists
  if (content.includes(tocEntry)) return content;

  lines.splice(nextCatIndex, 0, tocEntry);
  return lines.join('\n');
}

// --- BODY UPDATE LOGIC ---
function updateBody(content, name, category, yamlFile) {
  const sections = content.split('\n### ');
  const catSearch = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const catRegex = new RegExp(`^.*${catSearch}`, 'i');

  let targetSectionIndex = -1;
  for (let i = 0; i < sections.length; i++) {
    if (catRegex.test(sections[i])) {
      targetSectionIndex = i;
      break;
    }
  }

  if (targetSectionIndex === -1) {
    console.warn(`⚠️ Section "### ${category}" not found in body.`);
    return content;
  }

  // Read YAML for README preview
  const yamlBody = fs.readFileSync(path.join(ROOT, yamlFile), 'utf-8');
  const id = path.basename(yamlFile, '.yaml');
  
  // Extract description from YAML
  const descriptionMatch = yamlBody.match(/description:\s*"(.+?)"/);
  const description = descriptionMatch ? descriptionMatch[1] : "Description not available.";

  // Use the first real preview (previews are .webp since the optimization step)
  const previewDir = path.join(ROOT, 'preview', id);
  const previewFile = fs.existsSync(previewDir)
    ? (fs.readdirSync(previewDir).filter((f) => /\.(webp|png|jpe?g)$/i.test(f)).sort()[0] ?? `${id}_1.webp`)
    : `${id}_1.webp`;

  const newStyleBlock = `
#### ${name}

${description}

![${name} Preview](preview/${id}/${previewFile})

> [!TIP]
> This is a simplified preview. [View Full YAML](${yamlFile})

\`\`\`yaml
${yamlBody.trim()}
\`\`\`
`;

  // Insert before the --- separator or at the end of the section
  let sectionContent = sections[targetSectionIndex];
  if (sectionContent.includes('---')) {
    sections[targetSectionIndex] = sectionContent.replace('---', `${newStyleBlock}\n---\n`);
  } else {
    sections[targetSectionIndex] = sectionContent + `\n${newStyleBlock}`;
  }

  return sections.join('\n### ');
}

// --- CATALOG UPDATE LOGIC ---
function updateCatalog(name, category, yamlFile) {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  const target = catalog.categories.find((c) => c.name.toLowerCase().includes(category.toLowerCase()));
  if (!target) {
    console.warn(`⚠️ Category "${category}" not found in data/catalog.json.`);
    return;
  }

  const id = path.basename(yamlFile, '.yaml');
  if (catalog.categories.some((c) => c.styles.some((s) => s.id === id))) {
    console.log(`ℹ️ "${id}" is already in data/catalog.json.`);
    return;
  }

  const yamlBody = fs.readFileSync(path.join(ROOT, yamlFile), 'utf-8');
  const description = yamlBody.match(/^description:\s*"(.+?)"/m)?.[1] ?? '';
  target.styles.push({ id, name, description });
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf-8');
  console.log(`✅ data/catalog.json updated.`);
}

// 4. Apply Changes
console.log(`🚀 Adding style "${styleName}" to category "${categoryName}"...`);
readme = updateTOC(readme, styleName, categoryName);
readme = updateBody(readme, styleName, categoryName, yamlPath);
updateCatalog(styleName, categoryName, yamlPath);

// 5. Save
fs.writeFileSync(README_PATH, readme, 'utf-8');
console.log(`✅ README.md updated successfully.`);
