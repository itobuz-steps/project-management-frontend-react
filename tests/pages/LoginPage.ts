import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  // locators
  emailInput = () => this.page.getByPlaceholder('Enter Email');
  passwordInput = () => this.page.getByPlaceholder('Enter Password');
  loginBtn = () => this.page.getByRole('button', { name: 'Login' });
  passwordToggle = () => this.page.locator('button[type="button"]');
  forgotPasswordLink = () => this.page.getByText('Forgot password?');

  form = () => this.page.locator('form');

  // actions
  async fillForm(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
  }

  async submit() {
    await this.loginBtn().click();
  }

  async togglePassword() {
    await this.passwordToggle().click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink().click();
  }

  // assertions
  async expectRedirectToHome() {
    await expect(this.page).toHaveURL(/for-you/);
  }

  async expectFieldError(text: string) {
    await expect(this.form().locator('p', { hasText: text })).toBeVisible();
  }

  async expectToastError(text: string) {
    await expect(
      this.page.getByRole('alert').filter({ hasText: text })
    ).toBeVisible();
  }

  async expectPasswordHidden() {
    await expect(this.passwordInput()).toHaveAttribute('type', 'password');
  }

  async expectPasswordVisible() {
    await expect(this.passwordInput()).toHaveAttribute('type', 'text');
  }

  async expectForgotPasswordRedirect() {
    await expect(this.page).toHaveURL(/forgot-password/);
  }

  async getTokens() {
    return await this.page.evaluate(() => ({
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token'),
    }));
  }
}
