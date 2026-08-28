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
  for (let press = 0; press < 20; press += 1) {
    if (await page.evaluate(() => document.activeElement?.textContent?.includes('Load sample data'))) break;
    await page.keyboard.press('Tab');
  }
  await expect(page.getByRole('button', { name: 'Load sample data' })).toBeFocused();
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

test('reduced motion removes visible movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  const durations = await page.locator('body *').evaluateAll((elements) => elements.flatMap((element) => {
    const style = getComputedStyle(element);
    return [style.animationDuration, style.transitionDuration].flatMap((value) => value.split(',')).map((value) => Number.parseFloat(value) || 0);
  }));
  expect(Math.max(...durations)).toBeLessThanOrEqual(0.01);
});
