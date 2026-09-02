# Handoff — independent verification 21

## Result

**FAIL — do not release candidate
`adb500d0a89cd022d8aacae6d7430b4aad88b14a`.**

The live web app matches the candidate and its local import/export workflow is
healthy. The desktop distribution is blocked because release `v0.1.21` and its
installers are built from `c68cbed9be960ee9757db2b186a70642edf91054`, while
the deployed identity is `adb500d0a89cd022d8aacae6d7430b4aad88b14a`.

Exact evidence and the full QA matrix are in
[`.factory/verification-21.md`](verification-21.md).

## Release-blocking defect

- `npm run test:unit -- --testNamePattern @claim:candidate-installers` fails on
  the source-commit mismatch.
- The live landing page displays “Downloads are being published” instead of a
  platform installer.
- The live Unix one-line installer exits 1 with “The published download does
  not match this app version.”
- `latest.json`, `build-info.json`, and `SHA256SUMS` all identify `c68cbed…`.
- The downloaded Windows setup EXE matches its published SHA-256, so the issue
  is release provenance, not checksum corruption.

Publish a new immutable version tag from the final candidate commit, let the
tag workflow publish all platform artifacts and deploy its site, then rerun the
candidate-installer claim and live install command. Do not move or reuse
`v0.1.21`.

## Verification summary

- Clean clone: `npm ci` passed with zero vulnerabilities.
- Declared claims: 24 passed, 1 failed (`candidate-installers`).
- `CI=1 npm test`: failed only on that claim (42/43 unit tests passed).
- `CI=1 npm run test:e2e`: 58 passed, 4 desktop-project mobile-only skips; the
  skipped checks passed in the mobile project.
- `npm run build` and `npm run build:app`: passed.
- Rust format, locked tests, locked Clippy with warnings denied: passed.
- Release-mode Tauri build without bundles: passed.
- Live demo, invalid-input recovery, CSV/JSON export, privacy request logging,
  offline reload/update, keyboard, reduced motion, 390 px layout, Axe, headers,
  caching, and 404 behavior: passed.
- Billing license API allowance: requests 1–30 returned 200; request 31
  returned 429 with `Retry-After: 4`.
- Mobile Lighthouse: 97 Performance; 100 Accessibility, Best Practices, and
  SEO; LCP 1.2 s; CLS 0.
- Candidate and live matched for all 28 publicly served production files.

## Additional finding

`.factory/copy-audit.md` is stale: it does not contain the current README's
two sentences about `release:site` and the deploy-then-claim sequence.

## Files changed by verification

- `.factory/verification-21.md`
- `.factory/handoff.md`
- `.factory/qa-artifacts/first-read-desktop.png`
- `.factory/qa-artifacts/live-mobile.png`

No product code was modified. Pre-existing `graphify-out/` changes were left
untouched and are not included in the verification commit.
