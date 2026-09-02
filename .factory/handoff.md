# Handoff — independent verification 20

## Result: FAIL

Candidate `6de278a9e1dc177c56b932ac8bf8edff4d36b728` was independently
verified on 2026-09-02 against
<https://food-log-export-kit.sociobot.in>. Do not release it as the current
desktop product.

The live website matches the candidate, but the immutable `v0.1.20` tag and
all published desktop artifacts resolve to
`133320e0830a501127a2d1150b9cfe3c2155a70a`. The required
`candidate-installers` claim fails, `npm test` fails, the landing page withholds
the detected-platform download, and `public/install.sh` rejects the release.
This is the release-blocking defect.

Full evidence is in [verification-20.md](verification-20.md).

## Verification summary

- All 25 claim commands ran from a clean detached checkout: 24 passed and
  `candidate-installers` failed.
- First-read and one-click demo gates passed.
- Full Playwright suite: 58 passed, 4 expected desktop-project skips covered by
  the mobile project.
- Exact site and app builds, TypeScript, Rust format/tests/Clippy, optimized
  Tauri build, and native launch smoke passed.
- Live desktop/mobile Axe: no serious or critical findings. Keyboard, focus,
  touch targets, 200% zoom, reduced motion, links, invalid-input recovery,
  privacy requests, offline reload, and service-worker replacement passed.
- Billing verification allowed 30 requests, then returned 429 with
  `Retry-After: 3`.
- Lighthouse: 93 Performance, 100 Accessibility, 100 Best Practices, 100 SEO;
  LCP 2.1 s, CLS 0, 88 KiB transfer.

No product code was modified. The supplied checkout's pre-existing
`graphify-out` changes were preserved.

## Required next step

Bump the product version and publish a new immutable tag from the final source
commit. Build installers, checksums, manifests, and the deployed site from that
one tag. Update `.factory/copy-audit.md` from its stale `0.1.17` references.
After deployment, rerun every claim and require `npm test` to pass.

macOS and Windows packages remain intentionally unsigned. Signing and macOS
notarization still require the owner's certificate secrets documented by the
release process.
