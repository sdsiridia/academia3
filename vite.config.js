import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        blog: resolve(import.meta.dirname, 'blog.html'),
        cursos: resolve(import.meta.dirname, 'cursos.html'),
        'aviso-legal': resolve(import.meta.dirname, 'aviso-legal.html'),
        404: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
