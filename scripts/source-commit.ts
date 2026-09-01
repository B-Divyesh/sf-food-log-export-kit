import { execFileSync } from 'node:child_process';

const COMMIT_PATTERN = /^[0-9a-f]{40}$/;

/** Resolve the native source revision that a site build is allowed to offer. */
export function resolveSourceCommit(
  environment: NodeJS.ProcessEnv = process.env,
  workingDirectory = process.cwd()
): string {
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: workingDirectory,
    encoding: 'utf8'
  }).trim().toLowerCase();
  const supplied = environment.VITE_FOOD_LOG_SOURCE_COMMIT?.trim().toLowerCase();
  const sourceCommit = supplied || head;

  if (!COMMIT_PATTERN.test(sourceCommit)) {
    throw new Error('VITE_FOOD_LOG_SOURCE_COMMIT must be a full 40-character Git commit.');
  }

  if (sourceCommit !== head) {
    throw new Error('VITE_FOOD_LOG_SOURCE_COMMIT must match the checked-out Git commit.');
  }

  return sourceCommit;
}
