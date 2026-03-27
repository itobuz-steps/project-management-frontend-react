import { expect, Page } from '@playwright/test';

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

export async function openFirstProject(page: Page) {
  const projects = page.locator('#projectsMenu');
  await projects.click();

  const dropdown = page.locator('#projectsDropdown');
  await dropdown.waitFor();

  const project = dropdown.locator('li ul li').first();

  // If project not visible → expand workspace
  if (!(await project.isVisible())) {
    const workspace = dropdown.locator('li > button').first();
    await workspace.click();
  }

  await project.waitFor();
  await project.click();

  await page.waitForURL(/\/project\/.+/, { timeout: 10000 });
}

export async function openFirstProjectMobileView(page: Page) {
  page.getByRole('button', { name: 'Open Sidebar' }).click();

  const dropdown = page.locator('#projectsDropdown');
  await dropdown.waitFor();

  const project = dropdown.locator('li ul li').first();

  // If project not visible → expand workspace
  if (!(await project.isVisible())) {
    const workspace = dropdown.locator('li > button').first();
    await workspace.click();
  }

  await project.waitFor();
  await project.click();

  page.getByRole('button', { name: 'Close Sidebar' }).click();

  await page.waitForURL(/\/project\/.+/, { timeout: 10000 });
}

export async function expandSidebarIfCollapsed(page: Page) {
  const expandBtn = page.getByRole('button', {
    name: /expand sidebar/i,
  });

  if (await expandBtn.isVisible()) {
    await expandBtn.click();
  }
}

export async function ensureWorkspaceSectionOpen(page: Page) {
  const dropdown = page.locator('#projectsDropdown');

  if (!(await dropdown.isVisible())) {
    await page.getByText('Workspaces').click();
  }

  await expect(dropdown).toBeVisible();
}
