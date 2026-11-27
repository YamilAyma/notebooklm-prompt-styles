import fs from 'node:fs';
import path from 'node:path';

const origin = 'https://www.slidestyleshub.com';
const dist = path.resolve('dist');
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8');
const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const index = locations(read('sitemap.xml'));
check(index.length > 0, 'Empty sitemap index');
const urls = new Set();

for (const location of index) {
  const shard = new URL(location);
  check(shard.origin === origin, 'Wrong sitemap host: ' + location);
  if (shard.origin !== origin) continue;
  for (const location of locations(read(shard.pathname.slice(1)))) {
    const url = new URL(location);
    check(url.origin === origin, 'Wrong page host: ' + location);
    check(!urls.has(location), 'Duplicate sitemap URL: ' + location);
    urls.add(location);
    const file = path.join(dist, decodeURIComponent(url.pathname), 'index.html');
    check(fs.existsSync(file), 'Missing HTML: ' + location);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/g) ?? [];
    check(
      canonical.length === 1 && canonical[0].includes('href="' + location + '"'),
      'Canonical mismatch: ' + location,
    );
    check(!/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html), 'Noindex in sitemap: ' + location);
    check(/<title>[^<]+<\/title>/.test(html), 'Missing title: ' + location);
    check(/<meta\s+name="description"\s+content="[^"]+"/.test(html), 'Missing description: ' + location);
  }
}

const catalog = JSON.parse(read('data/styles.json'));
const gallery = read('styles/index.html');
for (const category of catalog.categories) {
  for (const style of category.styles) {
    const route = '/style/' + style.id + '/';
    check(urls.has(origin + route), 'Missing style in sitemap: ' + route);
    check(gallery.includes('href="' + route + '"'), 'Missing gallery link: ' + route);
  }
}
check(![...urls].some((url) => /^\/compare\/?$/.test(new URL(url).pathname)), 'Compare is indexed');
check(read('robots.txt').includes('Sitemap: ' + origin + '/sitemap.xml'), 'Wrong robots sitemap');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('SEO audit passed for ' + urls.size + ' sitemap URLs');
}
