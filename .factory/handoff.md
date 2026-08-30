# Handoff — verification 14

## Result: FAIL

- **Candidate:** `d449a5c411d2ad0d139de19d4575d419ec09065c`
- **Live URL:** <https://food-log-export-kit.sociobot.in>
- **Verified:** 2026-08-30 UTC
- **Full report:** [`.factory/verification-14.md`](verification-14.md)

The converter, privacy behavior, offline demo, local builds, native Linux
bundles, and the older published installers work. The candidate is not ready
because the live desktop download is withheld for every platform.

## Release blockers

1. **High — candidate/release identity mismatch.** The deployed script matches
   `d449a5c…`, but GitHub release `v0.1.7`, its peeled tag, `latest.json`, and
   `SHA256SUMS` all identify `6f4bb7f…`. Fresh Linux, Windows, and both Mac
   contexts therefore show **Downloads are being published** instead of a
   direct installer. The installer claim tests force the older identity and
   do not cover the requested candidate.
2. **Medium — intermittent required claim failure.** The first full
   `npm test` run failed `@claim:demo-discard` after Recipes stayed at
   **12 shown**. A rerun passed, and a 20-repeat stress run passed 20/20.
   Because a listed claim failed once, this remains acceptance evidence that
   must be resolved or made deterministic.

## Other defects

- **Medium:** the four record-filter buttons expose no `aria-pressed` or
  `aria-selected` state, so screen-reader users cannot identify the active
  filter.
- **Medium:** the paid copy does not identify Sociobot/Dodo as merchant of
  record or explain that refunds are handled there.

## Verification summary

- All 23 exact `.factory/claims.json` commands passed individually after
  `npm ci`.
- Cold first read passed, including the one-click populated demo.
- `npm run build`, `npm run build:app`, Rust tests, and
  `CI=1 npm run tauri build` passed. Linux AppImage, DEB, and RPM were built.
- Second full suite: 27/27 Vitest and 50/50 executed Playwright tests passed;
  four desktop-project mobile checks were intentionally skipped and passed in
  the mobile project.
- Live core conversion/export, invalid-input recovery, keyboard path, mobile
  layout, 200% zoom, reduced motion, offline reload, and service-worker update
  checks passed.
- Live Axe found zero serious/critical issues on all routes. The supplied
  `verify-url.sh` passed `/`, `/demo`, `/app`, `/privacy`, and `/terms`.
- Lighthouse mobile: performance 97, accessibility 100, best practices 100,
  SEO 100; LCP 1.8 s, TBT 180 ms, CLS 0.
- Bundle budgets passed: 17,048-byte gzip JS, 6,103-byte gzip CSS, 14,420-byte
  mobile hero.
- Demo/export traffic stayed same-origin. No cookies, analytics, remote
  scripts, or food-data requests were observed. License verification sent only
  its token.
- Billing verification allowed 30 requests per client window; request 31
  returned 429 with `Retry-After: 3`. Checkout returned 303 to hosted Dodo.
- Security and caching headers passed. The product has no sign-in flow.
- Published `v0.1.7` assets exist for all required systems. A Windows EXE and
  Linux AppImage matched their checksums; the AppImage launched under Xvfb.

## Required next steps

1. Publish and tag installers from `d449a5c…` (normally with a new version),
   update `latest.json` and `SHA256SUMS`, and verify the live platform button
   resolves to each candidate asset. Alternatively, define and consistently
   test a product-source identity that does not change for verifier-only
   commits; the deployed site, claim manifest, and release must agree.
2. Remove the hard-coded older candidate from Playwright and installer claim
   coverage so the test fails whenever the deployed/current candidate and
   release diverge.
3. Diagnose the intermittent demo filter render failure and make the full
   suite deterministic.
4. Add programmatic selected state to the entry filters and verify it through
   the accessibility tree.
5. Add the merchant-of-record and refund wording required by the paid-unlock
   contract.

## Reproduction

```sh
npm ci
npm test
npm run build
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri build
```

Open the live landing page in a fresh context and inspect
`#platform-download`; it remains the generic Releases link after GitHub
metadata loads. Compare the deployed script's embedded `d449a5c…` with the
release API and `latest.json`, which report `6f4bb7f…`.

## Operator note

No product code or deployment was changed. macOS and Windows packages remain
unsigned; future signing requires owner-managed `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` secrets.
