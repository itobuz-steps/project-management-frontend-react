import { test } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import {
  mockSendOtpSuccess,
  mockSendOtpFailure,
  mockResetPasswordSuccess,
  mockResetPasswordInvalidOtp,
} from '../utils/mockApi';

test.describe('Forgot Password Module', () => {
  // TC_025 - Send OTP
  test('TC_025 - Send OTP', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);

    await mockSendOtpSuccess(page);
    await forgot.goto();

    await forgot.enterEmail('test@example.com');
    await forgot.clickSendOtp();

    await forgot.expectToastSuccess('OTP sent successfully!');
  });

  // TC_026 - Invalid Email
  test('TC_026 - Invalid Email', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);

    await mockSendOtpFailure(page);
    await forgot.goto();

    await forgot.enterEmail('wrong@example.com');
    await forgot.clickSendOtp();

    await forgot.expectToastError('User not found');
  });

  // TC_027 - Empty Email
  test('TC_027 - Empty Email', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);

    await forgot.goto();
    await forgot.clickSendOtp();

    await forgot.expectFieldError('Email is required');
  });

  // TC_028 - Valid Reset
  test('TC_028 - Valid Reset', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);

    await mockSendOtpSuccess(page);
    await mockResetPasswordSuccess(page);

    await forgot.goto();

    await forgot.enterEmail('test@example.com');
    await forgot.clickSendOtp();

    await forgot.enterOtp('123456');
    await forgot.enterPassword('Password1!');
    await forgot.submit();

    await forgot.expectToastSuccess('Password reset successful!');
    await forgot.expectRedirectToLogin();
  });

  // TC_029 - Invalid OTP
  test('TC_029 - Invalid OTP', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);

    await mockSendOtpSuccess(page);
    await mockResetPasswordInvalidOtp(page);

    await forgot.goto();

    await forgot.enterEmail('test@example.com');
    await forgot.clickSendOtp();

    await forgot.enterOtp('000000');
    await forgot.enterPassword('Password1!');
    await forgot.submit();

    await forgot.expectToastError('Invalid OTP');
  });

  // TC_030 - Weak Password
  test('TC_030 - Weak Password', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);

    await mockSendOtpSuccess(page);
    await forgot.goto();

    await forgot.enterEmail('test@example.com');
    await forgot.clickSendOtp();

    await forgot.enterOtp('123456');
    await forgot.enterPassword('123'); // weak

    await forgot.submit();

    await forgot.expectFieldError('Password must');
  });

  // TC_031 - Disabled Fields Before OTP
  test('TC_031 - Disabled Fields Before OTP', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);

    await forgot.goto();

    await forgot.enterEmail('test@example.com');

    await forgot.expectFieldsDisabled();
  });

  // TC_032 - Cooldown Timer
  test('TC_032 - Cooldown Timer', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);

    await mockSendOtpSuccess(page);
    await forgot.goto();

    await forgot.enterEmail('test@example.com');
    await forgot.clickSendOtp();

    await forgot.expectSendOtpDisabled();
  });
});
