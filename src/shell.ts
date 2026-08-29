export function header(active = ''): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" data-link aria-label="Food Log Export Kit home"><span class="wordmark-mark" aria-hidden="true">F</span><span>Food Log<br><b>Export Kit</b></span></a>
    <nav aria-label="Main navigation">
      <a href="/demo" data-link ${active === 'demo' ? 'aria-current="page"' : ''}>Demo</a>
      <a href="/#how">How it works</a>
      <a href="/privacy" data-link ${active === 'privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      <a href="/terms" data-link ${active === 'terms' ? 'aria-current="page"' : ''}>Terms</a>
    </nav>
  </header>`;
}

export function footer(): string {
  return `<footer class="site-footer">
    <div><span class="footer-mark" aria-hidden="true">F</span><p>Turn food tracker exports into a local archive.</p></div>
    <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
    <p class="build">Version 0.1.4 · repair 4 · Generated artwork</p>
  </footer>`;
}
