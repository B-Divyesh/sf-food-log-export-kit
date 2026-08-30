import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import viteConfig from '../../vite.config';
import { resolveSourceCommit } from '../../scripts/source-commit';

describe('release tooling regressions', () => {
  it('@regression:F13-2 normalizes CI=1 before Tauri parses the documented command', () => {
    const result = spawnSync('npm', ['run', 'tauri', '--', 'build', '--help'], {
      cwd: resolve('.'),
      encoding: 'utf8',
      env: { ...process.env, CI: '1' }
    });

    expect(`${result.stdout}${result.stderr}`).not.toContain("invalid value '1' for '--ci'");
    expect(result.status).toBe(0);
  });

  it('@regression:F13-1-site-build commits a full source identity into every Vite build', () => {
    const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    expect(resolveSourceCommit({ ...process.env, VITE_FOOD_LOG_SOURCE_COMMIT: '' })).toBe(head);
    expect(viteConfig.define?.['import.meta.env.VITE_FOOD_LOG_SOURCE_COMMIT']).toBe(JSON.stringify(head));
    expect(() => resolveSourceCommit({ ...process.env, VITE_FOOD_LOG_SOURCE_COMMIT: 'not-a-commit' })).toThrow(/40-character Git commit/);
    expect(viteConfig.plugins).toBeDefined();
    for (const installer of ['public/install.sh', 'public/install.ps1']) {
      expect(readFileSync(installer, 'utf8')).not.toMatch(/[0-9a-f]{40}/);
      expect(readFileSync(installer, 'utf8')).toContain('release-identity.json');
    }
  });
});
