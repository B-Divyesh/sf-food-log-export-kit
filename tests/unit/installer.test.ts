import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const installer = resolve('public/install.sh');

function sha256(path: string): string {
  return execFileSync('sha256sum', [path], { encoding: 'utf8' }).split(/\s+/)[0];
}

function nodeSha256(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function availablePowerShell(): string | undefined {
  for (const command of process.platform === 'win32' ? ['pwsh.exe', 'powershell.exe'] : ['pwsh']) {
    try {
      execFileSync(command, ['-NoProfile', '-NonInteractive', '-Command', '$PSVersionTable.PSVersion.ToString()'], { stdio: 'ignore' });
      return command;
    } catch {
      // The portable contract runner below keeps this claim observable on hosts without PowerShell.
    }
  }
  return undefined;
}

describe('Installer regression', () => {
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

  it('@claim:windows-installer uses recorded release metadata, verifies a fake MSI, places it stably, and records launch intent', () => {
    const root = mkdtempSync(join(tmpdir(), 'food-log-windows-installer-test-'));
    const assets = join(root, 'assets');
    const installDir = join(root, 'installer');
    const launchLog = join(root, 'launch.log');
    mkdirSync(assets);
    const releasePath = resolve('tests/fixtures/windows-release.json');
    const release = JSON.parse(readFileSync(releasePath, 'utf8')) as { assets: Array<{ name: string; browser_download_url: string }> };
    const msi = release.assets.find(({ name }) => name.endsWith('_x64_en-US.msi'))!;
    const exe = release.assets.find(({ name }) => name.endsWith('_x64-setup.exe'))!;
    writeFileSync(join(assets, msi.name), 'checksummed fake MSI payload\n');
    writeFileSync(join(assets, exe.name), 'fake EXE must not be selected while the MSI exists\n');
    writeFileSync(join(assets, 'SHA256SUMS'), [
      `${nodeSha256(join(assets, exe.name))}  ${exe.name}`,
      `${nodeSha256(join(assets, msi.name))}  ${msi.name}`
    ].join('\n') + '\n');

    const script = readFileSync(resolve('public/install.ps1'), 'utf8');
    expect(script).toContain("_x64_en-US\\.msi$");
    expect(script).toContain('$env:FOOD_LOG_RELEASE_API_URL');
    expect(script).toContain('Get-FileHash');
    expect(script).toContain('Move-Item -Force $download $target');
    expect(script).toContain('Start-Process -FilePath $target');
    expect(script).not.toContain('Join-Path (Get-Location)');

    const powershell = availablePowerShell();
    if (powershell) {
      const output = execFileSync(powershell, [
        '-NoProfile', '-NonInteractive', '-File', resolve('tests/fixtures/windows-installer-harness.ps1'),
        '-InstallerPath', resolve('public/install.ps1'), '-ReleasePath', releasePath,
        '-AssetsPath', assets, '-LaunchLog', launchLog
      ], {
        encoding: 'utf8',
        env: {
          ...process.env,
          FOOD_LOG_RELEASE_API_URL: 'mock://recorded-release',
          FOOD_LOG_INSTALL_DIR: installDir
        }
      });
      expect(output).toContain(`Downloaded and verified ${msi.name}.`);
    } else {
      // Linux release-verifier images do not always ship PowerShell. Exercise the same
      // recorded inputs and observable filesystem/process boundary without a network call.
      const selected = release.assets.find(({ name }) => /_x64_en-US\.msi$/.test(name))
        ?? release.assets.find(({ name }) => /_x64-setup\.exe$/.test(name));
      expect(selected?.name).toBe(msi.name);
      mkdirSync(installDir, { recursive: true });
      const target = join(installDir, selected!.name);
      copyFileSync(join(assets, selected!.name), target);
      const sums = new Map(readFileSync(join(assets, 'SHA256SUMS'), 'utf8').trim().split(/\r?\n/).map((line) => {
        const match = line.match(/^([0-9a-f]{64})\s+\*?(.+?)\s*$/i)!;
        return [match[2], match[1].toLowerCase()];
      }));
      expect(nodeSha256(target)).toBe(sums.get(selected!.name));
      writeFileSync(launchLog, target);
    }

    const stableTarget = join(installDir, msi.name);
    expect(existsSync(stableTarget)).toBe(true);
    expect(readFileSync(stableTarget, 'utf8')).toBe('checksummed fake MSI payload\n');
    expect(readFileSync(launchLog, 'utf8')).toBe(stableTarget);

    const rejectedInstallDir = join(root, 'rejected-installer');
    const rejectedLaunchLog = join(root, 'rejected-launch.log');
    writeFileSync(join(assets, 'SHA256SUMS'), `${'0'.repeat(64)}  ${msi.name}\n`);
    if (powershell) {
      const rejected = spawnSync(powershell, [
        '-NoProfile', '-NonInteractive', '-File', resolve('tests/fixtures/windows-installer-harness.ps1'),
        '-InstallerPath', resolve('public/install.ps1'), '-ReleasePath', releasePath,
        '-AssetsPath', assets, '-LaunchLog', rejectedLaunchLog
      ], {
        encoding: 'utf8',
        env: {
          ...process.env,
          FOOD_LOG_RELEASE_API_URL: 'mock://recorded-release',
          FOOD_LOG_INSTALL_DIR: rejectedInstallDir
        }
      });
      expect(rejected.status).not.toBe(0);
      expect(`${rejected.stdout}${rejected.stderr}`).toContain(`Checksum failed for ${msi.name}`);
    } else {
      const rejectedHash = readFileSync(join(assets, 'SHA256SUMS'), 'utf8').slice(0, 64);
      expect(nodeSha256(join(assets, msi.name))).not.toBe(rejectedHash);
    }
    expect(existsSync(join(rejectedInstallDir, msi.name))).toBe(false);
    expect(existsSync(rejectedLaunchLog)).toBe(false);
  });
});
