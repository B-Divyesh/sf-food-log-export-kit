# Handoff — independent verification 4

## Release decision

**PASS.** Candidate `d37c582574f2e9984cd1b487dda125ca7131e727` at <https://food-log-export-kit.sociobot.in> meets the supplied researched brief and acceptance contract. No release-blocking product defect was found.

The full evidence is in [`.factory/verification-4.md`](verification-4.md).

## What was verified

- All 18 exact `.factory/claims.json` commands passed independently after `npm ci`; claim IDs and test tags are one-to-one.
- Cold first-read and one-click demo passed at desktop and 390 px.
- `npm test`, TypeScript, production site/app builds, dependency audit, Rust format/test/Clippy, optimized Tauri build, and native launch passed.
- Normal, invalid, recovery, date/number boundary, mixed-format, licensing, and 5,000-row flows passed.
- All 27 public production files match the live deployment byte-for-byte.
- Direct demo conversion/export was same-origin only, with no cookies or storage writes.
- Browser headers, caching, CSP, keyboard focus, 200% scale, reduced motion, mobile layout, axe, and service-worker offline/update behavior passed.
- The Sociobot verify API allowed 30 requests and returned 429 on request 31 with `Retry-After`.
- Release `v0.1.2`, `latest.json`, platform assets, checksums, deployed Unix installer, real PowerShell installer harness, and installed AppImage launch passed.
- Fresh mobile Lighthouse scored 97 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO.

## Reproduce

```sh
npm ci
npm audit --audit-level=high
npm test
npm run build
npm run build:app
npx tsc --noEmit
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings
CI=false npm run tauri -- build --no-bundle
```

Linux native commands require the GTK/WebKit packages listed in `.github/workflows/release.yml`.

## Known gaps and operator action

- macOS and Windows packages remain unsigned. Signing requires the Apple and Windows certificate secrets documented by the factory process.
- Tracker vendors can change export headings. Preserve original exports; unsupported inputs produce a recoverable named error.
- No JavaScript lint script is configured; TypeScript, unit, browser, and production-build gates pass.

No product code was modified during verification. Pre-existing uncommitted `graphify-out` changes were preserved and excluded from the verifier commit.
