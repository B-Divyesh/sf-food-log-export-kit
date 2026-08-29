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

    expect(packageVersion).toBe('0.1.4');
    expect(packageLock.version).toBe(packageVersion);
    expect(packageLock.packages[''].version).toBe(packageVersion);
    expect(tauri).toBe(packageVersion);
    expect(cargo).toMatch(new RegExp(`name = "food-log-export-kit"\\nversion = "${packageVersion}"`));
    expect(landing).toContain(`Desktop app · version ${packageVersion}`);
    for (const surface of [footer, notFound]) expect(surface).toContain(`Version ${packageVersion} · repair 4`);
  });

  it('requires a matching tag and verifies the published installer assets and checksums', () => {
    const workflow = read('.github/workflows/release.yml');
    expect(workflow).toContain("tags: ['v*']");
    expect(workflow).toContain('release_tag:');
    expect(workflow).toContain('ref: ${{ github.ref_type == \'tag\' && github.ref || inputs.release_tag }}');
    expect(workflow).toContain('Verify release tag matches the desktop and site version');
    expect(workflow).toContain('apt-get install -y file libwebkit2gtk-4.1-dev');
    expect(workflow).toContain('test "$RELEASE_TAG" = "v$(node -p');
    expect(workflow).toContain('Verify published installer release');
    expect(workflow).toContain('sha256sum -c SHA256SUMS');
    expect(workflow).toContain('git/ref/tags/${RELEASE_TAG}');
    expect(workflow).toContain('git/tags/${remote_tag_sha}');
    expect(workflow).toContain('if [ "$remote_tag_type" = tag ]; then');
    expect(workflow).not.toContain("|| 'v0.1.2'");
  });
});
