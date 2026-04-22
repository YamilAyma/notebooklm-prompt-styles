import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'web',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'web/index.html'),
        brandInspired: resolve(__dirname, 'web/brand-inspired.html'),
        minimalist: resolve(__dirname, 'web/minimalist.html'),
        creative: resolve(__dirname, 'web/creative.html'),
      },
    },
  },
  server: {
    open: true,
    fs: {
      allow: ['..'],
    },
  },
});
