import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const run = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

/**
 * Keep the release identity rules testable without having to create tags or
 * connect to a remote from the unit suite.
 */
export function validateReleaseState(state) {
  const problems = [];
  if (state.status) problems.push('commit or stash every change before creating a release tag');
  if (state.branch !== 'main') problems.push(`release checkout must be on main, found ${state.branch || 'detached HEAD'}`);
  if (state.remoteHead && state.head !== state.remoteHead) problems.push('origin/main must equal HEAD before creating a release tag');
  if (state.tagExists) problems.push(`${state.tag} already exists; bump the version instead of retagging a published release`);
  if (state.packageVersion !== state.tauriVersion || state.packageVersion !== state.cargoVersion || state.packageVersion !== state.buildVersion) {
    problems.push('package, Tauri, Cargo, and site build versions must match');
  }
  if (state.tag !== `v${state.packageVersion}`) problems.push('release tag must equal v plus the package version');
  if (problems.length) throw new Error(`Release preflight failed:\n- ${problems.join('\n- ')}`);
}

function versionFromCargo(source) {
  return source.match(/^version = "([^"]+)"$/m)?.[1] ?? '';
}

function versionFromBuild(source) {
  return source.match(/appVersion = '([^']+)'/)?.[1] ?? '';
}

export function collectReleaseState(cwd = process.cwd(), { checkRemote = true } = {}) {
  const packageVersion = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
  const tag = `v${packageVersion}`;
  const state = {
    status: run(['status', '--porcelain', '--untracked-files=all'], cwd),
    branch: run(['branch', '--show-current'], cwd),
    head: run(['rev-parse', 'HEAD'], cwd),
    remoteHead: '',
    tagExists: false,
    tag,
    packageVersion,
    tauriVersion: JSON.parse(readFileSync(new URL('../src-tauri/tauri.conf.json', import.meta.url), 'utf8')).version,
    cargoVersion: versionFromCargo(readFileSync(new URL('../src-tauri/Cargo.toml', import.meta.url), 'utf8')),
    buildVersion: versionFromBuild(readFileSync(new URL('../src/build.ts', import.meta.url), 'utf8'))
  };

  try {
    run(['show-ref', '--verify', '--quiet', `refs/tags/${tag}`], cwd);
    state.tagExists = true;
  } catch {
    // A new version has no local tag.
  }

  if (checkRemote) {
    run(['fetch', 'origin', 'main:refs/remotes/origin/main', '--quiet'], cwd);
    state.remoteHead = run(['rev-parse', 'origin/main'], cwd);
    try {
      run(['ls-remote', '--exit-code', '--tags', 'origin', `refs/tags/${tag}`], cwd);
      state.tagExists = true;
    } catch {
      // The remote has no tag for this new version.
    }
  }
  return state;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const skipRemote = process.argv.slice(2).includes('--skip-remote');
  const state = collectReleaseState(process.cwd(), { checkRemote: !skipRemote });
  validateReleaseState(state);
  console.log(`Release preflight passed for ${state.tag} at ${state.head}.`);
}
