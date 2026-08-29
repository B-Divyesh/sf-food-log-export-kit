# Handoff — independent verification 10

## Result

**FAIL.** Candidate `2ecd8f5f15f4b8fd15d3138c32bd5e9e6df06801`
was independently verified against
<https://food-log-export-kit.sociobot.in> on 2026-08-29 UTC.

Core import/export behavior, the first-read demo gate, all 20 declared claims,
builds, privacy checks, accessibility checks, rate limiting, and release assets
passed. Release is blocked by the PWA update path.

## Blocking findings

1. **High — installed clients stay on v0.1.5.** `public/sw.js` is identical in
   v0.1.5 and v0.1.6, both use cache `food-log-export-kit-v5`, and navigations
   are cache-first. A persistent-browser upgrade reproduction remained on the
   v0.1.5 footer and `index-Dza6e8mx.js` after the server moved to v0.1.6 and
   `registration.update()` completed. A clean context saw v0.1.6 and
   `index-0jQjMsY5.js`.
2. **Medium, release-blocking by claims policy — unlisted README claim.** The
   sentence asserting that hosting config provides route reloads, security
   headers, caching, and a 404 response has no `.factory/claims.json` entry and
   no single manifest-named claim test.

Full evidence and remediation guidance are in
[verification-10.md](verification-10.md).

## Verification summary

- Exact clean clone: `/tmp/food-log-verify-10.BkuzPe` at the candidate SHA.
- Every exact `.factory/claims.json` command: PASS (20/20).
- `npm test`: 23 unit tests and 48 applicable browser tests passed; 4
  cross-project skips had passing mobile counterparts.
- `npm run build` and `npm run build:app`: PASS; `dist/site/` and `dist/app/`
  produced.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Rust format, locked tests, and clippy with warnings denied: PASS after adding
  the standard Linux Tauri build dependencies.
- Live candidate identity: all built JS/CSS and critical static-file SHA-256
  hashes match the deployment. The v0.1.6 release source is an ancestor with no
  product-file diff from the candidate.
- Fresh Lighthouse mobile: Performance 96, Accessibility 100, Best Practices
  100, SEO 100; LCP 2.0 s and CLS 0.
- Live axe: 0 serious/critical findings across supported routes at desktop and
  390 px. Keyboard, focus, touch targets, 200% scale, reduced motion, links,
  routes, headers, caching, offline reload, and request logs passed.
- License verifier allowance observed: 30 requests per client window; request
  31 returned 429 with `Retry-After: 3`.
- Published v0.1.6 Linux DEB checksum matched `SHA256SUMS`; all required macOS,
  Windows, and Linux assets are present.

## Required next steps

1. Version the service-worker cache for each release and make navigation
   updates network-first or revalidated. Add an old-release-to-new-release
   browser regression.
2. Add a manifest claim/test for the README hosting assurance, or remove/narrow
   that assurance.
3. Rebuild, deploy, and verify from a browser profile already controlled by the
   v0.1.6 worker as well as a clean profile.

No product code was modified. The pre-existing `graphify-out/` changes remain
untouched. Desktop binaries remain intentionally unsigned and still need the
operator certificates described by the release process.
