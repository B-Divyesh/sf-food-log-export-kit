import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

/** Packages required by the Linux Tauri build in the release workflow. */
export const linuxNativeBuildPackages = Object.freeze([
  'file',
  'pkg-config',
  'libglib2.0-dev',
  'libwebkit2gtk-4.1-dev',
  'libappindicator3-dev',
  'librsvg2-dev',
  'patchelf'
]);

/** Libraries Cargo discovers through pkg-config before it can compile Tauri. */
export const linuxPkgConfigModules = Object.freeze(['glib-2.0', 'webkit2gtk-4.1']);

function pkgConfigHas(moduleName) {
  return spawnSync('pkg-config', ['--exists', moduleName], { stdio: 'ignore' }).status === 0;
}

/**
 * Check the direct Linux libraries before Cargo starts. Injection keeps the
 * regression test independent from the developer machine's installed packages.
 */
export function checkLinuxNativePrerequisites({
  platform = process.platform,
  probe = pkgConfigHas
} = {}) {
  if (platform !== 'linux') return { ready: true, missing: [] };

  const missing = linuxPkgConfigModules.filter((moduleName) => !probe(moduleName));
  return { ready: missing.length === 0, missing };
}

export function linuxNativePrerequisiteMessage(missing) {
  return [
    `Linux desktop build prerequisites are missing: ${missing.join(', ')}.`,
    'Install the documented packages, then run the build again:',
    `sudo apt-get update && sudo apt-get install -y ${linuxNativeBuildPackages.join(' ')}`
  ].join('\n');
}

export function ensureLinuxNativePrerequisites(options = {}) {
  const result = checkLinuxNativePrerequisites(options);
  if (!result.ready) throw new Error(linuxNativePrerequisiteMessage(result.missing));
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = ensureLinuxNativePrerequisites();
    if (process.platform === 'linux') console.log('Linux desktop build prerequisites are available.');
    else console.log('Linux desktop build prerequisites are not needed on this platform.');
    process.exitCode = result.ready ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
