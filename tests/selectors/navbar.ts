import { Page, Locator } from '@playwright/test';

export const navbar = (page: Page): Locator => page.getByTestId('nav');

export const searchBtn = (page: Page): Locator => page.getByText('Search');

export const hamburgerBtn = (page: Page): Locator => page.getByLabel(/menu/i);

export const projectHeader = (page: Page): Locator =>
  page.locator('.topbar-project-header');

export const projectIcon = (page: Page): Locator =>
  page.locator('img[alt="project icon"]');

export const projectTag = (page: Page): Locator => page.locator('.ant-tag');

export const mobileMenuItem = (page: Page, text: string): Locator =>
  page.getByRole('button', { name: text });

export const mobileMenu = (page: Page): Locator =>
  page.getByTestId('mobile-menu');
