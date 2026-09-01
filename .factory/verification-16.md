# Verification 16 — PASS

- **Candidate:** \`6930fab79aa0ff337e54b7631a40da4c48b66323\` (\`v0.1.16\`)
- **Live URL:** <https://food-log-export-kit.sociobot.in>
- **Verified:** 2026-09-01 UTC

**Decision: PASS — accept this deployed desktop-app candidate.**

## Release identity

Fresh live evidence binds the deployment to the candidate. Live
\`/release-identity.json\` reports version \`0.1.16\`, release tag \`v0.1.16\`, and
source commit \`6930fab79aa0ff337e54b7631a40da4c48b66323\`. The GitHub release
API reports that same tag and target commit. It contains macOS Intel and Apple
Silicon DMGs, Windows MSI/EXE, and Linux AppImage/DEB/RPM plus \`latest.json\`
and \`SHA256SUMS\`. A freshly downloaded Windows MSI had SHA-256
\`a3fecf6e3d7a51f0f0363a69ea64fcdf2c275c00d1bd0a2e1d3f2c1ee66e5bbd\`, matching
the published checksum whose source-commit header is the candidate.

## Required claims and first read

\`.factory/claims.json\` is present and contains 25 claims. After \`npm ci\` in
this clean candidate checkout (66 packages added; 0 vulnerabilities reported),
every declared command was run individually and passed:

\`csv-export\`, \`json-archive\`, \`local-only\`, \`format-import\`, \`explained-drops\`,
\`lossy-fields\`, \`validation-notes\`, \`batch-import\`, \`license-restore\`,
\`paid-purchase\`, \`offline-reload\`, \`demo-discard\`, \`privacy-no-account\`,
\`free-behavior\`, \`normalized-types\`, \`revoked-license\`,
\`detected-platform-downloads\`, \`verified-installer\`, \`windows-installer\`,
\`license-request-data-boundary\`, \`static-hosting\`, \`release-workflow\`,
\`candidate-installers\`, \`site-source-commit\`, and \`release-preflight\`.

The cold production first read passes. The first screen says **Save your food
history**, identifies food-tracker users needing years of meals and recipes as
the audience, and has the one-click **Try it with sample data** action. Its
adjacent plain copy says that clicking opens 12 sample entries for CSV and JSON
download.

## Automated and build checks

| Check | Result |
| --- | --- |
| \`npm test\` | Passed: 35 Vitest checks and 62 Playwright checks; \`test-results/.last-run.json\` records \`passed\`. |
| \`npm run build\` | Passed TypeScript and Vite; produced \`dist/site/\`. |
| \`npm run build:app\` | Passed TypeScript and Vite; produced \`dist/app/\`. |
| Type/lint | No separate lint command exists; both production builds run \`tsc --noEmit\`. |
| Native Rust test | Not runnable in this container: \`glib-2.0\` and \`webkit2gtk-4.1\` development prerequisites are absent. \`npm run native:prereqs\` gives the documented package command; \`cargo test --manifest-path src-tauri/Cargo.toml\` stops at missing \`glib-2.0.pc\`. |

The largest initial JavaScript asset is 39.70 kB (14.10 kB gzip) and CSS is
23.48 kB (6.10 kB gzip), within the 200 kB JS and 50 kB CSS budgets.

## Independent live product QA

- Demo at \`/demo\` displayed 12 normalized entries. It exported \`food-log.csv\`
  with its header plus 12 records (13 CRLF lines) and
  \`food-log-archive.json\` with 12 records.
- The demo's conversion/export request log contained only same-origin product
  requests. No account fields, tracking, or food-data upload was observed.
  The landing page separately requests documented GitHub release metadata for
  installer selection.
- After the first visit, the live service worker controlled \`/demo\`. With the
  context offline, reload returned HTTP 200 from cache and retained the 12
  sample entries. The suite also covers service-worker update behavior.
- The full suite exercises supported comma/semicolon/tab CSV and JSON imports,
  meal/recipe/nutrition/weight normalization, malformed and boundary values,
  conversion notes, recovery, free versus licensed batch selection, license
  restoration/revocation, and installer scripts.
- At 390 x 844 the live demo had zero horizontal overflow, exposed the named
  Oatmeal with blueberries sample record, and had no undersized visible link or
  button targets. Keyboard Tab starts at the skip link and showed a solid
  visible focus outline through navigation and all app controls. In
  reduced-motion mode the maximum computed animation/transition duration was
  0.00001 seconds.
- Fresh Axe scans of \`/\`, \`/demo\`, \`/app\`, \`/privacy\`, \`/terms\`, and the real
  HTTP 404 found zero serious or critical issues. Primary routes had one
  \`main\`, one \`h1\`, \`lang="en"\`, correct route titles, and no console/page
  errors. The expected browser resource message for the deliberately HTTP-404
  document was not treated as an application error.

## Deployment security, privacy, and service boundary

Root responses include HSTS, \`X-Content-Type-Options: nosniff\`, a strict
referrer policy, camera/microphone/geolocation denial, and a restrictive CSP.
HTML and \`sw.js\` use short revalidation caching; the hashed JavaScript asset
uses \`public, max-age=31536000, immutable\`. All required routes returned 200;
an unknown route returned a designed 404.

This is a static product. It has no product-owned server endpoint or sign-in;
the documented Sociobot billing verification call is client-side and its claim
test verifies that it sends only the license token. Consequently there is no
product API allowance/429 endpoint to exercise, and Entra External ID is not
applicable.

## Findings

| Severity | Finding |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |
| Informational | Native Linux Rust checks could not compile in this disposable container because the documented GLib/WebKit host packages are absent. Published platform artifacts, their candidate provenance, checksum, site build, and all browser/unit checks passed. |

No product code, deployment, data, secrets, or external service was changed.
The pre-existing \`graphify-out/\` working-tree changes were preserved.

