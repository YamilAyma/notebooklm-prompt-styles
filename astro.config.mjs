import { defineConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [
      Icons({
        compiler: 'astro',
      }),
    ],
  },
});
