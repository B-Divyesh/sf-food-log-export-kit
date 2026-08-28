import { checkoutUrl } from './license';
import { footer, header } from './shell';

const art = `<picture class="hero-art"><source media="(max-width: 720px)" srcset="/art/archive-kitchen-720.webp"><img src="/art/archive-kitchen-1280.webp" width="1280" height="853" alt="A recipe card archive box in a quiet kitchen at dusk." fetchpriority="high" decoding="async"></picture>`;

export function landingPage(): string {
  document.title = 'Food Log Export Kit — Save your food history';
  return `${header()}<main id="main">
    <section class="hero">
      ${art}
      <div class="hero-copy"><p class="eyebrow light">Your exit from a food tracker</p><h1 tabindex="-1">Save your food history</h1><p class="hero-lede">For calorie tracker users who need years of meals and recipes in files they control.</p>
        <div class="hero-actions"><a class="primary-button" href="/demo" data-link>Try it with sample data</a><span>Review 12 entries, then export both files.</span></div>
        <ul class="plain-facts"><li><b>No uploads.</b> Conversion stays on this device.</li><li><b>No account.</b> Open a file and start.</li><li><b>Free for one file.</b> Batch import costs $19 once.</li></ul>
      </div>
      <div class="hero-caption"><span>01 / THE SAFE EXIT</span><p>Your old log becomes an archive you can open anywhere.</p></div>
    </section>
    <section class="download-band" aria-labelledby="download-title"><div><p class="eyebrow">Desktop app · version 0.1.1</p><h2 id="download-title">Keep the converter on your computer</h2><p>The app reads CSV and JSON exports. It also works when your internet is off.</p></div><div class="download-action"><a class="primary-button download-button" id="platform-download" href="https://github.com/B-Divyesh/sf-food-log-export-kit/releases">Downloads are being published</a><small id="download-note">Unsigned builds for macOS, Windows, and Linux.</small></div></section>
    <section class="product-preview" aria-labelledby="preview-title"><div class="section-intro"><p class="eyebrow">The product</p><h2 id="preview-title">See every row before you export</h2><p>Missing or invalid dates and unreadable or comma-formatted numbers appear as notes. Skipped files and rows are named.</p></div>
      <div class="preview-window"><div class="preview-top"><span></span><b>Food Log Export Kit</b><small>● On this device</small></div><div class="preview-body"><ol><li class="done"><i>1</i><span><b>Import</b><small>sample-food-history.csv</small></span></li><li class="active"><i>2</i><span><b>Review</b><small>12 entries ready</small></span></li><li><i>3</i><span><b>Export</b><small>CSV + JSON</small></span></li></ol><div class="preview-ledger"><div class="ledger-head"><span>APR 14</span><b>3 meals</b><em>No notes</em></div><div><span>Breakfast</span><b>Oatmeal with blueberries</b><span>342 kcal</span></div><div><span>Lunch</span><b>Lentil soup</b><span>418 kcal</span></div><div><span>Dinner</span><b>Tofu ginger stir-fry</b><span>561 kcal</span></div></div></div></div>
    </section>
    <section class="walkthrough" id="how" aria-labelledby="how-title"><div class="section-intro"><p class="eyebrow">How it works</p><h2 id="how-title">Three checks between export and archive</h2></div><ol class="filmstrip">
      <li><figure><div class="frame"><img src="/screens/01-import.webp" width="760" height="489" alt="The app screen for choosing a tracker export." loading="lazy" decoding="async"></div><figcaption><span>01</span><h3>Choose your export</h3><p>Open a CSV or JSON file from your tracker.</p></figcaption></figure></li>
      <li><figure><div class="frame"><img src="/screens/02-review.webp" width="760" height="489" alt="A conversion note explaining an unusable row." loading="lazy" decoding="async"></div><figcaption><span>02</span><h3>Read the notes</h3><p>Check missing fields and rows before saving anything.</p></figcaption></figure></li>
      <li><figure><div class="frame"><img src="/screens/03-export.webp" width="760" height="489" alt="The filled review table with CSV and JSON export buttons." loading="lazy" decoding="async"></div><figcaption><span>03</span><h3>Save both formats</h3><p>Use CSV now. Keep JSON as the complete archive.</p></figcaption></figure></li>
    </ol></section>
    <section class="boundaries" aria-labelledby="boundaries-title"><div><p class="eyebrow light">Private by design</p><h2 id="boundaries-title">A converter, not another tracker</h2></div><ul><li><b>Your files stay local.</b><span>The app has no food-data server.</span></li><li><b>No account scraping.</b><span>Use exports you requested from your tracker.</span></li><li><b>No nutrition advice.</b><span>Numbers are copied and labeled, not judged.</span></li><li><b>No silent drops.</b><span>Skipped files and rows appear in conversion notes.</span></li></ul></section>
    <section class="pricing" aria-labelledby="price-title"><div class="price-copy"><p class="eyebrow">One job. One price.</p><h2 id="price-title">Combine several exports for $19</h2><p>A free archive handles one file at a time. The license adds multi-file selection for migrations split across years or apps.</p><ul><li>One-time purchase</li><li>Paste the license token on another device</li><li>CSV and JSON export stay free</li></ul></div><div class="price-ticket"><span>PERSONAL LICENSE</span><strong><sup>$</sup>19</strong><small>one time</small><a class="primary-button" href="${checkoutUrl()}" rel="external">Buy the batch license</a><p>Sociobot/Dodo handles payment and refunds. <a href="/terms" data-link>Read the terms.</a></p></div></section>
  </main>${footer()}`;
}

export function privacyPage(): string {
  document.title = 'Privacy — Food Log Export Kit';
  return `${header('privacy')}<main id="main" class="prose-page"><p class="eyebrow">Effective 28 August 2026</p><h1 tabindex="-1">Your food data stays with you</h1><p class="lede">Food Log Export Kit processes food tracker exports on your device.</p><h2>Files you open</h2><p>The app reads your files in memory. It does not upload meals, recipes, nutrition values, weights, or conversion notes. The app does not add analytics or tracking.</p><h2>Files you save</h2><p>You choose where exported CSV and JSON files are stored. Demo data uses memory only and is discarded when you leave the demo.</p><h2>License checks</h2><p>If you buy or restore a license, the app stores the token and its last result on your device. It sends that token to the Sociobot billing API for verification. It never sends food data with this request.</p><h2>Desktop downloads</h2><p>The website asks the public GitHub API for current release links. GitHub may receive your IP address under its own privacy terms.</p><h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>. Do not attach your food export.</p></main>${footer()}`;
}

export function termsPage(): string {
  document.title = 'Terms — Food Log Export Kit';
  return `${header()}<main id="main" class="prose-page"><p class="eyebrow">Effective 28 August 2026</p><h1 tabindex="-1">Terms for using the export kit</h1><p class="lede">Use this tool with files you have the right to access.</p><h2>What the app does</h2><p>The app converts supported fields from CSV and JSON files. Source apps can change their formats. Review conversion notes before deleting an old account or original export.</p><h2>Not medical advice</h2><p>The app preserves supplied values. It does not check nutrition accuracy or provide health advice.</p><h2>Purchases and refunds</h2><p>A $19 personal license adds batch file selection. Sociobot/Dodo is the merchant of record. Refunds are handled through the purchase receipt. A refunded or revoked license stops batch access. Core single-file export remains available.</p><h2>Warranty and responsibility</h2><p>The software is provided as is. Keep the original tracker export and verify the result before relying on it. You are responsible for your own backups.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> for product or purchase questions.</p></main>${footer()}`;
}

export function notFoundPage(): string {
  document.title = 'Page not found — Food Log Export Kit';
  return `${header()}<main id="main" class="not-found"><div><p class="eyebrow light">404 · Not found</p><h1 tabindex="-1">This page was not found</h1><p>The address may be wrong, or the page may have moved. Your files have not been touched.</p><a class="primary-button" href="/" data-link>Return to the home page</a></div><picture><source media="(max-width: 720px)" srcset="/art/archive-kitchen-720.webp"><img src="/art/archive-kitchen-1280.webp" width="1280" height="853" alt="An open recipe card box on a kitchen table." decoding="async"></picture></main>${footer()}`;
}

export async function resolvePlatformDownload(): Promise<void> {
  const button = document.querySelector<HTMLAnchorElement>('#platform-download');
  const note = document.querySelector('#download-note');
  if (!button || !note) return;
  const platform = /Mac/i.test(navigator.userAgent) ? 'macOS' : /Windows/i.test(navigator.userAgent) ? 'Windows' : 'Linux';
  const matches: Record<string, RegExp> = { macOS: /\.(dmg|app\.tar\.gz)$/i, Windows: /\.(msi|exe)$/i, Linux: /\.(AppImage|deb)$/i };
  try {
    const cached = localStorage.getItem('release:food-log-export-kit');
    let release: { html_url: string; assets: Array<{ name: string; browser_download_url: string }> };
    if (cached && Date.now() - JSON.parse(cached).saved < 3_600_000) release = JSON.parse(cached).release;
    else {
      const response = await fetch('https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/latest');
      if (!response.ok) throw new Error('No release');
      release = await response.json();
      localStorage.setItem('release:food-log-export-kit', JSON.stringify({ saved: Date.now(), release }));
    }
    const asset = release.assets.find((item) => matches[platform].test(item.name));
    button.href = asset?.browser_download_url ?? release.html_url;
    button.textContent = asset ? `Download for ${platform}` : 'View desktop releases';
    note.textContent = asset ? `${asset.name} · unsigned build` : 'Downloads are being published for all three platforms.';
  } catch {
    button.textContent = 'Downloads are being published';
    note.textContent = 'Use the release page to check current desktop builds.';
  }
}
