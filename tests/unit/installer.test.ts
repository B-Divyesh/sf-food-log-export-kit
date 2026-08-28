import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const installer = resolve('public/install.sh');

function sha256(path: string): string {
  return execFileSync('sha256sum', [path], { encoding: 'utf8' }).split(/\s+/)[0];
}

describe('Unix installer regression', () => {
  it('@claim:verified-installer parses spaced GitHub JSON, selects Linux and both Mac architectures, verifies, and installs a PATH launcher', () => {
    const root = mkdtempSync(join(tmpdir(), 'food-log-installer-test-'));
    const fakeBin = join(root, 'fake-bin');
    const assets = join(root, 'assets');
    mkdirSync(fakeBin);
    mkdirSync(assets);

    const linuxName = 'Food.Log.Export.Kit_0.1.2_amd64.AppImage';
    const armName = 'Food.Log.Export.Kit_aarch64.app.tar.gz';
    const intelName = 'Food.Log.Export.Kit_x64.app.tar.gz';
    const linuxAsset = join(assets, linuxName);
    writeFileSync(linuxAsset, '#!/bin/sh\necho food-log-export-kit\n');
    chmodSync(linuxAsset, 0o755);

    for (const [archiveName, marker] of [[armName, 'arm64'], [intelName, 'x64']] as const) {
      const staging = join(root, marker);
      const executable = join(staging, 'Food Log Export Kit.app', 'Contents', 'MacOS');
      mkdirSync(executable, { recursive: true });
      writeFileSync(join(executable, 'food-log-export-kit'), `#!/bin/sh\necho ${marker}\n`);
      chmodSync(join(executable, 'food-log-export-kit'), 0o755);
      execFileSync('tar', ['-czf', join(assets, archiveName), '-C', staging, 'Food Log Export Kit.app']);
    }

    const sums = [linuxName, armName, intelName]
      .map((name) => `${sha256(join(assets, name))}  ${name}`)
      .join('\n');
    const sumsPath = join(assets, 'SHA256SUMS');
    writeFileSync(sumsPath, `${sums}\n`);
    const releasePath = join(root, 'release.json');
    writeFileSync(releasePath, JSON.stringify({
      assets: [linuxName, armName, intelName, 'SHA256SUMS'].map((name) => ({
        name,
        browser_download_url: `https://downloads.test/${name}`
      }))
    }, null, 2));

    const curl = join(fakeBin, 'curl');
    writeFileSync(curl, `#!/bin/sh
set -eu
url=''
out=''
while [ "$#" -gt 0 ]; do
  case "$1" in
    -o) out="$2"; shift 2 ;;
    -*) shift ;;
    *) url="$1"; shift ;;
  esac
done
case "$url" in
  mock://release) source="$MOCK_RELEASE" ;;
  */SHA256SUMS) source="$MOCK_ASSETS/SHA256SUMS" ;;
  *) source="$MOCK_ASSETS/\${url##*/}" ;;
esac
if [ -n "$out" ]; then cp "$source" "$out"; else exec /bin/cat "$source"; fi
`);
    chmodSync(curl, 0o755);

    const uname = join(fakeBin, 'uname');
    writeFileSync(uname, '#!/bin/sh\ncase "$1" in -s) echo "$MOCK_OS" ;; -m) echo "$MOCK_ARCH" ;; *) echo "$MOCK_OS" ;; esac\n');
    chmodSync(uname, 0o755);

    const cases = [
      { os: 'Linux', arch: 'x86_64', expected: linuxName, target: 'linux-bin' },
      { os: 'Darwin', arch: 'arm64', expected: armName, target: 'arm-bin' },
      { os: 'Darwin', arch: 'x86_64', expected: intelName, target: 'intel-bin' }
    ];
    for (const item of cases) {
      const installDir = join(root, item.target);
      const appDir = join(root, `${item.target}-apps`);
      mkdirSync(installDir);
      const output = execFileSync('sh', [installer], {
        encoding: 'utf8',
        env: {
          ...process.env,
          PATH: `${fakeBin}:${installDir}:/usr/bin:/bin`,
          FOOD_LOG_RELEASE_API_URL: 'mock://release',
          FOOD_LOG_INSTALL_DIR: installDir,
          FOOD_LOG_APP_DIR: appDir,
          MOCK_RELEASE: releasePath,
          MOCK_ASSETS: assets,
          MOCK_OS: item.os,
          MOCK_ARCH: item.arch
        }
      });
      const launcher = join(installDir, 'food-log-export-kit');
      expect(output).toContain(`Installed and verified ${item.expected}.`);
      expect(output).toContain(`Launcher: ${launcher}`);
      expect(existsSync(launcher)).toBe(true);
      expect(execFileSync(launcher, { encoding: 'utf8' }).trim()).toMatch(/food-log-export-kit|arm64|x64/);
    }
  });

  it('prefers the verified Windows MSI and starts it from a stable install directory', () => {
    const script = readFileSync(resolve('public/install.ps1'), 'utf8');
    expect(script).toContain("_x64_en-US\\.msi$");
    expect(script).toContain('Get-FileHash');
    expect(script).toContain('Start-Process -FilePath $target');
    expect(script).not.toContain('Join-Path (Get-Location)');
  });
});
