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

  it('@regression:verification-18 rejects the exact v0.1.18 installer/site provenance split', () => {
    // This is the release-blocking defect independently reproduced before this
    // repair: v0.1.18 installers identified ed7b13e while the live site
    // identified the accepted candidate 88a07a9.
    expect(() => validateReleaseSiteTarget({
      packageVersion: '0.1.18',
      tag: 'v0.1.18',
      head: '88a07a940040f719d2ec4fda994bda8814f8428b',
      taggedCommit: 'ed7b13e93e4ab5c9bbe2c2d17acfec694099fba0'
    })).toThrow('Release site checkout must equal the immutable release tag target before deployment.');
  });

  it('@regression:verification-19 rejects the exact v0.1.19 installer/site provenance split', () => {
    // Verification 19 found the live site naming 15674b0 while its v0.1.19
    // installers remained bound to f80b939. A deployable release site may
    // only be built from the commit named by its immutable version tag.
    expect(() => validateReleaseSiteTarget({
      packageVersion: '0.1.19',
      tag: 'v0.1.19',
      head: '15674b0dfe8a26931f8d64c51b44d23859728e77',
      taggedCommit: 'f80b939cbff20abb945b1d3a01a125351a226c55'
    })).toThrow('Release site checkout must equal the immutable release tag target before deployment.');
  });

  it('accepts the immutable target and rejects a mismatched emitted identity', () => {
    const target = validateReleaseSiteTarget({
      packageVersion: '0.1.20',
      tag: 'v0.1.20',
      head: taggedCommit,
      taggedCommit
    });
    expect(target).toEqual({ version: '0.1.20', release_tag: 'v0.1.20', source_commit: taggedCommit });
    expect(() => validateBuiltReleaseIdentity({ ...target, source_commit: laterCandidate }, target))
      .toThrow('Built release identity does not match the immutable release target.');
  });
});
