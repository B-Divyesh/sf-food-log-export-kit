import './styles.css';
import { startApp } from './app';
import { acceptLicenseFromUrl } from './license';
import { landingPage, notFoundPage, privacyPage, resolvePlatformDownload, termsPage } from './pages';

const root = document.querySelector<HTMLElement>('#app');
const live = document.createElement('div');
live.className = 'sr-only';
live.setAttribute('aria-live', 'polite');
document.body.append(live);

function isTauri(): boolean { return '__TAURI_INTERNALS__' in window; }

function render(path = location.pathname): void {
  if (!root) return;
  if (path !== '/demo') acceptLicenseFromUrl();
  if (isTauri() || path === '/app') startApp(root, false);
  else if (path === '/demo') startApp(root, true);
  else if (path === '/privacy') root.innerHTML = privacyPage();
  else if (path === '/terms') root.innerHTML = termsPage();
  else if (path === '/') { root.innerHTML = landingPage(); void resolvePlatformDownload(); }
  else root.innerHTML = notFoundPage();
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://food-log-export-kit.sociobot.in${path === '/app' ? '/' : path}`;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title);
  bindLinks();
  const heading = root.querySelector<HTMLElement>('h1');
  live.textContent = heading?.textContent ?? '';
  if (path !== '/' && !isTauri()) requestAnimationFrame(() => heading?.focus({ preventScroll: false }));
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
