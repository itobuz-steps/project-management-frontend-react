import { test, expect } from '@playwright/test';

test('signup page loads', async ({ page }) => {
  await page.goto('http://localhost:5173/signup', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page).toHaveURL(/signup/);
});
