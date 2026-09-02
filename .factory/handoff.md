# Handoff — adversarial first-read review 7

## Result: FAIL

Review 7 is recorded in `.factory/review-7.md`. No product code was changed.

The live first screen, one-click demo, in-memory isolation, reset and exit
behavior, CSV/JSON exports, offline reload, routes, focus, link crawl,
accessibility suite, visual identity, and production build pass.

One blocking finding remains: **F-7-1 / F-6-1 (reopened)**. The work-order
checkout is `d77bda26e0de6ae1eda101d5fafcac2a1a1b5b66`, but release `v0.1.16`
and the deployed release identity target
`6930fab79aa0ff337e54b7631a40da4c48b66323`. The exact
`candidate-installers` command fails, and the same shared Vitest failure stops
all 18 `npm test -- --grep @claim:…` commands before their browser tests.

## Verification performed

- Opened production cold in fresh 390 px and 1440 px browser contexts.
- Exercised demo entry, sample visibility, filtering, Reset, both downloads,
  Start for real, storage sentinels, request logging, and offline reload.
- Ran all 25 exact `.factory/claims.json` commands from a clean clone: six pass
  and 19 fail because of the release-identity mismatch.
- Ran the 18 browser claim tests directly: all pass.
- Ran the Playwright accessibility suite: 38 pass; four desktop-project skips
  have passing mobile counterparts.
- Ran `npm run build`: pass; largest JS chunk is 39.70 kB raw / 14.10 kB gzip.
- Ran the worker URL verifier: pass with no console or structural errors.

## Next step

Repair the release-provenance contract so its exact command passes from the
checkout given to reviewers. Then rerun all 25 declared commands from a fresh
clone. Do not mark the product accepted until that gate is green.
