import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const sitemap0Path = path.join(distDir, 'sitemap-0.xml');
const sitemapIndexPath = path.join(distDir, 'sitemap-index.xml');
const finalSitemapPath = path.join(distDir, 'sitemap.xml');

// Astro generates sitemap-0.xml and sitemap-index.xml
if (fs.existsSync(sitemap0Path)) {
  // Rename sitemap-0.xml to sitemap.xml
  fs.renameSync(sitemap0Path, finalSitemapPath);
  console.log('✅ Renamed sitemap-0.xml to sitemap.xml');

  // Delete sitemap-index.xml
  if (fs.existsSync(sitemapIndexPath)) {
    fs.unlinkSync(sitemapIndexPath);
    console.log('🗑️ Deleted sitemap-index.xml');
  }
} else {
  console.log('⚠️ sitemap-0.xml not found. Astro sitemap generation might have failed.');
}
