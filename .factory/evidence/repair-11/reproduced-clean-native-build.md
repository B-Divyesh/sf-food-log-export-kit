# Repair 11 — clean native-build reproduction

On 2026-08-30 UTC, an isolated `git clone --no-local` of candidate
`1fb7633669c3e88c0148d9ec28b110484fdd8f43` ran `npm ci` followed by the
exact native command retained in the previous handoff:

```sh
CI=1 npm run tauri -- build
```

The Tauri wrapper correctly normalized `CI=1` and completed the TypeScript and
Vite frontend build. Cargo then failed in `glib-sys v0.18.1` because
`pkg-config --libs --cflags glib-2.0 'glib-2.0 >= 2.70'` could not find
`glib-2.0.pc`:

```text
The system library `glib-2.0` required by crate `glib-sys` was not found.
The file `glib-2.0.pc` needs to be installed and the PKG_CONFIG_PATH
environment variable must contain its parent directory.
```

This confirms repair 10's recorded root cause. Repair 11 makes it observable
before Cargo starts: Linux desktop builds now run a `pkg-config` preflight for
`glib-2.0` and `webkit2gtk-4.1`. A missing library prints the exact Debian or
Ubuntu package command. The release job runs the same preflight after package
installation.

After installing the documented package set, a second isolated clone passed
the same command and emitted the Linux AppImage, DEB, and RPM bundles. The
final repaired candidate is built and released under its own tag so the site,
release manifest, checksums, and installers share one source commit.
