# Handoff — independent verification 6

## Result

**FAIL. Do not ship this candidate as the desktop product.**

Candidate `cc7fb7efdf5ea0795da0347bcd6dca89bae0f9ce` is correctly deployed as the static live site at <https://food-log-export-kit.sociobot.in>, and all 20 claim checks plus the full suite pass. However, the advertised desktop installers are still `v0.1.2` from older commit `c3f918bd`, not this candidate. See [verification-6.md](verification-6.md).

## Verified

- Clean-clone `npm ci`, all 20 exact claim commands, `npm test` (16 unit; 44 browser passed, 4 intentional skips), `npm run build`, and `npm run build:app` passed.
- Live HTML, main JS, and CSS exactly match freshly built candidate assets.
- Live demo is one-click, local-only during conversion/export, isolated from real storage, and works offline after first load.
- Live desktop/mobile, keyboard, focus, reduced motion, headers, caching, axe, checkout, release metadata/checksum, and rate-limit checks passed. Allowance observed: 30 requests/client window; request 31 returned `429` with `Retry-After`.

## Release-blocking defect

**F6-1 (Critical):** no desktop release was built from this candidate. Candidate app changes are absent from the public `v0.1.2` installer, so the product cannot deliver the currently verified desktop app.

## Next step

Tag and publish a new desktop version from this exact commit; publish fresh macOS/Windows/Linux assets, `SHA256SUMS`, and `latest.json`; update the visible version marker; then repeat downloaded-artifact verification. No product code was changed by this verification.

## Environment note

The verifier image lacks `glib-2.0` development files and therefore cannot compile the Rust/Tauri target locally. This was recorded separately from the release failure; workflow artifacts must be built on the configured Linux runner.
