# Independent verification 5 — PASS

Verified 2026-08-29 UTC from a detached clean clone at `bbedc5f06dceba4743771e36c065810372a31f45`.

- Live URL: <https://food-log-export-kit.sociobot.in>
- Result: **PASS — no release-blocking, high, medium, or low product defects found.**
- Acceptance contract: researched brief, work order, `AGENTS.md`, `.factory/brief.json`, `.factory/design.md`, and attached skills.

## Cold first read and demo

**PASS.** A new browser context at the live root answers the required questions in one screen: “Save your food history”; “For calorie tracker users who need years of meals and recipes in files they control”; and **Try it with sample data** followed by “Review 12 sample entries, then download a CSV and JSON archive.” The direct demo URL `/demo` works. The first-screen CTA also works in one click, opening `/?demo=1` with the persistent “Demo — sample data, nothing is saved” banner, Reset demo, Start for real, and the populated export workspace. There were no console or page errors.

## Claims gate — mandatory clean-clone result

`npm ci` was run first in an independent detached clone. Every exact test command listed in the present `.factory/claims.json` was then run independently through its specified demo/test entry point. **All 18 passed**:

`csv-export`, `json-archive`, `local-only`, `format-import`, `explained-drops`, `validation-notes`, `batch-import`, `license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`, `privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`, `detected-platform-downloads`, `verified-installer`, `windows-installer`, and `license-request-data-boundary`.

This covers normal CSV/JSON conversion; comma, semicolon and tab delimiters; invalid files and rows; invalid dates and numeric formats; no-silent-drop notes; free and licensed batch behavior; token restore/revocation; CSV and portable JSON downloads; demo isolation/discard; offline reload; installer selection/checksums; and minimal license-verification data.

## Build and automated quality gates

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 66 packages; audit reported 0 vulnerabilities |
| `npm test` | PASS — 39 passed, 4 intentional desktop-project skips |
| `npm run build` | PASS — TypeScript check and production site build to `dist/site/` |
| `npm run build:app` | PASS — desktop frontend build to `dist/app/` |
| `cargo fmt --check --manifest-path src-tauri/Cargo.toml` | PASS |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — no native/doc tests are defined |
| `cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings` | PASS |
| `CI=false npm run tauri -- build --no-bundle` | PASS — optimized Linux Tauri binary built |
| Native binary smoke | PASS — binary stayed running under Xvfb for the 8-second timeout; only expected headless EGL warnings |

The initial native check was blocked only by absent `glib-2.0` development files in the disposable verifier. I installed the same Linux packages declared by `.github/workflows/release.yml`, then reran and passed all native gates.

The production site build emitted 16.46 KB gzip JavaScript in total and 6.03 KB gzip CSS; it has no web fonts. This is within the static-product budget.

## Independent live QA

- The fresh candidate build’s deployed entry JavaScript SHA-256 is `617e13588b4b225e241a6488054a4271047cb229b0295b5dc51a3c1c64406346` both locally and live. The CSS SHA-256 is also identical: `a93ad6ea0a2565f365cba412bac4108cd9030ec24fc418cbafd71d9028caf71f`. The live deployment therefore matches this candidate’s shipped UI code.
- Desktop and 390 × 844 live `/demo` checks passed: no horizontal overflow, no console/page errors, 12 sample records, both downloads working, and a designed 3 px amber keyboard-focus outline after Tab.
- Fresh axe-core scans at desktop and 390 px found **zero serious or critical violations**. The page has `lang=en`, a route title, one `h1`, and a `main`. Reduced-motion emulation reduces the entrance animation to 0.01 ms while retaining visible focus after the transition settles.
- Direct live demo conversion requested only document, JavaScript, and CSS from the product origin. Cold landing additionally makes the documented GitHub release API lookup. There are no third-party scripts, remote fonts, analytics, or tracker requests. No sign-in exists; Entra validation is not applicable.
- Response headers on `/`, `/demo`, and hashed JS include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive permissions policy, and a CSP allowing only self plus documented GitHub/Sociobot endpoints. HTML revalidates after 30 seconds; hashed JS is one-year immutable.
- The product’s only server-side dependency, Sociobot license verification, was rate tested with a single cookie-backed client using a harmless invalid token. Requests 1–30 returned 200; request 31 returned **429** with `Retry-After: 3` and `X-RateLimit-After: 3`. Observed allowance: **30 requests per client window**.

## Desktop release

GitHub release `v0.1.2` contains Linux AppImage/DEB/RPM, Windows MSI/EXE, Intel and Apple Silicon macOS DMGs/app archives, `SHA256SUMS`, and `latest.json`. I downloaded `Food.Log.Export.Kit_0.1.2_amd64.deb`; its published SHA-256 verification passed. It identifies as the expected `food-log-export-kit` 0.1.2 AMD64 package and contains `/usr/bin/food-log-export-kit`.

## Notes

No repair is required. The repository does not contain a `verify-url.sh`; I performed its required live equivalents directly (title/lang/main/alt coverage through the browser suite and fresh live page, console/page errors, header inspection, and axe).
