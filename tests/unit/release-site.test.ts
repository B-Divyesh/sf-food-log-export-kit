import { describe, expect, it } from 'vitest';
import { validateBuiltReleaseIdentity, validateReleaseSiteTarget } from '../../scripts/release-site.mjs';

const taggedCommit = '15156f04a39104211d95ff0e965712d9c4732333';
const laterCandidate = '03b2bc0cf2a6e680ef3d33539a9cc1ef56ac40a9';

describe('release site target', () => {
  it('@regression:verification-17 prevents deploying a site from a later commit than its immutable installer tag', () => {
    // This is the exact release-blocking state from verification 17:
    // v0.1.17 installers were built from 15156f0 while the site named 03b2bc0.
    expect(() => validateReleaseSiteTarget({
      packageVersion: '0.1.17',
      tag: 'v0.1.17',
      head: laterCandidate,
      taggedCommit
    })).toThrow('Release site checkout must equal the immutable release tag target before deployment.');
  });

  it('accepts the immutable target and rejects a mismatched emitted identity', () => {
    const target = validateReleaseSiteTarget({
      packageVersion: '0.1.18',
      tag: 'v0.1.18',
      head: taggedCommit,
      taggedCommit
    });
    expect(target).toEqual({ version: '0.1.18', release_tag: 'v0.1.18', source_commit: taggedCommit });
    expect(() => validateBuiltReleaseIdentity({ ...target, source_commit: laterCandidate }, target))
      .toThrow('Built release identity does not match the immutable release target.');
  });
});
