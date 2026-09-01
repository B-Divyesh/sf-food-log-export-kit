import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

describe('desktop release regression', () => {
  it('keeps the tagged desktop release version in sync across every shipped surface', () => {
    const packageVersion = JSON.parse(read('package.json')).version as string;
    const packageLock = JSON.parse(read('package-lock.json')) as { version: string; packages: { '': { version: string } } };
    const tauri = JSON.parse(read('src-tauri/tauri.conf.json')).version as string;
    const cargo = read('src-tauri/Cargo.toml');
    const landing = read('src/pages.ts');
    const footer = read('src/shell.ts');
    const notFound = read('public/404.html');

    expect(packageVersion).toBe('0.1.12');
    expect(packageLock.version).toBe(packageVersion);
    expect(packageLock.packages[''].version).toBe(packageVersion);
    expect(tauri).toBe(packageVersion);
    expect(cargo).toMatch(new RegExp(`name = "food-log-export-kit"\\nversion = "${packageVersion}"`));
    expect(landing).toContain('Desktop app · version ${appVersion}');
    expect(read('src/build.ts')).toContain(`appVersion = '${packageVersion}'`);
    expect(footer).toContain('Version ${appVersion} · release repair');
    expect(notFound).toContain(`Version ${packageVersion} · release repair`);
    expect(read('vite.config.ts')).toContain("fileName: 'release-identity.json'");
    expect(JSON.parse(read('package.json')).scripts['release:preflight']).toBe('node scripts/release-preflight.mjs');
  });

  it('@claim:release-workflow starts both Mac architectures, Windows, and Linux from a v* tag', () => {
    const workflow = read('.github/workflows/release.yml');
    expect(workflow).toContain("tags: ['v*']");
    expect(workflow).toContain('target: x86_64-apple-darwin');
    expect(workflow).toContain('target: aarch64-apple-darwin');
    expect(workflow).toContain('platform: windows-latest');
    expect(workflow).toContain('platform: ubuntu-22.04');
    expect(workflow).toContain('release_tag:');
    expect(workflow).toContain('ref: ${{ github.ref_type == \'tag\' && github.ref || inputs.release_tag }}');
    expect(workflow).toContain('Verify release tag matches the desktop and site version');
    expect(workflow).toContain('Install Linux build prerequisites');
    expect(workflow).toContain('apt-get install -y file pkg-config libglib2.0-dev libwebkit2gtk-4.1-dev');
    expect(workflow).toContain('test "$RELEASE_TAG" = "v$(node -p');
    expect(workflow).toContain('Verify published installer release');
    expect(workflow).toContain('sha256sum -c SHA256SUMS');
    for (const asset of ["'*.dmg'", "'*.msi'", "'*-setup.exe'", "'*.AppImage'", "'*.deb'", "'*.rpm'"]) expect(workflow).toContain(asset);
    expect(workflow).toContain('git/ref/tags/${RELEASE_TAG}');
    expect(workflow).toContain('git/tags/${remote_tag_sha}');
    expect(workflow).toContain('if [ "$remote_tag_type" = tag ]; then');
    expect(workflow).toContain('FOOD_LOG_SOURCE_COMMIT');
    expect(workflow).toContain('VITE_FOOD_LOG_SOURCE_COMMIT');
    expect(workflow).toContain('github.event.repository.default_branch');
    expect(workflow).toContain('git fetch origin "$default_branch:refs/remotes/origin/$default_branch" --depth=1');
    expect(workflow).toContain('git rev-parse "origin/$default_branch"');
    expect(workflow).toContain("'source_commit': source_commit");
    expect(workflow).toContain("latest['source_commit'] == source_commit");
    expect(workflow).toContain("printf '# source_commit=%s\\n'");
    expect(workflow).toContain("--pattern 'Food*'");
    expect(workflow).toContain('sha256sum "${release_files[@]}"');
    expect(workflow).toContain("'checksums': checksums");
    expect(workflow).toContain('grep -Fx "# source_commit=$FOOD_LOG_SOURCE_COMMIT" SHA256SUMS');
    expect(workflow).not.toContain("|| 'v0.1.2'");
  });

  it('@regression:R13-release-preflight requires a clean current main tip before a tag can exist', () => {
    const preflight = read('scripts/release-preflight.mjs');
    expect(preflight).toContain("['status', '--porcelain', '--untracked-files=all']");
    expect(preflight).toContain("['fetch', 'origin', 'main:refs/remotes/origin/main', '--quiet']");
    expect(preflight).toContain("['ls-remote', '--exit-code', '--tags', 'origin'");
    expect(preflight).toContain('origin/main must equal HEAD before creating a release tag');
  });

  it('@regression:R10-native-build-prerequisites documents the direct Linux dependency that Cargo needs', () => {
    const readme = read('README.md');
    const workflow = read('.github/workflows/release.yml');
    const preflight = read('scripts/linux-native-prereqs.mjs');
    for (const prerequisite of ['pkg-config', 'libglib2.0-dev', 'libwebkit2gtk-4.1-dev', 'libappindicator3-dev', 'librsvg2-dev', 'patchelf']) {
      expect(readme).toContain(prerequisite);
      expect(workflow).toContain(prerequisite);
      expect(preflight).toContain(prerequisite);
    }
    expect(workflow).toContain('npm run native:prereqs');
  });
});
