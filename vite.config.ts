import { defineConfig } from 'vite';
import { resolveSourceCommit } from './scripts/source-commit';

const sourceCommit = resolveSourceCommit();

export default defineConfig({
  define: {
    'import.meta.env.VITE_FOOD_LOG_SOURCE_COMMIT': JSON.stringify(sourceCommit)
  },
  build: {
    target: 'es2022',
    outDir: 'dist/site',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: { host: '127.0.0.1', port: 4173 },
  preview: { host: '127.0.0.1', port: 4173 }
});
