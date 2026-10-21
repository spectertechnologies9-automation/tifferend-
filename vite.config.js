import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        case: resolve(__dirname, 'work/my-mithila/index.html'),
        careers: resolve(__dirname, 'careers/index.html'),
      },
    },
  },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
