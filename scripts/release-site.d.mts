export interface ReleaseSiteTarget {
  version: string;
  release_tag: string;
  source_commit: string;
}

export function validateReleaseSiteTarget(input: {
  packageVersion: string;
  tag: string;
  head: string;
  taggedCommit: string;
}): ReleaseSiteTarget;

export function validateBuiltReleaseIdentity(identity: unknown, target: ReleaseSiteTarget): void;

export function collectReleaseSiteTarget(cwd?: string): ReleaseSiteTarget;
