import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist/site',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: { host: '127.0.0.1', port: 4173 },
  preview: { host: '127.0.0.1', port: 4173 }
});
