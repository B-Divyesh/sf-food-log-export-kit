# Food Log Export Kit

Turn food tracker exports into a local archive.

Food Log Export Kit is for people leaving a food tracker. It reads CSV and JSON food tracker exports. It keeps meal, recipe, nutrition, and weight fields. It exports a CSV and JSON archive. Files, rows, and populated fields the app does not recognize appear in conversion notes. JSON preserves those original field values.

The website and desktop app convert food data on your device. The project does not track meals, require an account, store food data on a server, or give medical advice. The sample demo contacts only this website.

Live site: <https://food-log-export-kit.sociobot.in>

Demo: <https://food-log-export-kit.sociobot.in/demo>

## Supported input

- CSV files separated by commas, semicolons, or tabs
- JSON arrays and objects with `entries`, `records`, `meals`, `foods`, `items`, or `data` lists
- CSV headings for dates, meals, foods, recipes, amounts, energy, macros, and weights
- Dates in `YYYY-MM-DD` order; impossible or ambiguous numeric dates appear in conversion notes
- Dot decimals, grouped commas such as `1,234`, and decimal commas such as `1,5`; comma interpretations are noted

The free app imports one file at a time. A $19 one-time batch-import license adds multi-file selection. Paste its token to restore it on another device. CSV and JSON export stay free. License checks send only the token to the Sociobot billing API. Sociobot/Dodo is the merchant of record and handles refunds. A refund revokes the license.

## Install the desktop app

The landing page selects the published build for your system. On Linux or macOS, the installer checks that the downloaded file was not changed. It installs the `food-log-export-kit` command so you can run it from a terminal:

```sh
curl -fsSL https://food-log-export-kit.sociobot.in/install.sh | sh
```

On Windows, this command verifies and starts the MSI installer:

```powershell
irm https://food-log-export-kit.sociobot.in/install.ps1 | iex
```

Review the [release notes](https://github.com/B-Divyesh/sf-food-log-export-kit/releases/latest) for the steps to open the app on your system.
The published manifest and checksum file name the source commit used for every desktop build. The deployed site names that same version tag and source commit.

## Run locally

Requires Node.js 22. Rust is needed only to build the desktop app. On Debian or Ubuntu, a native desktop build also needs the same GTK/WebKit packages as the release workflow:

```sh
sudo apt-get update && sudo apt-get install -y file pkg-config libglib2.0-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:4173/demo` for the isolated sample workspace.

## Test and build

```sh
npm test
npm run build:site
npm run build:app
npm run native:prereqs # Linux only; verifies the packages above
npm run tauri build
```

`npm run build:site` writes the deployable website to `dist/site/`, with `index.html` at that root. `npm run build:app` writes the Tauri frontend to `dist/app/`. The release workflow builds macOS, Windows, and Linux installers after a `v*` tag is pushed.

Site builds use the checked-out Git commit. A supplied commit must match it. Published downloads remain bound to this version's immutable tag.

## Publish a desktop release

Commit and push all source, test, handoff, and evidence changes first. From the clean `main` tip, run:

```sh
npm run release:preflight
git tag -a v0.1.18 -m "Food Log Export Kit v0.1.18"
git push origin main v0.1.18
```

The preflight stops a dirty checkout. It also stops wrong branches, existing tags, version mismatches, and stale main tips. Wait for GitHub Actions to publish installers, `SHA256SUMS`, and `latest.json`. Then run `npm run release:site`; it refuses to build a deployable site unless the checkout is the immutable version-tag target. Deploy the resulting `dist/site/`, then run the `candidate-installers` claim.

Tested product claims are listed in [`.factory/claims.json`](.factory/claims.json). Demo behavior is documented in [`.factory/demo.md`](.factory/demo.md).

## Project map

- `src/importer.ts` — format detection and normalization
- `src/exporter.ts` — CSV and portable JSON output
- `src/app.ts` — local workspace and demo
- `src-tauri/` — Tauri 2 desktop app code
- `.github/workflows/release.yml` — cross-platform release builds

## Deploy

Publish `dist/site/` as a static site. The included hosting config defines reload routes, security headers, cache rules, and the 404 response. The factory handles DNS and deployment.

## Privacy and license

The MIT license covers the source code. Product terms for the batch-import license are available at `/terms`; data handling details are at `/privacy`.
