import { test, expect, type Page } from '@playwright/test';
import { stubAuth } from '../tests/mocks/auth.mock';
import { LoginPage } from '../tests/pages/LoginPage';

async function getLocalStorageValue(page: Page, key: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await page.evaluate(
        (localStorageKey) => window.localStorage.getItem(localStorageKey),
        key
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Execution context was destroyed')
      ) {
        await page.waitForTimeout(100);
        continue;
      }
      throw error;
    }
  }

  return null;
}

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.visit();
  });

  test.describe('TS-Login-001: Render Login Form', () => {
    test('should display email and password fields with forgot password link and login button', async () => {
      await expect(loginPage.getEmail()).toBeVisible();
      await expect(loginPage.getEmail()).toHaveAttribute(
        'placeholder',
        'Enter Email'
      );
      await expect(loginPage.getPassword()).toBeVisible();
      await expect(loginPage.getLoginButton()).toBeVisible();
      await expect(loginPage.getForgotLink()).toBeVisible();
    });
  });

  test.describe('TS-Login-002: Login Flow', () => {
    test('should successfully login with valid credentials', async ({
      page,
    }) => {
      await stubAuth(page, 200, {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        user: { _id: 'user-123', email: 'devjyoti.banerjee@itobuz.com' },
      });

      await loginPage.fillEmail('devjyoti.banerjee@itobuz.com');
      await loginPage.fillPassword('Password@123');
      await loginPage.submit();

      await expect(page).toHaveURL(/\/for-you/);

      await expect
        .poll(() => getLocalStorageValue(page, 'access_token'))
        .toBe('valid-access-token');
      await expect
        .poll(() => getLocalStorageValue(page, 'refresh_token'))
        .toBe('valid-refresh-token');
    });

    test('should show error toast on invalid credentials', async ({ page }) => {
      await stubAuth(page, 401, { message: 'Invalid credentials' });

      await loginPage.fillEmail('wrong@mail.com');
      await loginPage.fillPassword('wrongpass');
      await loginPage.submit();

      await expect(
        page.getByText('Login failed: Invalid credentials')
      ).toBeVisible();
    });
  });

  test.describe('TS-Login-003: Form Validation', () => {
    test('should display validation errors when form is empty', async () => {
      await loginPage.submit();
      await expect(loginPage.getValidationErrors()).toHaveCount(2);
    });

    test('should show email validation error for invalid email format', async ({
      page,
    }) => {
      await loginPage.fillEmail('abc');
      await loginPage.fillPassword('password123');
      await loginPage.getEmail().focus();
      await loginPage.getEmail().blur();

      await expect(page.getByText(/email/i).first()).toBeVisible();
    });

    test('should show password validation error for short password', async ({
      page,
    }) => {
      await loginPage.fillEmail('devjyoti.banerjee@itobuz.com');
      await loginPage.fillPassword('PASS');
      await loginPage.getPassword().blur();

      await expect(page.getByText(/password/i).first()).toBeVisible();
    });
  });

  test.describe('TS-Login-004: UI Interactions', () => {
    test('should toggle password visibility when clicking eye icon', async ({
      page,
    }) => {
      await expect(loginPage.getPassword()).toBeVisible();

      await loginPage.togglePasswordVisibility();
      await expect(
        page.locator('input[type="text"][placeholder="Enter Password"]')
      ).toBeVisible();

      await loginPage.togglePasswordVisibility();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });
  });

  test.describe('TS-Login-005: Navigation', () => {
    test('should navigate to forgot password page when clicking the link', async ({
      page,
    }) => {
      await loginPage.getForgotLink().click();
      await expect(page).toHaveURL(/\/forgot-password/);
    });

    test('should redirect to For You page after successful login', async ({
      page,
    }) => {
      await stubAuth(page, 200, {
        accessToken: 'token',
        refreshToken: 'refresh',
      });

      await loginPage.fillEmail('devjyoti.banerjee@itobuz.com');
      await loginPage.fillPassword('Password@123');
      await loginPage.submit();

      await expect(page).toHaveURL(/\/for-you/);
    });
  });

  test.describe('TS-Login-006: Data Persistence', () => {
    test('should store access_token and refresh_token in localStorage after successful login', async ({
      page,
    }) => {
      await stubAuth(page, 200, {
        accessToken: 'test-access-token-12345',
        refreshToken: 'test-refresh-token-12345',
      });

      await loginPage.fillEmail('devjyoti.banerjee@itobuz.com');
      await loginPage.fillPassword('Password@123');
      await loginPage.submit();
      await expect(page).toHaveURL(/\/for-you/);

      await expect
        .poll(() => getLocalStorageValue(page, 'access_token'))
        .toBe('test-access-token-12345');
      await expect
        .poll(() => getLocalStorageValue(page, 'refresh_token'))
        .toBe('test-refresh-token-12345');
    });
  });

  test.describe('Additional Edge Cases', () => {
    test('should show error when user is not found', async ({ page }) => {
      await stubAuth(page, 404, { message: 'User not found' });

      await loginPage.fillEmail('nonexistent@example.com');
      await loginPage.fillPassword('Password@123');
      await loginPage.submit();

      await expect(
        page.getByText('Login failed: User not found')
      ).toBeVisible();
    });

    test('should show error on server error (500)', async ({ page }) => {
      await stubAuth(page, 500, { message: 'Internal server error' });

      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('Password@123');
      await loginPage.submit();

      await expect(page.getByText(/Login failed/i)).toBeVisible();
    });

    test('should submit form when pressing Enter key', async ({ page }) => {
      await stubAuth(page, 200, {
        accessToken: 'token',
        refreshToken: 'refresh',
      });

      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('Password@123');
      await loginPage.getPassword().press('Enter');

      await expect(page).toHaveURL(/\/for-you/);
    });

    test('should not store tokens in localStorage on failed login', async ({
      page,
    }) => {
      await stubAuth(page, 401, { message: 'Invalid credentials' });

      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('WrongPassword');
      await loginPage.submit();

      await expect
        .poll(() => getLocalStorageValue(page, 'access_token'))
        .toBe(null);
      await expect
        .poll(() => getLocalStorageValue(page, 'refresh_token'))
        .toBe(null);
    });

    test('should allow clearing and retyping fields', async () => {
      await loginPage.fillEmail('wrong@example.com');
      await loginPage.fillPassword('WrongPass');

      await loginPage.getEmail().clear();
      await loginPage.getPassword().clear();

      await expect(loginPage.getEmail()).toHaveValue('');
      await expect(loginPage.getPassword()).toHaveValue('');

      await loginPage.fillEmail('correct@example.com');
      await loginPage.fillPassword('CorrectPass@123');

      await expect(loginPage.getEmail()).toHaveValue('correct@example.com');
      await expect(loginPage.getPassword()).toHaveValue('CorrectPass@123');
    });
  });
});
