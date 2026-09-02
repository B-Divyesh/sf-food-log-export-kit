import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const COMMIT_PATTERN = /^[0-9a-f]{40}$/;

function commit(value, label) {
  const normalized = value.trim().toLowerCase();
  if (!COMMIT_PATTERN.test(normalized)) throw new Error(`${label} must be a full 40-character Git commit.`);
  return normalized;
}

/**
 * A desktop release is one immutable tag. The site that advertises its
 * installers must come from that very tag, not from a later review commit.
 */
export function validateReleaseSiteTarget({ packageVersion, tag, head, taggedCommit }) {
  const expectedTag = `v${packageVersion}`;
  if (tag !== expectedTag) throw new Error(`Release site tag must be ${expectedTag}.`);

  const currentHead = commit(head, 'Checked-out commit');
  const immutableTarget = commit(taggedCommit, 'Release tag target');
  if (currentHead !== immutableTarget) {
    throw new Error('Release site checkout must equal the immutable release tag target before deployment.');
  }

  return { version: packageVersion, release_tag: expectedTag, source_commit: immutableTarget };
}

/** Ensure the emitted public identity cannot drift from the selected target. */
export function validateBuiltReleaseIdentity(identity, target) {
  if (!identity || identity.version !== target.version || identity.release_tag !== target.release_tag || identity.source_commit !== target.source_commit) {
    throw new Error('Built release identity does not match the immutable release target.');
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

export function collectReleaseSiteTarget(cwd = process.cwd()) {
  const packageVersion = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf8')).version;
  const tag = `v${packageVersion}`;
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' });
  const taggedCommit = execFileSync('git', ['rev-parse', `${tag}^{commit}`], { cwd, encoding: 'utf8' });
  return validateReleaseSiteTarget({ packageVersion, tag, head, taggedCommit });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const cwd = process.cwd();
  const target = collectReleaseSiteTarget(cwd);
  process.env.VITE_FOOD_LOG_SOURCE_COMMIT = target.source_commit;
  run('npm', ['run', 'build:site'], cwd);
  const identity = JSON.parse(readFileSync(resolve(cwd, 'dist/site/release-identity.json'), 'utf8'));
  validateBuiltReleaseIdentity(identity, target);
  console.log(`Release site is ready for ${target.release_tag} at ${target.source_commit}.`);
}
