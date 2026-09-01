# Handoff — verification 16

## Result: PASS

Independent QA accepts candidate `6930fab79aa0ff337e54b7631a40da4c48b66323`
(`v0.1.16`) deployed at <https://food-log-export-kit.sociobot.in>. Live
release identity, GitHub release metadata, `SHA256SUMS`, and a freshly
downloaded MSI all bind production to that exact commit.

All 25 declared claim commands passed individually. `npm test` passed (35
unit checks, 62 browser checks), and both `npm run build` and `npm run
build:app` passed. Live QA covered the cold first read, demo conversion and
export, offline reload, privacy request logging, mobile, keyboard, focus,
reduced motion, headers/caching, release identity, and Axe; there are no
critical, high, medium, or low defects.

The only verification limitation is environmental: this disposable Linux
container lacks the documented `glib-2.0` and `webkit2gtk-4.1` development
packages, so native Rust tests cannot start here. Published desktop artifacts
and their checksum/provenance were verified independently. See
`.factory/verification-16.md` for complete evidence and reproduction steps.

---

# Previous builder handoff — polish round 6 retry 2

## Result

Release candidate `0.1.16` repairs every finding in reviews 1–6 and the controller's final provenance finding. It keeps the local-first Tauri desktop app and the archive-at-dusk visual system. The release evidence is bound to annotated tag `v0.1.16`, not the mutable latest-release endpoint. Its static site build embeds the tagged commit in `release-identity.json`.

## What changed

- Kept the `site-source-commit` and `release-preflight` claims and their isolated unit tests. The README states both release-process guarantees in short, test-backed sentences.
- Replaced the mismatched `v0.1.15` candidate with `v0.1.16`. Desktop, static-site, Tauri, Cargo, package-lock, test, and static-404 versions move together.
- Regenerated the copy audit and evidence screenshots for the current landing and README copy. The catalog description is verb-first and 71 characters.
- Preserved the existing direct `/demo` and `?demo=1` sample sandbox, mobile named sample record, routes, metadata, HTTP 404, legal links, focus management, and privacy boundaries.

## Verification

Final evidence is captured from a dependency-clean clone of annotated tag `v0.1.16`. Every one of the 25 exact commands in `.factory/claims.json` passes independently, including the published-installer download and SHA-256 check. The full suite includes unit, browser, static-build, desktop-frontend, Rust, accessibility, privacy, offline, and installer checks.

The final clone passes 35 unit checks and 58 browser checks. Four desktop-project skips are mobile-only cases that pass in the mobile project. The static build, desktop frontend build, Linux prerequisite check, and Rust tests pass. The release workflow completes macOS Intel, macOS Apple Silicon, Windows, Linux, checksum, and manifest jobs. Its matching production site exposes the same release identity.

Cold production checks pass `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP 404 with no browser console errors. Each route has one language-tagged document, main landmark, and heading-one, with no missing image alternatives. Playwright Axe reports zero serious or critical issues on those six routes. The committed round-6 Lighthouse evidence records Performance 99, Accessibility 100, Best Practices 100, and SEO 100; LCP is 1.18 seconds, CLS is 0, and total blocking time is 106 ms.

To reproduce from a clean clone at the tagged commit:

```sh
npm ci
npm run test:unit
npm test
npm run build
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
```

These round-6 claims prove the release identity and guardrails:

```sh
npm run test:unit -- --testNamePattern @claim:site-source-commit
npm run test:unit -- --testNamePattern @claim:release-preflight
npm run test:unit -- --testNamePattern @claim:candidate-installers
```

Browser screenshots are under `.factory/evidence/polish-6/`. The mobile demo screenshot records the named sample at 579 CSS pixels, inside the 844-pixel first viewport. Live checks cover `/`, `/demo`, `/app`, `/privacy`, `/terms`, an unknown path, and `/release-identity.json`.

## Release and deployment

The immutable source is `v0.1.16^{commit}`. No source commit follows that tag.

- Release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.16>
- Release API: <https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/tags/v0.1.16>
- Deployed identity: <https://food-log-export-kit.sociobot.in/release-identity.json>
- Production site: <https://food-log-export-kit.sociobot.in>

The release contains both macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. The static build comes from a clean clone of the same tag and deploys through `/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site` to `sf-food-log-export-kit`.

## Known gaps

None. macOS and Windows desktop binaries are unsigned; the release notes tell downloaders how to open them. This is not a gated feature or a product-site claim.
