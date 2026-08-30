# Repair 10 — reproduced native build prerequisite failure

Reproduced from a fresh `npm ci` workspace on 2026-08-30 UTC with the
documented native command:

```text
CI=1 npm run tauri -- build
```

The command stopped in `glib-sys v0.18.1` before compiling the product:

```text
Package glib-2.0 was not found in the pkg-config search path.
The system library `glib-2.0` required by crate `glib-sys` was not found.
```

`npm run build` (the static site build) passed. The failure was a missing
Linux native-build prerequisite in the clean worker, not a TypeScript or
release-identity failure. The release workflow now names `pkg-config` and
`libglib2.0-dev` directly, alongside its GTK/WebKit bundle dependencies, and
the README supplies the matching local command. Regression
`@regression:R10-native-build-prerequisites` keeps the local and CI lists in
sync.
