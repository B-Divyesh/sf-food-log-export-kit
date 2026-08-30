# Handoff — repair 6

## Result

**READY TO DEPLOY.** This repair closes both release-blocking findings from
independent verification 10 for candidate
`2ecd8f5f15f4b8fd15d3138c32bd5e9e6df06801`. The product remains a Tauri 2
desktop app with its static companion site and local-first import/export flow.

## Repairs

1. **F-10-1 — installed PWA update path.** `public/sw.js` now has a new
   `food-log-export-kit-v6` cache, so browsers controlled by the prior v5
   worker receive a byte-different worker and activate it immediately.
   Navigations are now network-first with `cache: 'reload'`; an online reload
   revalidates the application shell instead of indefinitely serving a stale
   cached HTML document. Offline navigation still falls back to the matching
   cached route or shell. Hashed assets remain cache-first.
2. **F-10-1 regression.**
   `@regression:pwa-update replaces a controlled v5 worker and stale
   navigation shell` starts a fresh browser context with a v5 fixture worker,
   confirms its stale `Version 0.1.5` document is controlling the page, removes
   the fixture, runs `registration.update()`, waits for `controllerchange`,
   requires v6 with v5 removed, then reloads into the current `Save your food
   history` page. This is the persistent-profile upgrade that previously
   failed.
3. **F-10-2 — README claim inventory.** The README now says the hosting
   configuration *defines* reload routes, security headers, cache rules, and
   the 404 response. `static-hosting` is registered in
   `.factory/claims.json`, with exactly one
   `@claim:static-hosting` test. The test asserts the four explicit route
   rewrites, immutable static-asset rules, CSP/nosniff/referrer/permissions
   headers, and static 404 rewrite.

## Verification

- Clean dependencies: `npm ci` completed; `npm audit --audit-level=high`
  reported zero vulnerabilities.
- `npm test`: 23/23 Vitest tests passed; 49 applicable Playwright tests
  passed. The four desktop-project mobile-only skips have their corresponding
  390 px mobile runs.
- Every one of the 21 commands declared in `.factory/claims.json` passed
  independently. A manifest check confirmed every claim ID has exactly one
  tagged test.
- `npm run build` and `npm run build:app` passed and produced `dist/site/`
  and `dist/app/`. Initial JS is 49.10 kB raw / 16.93 kB gzip across four
  chunks; CSS is 23.48 kB raw / 6.10 kB gzip. The built worker SHA-256 is
  `1e9a528a71ac4a8d877d706671514bc3adfa2f9f8be4a3165253b3d34400c0f0`.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`,
  `cargo test --locked --manifest-path src-tauri/Cargo.toml`, and
  `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings`
  passed after installing the release-equivalent GTK/WebKit libraries in this
  disposable worker.
- `CI=false npm run tauri -- build --no-bundle` produced the Linux release
  executable at `src-tauri/target/release/food-log-export-kit` (13 MB ELF).
  It remained running for ten seconds under Xvfb. The direct headless GTK
  invocation cannot initialize a display, as expected for a GUI executable.
- `/opt/fleet/lib/verify-url.sh` passed locally on `/`, `/demo`, `/app`,
  `/privacy`, and `/terms`: each had 200, a title, `lang=en`, one `<h1>`, one
  `<main>`, image alt text, and zero page/console errors. The existing
  Playwright AxeBuilder suite passed with zero serious/critical violations on
  those routes plus the designed 404, desktop keyboard flow, reduced motion,
  and 390 px touch/overflow/200% checks. The standalone axe CLI could not
  locate a system Chrome binary in this worker; Playwright's installed Chromium
  is the browser used by the passing AxeBuilder integration.

## Deployment

Deployed to <https://food-log-export-kit.sociobot.in> on 2026-08-30 UTC with
`/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site` from repair
commit `d1d6b68a78fef91b139e82dc7896deae9da0e470`.

- Live `/sw.js` SHA-256 is
  `1e9a528a71ac4a8d877d706671514bc3adfa2f9f8be4a3165253b3d34400c0f0`,
  exactly matching `dist/site/sw.js`; it declares v6 and has the required
  30-second revalidation response policy.
- A live persistent Chromium context was first controlled by a v5 fixture,
  then updated against the deployed worker. It received `controllerchange`,
  removed v5, activated v6, and reloaded the current `Save your food history`
  page.
- `/opt/fleet/lib/verify-url.sh` passed live on the five supported routes.
  Live desktop and 390 px AxeBuilder scans found zero serious/critical issues
  and zero console/page errors. The live demo made no cross-origin requests
  during CSV export, then reopened offline with its named sample and offline
  status.
- Live `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200; the designed
  unknown route returns HTTP 404. Live headers include CSP
  `frame-ancestors 'none'`, HSTS, nosniff, strict-origin referrer policy, and
  denied camera/microphone/geolocation.

## Known gaps

No product behavior is intentionally deferred. Existing macOS and Windows
desktop binaries remain intentionally unsigned; that is unchanged from the
candidate and does not affect the static worker repair.

## Needs operator action

For signed desktop releases, provide `APPLE_CERTIFICATE` for macOS signing and
`WINDOWS_CERT_PFX` for Windows Authenticode signing. Current release artifacts
are intentionally unsigned.
