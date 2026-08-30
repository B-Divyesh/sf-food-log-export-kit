import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import viteConfig from '../../vite.config';
// This Node-only executable is deliberately JavaScript so npm can run it before TypeScript is available.
// @ts-expect-error The test exercises its runtime exports directly.
import { checkLinuxNativePrerequisites, linuxNativeBuildPackages, linuxNativePrerequisiteMessage } from '../../scripts/linux-native-prereqs.mjs';
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

  it('@regression:R11-native-preflight names the missing Linux library and exact setup command before Cargo runs', () => {
    const missingWebKit = checkLinuxNativePrerequisites({
      platform: 'linux',
      probe: (moduleName: string) => moduleName === 'glib-2.0'
    });
    expect(missingWebKit).toEqual({ ready: false, missing: ['webkit2gtk-4.1'] });
    expect(linuxNativePrerequisiteMessage(missingWebKit.missing)).toContain('sudo apt-get update && sudo apt-get install -y');
    for (const packageName of linuxNativeBuildPackages) {
      expect(linuxNativePrerequisiteMessage(missingWebKit.missing)).toContain(packageName);
    }
    expect(checkLinuxNativePrerequisites({ platform: 'linux', probe: () => true })).toEqual({ ready: true, missing: [] });
    expect(checkLinuxNativePrerequisites({ platform: 'darwin', probe: () => false })).toEqual({ ready: true, missing: [] });

    const wrapper = readFileSync(new URL('../../scripts/tauri.mjs', import.meta.url), 'utf8');
    const workflow = readFileSync(new URL('../../.github/workflows/release.yml', import.meta.url), 'utf8');
    expect(wrapper).toContain('ensureLinuxNativePrerequisites');
    expect(workflow).toContain('Verify Linux native build prerequisites');
    expect(workflow).toContain('npm run native:prereqs');
  });
});
