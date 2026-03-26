import { Page, Locator } from '@playwright/test';

export function logoutButton(page: Page): Locator {
  return page.locator('button', { hasText: 'Logout' });
}

export function collapseSidebarBtn(page: Page): Locator {
  return page.getByLabel('Collapse sidebar');
}

export function openSidebarBtn(page: Page): Locator {
  return page.getByLabel('Open sidebar');
}
