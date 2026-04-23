import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  site: 'https://notebooklm-prompt-styles.vercel.app',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [
      Icons({
        compiler: 'astro',
      }),
    ],
  },
});
