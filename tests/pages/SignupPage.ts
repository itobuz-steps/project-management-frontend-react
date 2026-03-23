import { Page, expect } from '@playwright/test';

export class SignupPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/signup');
  }

  // locators
  usernameInput = () => this.page.getByPlaceholder('Enter Username');
  emailInput = () => this.page.getByPlaceholder('Enter Email');
  passwordInput = () => this.page.getByPlaceholder('Enter Password');
  submitBtn = () => this.page.getByRole('button', { name: 'Sign Up' });
  passwordToggle = () => this.page.locator('button[type="button"]');

  form = () => this.page.locator('form');

  // actions
  async fillForm(username: string, email: string, password: string) {
    await this.usernameInput().fill(username);
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
  }

  async submit() {
    await this.submitBtn().click();
  }

  async togglePassword() {
    await this.passwordToggle().click();
  }

  // assertions
  async expectRedirectToOtp() {
    await expect(this.page).toHaveURL(/verify-otp/);
  }

  async expectFieldError(text: string) {
    await expect(this.form().locator('p', { hasText: text })).toBeVisible();
  }

  async expectToastError(text: string) {
    await expect(
      this.page.getByRole('alert').filter({ hasText: text })
    ).toBeVisible();
  }

  async expectPasswordVisible() {
    await expect(this.passwordInput()).toHaveAttribute('type', 'text');
  }

  async expectPasswordHidden() {
    await expect(this.passwordInput()).toHaveAttribute('type', 'password');
  }
}
