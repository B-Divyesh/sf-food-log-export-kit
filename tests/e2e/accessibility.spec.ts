import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/demo', '/app', '/privacy', '/terms', '/missing-page']) {
  test(`has no serious accessibility errors on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}

test('keyboard path loads sample and reaches export', async ({ page }) => {
  await page.goto('/app');
  const sampleButton = page.getByRole('button', { name: 'Load sample data' });
  await sampleButton.focus();
  await expect(sampleButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible();
});

test('mobile landing has no horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('visible mobile links and buttons have 44 pixel touch targets', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  for (const path of ['/', '/app', '/privacy', '/terms']) {
    await page.goto(path);
    const undersized = await page.locator('a:visible, button:visible').evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { name: (element.getAttribute('aria-label') || element.textContent || '').trim().replace(/\s+/g, ' '), width: rect.width, height: rect.height };
    }).filter(({ width, height }) => width < 44 || height < 44));
    expect(undersized, `${path} contains undersized targets`).toEqual([]);
  }
});

test('mobile app keeps content at 200 percent page scale', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/demo');
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
  await expect(page.getByRole('heading', { name: 'Save your food history' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('mobile demo shows a named sample record in the first viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/?demo=1');
  const record = page.getByLabel('Sample record');
  await expect(record).toContainText('Oatmeal with blueberries');
  const box = await record.boundingBox();
  expect(box?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(844);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(844);
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible();
});

test('back navigation restores focus to the landing heading', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Main navigation').getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { name: 'Your food data stays with you' })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Save your food history' })).toBeFocused();
});

test('app and demo use the shared navigation and footer', async ({ page }) => {
  for (const path of ['/app', '/demo']) {
    await page.goto(path);
    const navigation = page.getByLabel('Main navigation');
    await expect(navigation.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Terms' })).toBeVisible();
    const footer = page.locator('footer');
    await expect(footer).toContainText('Built by Param Factory');
    await expect(footer).toContainText('Version 0.1.6 · release repair');
  }
});

test('each client route sets its title, canonical URL, and heading focus', async ({ page }) => {
  const routes = [
    ['/app', 'Archive — Food Log Export Kit', '/app', 'Save your food history'],
    ['/demo', 'Demo — Food Log Export Kit', '/demo', 'Save your food history'],
    ['/privacy', 'Privacy — Food Log Export Kit', '/privacy', 'Your food data stays with you'],
    ['/terms', 'Terms — Food Log Export Kit', '/terms', 'Terms for using the export kit']
  ] as const;
  await page.goto('/');
  for (const [path, title, canonicalPath, heading] of routes) {
    await page.evaluate((nextPath) => {
      history.pushState({}, '', nextPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://food-log-export-kit.sociobot.in${canonicalPath}`);
    await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeFocused();
  }
});

test('reduced motion removes visible movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  const durations = await page.locator('body *').evaluateAll((elements) => elements.flatMap((element) => {
    const style = getComputedStyle(element);
    return [style.animationDuration, style.transitionDuration].flatMap((value) => value.split(',')).map((value) => Number.parseFloat(value) || 0);
  }));
  expect(Math.max(...durations)).toBeLessThanOrEqual(0.01);
});

test('landing link crawl includes the selected release notes page', async ({ page, request }) => {
  const releaseUrl = 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.6';
  await page.route('https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/latest', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      tag_name: 'v0.1.6',
      html_url: releaseUrl,
      assets: [{
        name: 'Food.Log.Export.Kit_0.1.6_amd64.AppImage',
        browser_download_url: 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/download/v0.1.6/Food.Log.Export.Kit_0.1.6_amd64.AppImage'
      }]
    })
  }));
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Read release notes on GitHub' })).toHaveAttribute('href', releaseUrl);

  const sameOriginLinks = await page.locator('a[href]').evaluateAll((links) => [...new Set(links
    .map((link) => (link as HTMLAnchorElement).href)
    .filter((href) => new URL(href).origin === location.origin)
    .map((href) => new URL(href).pathname))]);
  for (const path of sameOriginLinks) {
    const response = await request.get(path);
    expect(response.status(), `${path} should resolve`).toBe(200);
  }
});

test('@regression:stale-desktop-release keeps the download action calm when GitHub latest predates this site build', async ({ page }) => {
  await page.route('https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/latest', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      tag_name: 'v0.1.4',
      target_commitish: '5b770194cb02e41d70efb114f7e11a1a35f6766c',
      html_url: 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.4',
      assets: [{
        name: 'Food.Log.Export.Kit_0.1.4_amd64.AppImage',
        browser_download_url: 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/download/v0.1.4/Food.Log.Export.Kit_0.1.4_amd64.AppImage'
      }]
    })
  }));

  await page.goto('/');
  await expect(page.locator('#download-note')).toHaveText('Use the release page to check current desktop builds.');
  await expect(page.getByRole('link', { name: 'Downloads are being published' })).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases');
  await expect(page.getByRole('link', { name: 'Read release notes on GitHub' })).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases');
});
