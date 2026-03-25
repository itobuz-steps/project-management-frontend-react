import { Page, expect } from '@playwright/test';

export class ForgotPasswordPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/forgot-password');
  }

  // locators
  emailInput = () => this.page.getByPlaceholder('Enter your email');
  otpInput = () => this.page.getByPlaceholder('Enter OTP');
  passwordInput = () => this.page.getByPlaceholder('Enter new password');

  sendOtpBtn = () => this.page.getByRole('button', { name: 'Send OTP' });
  resetBtn = () => this.page.getByRole('button', { name: 'Reset Password' });

  form = () => this.page.locator('form');

  // actions
  async enterEmail(email: string) {
    await this.emailInput().fill(email);
  }

  async enterOtp(otp: string) {
    await this.otpInput().fill(otp);
  }

  async enterPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  async clickSendOtp() {
    await this.sendOtpBtn().click();
  }

  async submit() {
    await this.resetBtn().click();
  }

  // assertions
  async expectToastSuccess(text: string) {
    await expect(
      this.page.getByRole('alert').filter({ hasText: text })
    ).toBeVisible();
  }

  async expectToastError(text: string) {
    await expect(
      this.page.getByRole('alert').filter({ hasText: text })
    ).toBeVisible();
  }

  async expectFieldError(text: string) {
    await expect(this.form().locator('p', { hasText: text })).toBeVisible();
  }

  async expectRedirectToLogin() {
    await expect(this.page).toHaveURL(/login/);
  }

  async expectFieldsDisabled() {
    await expect(this.otpInput()).toBeDisabled();
    await expect(this.passwordInput()).toBeDisabled();
  }

  async expectSendOtpDisabled() {
    await expect(this.sendOtpBtn()).toBeDisabled();
  }
}
