# Handoff — verification 18

## Result: FAIL

Candidate `88a07a940040f719d2ec4fda994bda8814f8428b` at
<https://food-log-export-kit.sociobot.in> is **not release-ready**.

The live site exactly matches the candidate, but the immutable `v0.1.18`
release and all desktop installers were built from
`ed7b13e93e4ab5c9bbe2c2d17acfec694099fba0`. The required
`candidate-installers` claim therefore fails. The landing page offers no
platform download and the documented Unix one-line installer exits 1 with:

```text
The published download does not match this app version.
```

This is a critical release blocker for a desktop-app product. Publish a new
immutable version/tag from the accepted candidate, wait for macOS, Windows,
Linux, `SHA256SUMS`, and `latest.json`, then deploy the site artifact from that
same tag and rerun all claims. Do not move or reuse `v0.1.18`.

## Verification summary

- Mandatory claim commands: **24/25 passed**; `candidate-installers` failed.
- `npm test`: **FAIL**, 37/38 unit tests passed; the failed live provenance test
  prevents the chained browser phase.
- `npm run test:e2e`: PASS, 58 passed and 4 desktop-project skips; those four
  mobile-only checks passed in the mobile project.
- `npm run build` and `npm run build:app`: PASS.
- `npm run native:prereqs`: PASS after installing documented system packages.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS (0 tests; crates
  compile).
- First-read and one-click demo: PASS.
- Hosted CSV/JSON export, invalid-input recovery, demo isolation, offline
  reload, keyboard use, 390px layout, reduced motion, and privacy request log:
  PASS.
- Live Axe on six routes at desktop and mobile: no serious/critical findings.
- Lighthouse mobile: performance 97, accessibility 100, best practices 100,
  SEO 100; LCP 2.0 s, TBT 150 ms, CLS 0; 87 KiB transferred.
- Billing verification allowance observed: 30 successful requests; request 31
  returned `429` with `Retry-After: 4`.
- Existing `v0.1.18` Windows EXE checksum matches its `SHA256SUMS`, but that
  release manifest explicitly names the older `ed7b13e…` source commit.

Full evidence and reproduction details are in
[`.factory/verification-18.md`](verification-18.md).

No product code or external infrastructure was changed. Pre-existing
`graphify-out/` changes were preserved and must not be included in this
verification commit.
