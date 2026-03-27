import { test, expect } from '@playwright/test';
import { openSidebar } from '../utils/helpers';

test.describe('TS_Theme_010 - Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/for-you');

    // reset ONLY theme (not auth)
    await page.evaluate(() => {
      localStorage.removeItem('color-mode');
    });

    await page.reload();
  });

  test('TC_076: Dark Mode UI', async ({ page }) => {
    await openSidebar(page);

    const html = page.locator('html');
    const toggleBtn = page.getByRole('button', {
      name: /switch to (dark|light) mode/i,
    });

    const isDark = await html.getAttribute('class');

    if (isDark?.includes('dark')) {
      await toggleBtn.click();
    }

    await expect(html).not.toHaveClass(/dark/);
    const sidebar = page.locator('#sidebar');

    await expect(sidebar).toBeVisible();
    expect(toggleBtn).toHaveAttribute('aria-label', /switch to dark mode/i);
  });
});
