# Handoff — polish round 6 retry

## Result

Release candidate `0.1.15` repairs every finding in reviews 1–6. It keeps the local-first Tauri desktop app and the archive-at-dusk visual system. The release evidence is bound to the annotated `v0.1.15` tag, not to the mutable latest-release endpoint. Its static site build embeds the tagged commit in `release-identity.json`.

## What changed

- Added the `site-source-commit` and `release-preflight` claims and their isolated unit tests. The README now states both release-process guarantees in short, test-backed sentences.
- Bumped the desktop, static-site, Tauri, Cargo, package-lock, and static-404 version together to `0.1.15`.
- Regenerated the copy audit from current landing and README copy. The catalog description is now verb-first and 59 characters.
- Preserved the existing direct `/demo` and `?demo=1` sample sandbox, mobile named sample record, routes, metadata, HTTP 404, legal links, focus management, and privacy boundaries.

## Verification

Final evidence is captured from a dependency-clean clone of the annotated `v0.1.15` tag. Every one of the 25 exact commands in `.factory/claims.json` passes independently, including the published-installer download and SHA-256 check. The full suite includes the unit, browser, static-build, desktop-frontend, Rust, accessibility, privacy, offline, and installer checks.

The final clone also passed the static build, desktop frontend build, Linux prerequisite check, and Rust tests. The release workflow completed its macOS (Intel and Apple Silicon), Windows, Linux, checksum, and manifest jobs. Its matching production site exposes the same release identity.

Cold production checks passed `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP 404 with no browser console errors, one language-tagged document, one main landmark, one heading-one, and no missing image alt text. Live Playwright Axe found zero serious or critical issues on those six routes. The mobile Lighthouse run scored Performance 99, Accessibility 100, Best Practices 100, and SEO 100; LCP was 1.18 s, CLS 0, and total blocking time 106 ms.

To reproduce from a clean clone at the tagged commit:

```sh
npm ci
npm run test:unit
npm test
npm run build
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
```

In particular, these round-6 claims prove the release identity and guardrails:

```sh
npm run test:unit -- --testNamePattern @claim:site-source-commit
npm run test:unit -- --testNamePattern @claim:release-preflight
npm run test:unit -- --testNamePattern @claim:candidate-installers
```

Browser screenshots are recorded under `.factory/evidence/polish-6/`. The live verifier evidence covers `/`, `/demo`, `/app`, `/privacy`, `/terms`, and an unknown path; it checks titles, headings, route focus, demo isolation, request boundaries, 404, and accessibility.

## Release and deployment

1. Push the clean `main` candidate and annotated `v0.1.15` tag.
2. Wait for the GitHub Actions desktop release to attach both macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.
3. Run the candidate-installers claim from a clean clone of the tag.
4. Build the site from that same checkout and deploy `dist/site/` to `sf-food-log-export-kit`.
5. Cold-open the live URL and rerun the browser/a11y checks.

## Known gaps

None. macOS and Windows desktop binaries are unsigned; the release notes tell downloaders how to open them. This is not a gated feature and is not claimed on the product site.
