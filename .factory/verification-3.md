# Independent verification 3 — FAIL

Verified 2026-08-28 UTC against candidate `7974c2ba2b5688dbab82b1061521b470a0c8ff86` and the live site at <https://food-log-export-kit.sociobot.in>.

## Decision

**FAIL — do not release this candidate.** The product behavior, deployment, installer repair, and declared checks are strong, but the mandatory claims inventory is still incomplete: a public Windows-installer promise has no claim entry and no tagged observable test. The supplied claims contract makes that a release blocker.

## Release-blocking finding

### High — Windows installer promise is absent from `.factory/claims.json`

`README.md` publicly states: “On Windows, this command verifies and starts the MSI installer.” `public/install.ps1` repeats that behavior with the messages “Downloaded and verified …” and “Starting the Windows installer …”.

The 17 manifest IDs include `verified-installer`, but that claim explicitly covers **only the Unix installer**: “The Unix installer verifies its download and installs a launcher on PATH for Linux, Apple Silicon, and Intel Mac.” There is no Windows installer claim in `.factory/claims.json` and no test tagged `@claim:<windows-installer-id>`.

`tests/unit/installer.test.ts` has an untagged source-text assertion for the PowerShell script. That is useful regression coverage, but it is not an entry in the mandatory manifest and not the required tagged observable sandbox test. The claim rule requires each visitor-reliant statement to be listed and exercised on every build. Add a Windows installer claim with one tagged test that uses recorded release metadata and a checksummed fake MSI, or remove/narrow the public promise.

## Mandatory first-read and claims gate

**First-read: PASS.** A cold 1440 × 900 live load says “Save your food history,” names “calorie tracker users who need years of meals and recipes in files they control,” and presents “Try it with sample data” first, with the outcome “Review 12 entries, then export both files.” The first screen also gives three short facts: no uploads, no account, and free single-file / $19 batch migration.

One click opened `/demo` with 12 realistic records. Its persistent banner reads “Demo — sample data, nothing is saved” and has **Reset demo** and **Start for real**. At 390 px it had no horizontal overflow and showed both export actions.

**Declared claims: PASS.** After `npm ci --include=dev`, I ran every command in `.factory/claims.json` independently. All 17 passed:

`csv-export`, `json-archive`, `local-only`, `format-import`, `explained-drops`, `validation-notes`, `batch-import`, `license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`, `privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`, `detected-platform-downloads`, and `verified-installer`.

The Unix-installer claim used the revised whitespace-tolerant GitHub JSON parser and covered Linux x64, Apple Silicon, and Intel Mac with checksummed recorded assets and launcher execution.

## Clean build and test evidence

| Check | Result |
| --- | --- |
| `npm ci --include=dev` | PASS — 66 packages; 0 audit vulnerabilities |
| Each of 17 declared claim commands | PASS |
| `npm test` | PASS — 13 unit tests; 38 browser tests; three intentional project skips |
| `npm run build` | PASS — typecheck and deployable `dist/site/` |
| `npm run build:app` | PASS — typecheck and `dist/app/` |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| JavaScript lint | No lint script is configured |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS after installing the standard Linux Tauri/GTK development prerequisites |
| `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings` | PASS after the same prerequisite installation |
| `CI=false npm run tauri -- build --no-bundle` | PASS; optimized Linux binary built |

The site build emits 15.9 KB gzip initial JavaScript, 5.9 KB gzip CSS, no web fonts, and a 14.4 KB mobile hero: within the stated static budgets. Lighthouse CLI could not launch the preinstalled Playwright Chromium directly in this container; browser-measured usability, accessibility, request, and bundle checks below were completed instead.

## Product flows and boundaries

- Normal demo exported `food-log.csv` with its header plus 12 rows, and `food-log-archive.json` with 12 normalized records.
- The declared end-to-end suite exercised comma, semicolon, and tab CSV; raw JSON arrays and all documented JSON list shapes; meal, recipe, nutrition macro, and body-weight records.
- It exercised invalid/missing dates; unreadable, grouped-comma, decimal-comma, European grouping, ambiguous, and negative numbers; named invalid files and unusable rows; successful recovery after clearing/replacing an import; and two-file licensed migration.
- Unlicensed mode permits one selected file while retaining free CSV and JSON export. License restore, a revoked replacement, and checkout redirect behavior passed.
- The live PWA registered `/sw.js`, controlled `/`, completed `registration.update()`, then reloaded `/demo` offline with the sample record and “You are offline” state and no page error.

## Deployment, privacy, headers, and rate limit

- Every locally built public artifact matched the live version byte-for-byte, including HTML, JS, CSS, source maps, artwork, screenshots, service worker, manifest, installer scripts, robots, and sitemap. `staticwebapp.config.json` is intentionally not served by Static Web Apps (live 404); that is deployment configuration rather than a product artifact.
- A direct live `/demo` session through both exports made only same-origin requests: the document, JS, and CSS. A cold landing page additionally requested only the disclosed GitHub release API plus same-origin imagery. There were no console/page errors, analytics, remote fonts, or third-party scripts.
- `/`, `/demo`, `/privacy`, `/terms`, and `/sw.js` return 200 with short revalidation caching; hashed JS is one-year immutable. The intentional unknown route returns HTTP 404.
- Live CSP permits only self plus `api.github.com` and `api.sociobot.in` for the documented uses, and includes response-header `frame-ancestors 'none'`; HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial are present.
- The unauthenticated product license verification endpoint returned 200 for requests 1–30 and `429` with `Retry-After: 1` for requests 31–35. Observed allowance: **30 requests per client window**. Checkout returned HTTP 303 to a Dodo hosted session.

## Accessibility and interaction

- The repository's axe integration found zero serious/critical violations on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the 404 route at desktop and mobile coverage.
- The complete browser suite verified the keyboard path to sample loading and export, visible focus behavior, 44 px mobile targets, 200% scale, reduced-motion behavior, headings, landmarks, title, language, and image alt text.
- Fresh live desktop and 390 px checks found no console/page errors or horizontal overflow. No sign-in exists, so external identity-provider validation is not applicable.

## Desktop release and installer

- Release `v0.1.2` contains Linux AppImage/DEB/RPM, Windows MSI/EXE, macOS arm64/x64 DMGs and app archives, `SHA256SUMS`, and valid `latest.json`. Its release target is `c3f918bd1aea5a6bf765a39112ac7698a37c1349`; the diff to this candidate contains only handoff/graph metadata, while the live web build itself matches this candidate byte-for-byte.
- A fresh live execution of `install.sh`, constrained to a temporary QA directory, selected `Food.Log.Export.Kit_0.1.2_amd64.AppImage`, verified SHA-256 `5de0492cd920c52ef73121e564dbcb5ccea7318baa872000d306cb9a5122ce21`, installed the launcher, and the launcher stayed running under Xvfb until the expected eight-second timeout with no error output.
- PowerShell is not available in this Linux verifier image, so the Windows script could not be executed here. That does not excuse the missing claim-test entry; it is the finding above.

## Required before re-verification

1. Add a separate `windows-installer` (or equivalent) claim to `.factory/claims.json` for the README/installer promise, with exactly one tagged `@claim:` test that observes recorded release metadata, checksum validation, stable target placement, and process launch intent. Then run it from the demo/installer sandbox in CI.
2. Keep the existing Unix claim separate; it must not be broadened to imply untested Windows behavior.
