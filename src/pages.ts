import { checkoutUrl } from './license';
import { appVersion, sourceCommit } from './build';
import { detectDesktopPlatform, detectMacArchitecture, loadCurrentRelease, releasePageUrl, selectPlatformAsset } from './release';
import { footer, header } from './shell';

const art = `<picture class="hero-art"><source media="(max-width: 720px)" srcset="/art/archive-kitchen-720.webp"><img src="/art/archive-kitchen-1280.webp" width="1280" height="853" alt="A recipe card archive box in a quiet kitchen at dusk." fetchpriority="high" decoding="async"></picture>`;

export function landingPage(): string {
  document.title = 'Food Log Export Kit — Save your food history';
  return `${header()}<main id="main">
    <section class="hero">
      ${art}
      <div class="hero-copy"><p class="eyebrow light">Export food tracker history</p><h1 tabindex="-1">Save your food history</h1><p class="hero-lede">For food tracker users who need years of meals and recipes in files they control.</p>
        <div class="hero-actions"><a class="primary-button" href="/?demo=1" data-link>Try it with sample data</a><span>Review 12 sample entries, then download a CSV and JSON archive.</span></div>
        <ul class="plain-facts"><li><b>No uploads.</b> Conversion stays on this device.</li><li><b>No account.</b> Open a file and start.</li><li><b>Free for one file.</b> Batch import costs $19 once.</li></ul>
      </div>
      <div class="hero-caption"><p>Keep a CSV for spreadsheets. JSON keeps consistent fields and conversion notes.</p></div>
    </section>
    <section class="download-band" aria-labelledby="download-title"><div><p class="eyebrow">Desktop app · version ${appVersion}</p><h2 id="download-title">Download the desktop app</h2><p>The app reads CSV and JSON exports. It also works when your internet is off.</p></div><div class="download-action"><a class="primary-button download-button" id="platform-download" href="${releasePageUrl}">Downloads are being published</a><small id="download-note">Choose a build for your computer from the release page.</small><a class="release-notes-link" id="release-notes" href="${releasePageUrl}" rel="external">Read release notes<span class="sr-only"> on GitHub</span></a></div></section>
    <section class="product-preview" aria-labelledby="preview-title"><div class="section-intro"><p class="eyebrow">Review before export</p><h2 id="preview-title">Review entries and conversion notes</h2><p>Invalid values, skipped rows, and populated unrecognized fields appear in conversion notes.</p></div>
      <div class="preview-window"><div class="preview-top"><span></span><b>Food Log Export Kit</b><small>● On this device</small></div><div class="preview-body"><ol><li class="done"><i>1</i><span><b>Import</b><small>sample-food-history.csv</small></span></li><li class="active"><i>2</i><span><b>Review</b><small>12 entries ready</small></span></li><li><i>3</i><span><b>Export</b><small>CSV + JSON</small></span></li></ol><div class="preview-ledger"><div class="ledger-head"><span>APR 14</span><b>3 meals</b><em>No notes</em></div><div><span>Breakfast</span><b>Oatmeal with blueberries</b><span>342 kcal</span></div><div><span>Lunch</span><b>Lentil soup</b><span>418 kcal</span></div><div><span>Dinner</span><b>Tofu ginger stir-fry</b><span>561 kcal</span></div></div></div></div>
    </section>
    <section class="walkthrough" id="how" aria-labelledby="how-title"><div class="section-intro"><p class="eyebrow">How it works</p><h2 id="how-title">How to turn an export into an archive</h2></div><ol class="filmstrip">
      <li><figure><div class="frame"><img src="/screens/01-import.webp" width="760" height="489" alt="The app screen for choosing a tracker export." loading="lazy" decoding="async"></div><figcaption><span>01</span><h3>Choose your export</h3><p>Open a CSV or JSON file from your tracker.</p></figcaption></figure></li>
      <li><figure><div class="frame"><img src="/screens/02-review.webp" width="760" height="489" alt="A conversion note explaining an unusable row." loading="lazy" decoding="async"></div><figcaption><span>02</span><h3>Review conversion notes</h3><p>Check missing fields and rows before saving anything.</p></figcaption></figure></li>
      <li><figure><div class="frame"><img src="/screens/03-export.webp" width="760" height="489" alt="Two filled food-log rows above Export CSV and Export JSON buttons." loading="lazy" decoding="async"></div><figcaption><span>03</span><h3>Save CSV and JSON</h3><p>Use the CSV in a spreadsheet. Keep JSON with consistent fields and conversion notes.</p></figcaption></figure></li>
    </ol></section>
    <section class="boundaries" aria-labelledby="boundaries-title"><div><p class="eyebrow light">Privacy and limits</p><h2 id="boundaries-title">How the app handles your files</h2></div><ul><li><b>Your files stay local.</b><span>The app has no food-data server.</span></li><li><b>The app does not sign in to your tracker.</b><span>Use exports you requested from your tracker.</span></li><li><b>No nutrition advice.</b><span>Numbers are copied and labeled, not judged.</span></li><li><b>Unrecognized fields appear in conversion notes.</b><span>The app names them and keeps their values in JSON.</span></li></ul></section>
    <section class="pricing" aria-labelledby="price-title"><div class="price-copy"><p class="eyebrow">Batch-import license</p><h2 id="price-title">Combine several exports for $19</h2><p>The free app handles one file at a time. The batch-import license adds multi-file selection for migrations split across years or apps.</p><ul><li>One-time purchase</li><li>Paste the license token on another device</li><li>CSV and JSON export stay free</li></ul></div><div class="price-ticket"><span>BATCH-IMPORT LICENSE</span><strong><sup>$</sup>19</strong><small>one time</small><a class="primary-button" href="${checkoutUrl()}" rel="external">Buy the batch-import license</a><p>Sociobot/Dodo is the merchant of record. It handles refunds, which revoke the license. <a href="/terms" data-link>Read the terms.</a></p></div></section>
  </main>${footer()}`;
}

export function privacyPage(): string {
  document.title = 'Privacy — Food Log Export Kit';
  return `${header('privacy')}<main id="main" class="prose-page"><p class="eyebrow">Effective 28 August 2026</p><h1 tabindex="-1">Your food data stays with you</h1><p class="lede">Food Log Export Kit processes food tracker exports on your device.</p><h2>Files you open</h2><p>The app reads your files in memory. It does not upload meals, recipes, nutrition values, weights, or conversion notes. The app does not add analytics or tracking.</p><h2>Files you save</h2><p>You choose where exported CSV and JSON files are stored. Demo data uses memory only and is discarded when you leave the demo.</p><h2>License checks</h2><p>If you buy or restore a license, the app stores the token and its last result on your device. It sends only that token to the Sociobot billing API for verification.</p><h2>Desktop downloads</h2><p>The website asks the public GitHub API for current release links. GitHub may receive your IP address under its own privacy terms.</p><h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>. Do not attach your food export.</p></main>${footer()}`;
}

export function termsPage(): string {
  document.title = 'Terms — Food Log Export Kit';
  return `${header('terms')}<main id="main" class="prose-page"><p class="eyebrow">Effective 28 August 2026</p><h1 tabindex="-1">Terms for using the export kit</h1><p class="lede">Use this tool with files you have the right to access.</p><h2>What the app does</h2><p>The app converts supported fields from CSV and JSON files. Review conversion notes before deleting an old account or original export.</p><h2>Not medical advice</h2><p>JSON keeps recognized fields, conversion notes, and populated unrecognized fields. The app does not check nutrition accuracy or provide health advice.</p><h2>Batch-import license</h2><p>A $19 batch-import license adds batch file selection. A revoked license stops batch access. Core single-file export remains available.</p><h2>Purchases and refunds</h2><p>Sociobot/Dodo is the merchant of record and handles refunds. A refund revokes the batch-import license.</p><h2>Warranty and responsibility</h2><p>The software is provided as is. Keep the original tracker export and verify the result before relying on it. You are responsible for your own backups.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> for product or purchase questions.</p></main>${footer()}`;
}

export function notFoundPage(): string {
  document.title = 'Page not found — Food Log Export Kit';
  return `${header()}<main id="main" class="not-found"><div><p class="eyebrow light">404 · Not found</p><h1 tabindex="-1">This page was not found</h1><p>The address may be wrong, or the page may have moved. Your files have not been touched.</p><a class="primary-button" href="/" data-link>Return to the home page</a></div><picture><source media="(max-width: 720px)" srcset="/art/archive-kitchen-720.webp"><img src="/art/archive-kitchen-1280.webp" width="1280" height="853" alt="An open recipe card box on a kitchen table." decoding="async"></picture></main>${footer()}`;
}

export async function resolvePlatformDownload(): Promise<void> {
  const button = document.querySelector<HTMLAnchorElement>('#platform-download');
  const note = document.querySelector('#download-note');
  const releaseNotes = document.querySelector<HTMLAnchorElement>('#release-notes');
  if (!button || !note || !releaseNotes) return;
  const platform = detectDesktopPlatform(navigator.userAgent);
  const currentRelease = await loadCurrentRelease(appVersion, sourceCommit);
  if (currentRelease) {
    const macArchitecture = platform === 'macOS' ? await detectMacArchitecture() : 'unknown';
    const asset = selectPlatformAsset(currentRelease.assets, platform, macArchitecture);
    button.href = asset?.browser_download_url ?? currentRelease.html_url;
    releaseNotes.href = currentRelease.html_url;
    button.textContent = asset ? `Download for ${platform}` : platform === 'macOS' ? 'Choose your Mac download' : 'View desktop releases';
    note.textContent = asset ? asset.name : platform === 'macOS' ? 'Choose Apple Silicon or Intel on the release page.' : 'Downloads are being published for all three platforms.';
  } else {
    button.textContent = 'Downloads are being published';
    note.textContent = 'Use the release page to check current desktop builds.';
    button.href = releasePageUrl;
    releaseNotes.href = releasePageUrl;
  }
}
