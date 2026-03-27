import { test, expect } from '@playwright/test';
import { openFirstProject, openFirstProjectMobileView } from '../utils/helpers';
import {
  navbar,
  hamburgerBtn,
  projectHeader,
  projectIcon,
  projectTag,
  mobileMenuItem,
} from '../selectors/navbar';

test.describe('TS_Navbar_007 - Navbar', () => {
  // ✅ TC_054
  test('TC_054: Navbar Rendering', async ({ page }) => {
    await page.goto('/for-you');
    await expect(navbar(page)).toBeVisible();
  });

  // ✅ TC_055
  test('TC_055: Project Info Hidden (For You)', async ({ page }) => {
    await page.goto('/for-you');
    await expect(projectHeader(page)).toHaveCount(0);
  });

  // ✅ TC_056
  test('TC_056: Project Info Hidden (Task Page)', async ({ page }) => {
    await page.goto('task/1'); // adjust dynamic route
    await expect(projectHeader(page)).toHaveCount(0);
  });

  // ✅ TC_057

  test('TC_057: Project Info Visible', async ({ page }) => {
    await page.goto('/for-you');
    await openFirstProject(page);

    await expect(projectHeader(page)).toBeVisible();
    await expect(projectTag(page)).toBeVisible();
    const icon = projectIcon(page);

    if ((await icon.count()) > 0) {
      await expect(icon).toBeVisible();
    } else {
      console.log('Project icon not present (valid case)');
    }
  });

  // ✅ TC_058
  test('TC_058: Project Navigation', async ({ page }) => {
    await page.goto('/for-you');
    await openFirstProject(page);

    await projectHeader(page).click();
    await expect(page).toHaveURL(/backlog/);
  });
});

test.describe('TS_NavbarUI_008 - Mobile Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/for-you');
  });

  // ✅ TC_059
  test('TC_059: Open Mobile Menu', async ({ page }) => {
    await hamburgerBtn(page).click();

    await expect(mobileMenuItem(page, 'Notifications')).toBeVisible();
    await expect(mobileMenuItem(page, 'Search')).toBeVisible();
  });

  // ✅ TC_060
  test('TC_060: Close Mobile Menu', async ({ page }) => {
    await hamburgerBtn(page).click();

    await page.mouse.click(10, 10); // outside click

    await expect(mobileMenuItem(page, 'Notifications')).toHaveCount(0);
  });

  // ✅ TC_061
  //   test('TC_061: Mobile Notifications', async ({ page }) => {

  //     await hamburgerBtn(page).click();

  //     await expect(mobileMenu(page)).toBeVisible();

  //     const btn = page.getByRole('button', { name: /notifications/i });
  //     await expect(btn).toBeVisible();

  //     await btn.click();

  //     // ✅ Assert actual dropdown (THIS is key)
  //     await expect(
  //       page
  //         .locator('[id="notificationBadge"]')
  //         .or(page.locator('text=No notifications'))
  //     ).toBeVisible();
  //   });

  // ✅ TC_062
  test('TC_062: Mobile Project Settings', async ({ page }) => {
    await openFirstProjectMobileView(page);

    await hamburgerBtn(page).click();
    await mobileMenuItem(page, 'Settings').click();

    await expect(page).toHaveURL(/settings/);
  });

  // ✅ TC_063
  test('TC_063: Mobile Search', async ({ page }) => {
    await hamburgerBtn(page).click();
    await mobileMenuItem(page, 'Search').click();

    await expect(page.locator('text=RECENTLY CREATED')).toBeVisible();
  });
});
