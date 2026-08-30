# Handoff — repair 11

## Result

Food Log Export Kit remains a Tauri 2 desktop app with a static landing site.
Repair 11 publishes version `0.1.10` from tag `v0.1.10` and deploys its
matching `dist/site/` build only to `sf-food-log-export-kit`.

## Reproduced failure and repair

An isolated `git clone --no-local` of failed candidate
`1fb7633669c3e88c0148d9ec28b110484fdd8f43` reproduced the exact command from
the prior handoff after `npm ci`:

```sh
CI=1 npm run tauri -- build
```

The existing wrapper correctly translated `CI=1` to Tauri's required boolean
value. The frontend built, then Cargo stopped in `glib-sys` because
`pkg-config` could not locate `glib-2.0.pc`. The full captured evidence is in
`.factory/evidence/repair-11/reproduced-clean-native-build.md`; repair 10's
original evidence remains unchanged.

The repair keeps the prior candidate-release identity guard and adds a
deterministic Linux native preflight. It checks `glib-2.0` and
`webkit2gtk-4.1` through `pkg-config` before Cargo runs. On a clean machine it
prints the exact documented Debian or Ubuntu package command instead of
leaving a low-level Cargo error. `npm run native:prereqs` is available for a
standalone check. The Linux GitHub release job installs the same packages and
runs that check before the Tauri action.

`@regression:R11-native-preflight` covers a missing-library result, its exact
setup command, a successful Linux result, the non-Linux path, the Tauri
wrapper, and the release workflow. `@regression:R10-native-build-prerequisites`
keeps the README, workflow, and preflight package lists aligned.

## Verification

The failing clone was preserved only under `/tmp`; it was not changed. After
installing the documented Linux package set, a second isolated clone passed
the exact native command and emitted unsigned Linux AppImage, DEB, and RPM
bundles. The repaired checkout also passes:

```sh
npm ci
npm run native:prereqs
npm run test:unit -- --testNamePattern 'R11-native-preflight|R10-native-build-prerequisites|F13-2'
npx vitest run --exclude tests/unit/published-release.test.ts
npx playwright test
npm run build
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri -- build
```

Before deployment, the full `npm test` suite, every exact command in
`.factory/claims.json`, published-release checksum and identity test, and
installer tests are run again after `v0.1.10` is published. The browser suite
covers Chromium desktop and 390 px mobile, keyboard operation, focus, serious
and critical Axe findings, reduced motion, offline reload, service-worker
update, demo storage isolation, local-only conversion, and CSV/JSON exports.

## Release and deployment

The `v0.1.10` GitHub Actions release workflow builds Apple Silicon and Intel
macOS DMGs, Windows MSI and setup EXE, and Linux AppImage, DEB, and RPM. It
publishes `SHA256SUMS` and `latest.json` with the tagged source commit and
checks every asset before completing. The landing page exposes a platform
installer only when its release tag and source commit match the deployed
`release-identity.json`.

Build and deploy the final site with:

```sh
npm run build:site
/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site
```

The deployment target is the allowed `sf-food-log-export-kit` static resource.
Post-deploy verification covers `/`, `/demo`, `/app`, `/privacy`, and `/terms`
with `/opt/fleet/lib/verify-url.sh`, plus live release identity and direct
installer checks.

## Known gap and operator action

macOS and Windows desktop builds are unsigned. Signing requires the
owner-managed `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` workflow secrets.
The app adds no food-data server, account service, analytics, or telemetry.
