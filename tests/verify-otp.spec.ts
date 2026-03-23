import { test, expect } from '@playwright/test';
import { stubSendOtp, stubVerifyOtp } from '../tests/mocks/auth.mock';
import { VerifyOtpPage } from '../tests/pages/VerifyOtpPage';

test.describe('VerifyOtpForm - Complete Test Suite', () => {
  let verifyOtpPage: VerifyOtpPage;

  test.beforeEach(async ({ page }) => {
    verifyOtpPage = new VerifyOtpPage(page);
    await verifyOtpPage.visit('test@example.com');
  });

  test.describe('TS-OTP-001: Render Verify OTP Form', () => {
    test('should display OTP input field and verify button', async () => {
      await expect(verifyOtpPage.getOtpInput()).toBeVisible();
      await expect(verifyOtpPage.getOtpInput()).toHaveAttribute(
        'placeholder',
        'Enter OTP'
      );
      await expect(verifyOtpPage.getOtpInput()).toHaveAttribute('type', 'text');
      await expect(verifyOtpPage.getVerifyButton()).toBeVisible();
    });

    test('should display resend OTP link', async ({ page }) => {
      await expect(verifyOtpPage.getResendLink()).toBeVisible();
      await expect(page.getByText("Didn't receive the OTP?")).toBeVisible();
    });

    test('should have autoComplete off for OTP input', async () => {
      await expect(verifyOtpPage.getOtpInput()).toHaveAttribute(
        'autocomplete',
        'off'
      );
    });
  });

  test.describe('TS-OTP-002: OTP Verification Flow', () => {
    test('should successfully verify OTP with valid code', async ({ page }) => {
      await stubVerifyOtp(page, 200, {
        message: 'OTP verified successfully',
        user: {
          _id: 'user-123',
          email: 'test@example.com',
        },
      });

      await verifyOtpPage.fillOtp('123456');
      await verifyOtpPage.submit();

      await expect(page.getByText('OTP Verified successfully!')).toBeVisible();
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('should show error on invalid OTP', async ({ page }) => {
      await stubVerifyOtp(page, 400, {
        message: 'Invalid OTP',
      });

      await verifyOtpPage.fillOtp('000000');
      await verifyOtpPage.submit();

      await expect(
        page.getByText('OTP Verification failed: Invalid OTP')
      ).toBeVisible();
    });

    test('should show error when OTP is expired', async ({ page }) => {
      await stubVerifyOtp(page, 410, {
        message: 'OTP has expired',
      });

      await verifyOtpPage.fillOtp('123456');
      await verifyOtpPage.submit();

      await expect(
        page.getByText('OTP Verification failed: OTP has expired')
      ).toBeVisible();
    });

    test('should show error on server error', async ({ page }) => {
      await stubVerifyOtp(page, 500, {
        message: 'Internal server error',
      });

      await verifyOtpPage.fillOtp('123456');
      await verifyOtpPage.submit();

      await expect(page.getByText(/OTP Verification failed/i)).toBeVisible();
    });
  });

  test.describe('TS-OTP-003: Form Validation', () => {
    test('should show error when OTP field is empty', async () => {
      await verifyOtpPage.submit();
      await expect(verifyOtpPage.getOtpValidationMessage()).toBeVisible();
    });

    test('should show error when OTP is less than 6 digits', async () => {
      await verifyOtpPage.fillOtp('12345');
      await verifyOtpPage.submit();
      await expect(verifyOtpPage.getOtpValidationMessage()).toBeVisible();
    });
  });

  test.describe('TS-OTP-004: Resend OTP Flow', () => {
    test('should successfully resend OTP', async ({ page }) => {
      await stubSendOtp(page, 200, {
        message: 'OTP sent successfully',
      });

      await verifyOtpPage.resend();
      await expect(page.getByText('OTP resent successfully!')).toBeVisible();
    });

    test('should show error when resend OTP fails', async ({ page }) => {
      await stubSendOtp(page, 400, {
        error: 'Too many resend attempts',
      });

      await verifyOtpPage.resend();
      await expect(
        page.getByText('Resend OTP failed: Too many resend attempts')
      ).toBeVisible();
    });

    test('should show error on server error during resend', async ({
      page,
    }) => {
      await stubSendOtp(page, 500, {
        error: 'Internal server error',
      });

      await verifyOtpPage.resend();
      await expect(page.getByText(/Resend OTP failed/i)).toBeVisible();
    });
  });

  test.describe('TS-OTP-005: URL Parameter Handling', () => {
    test('should redirect to signup when email is missing from URL', async ({
      page,
    }) => {
      await verifyOtpPage.visit();
      await expect(
        page.getByText('Email is required for OTP verification.')
      ).toBeVisible();
      await expect(page).toHaveURL(/\/signup/);
    });

    test('should stay on OTP page when email is in URL', async ({ page }) => {
      await verifyOtpPage.visit('test@example.com');
      await expect(page).toHaveURL(/\/verify-otp/);
      await expect(page).toHaveURL(/email=/);
    });

    test('should handle URL encoded email parameter', async () => {
      await verifyOtpPage.visit('test+1@example.com');
      await expect(verifyOtpPage.getOtpInput()).toBeVisible();
    });
  });

  test.describe('TS-OTP-006: User Interactions', () => {
    test('should allow typing in OTP field', async () => {
      await verifyOtpPage.fillOtp('123456');
      await expect(verifyOtpPage.getOtpInput()).toHaveValue('123456');
    });

    test('should allow clearing OTP field', async () => {
      await verifyOtpPage.fillOtp('123456');
      await verifyOtpPage.getOtpInput().clear();
      await expect(verifyOtpPage.getOtpInput()).toHaveValue('');
    });

    test('should submit form when pressing Enter', async ({ page }) => {
      await stubVerifyOtp(page, 200, {
        message: 'OTP verified successfully',
      });

      await verifyOtpPage.fillOtp('123456');
      await verifyOtpPage.getOtpInput().press('Enter');

      await expect(page.getByText('OTP Verified successfully!')).toBeVisible();
    });

    test('should trigger resend OTP when link is clicked', async ({ page }) => {
      await stubSendOtp(page, 200, {
        message: 'OTP sent successfully',
      });

      await verifyOtpPage.resend();
      await expect(page.getByText('OTP resent successfully!')).toBeVisible();
    });
  });

  test.describe('TS-OTP-007: Navigation', () => {
    test('should redirect to login page after successful verification', async ({
      page,
    }) => {
      await stubVerifyOtp(page, 200, {
        message: 'OTP verified successfully',
      });

      await verifyOtpPage.fillOtp('123456');
      await verifyOtpPage.submit();

      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('should stay on OTP page when verification fails', async ({
      page,
    }) => {
      await stubVerifyOtp(page, 400, {
        message: 'Invalid OTP',
      });

      await verifyOtpPage.fillOtp('000000');
      await verifyOtpPage.submit();

      await expect(page).toHaveURL(/\/verify-otp/);
    });
  });

  test.describe('Additional Edge Cases', () => {
    test('should accept numeric OTP input', async () => {
      await verifyOtpPage.fillOtp('123456');
      await expect(verifyOtpPage.getOtpInput()).toHaveValue('123456');
    });

    test('should allow multiple verification attempts', async ({ page }) => {
      await stubVerifyOtp(page, 400, {
        message: 'Invalid OTP',
      });

      await verifyOtpPage.fillOtp('000000');
      await verifyOtpPage.submit();

      await verifyOtpPage.getOtpInput().clear();
      await verifyOtpPage.fillOtp('111111');
      await verifyOtpPage.submit();

      await expect(
        page.getByText(/OTP Verification failed/i).first()
      ).toBeVisible();
    });

    test('should allow resending OTP and then verifying', async ({ page }) => {
      await stubSendOtp(page, 200, {
        message: 'OTP sent successfully',
      });

      await stubVerifyOtp(page, 200, {
        message: 'OTP verified successfully',
      });

      await verifyOtpPage.resend();
      await expect(page.getByText('OTP resent successfully!')).toBeVisible();

      await verifyOtpPage.fillOtp('654321');
      await verifyOtpPage.submit();
      await expect(page.getByText('OTP Verified successfully!')).toBeVisible();
    });

    test('should show error message for invalid OTP', async () => {
      await verifyOtpPage.submit();
      await expect(verifyOtpPage.getOtpValidationMessage()).toBeVisible();
    });

    test('should have submit button of correct type', async () => {
      await expect(verifyOtpPage.getVerifyButton()).toHaveAttribute(
        'type',
        'submit'
      );
    });
  });
});
