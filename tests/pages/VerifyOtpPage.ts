import { Page, expect } from '@playwright/test';

export class VerifyOtpPage {
  constructor(private page: Page) {}

  async goto(email = 'test@example.com') {
    await this.page.goto(`/verify-otp?email=${email}`);
  }

  // locators
  otpInput = () => this.page.getByPlaceholder('Enter OTP');
  verifyBtn = () => this.page.getByRole('button', { name: 'Verify' });
  resendBtn = () => this.page.getByText('Resend OTP');

  // actions
  async enterOtp(otp: string) {
    await this.otpInput().fill(otp);
  }

  async clickVerify() {
    await this.verifyBtn().click();
  }

  async clickResend() {
    await this.resendBtn().click();
  }

  // assertions
  async expectInvalidOtp() {
    await expect(this.page.getByText(/Invalid OTP/i).first()).toBeVisible();
  }

  async expectOtpValidationError() {
    await expect(
      this.page.locator('form').getByText(/Please enter a valid OTP/i)
    ).toBeVisible();
  }

  async expectRedirectToLogin() {
    await expect(this.page).toHaveURL(/login/);
  }

  async expectResendSuccess() {
    await expect(
      this.page.getByText(/OTP resent successfully/i).first()
    ).toBeVisible();
  }
}
