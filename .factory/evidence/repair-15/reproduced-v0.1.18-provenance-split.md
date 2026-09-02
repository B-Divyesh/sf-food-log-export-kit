# Reproduced release provenance split — 2026-09-02 UTC

From the candidate checkout, after `npm ci`, I ran:

```text
npm run test:unit -- --testNamePattern @claim:candidate-installers
```

The command exited `1` at `tests/unit/published-release.test.ts:69`.
Its immutable `v0.1.18` tag and GitHub Release reported source commit
`ed7b13e93e4ab5c9bbe2c2d17acfec694099fba0`; the live
`release-identity.json` reported
`88a07a940040f719d2ec4fda994bda8814f8428b` for the same version and tag.

This is the verifier's release-blocking condition. `v0.1.18` was not moved or
modified. The repair publishes a new version tag and deploys only the matching
site artifact.
