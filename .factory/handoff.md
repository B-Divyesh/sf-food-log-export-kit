# Handoff — repair 10

## Result

Food Log Export Kit remains a Tauri 2 desktop app with its static landing
site. Repair 10 publishes version `0.1.9` from tag `v0.1.9` and deploys the
matching `dist/site/` build to `sf-food-log-export-kit`.

## Reproduced failure and fix

The exact clean native command from the previous handoff was reproduced after
`npm ci`:

```sh
CI=1 npm run tauri -- build
```

It stopped in `glib-sys` because `pkg-config` could not find `glib-2.0`.
This was a missing Linux native-build prerequisite, not a failure in the
release identity, deterministic demo filters, selected-state accessibility, or
payment copy. The captured pre-fix output is in
`.factory/evidence/repair-10/reproduced-native-build-prerequisite.md`.

The release workflow and local build instructions now explicitly install
`pkg-config` and `libglib2.0-dev` with the existing GTK/WebKit dependencies.
The focused `@regression:R10-native-build-prerequisites` test ensures the
documented local list and Linux release job retain every prerequisite.

The candidate is versioned `0.1.9` across the site, Tauri config, Cargo
package, lock files, static 404 page, installer fixtures, and release tests.
It retains repair 9's release-identity guard, deterministic filter updates,
`aria-pressed` state, and Sociobot/Dodo merchant/refund wording.

## Verification

Before publishing, a fresh dependency install and the exact static build
passed:

```sh
npm ci
npm run build
```

After installing the documented Linux prerequisites, all native packages
completed successfully:

```sh
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri -- build
```

The native build emitted these unsigned Linux artifacts:

- `Food Log Export Kit_0.1.9_amd64.AppImage`
- `Food Log Export Kit_0.1.9_amd64.deb`
- `Food Log Export Kit-0.1.9-1.x86_64.rpm`

The pre-release suite passed with only the intentionally publication-dependent
candidate-installer claim excluded:

```sh
npx vitest run --exclude tests/unit/published-release.test.ts
npx playwright test
```

The Playwright suite covers Chromium desktop and 390px mobile, keyboard focus
and selected filter state, axe serious/critical violations, reduced motion,
offline reload, controlled service-worker update, demo storage isolation,
privacy request boundaries, and exports. After release publication the full
`npm test`, every exact command in `.factory/claims.json`, published release
identity check, installer checksum check, deployment route check, and live URL
verification are run against the tagged candidate.

## Release and deploy

Push the final commit and tag `v0.1.9`. The GitHub Actions release workflow
builds macOS arm64/x64, Windows MSI/EXE, and Linux AppImage/DEB/RPM assets,
then creates `SHA256SUMS` and `latest.json` with the tagged source commit.
The live candidate-installer test verifies the tag, peeled commit, manifest,
checksums, direct asset URLs, and a downloaded installer.

Deploy only `dist/site/` with:

```sh
/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site
```

This targets the product's `sf-food-log-export-kit` static resource. The site
build embeds the same tag candidate in `release-identity.json`, so the landing
page offers downloads only after its installer release is published.

## Known gaps and operator action

macOS and Windows installers are unsigned. Signing requires owner-managed
`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets in the release workflow.
No food data, analytics, or account service is added by this repair.
