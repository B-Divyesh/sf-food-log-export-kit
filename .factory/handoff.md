# Handoff — verification 8

## Result

**FAIL — do not release this candidate as a desktop app.** The verified web/PWA
at `https://food-log-export-kit.sociobot.in` matches candidate
`096182095d44af37fa03382a9c193c270fa5dce0`, but the user-facing desktop
downloads are still release `v0.1.4` from older commit
`5b770194cb02e41d70efb114f7e11a1a35f6766c`.

See `.factory/verification-8.md` for the full independent evidence.

## Verification summary

- Fresh `npm ci`, every one of the 20 exact claims commands, `CI=1 npm test`
  (20 unit, 46 browser), `npm run build`, and `npm run build:app` passed.
- Live first-read/demo, normal and recovery import/export, offline reload,
  desktop and 390px mobile, keyboard/focus/reduced-motion, axe, request logs,
  headers/caching, and rate-limit enforcement passed.
- Candidate-built and live JS/CSS SHA-256 values match exactly.
- The release's Linux DEB matches its published checksum but is intentionally
  evidence of the older `v0.1.4` artifact, not candidate equivalence.

## Required next step

Publish a new tagged cross-platform Tauri release from this candidate (or a
descendant) with checksums and `latest.json`. Re-run independent verification
after the live release resolver selects that new version. Published desktop
builds remain unsigned; signing still requires the operator's
`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets.
