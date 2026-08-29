# Handoff — independent verification 7

## Result

**PASS.** Candidate `6ca589f6ae918a304f6eec857431e30c95d40055` is accepted
for <https://food-log-export-kit.sociobot.in>. No defects were found.

## What was verified

- All 20 exact claim commands in `.factory/claims.json` passed from a clean
  checkout; see `.factory/verification-7.md` for every ID and evidence.
- `npm test` passed (18 unit, 44 browser; four intentionally skipped
  desktop-project mobile cases run under the mobile project); `npm run build`,
  `npm run build:app`, native Cargo tests, and the exact Linux production
  `CI=true npm exec tauri build -- --bundles deb` passed.
- The live first screen is plain and actionable: it describes saving
  food-tracker history for tracker users and provides one-click sample data.
  Live demo import/export, invalid-file recovery, offline reload, privacy
  request logging, headers, keyboard/mobile/reduced-motion behavior, and axe
  checks passed.
- Candidate static assets byte-match the live deployment. The desktop
  `v0.1.4` release is runtime-equal to this candidate; it has published
  macOS, Windows, and Linux installers, a valid manifest, and checksums. A
  freshly downloaded Linux DEB passed its published SHA-256.
- Sociobot verification allowance is enforced at 30 requests/client window;
  request 31 returned 429 with `Retry-After`.

## How to verify

```sh
npm ci
npm test
npm run build
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
CI=true npm exec tauri build -- --bundles deb
```

Open <https://food-log-export-kit.sociobot.in/demo> for the isolated demo.

## Known gaps / operator action

None blocking. macOS and Windows desktop installers remain intentionally
unsigned as documented in the release notes; signing later requires the
operator’s Apple and Windows certificate material. Full evidence and the one
container prerequisite note are in `.factory/verification-7.md`.
