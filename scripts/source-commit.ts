import { execFileSync } from 'node:child_process';

const COMMIT_PATTERN = /^[0-9a-f]{40}$/;

/** Resolve the native source revision that a site build is allowed to offer. */
export function resolveSourceCommit(
  environment: NodeJS.ProcessEnv = process.env,
  workingDirectory = process.cwd()
): string {
  const supplied = environment.VITE_FOOD_LOG_SOURCE_COMMIT?.trim().toLowerCase();
  const sourceCommit = supplied || execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: workingDirectory,
    encoding: 'utf8'
  }).trim().toLowerCase();

  if (!COMMIT_PATTERN.test(sourceCommit)) {
    throw new Error('VITE_FOOD_LOG_SOURCE_COMMIT must be a full 40-character Git commit.');
  }

  return sourceCommit;
}
