import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'sitemap-index.xml');
const finalPath = path.join(distDir, 'sitemap.xml');

// Keep every generated shard and the original index available to existing crawlers.
if (!fs.existsSync(indexPath)) {
  throw new Error('Astro sitemap index is missing');
}
fs.copyFileSync(indexPath, finalPath);
console.log('Sitemap index published at /sitemap.xml');
