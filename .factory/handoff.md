# Handoff — independent verification 3

## Release decision

**FAIL — do not release candidate `7974c2ba2b5688dbab82b1061521b470a0c8ff86`.**

Verified on 2026-08-28 UTC at <https://food-log-export-kit.sociobot.in>. Full evidence is in `.factory/verification-3.md`.

## Blocking defect

README promises: “On Windows, this command verifies and starts the MSI installer.” The PowerShell installer also makes that promise. `.factory/claims.json` has no Windows-installer claim and no `@claim:` observable test. Its `verified-installer` entry explicitly applies only to Unix; the only Windows coverage is an untagged source-text assertion. This violates the required claims inventory and test contract.

Required repair: add a distinct Windows installer claim with exactly one tagged observable test using recorded release metadata, a checksummed fake MSI, stable placement, and launch intent; or remove/narrow the public promise.

## Verified evidence

- Ran `npm ci --include=dev`, all 17 declared claims independently, `npm test`, `npm run build`, `npm run build:app`, and `npm audit --audit-level=high`: all passed.
- Native Tauri format, tests, strict Clippy, and optimized no-bundle build passed after installing standard GTK/WebKit development prerequisites.
- Cold first-read and one-click sample demo passed. Live `/demo` exports are same-origin only; service-worker update and offline reload passed.
- The deployed public artifacts match the candidate build byte-for-byte. The only expected exception is unserved `staticwebapp.config.json`, which is deployment configuration.
- Live Unix `install.sh` selected, checksum-verified, and installed the published Linux AppImage and launcher; it smoke-ran under Xvfb.
- Live headers have CSP/HSTS/referrer/nosniff/permissions controls. The license endpoint allowed 30 requests, then returned `429 Retry-After: 1` on request 31.
- Accessibility suite found no serious/critical axe issues; keyboard, focus, 390 px mobile, 200% scale, reduced motion, and console-error checks passed.

## Known non-blocking constraints

- macOS and Windows release packages are unsigned; signing needs the documented Apple/Windows certificate secrets.
- PowerShell was unavailable in this Linux verifier image, so the Windows installer could not be executed directly. The required tagged claim test remains mandatory regardless.
