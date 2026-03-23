import { type Page } from '@playwright/test';

export class VerifyOtpPage {
  constructor(private readonly page: Page) {}

  async visit(email?: string) {
    const url = email
      ? `http://localhost:5173/verify-otp?email=${encodeURIComponent(email)}`
      : 'http://localhost:5173/verify-otp';

    await this.page.goto(url);
  }

  getOtpInput() {
    return this.page.locator('input#otp-input');
  }

  getVerifyButton() {
    return this.page.getByRole('button', { name: 'Verify' });
  }

  getResendLink() {
    return this.page.getByText('Resend OTP');
  }

  getOtpValidationMessage() {
    return this.page.getByText('Please enter a valid OTP.');
  }

  async fillOtp(otp: string) {
    await this.getOtpInput().fill(otp);
  }

  async submit() {
    await this.getVerifyButton().click();
  }

  async resend() {
    await this.getResendLink().click();
  }
}
