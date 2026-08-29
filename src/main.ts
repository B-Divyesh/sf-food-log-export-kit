import './styles.css';
import { startApp } from './app';
import { acceptLicenseFromUrl } from './license';
import { landingPage, notFoundPage, privacyPage, resolvePlatformDownload, termsPage } from './pages';

const root = document.querySelector<HTMLElement>('#app');
const live = document.createElement('div');
live.className = 'sr-only';
live.setAttribute('aria-live', 'polite');
document.body.append(live);
let initialRender = true;

function isTauri(): boolean { return '__TAURI_INTERNALS__' in window; }

function render(path = location.pathname): void {
  if (!root) return;
  const demo = path === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  if (!demo) acceptLicenseFromUrl();
  if (demo) startApp(root, true);
  else if (isTauri() || path === '/app') startApp(root, false);
  else if (path === '/privacy') root.innerHTML = privacyPage();
  else if (path === '/terms') root.innerHTML = termsPage();
  else if (path === '/') { root.innerHTML = landingPage(); void resolvePlatformDownload(); }
  else root.innerHTML = notFoundPage();
  const canonicalPath = demo ? '/demo' : path;
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://food-log-export-kit.sociobot.in${canonicalPath}`;
  const description = demo
    ? 'Review 12 sample food-log entries and export CSV or JSON without saving anything.'
    : path === '/privacy'
      ? 'How Food Log Export Kit handles food exports, demo data, and license tokens.'
      : path === '/terms'
        ? 'Terms for using Food Log Export Kit and its optional batch-import license.'
        : path === '/app'
          ? 'Import a food tracker export and review it before creating CSV and JSON files.'
          : !['/', '/demo', '/app', '/privacy', '/terms'].includes(path)
            ? 'The requested Food Log Export Kit page was not found.'
            : 'Turn food tracker exports into CSV and JSON files on your device.';
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', document.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', `https://food-log-export-kit.sociobot.in${canonicalPath}`);
  bindLinks();
  const heading = root.querySelector<HTMLElement>('h1');
  live.textContent = heading?.textContent ?? '';
  if (!initialRender && !isTauri()) requestAnimationFrame(() => heading?.focus({ preventScroll: false }));
  initialRender = false;
}

function bindLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => link.addEventListener('click', (event) => {
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    render(url.pathname);
    if (url.hash) requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView());
    else scrollTo(0, 0);
  }));
}

window.addEventListener('popstate', () => render());
render();

if ('serviceWorker' in navigator && !isTauri()) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
