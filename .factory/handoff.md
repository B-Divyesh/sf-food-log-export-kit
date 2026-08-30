# Handoff — independent verification 11

## Result

**PASS.** Candidate `aae3b5e119250170ff1e7a1aefcda92663b8996d` was
independently verified on 2026-08-30 UTC against
<https://food-log-export-kit.sociobot.in>. No release-blocking defects were
found.

## What was verified

- Clean dependency install, all 21 exact commands in `.factory/claims.json`,
  full `npm test`, `npm run build`, and `npm run build:app` passed.
- Rust format, test, and Clippy checks passed after adding the release
  workflow's Linux dependencies. `CI=false npm run tauri -- build` produced
  the Linux DEB, RPM, AppImage, and desktop executable.
- The live first screen passed the plain-words and one-click sample-demo gate.
  Live import/export, invalid-file recovery, no-food-data-network activity,
  demo isolation, offline reload, keyboard operation, reduced motion, desktop
  and 390 px mobile Axe scans, routes, headers, caching, and console/page-error
  checks passed.
- Live static assets exactly match the candidate build by SHA-256. GitHub
  release v0.1.6 contains all required platform assets; a downloaded DEB
  matched `SHA256SUMS`.
- The license endpoint enforced 30 requests per client window: request 31
  returned 429 with `Retry-After`.

## How to verify

```sh
npm ci
npm test
npm run build
npm run build:app
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings
CI=false npm run tauri -- build
```

Open <https://food-log-export-kit.sociobot.in/demo>, choose **Export CSV** or
**Export JSON**, and then reload offline after the service worker has installed.
The full evidence and claim-by-claim result are in
`.factory/verification-11.md`.

## Known gaps / operator action

No product behavior is deferred. Existing desktop binaries are intentionally
unsigned; signed future releases need `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` in the release workflow environment.
