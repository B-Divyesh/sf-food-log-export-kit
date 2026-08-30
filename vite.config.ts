import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolveSourceCommit } from './scripts/source-commit';

const sourceCommit = resolveSourceCommit();
const appVersion = (JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }).version;

export default defineConfig({
  plugins: [{
    name: 'release-identity',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'release-identity.json',
        source: `${JSON.stringify({ version: appVersion, release_tag: `v${appVersion}`, source_commit: sourceCommit }, null, 2)}\n`
      });
    }
  }],
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
