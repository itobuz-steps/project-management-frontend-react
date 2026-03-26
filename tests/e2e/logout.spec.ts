import { test, expect } from '@playwright/test';
import { login, openSidebar, logout } from '../utils/helpers';
import {
  logoutButton,
  collapseSidebarBtn,
  openSidebarBtn,
} from '../selectors/sidebar';

test.describe('TS_Logout_006 - Logout Flow (Real Login)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openSidebar(page);
  });

  test('TC_046: Successful Logout', async ({ page }) => {
    await logout(page);

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    const tokens = await page.evaluate(() => ({
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token'),
    }));
    expect(tokens.access).toBeNull();
    expect(tokens.refresh).toBeNull();
  });

  test('TC_047: Token Removal', async ({ page }) => {
    await logout(page);

    const tokens = await page.evaluate(() => ({
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token'),
    }));
    expect(tokens.access).toBeNull();
    expect(tokens.refresh).toBeNull();
  });

  test('TC_048: Redirect After Logout', async ({ page }) => {
    await logout(page);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('TC_049: Access Protected Route After Logout', async ({ page }) => {
    await logout(page);
    await page.goto('http://localhost:5173/for-you', {
      waitUntil: 'networkidle',
    });
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC_050: Back Button After Logout', async ({ page }) => {
    await logout(page);
    await page.goBack();
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC_051: UI Visibility for Mobile Screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    if (await openSidebarBtn(page).isVisible())
      await openSidebarBtn(page).click();
    await expect(logoutButton(page)).toBeVisible();
  });

  test('TC_052: Collapsed Sidebar Behavior', async ({ page }) => {
    if (await collapseSidebarBtn(page).isVisible())
      await collapseSidebarBtn(page).click();
    const btn = logoutButton(page);
    await expect(btn).toBeVisible();
    const btnText = await btn.textContent();
    expect(btnText?.trim().length).toBeGreaterThan(0);
  });

  test('TC_053: Hover Effects', async ({ page }) => {
    const btn = logoutButton(page);
    await btn.hover();
    const bg = await btn.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('background-color')
    );
    expect(bg).not.toBe('');
  });
});
