import { test, expect } from '@playwright/test';
import {
  ensureWorkspaceSectionOpen,
  expandSidebarIfCollapsed,
  openSidebar,
} from '../utils/helpers';

test.describe('TS_WorkSpaces_021 - Workspaces', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/for-you');
    await openSidebar(page);
    await expandSidebarIfCollapsed(page);
  });

  test('TC_129: Workspace Section Visible', async ({ page }) => {
    await expect(page.getByText('Workspaces')).toBeVisible();
  });

  test('TC_130: Toggle Workspaces Expand', async ({ page }) => {
    const header = page.getByText('Workspaces');
    const dropdown = page.locator('#projectsDropdown');

    await header.click();
    await expect(dropdown).toBeHidden();

    await header.click();
    await expect(dropdown).toBeVisible();
  });

  test('TC_131: Collapsed Sidebar Click Behavior', async ({ page }) => {
    const collapseBtn = page.getByRole('button', {
      name: /collapse sidebar/i,
    });

    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
    }

    const workspaceMenu = page.locator('#projectsMenu');
    await workspaceMenu.click();

    await expect(page.locator('#sidebar')).toHaveClass(/w-80/);

    await expect(page.locator('#projectsDropdown')).toBeVisible();
  });

  test('TC_132: Workspace List Rendering', async ({ page }) => {
    await ensureWorkspaceSectionOpen(page);

    const dropdown = page.locator('#projectsDropdown');

    await expect(dropdown).toBeVisible();

    const hasItems = await dropdown.locator('li').count();

    if (hasItems === 0) {
      await expect(page.getByText('No workspaces yet')).toBeVisible();
    } else {
      await expect(dropdown.locator('li').first()).toBeVisible();
    }
  });

  test('TC_133: Empty Workspace State', async ({ page }) => {
    await ensureWorkspaceSectionOpen(page);

    const empty = page.getByText('No workspaces yet');

    if (await empty.count()) {
      await expect(empty).toBeVisible();
    } else {
      test.skip(); // depends on backend data
    }
  });

  test('TC_134: Workspace Expand/Collapse UI', async ({ page }) => {
    await ensureWorkspaceSectionOpen(page);

    const workspaceItem = page.locator('#projectsDropdown button').first();

    if ((await workspaceItem.count()) === 0) {
      test.skip();
    }

    const nestedList = workspaceItem.locator('xpath=../ul');

    // Collapse
    await workspaceItem.click();
    await expect(nestedList).toBeHidden();

    // Expand
    await workspaceItem.click();
    await expect(nestedList).toBeVisible();
  });
});

test.describe('TS_WorkspaceCreate_022 - Workspace Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/for-you');
    await openSidebar(page);
    await expandSidebarIfCollapsed(page);
  });

  test('TC_135: Show Create Workspace', async ({ page }) => {
    await expect(page.getByText('Create workspace')).toBeVisible();
  });

  test('TC_136: Open Input Field', async ({ page }) => {
    await page.getByText('Create workspace').click();

    await expect(
      page.locator('input[placeholder="Workspace name"]')
    ).toBeVisible();
  });

  test('TC_137: Valid Workspace Creation', async ({ page }) => {
    await page.getByText('Create workspace').click();

    const input = page.locator('input[placeholder="Workspace name"]');
    const name = `Test Workspace ${Date.now()}`;

    await input.fill(name);
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(name)).toBeVisible();
  });

  test('TC_138: Empty Input Validation', async ({ page }) => {
    await page.getByText('Create workspace').click();

    const submit = page.locator('button[type="submit"]');

    await expect(submit).toBeDisabled();
  });
});
