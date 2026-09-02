# Reproduced v0.1.19 release provenance split — 2026-09-02 UTC

From verifier commit `bd59d3d7dab2480d6ce63d84d60d3ed715919864`, after
`npm ci`, I ran:

```text
npm run test:unit -- --testNamePattern @claim:candidate-installers
```

The command exited `1` at `tests/unit/published-release.test.ts:78`.
The immutable `v0.1.19` tag and GitHub release name source commit
`f80b939cbff20abb945b1d3a01a125351a226c55`. The live
`release-identity.json` instead named candidate
`15674b0dfe8a26931f8d64c51b44d23859728e77` for version `0.1.19`.

The exact fixture-level regressions are
`@regression:verification-19` in `tests/unit/release-site.test.ts` and
`tests/unit/release.test.ts`. They require this split to be rejected before a
site can expose the mismatched installers. The live
`@claim:candidate-installers` test remains the release gate for the complete
tag, release, manifest, checksums, installer, and deployment chain.
