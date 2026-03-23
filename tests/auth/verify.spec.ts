import { test } from '@playwright/test';
import { VerifyOtpPage } from '../pages/VerifyOtpPage';
import {
  mockVerifySuccess,
  mockVerifyFailure,
  mockResendOtp,
} from '../utils/mockApi';

test.describe('Verify OTP Module', () => {
  test('TC_VerifyOTP_001 - Valid OTP', async ({ page }) => {
    const otpPage = new VerifyOtpPage(page);

    await mockVerifySuccess(page);
    await otpPage.goto();

    await otpPage.enterOtp('123456');
    await otpPage.clickVerify();

    await otpPage.expectRedirectToLogin();
  });

  test('TC_VerifyOTP_002 - Invalid OTP', async ({ page }) => {
    const otpPage = new VerifyOtpPage(page);

    await mockVerifyFailure(page);
    await otpPage.goto();

    await otpPage.enterOtp('000000');
    await otpPage.clickVerify();

    await otpPage.expectInvalidOtp();
  });

  test('TC_VerifyOTP_003 - Empty OTP', async ({ page }) => {
    const otpPage = new VerifyOtpPage(page);

    await otpPage.goto();
    await otpPage.clickVerify();

    await otpPage.expectOtpValidationError();
  });

  test('TC_VerifyOTP_004 - OTP Length Validation', async ({ page }) => {
    const otpPage = new VerifyOtpPage(page);

    await otpPage.goto();
    await otpPage.enterOtp('123');
    await otpPage.clickVerify();

    await otpPage.expectOtpValidationError();
  });

  test('TC_VerifyOTP_005 - Resend OTP', async ({ page }) => {
    const otpPage = new VerifyOtpPage(page);

    await mockResendOtp(page);
    await otpPage.goto();

    await otpPage.clickResend();

    await otpPage.expectResendSuccess();
  });

  test('TC_VerifyOTP_006 - Missing Email', async ({ page }) => {
    await page.goto('/verify-otp');

    await test.expect(page).toHaveURL(/signup/);
  });
});
