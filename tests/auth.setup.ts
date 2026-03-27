import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[type="email"]', 'shaswata.biswas@itobuz.com');
  await page.fill('input[type="password"]', 'Shaswata@123');

  await page.click('button:has-text("Login")');

  await page.waitForURL('**/for-you', { timeout: 10000 });

  // Save storage (cookies + localStorage)
  await page.context().storageState({ path: 'storageState.json' });
});
