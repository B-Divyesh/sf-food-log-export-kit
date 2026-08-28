# Handoff — independent verification 2

## Release decision

**FAIL — do not release candidate `439bb2419fe5f767fe3d9f0a18b272ba03ddf284`.**

Tested on 2026-08-28 against `https://food-log-export-kit.sociobot.in`. The live web build matches the candidate byte-for-byte. Full evidence is in [`.factory/verification-2.md`](verification-2.md).

## Release blockers

1. **High: `install.sh` is broken.** Fresh execution exits with “Desktop downloads are still being published” although v0.1.1 assets exist. Its `sed` parser does not accept the whitespace in GitHub's JSON. It also does not install to `PATH`, and it does not distinguish Intel from Apple Silicon when selecting a macOS DMG.
2. **High: `.factory/claims.json` is incomplete.** Public promises about demo storage/discard, no analytics, no account, unlicensed/free behavior, supported normalized record types, and detected-platform downloads do not each have the required tagged observable test.

## What passed

- First-read and one-click demo gates.
- All ten declared claim commands.
- `npm test`: 10 unit and 25 browser tests passed; 2 expected project skips.
- TypeScript and exact site/app production builds.
- Rust formatting, native/doc tests, strict Clippy, optimized Tauri build, and native launch smoke tests.
- Live conversion/export, invalid-input recovery, mixed-file notes, token replacement, checkout redirect, and a 5,000-row import.
- Privacy request logging, security/caching headers, exact live/candidate asset hashes, and API rate limiting (30 allowed; request 31 returned 429 with `Retry-After: 1`).
- Desktop and 390 px mobile axe, keyboard, focus, touch targets, overflow, 200% zoom, and reduced-motion checks.
- PWA update/offline reload and Chromium installability checks.
- Mobile Lighthouse: 97 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 190 ms.
- Release matrix presence and a fresh Linux DEB checksum/launch smoke test.

## Reproduce

```sh
git checkout 439bb2419fe5f767fe3d9f0a18b272ba03ddf284
npm ci
npm test
npm run build
npm run build:app
npm audit --audit-level=high
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings
CI=false npm run tauri -- build --no-bundle
```

Installer failure:

```sh
tmpdir=$(mktemp -d)
cd "$tmpdir"
curl -fsSL https://food-log-export-kit.sociobot.in/install.sh | sh
# Desktop downloads are still being published. (exit 1)
```

## Known gaps and next steps

- Repair and test both architecture selection and installation behavior in `install.sh`; verify the Windows script on Windows.
- Complete the claims inventory and add the missing tagged tests before another verification pass.
- macOS and Windows packages remain unsigned and require the signing secrets documented in the prior builder handoff/history.

No product code was changed during verification.
