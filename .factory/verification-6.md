# Independent verification 6 — FAIL

**Candidate:** `cc7fb7efdf5ea0795da0347bcd6dca89bae0f9ce`  
**Live URL:** <https://food-log-export-kit.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Result:** **FAIL — release-blocking desktop artifact mismatch**

## First read

Cold landing-page result: it saves food-tracker history as local CSV and JSON files for food-tracker users who need years of meals and recipes in files they control. The first action is the visible **Try it with sample data** link, which says it opens 12 entries and allows CSV/JSON downloads. It passes the plain-words and one-click demo gate.

## Required claims gate

A detached clean clone at the candidate ran `npm ci` before every exact command in `.factory/claims.json`. All 20 returned zero; each ID occurs exactly once in tagged tests.

| Claim IDs | Result |
| --- | --- |
| `csv-export`, `json-archive`, `local-only`, `format-import`, `explained-drops` | PASS |
| `lossy-fields`, `validation-notes`, `batch-import`, `license-restore`, `paid-purchase` | PASS |
| `offline-reload`, `demo-discard`, `privacy-no-account`, `free-behavior`, `normalized-types` | PASS |
| `revoked-license`, `detected-platform-downloads`, `verified-installer`, `windows-installer`, `license-request-data-boundary` | PASS |

Execution log: `/tmp/food-log-claim-status2.8wVZtF` (20 lines, all exit status `0`).

## Local checks

- `npm test`: **PASS** — 16 unit tests; 44 browser tests passed; 4 intentional project skips.
- `npm run build`: **PASS**, writing `dist/site/`.
- `npm run build:app`: **PASS**, writing `dist/app/`.
- Initial JS is 48.52 kB raw total (largest 38.13 kB / 13.51 kB gzip); CSS is 23.39 kB raw / 6.08 kB gzip.
- The browser suite covers normal CSV/JSON conversion, comma/semicolon/tab input, invalid files/rows/dates/numbers, recovery notes, free/licensed batch flow, license restore/revocation, downloads, demo discard, and offline reload.
- `cargo test --manifest-path src-tauri/Cargo.toml` cannot compile in this disposable image because `pkg-config` cannot find the required `glib-2.0` development package. This is a verifier-image prerequisite for Tauri, not a product-code finding; the Linux release workflow installs its Tauri packages.

## Live checks

- Fresh local `index.html`, `assets/index-BDpu97_s.js`, and `assets/index-DFSEALGf.css` SHA-256 values exactly match live responses. The static live deployment matches the candidate.
- Cold `/demo` exported the expected CSV. Its request log was same-origin only, with zero cookies and local-storage keys. Service-worker-controlled offline reload retained the sample and showed **You are offline**.
- Desktop and 390×844 mobile checks passed: no horizontal overflow; sample record fully visible at y=521–616; all controls at least 44 px; keyboard sample-load/export and visible focus passed; reduced-motion maximum duration was 0.00001 seconds.
- Axe serious/critical findings: zero on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and 404. `verify-url.sh` passed with no console/page errors on the five normal routes.
- Headers include HSTS, `nosniff`, strict-origin referrer policy, restrictive CSP with `frame-ancestors 'none'`, and camera/microphone/geolocation denial. HTML/SW revalidate at 30 seconds; hashed assets are immutable for a year.
- The landing page calls the disclosed GitHub release API; demo conversion/export contacts no third party.
- With one cookie-backed client and a harmless invalid token, requests 1–30 to license verification returned HTTP 200; request 31 and later returned HTTP 429 with `Retry-After: 3` (later 2). Observed allowance: **30 requests/client window**. Checkout returned HTTP 303 to a Dodo-hosted session.

## F6-1 — Critical — downloadable desktop app is not this candidate

The public `v0.1.2` release has macOS, Windows, Linux, `latest.json`, and `SHA256SUMS`; downloaded `Food.Log.Export.Kit_0.1.2_amd64.deb` matched its published SHA-256 `c2fcd3c6e2fad0c1612185a4e20d663ebd94dbb966441fa34983fa2ce9c579cc`.

However, `v0.1.2` resolves to `c3f918bd1aea5a6bf765a39112ac7698a37c1349`, not candidate `cc7fb7efdf5ea0795da0347bcd6dca89bae0f9ce`, which has no release tag. The workflow builds installers only from `v*` tags. The diff from `v0.1.2` to this candidate changes app/bundle inputs including `src/importer.ts`, `src/app.ts`, `src/main.ts`, `src/pages.ts`, `src/types.ts`, `public/sw.js`, and `src-tauri/tauri.conf.json`. In particular, the current `lossy-fields` behavior that preserves populated unknown fields under `unmapped_fields` is candidate-only, while the public desktop download remains the old binary under the same 0.1.2 version.

This violates the desktop-app release contract. The live web deployment cannot establish that a customer downloading the desktop app gets the verified candidate. Publish a new version/tag from this commit with fresh platform assets, checksums, and version marker, then verify the downloaded artifact against that tag.

## Conclusion

The static web/PWA deployment, claims, privacy, accessibility, local builds, and backend allowance pass. **Do not accept or ship this candidate as the desktop product until F6-1 is repaired.**

