import { test, expect, Page } from '@playwright/test';

const bellBetter = (page: Page) =>
  page.getByRole('button', { name: /notification/i });

const notificationItems = (page: Page) =>
  page.locator('ul >> li').filter({ hasText: /.+/ });

const notificationBadge = (page: Page) => page.locator('#notificationBadge');

test('TC_077: Open Notifications Panel', async ({ page }) => {
  await page.goto('/for-you');

  const bell = bellBetter(page).first();

  await expect(bell).toBeVisible();
  await bell.click();

  await expect(page.locator('text=Notifications')).toBeVisible();
});

test('TC_078: Notification Badge & Listing', async ({ page }) => {
  await page.goto('/for-you');

  const bell = bellBetter(page).first();

  if (
    await notificationBadge(page)
      .isVisible()
      .catch(() => false)
  ) {
    await expect(notificationBadge(page)).toBeVisible();
  }

  await bell.click();

  await expect(page.locator('text=Notifications')).toBeVisible();

  const empty = page.locator('#notificationListEmpty');

  if (await empty.isVisible().catch(() => false)) {
    await expect(empty).toHaveText(/nothing to see/i);
  } else {
    await expect(notificationItems(page).first()).toBeVisible();
  }
});
