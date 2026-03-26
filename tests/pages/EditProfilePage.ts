import { Page, expect } from '@playwright/test';

export class EditProfilePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/edit-profile');
  }

  // locators
  usernameInput = () => this.page.getByPlaceholder('Username');
  fileInput = () => this.page.locator('input[type="file"]');
  saveBtn = () => this.page.getByRole('button', { name: 'Save' });

  previewImage = () => this.page.locator('#preview');
  emailText = () => this.page.locator('#user-email');

  pushToggle = () => this.page.locator('.custom-switch').nth(0);
  emailToggle = () => this.page.locator('.custom-switch').nth(1);
  inAppToggle = () => this.page.locator('.custom-switch').nth(2);

  form = () => this.page.locator('#edit-profile-form');

  // actions
  async updateUsername(name: string) {
    await this.usernameInput().fill(name);
  }

  async uploadImage(filePath: string) {
    await this.fileInput().setInputFiles(filePath);
  }

  async togglePush() {
    await this.pushToggle().click();
  }

  async toggleEmail() {
    await this.emailToggle().click();
  }

  async toggleInApp() {
    await this.inAppToggle().click();
  }

  async submit() {
    await this.saveBtn().click();
  }

  // assertions
  async expectSuccessMessage(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectErrorMessage(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectPreviewChanged() {
    await expect(this.previewImage()).toBeVisible();
  }

  async expectPreviewUpdated() {
    const src = await this.previewImage().getAttribute('src');
    expect(src).toContain('blob:');
  }

  async expectUsernameValue(value: string) {
    await expect(this.usernameInput()).toHaveValue(value);
  }
}
