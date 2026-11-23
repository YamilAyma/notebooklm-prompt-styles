import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  site: 'https://www.slidestyleshub.com',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/compare/') })],
  vite: {
    plugins: [
      Icons({
        compiler: 'astro',
      }),
    ],
  },
});
