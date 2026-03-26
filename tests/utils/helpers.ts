import { Page } from '@playwright/test';

export async function login(
  page: Page,
  email = 'shaswata.biswas@itobuz.com',
  password = 'Shaswata@123'
) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Login")');

  await page.waitForURL('**/for-you', { timeout: 10000 });
  await page.waitForSelector('h2', { timeout: 10000 });
}

export async function openSidebar(page: Page) {
  const sidebar = page.locator('#sidebar');
  if (!(await sidebar.isVisible())) {
    const openBtn = page.getByLabel('Open sidebar');
    if (await openBtn.isVisible()) {
      await openBtn.click();
    }
  }
  await sidebar.waitFor();
}

export async function logout(page: Page) {
  const logoutBtn = page.locator('button', { hasText: 'Logout' });
  await logoutBtn.click();
  await page.waitForURL('**/login', { timeout: 10000 });
}
