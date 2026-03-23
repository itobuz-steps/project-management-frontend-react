import { test, expect } from '@playwright/test';
import { stubSignup } from '../tests/mocks/auth.mock';
import { SignupPage } from '../tests/pages/SignupPage';

test.describe('Signup', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.visit();
  });

  test.describe('TS-Signup-001: Render Signup Form', () => {
    test('should display username, email, and password fields with Sign Up button', async () => {
      await expect(signupPage.getUsername()).toBeVisible();
      await expect(signupPage.getEmail()).toBeVisible();
      await expect(signupPage.getPassword()).toBeVisible();
      await expect(signupPage.getSignUpButton()).toBeVisible();
    });
  });

  test.describe('TS-Signup-002: Form Validation', () => {
    test('should display validation errors for all required fields when empty', async () => {
      await signupPage.submit();
      await expect(signupPage.getValidationErrors()).toHaveCount(3);
    });

    test('should show email validation error for invalid email format', async ({
      page,
    }) => {
      await signupPage.fillUsername('testuser');
      await signupPage.fillEmail('abc');
      await signupPage.fillPassword('Password@123');
      await signupPage.getEmail().focus();
      await signupPage.getEmail().blur();

      await expect(page.getByText(/email/i).first()).toBeVisible();
    });

    test('should show password validation error for weak password', async ({
      page,
    }) => {
      await signupPage.fillUsername('testuser');
      await signupPage.fillEmail('test@example.com');
      await signupPage.fillPassword('123');
      await signupPage.getPassword().blur();

      await expect(page.getByText(/password/i).first()).toBeVisible();
    });

    test('should show username validation error when left empty', async () => {
      await signupPage.fillEmail('test@example.com');
      await signupPage.fillPassword('Password@123');
      await signupPage.submit();

      await expect(
        signupPage
          .getValidationErrors()
          .filter({ hasText: 'Username is required' })
          .first()
      ).toBeVisible();
    });
  });

  test.describe('TS-Signup-003: Signup Flow', () => {
    test('should successfully signup with valid credentials', async ({
      page,
    }) => {
      await stubSignup(page, 201, {
        message: 'User created successfully',
        user: {
          _id: 'user-new-123',
          username: 'newuser',
          email: 'devjyoti.banerjee+3@itobuz.com',
        },
      });

      await signupPage.fillUsername('newuser');
      await signupPage.fillEmail('devjyoti.banerjee+3@itobuz.com');
      await signupPage.fillPassword('Password@123');
      await signupPage.submit();

      await expect(page).toHaveURL(/\/verify-otp\?email=/);
    });

    test('should show error message when signup fails with existing email', async ({
      page,
    }) => {
      await stubSignup(page, 400, { message: 'Email already exists' });

      await signupPage.fillUsername('someuser');
      await signupPage.fillEmail('devjyoti.banerjee@itobuz.com');
      await signupPage.fillPassword('Password@123');
      await signupPage.submit();

      await expect(
        page.getByText('Signup failed: Email already exists')
      ).toBeVisible();
    });
  });

  test.describe('TS-Signup-004: UI Interactions', () => {
    test('should toggle password visibility when clicking eye icon', async ({
      page,
    }) => {
      await expect(signupPage.getPassword()).toBeVisible();

      await signupPage.togglePasswordVisibility();
      await expect(
        page.locator('input[type="text"][placeholder="Enter Password"]')
      ).toBeVisible();

      await signupPage.togglePasswordVisibility();
      await expect(
        page.locator('input[type="password"][placeholder="Enter Password"]')
      ).toBeVisible();
    });
  });

  test.describe('TS-Signup-005: Navigation & URL Handling', () => {
    test('should encode email properly in redirect URL', async ({ page }) => {
      const testEmail = 'test@mail.com';

      await stubSignup(page, 201, {
        message: 'User created successfully',
        user: { _id: 'user-123', username: 'testuser', email: testEmail },
      });

      await signupPage.fillUsername('testuser');
      await signupPage.fillEmail(testEmail);
      await signupPage.fillPassword('Password@123');
      await signupPage.submit();

      await expect(page).toHaveURL(
        new RegExp(`/verify-otp\\?email=${encodeURIComponent(testEmail)}`)
      );
    });
  });

  test.describe('TS-Signup-006: Error Handling UI', () => {
    test('should display error messages below respective fields', async () => {
      await signupPage.fillUsername('abc');
      await signupPage.fillEmail('invalid');
      await signupPage.fillPassword('weak');
      await signupPage.getEmail().focus();
      await signupPage.getEmail().blur();

      await expect(signupPage.getValidationErrors().first()).toBeVisible();
    });

    test('should prevent API call when form is invalid', async ({ page }) => {
      let apiCalled = false;

      await page.route('**/auth/signup', async (route) => {
        apiCalled = true;
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid data' }),
        });
      });

      await signupPage.submit();
      await page.waitForTimeout(500);

      await expect(apiCalled).toBeFalsy();
    });
  });

  test.describe('TS-Signup-007: Button Interaction', () => {
    test('should trigger form submit when clicking Sign Up button', async ({
      page,
    }) => {
      await stubSignup(page, 201, { message: 'User created successfully' });

      await signupPage.fillUsername('newuser');
      await signupPage.fillEmail('new@example.com');
      await signupPage.fillPassword('Password@123');
      await signupPage.submit();

      await expect(page).toHaveURL(/\/verify-otp\?email=/);
    });
  });

  test.describe('Additional Edge Cases', () => {
    test('should allow typing in all form fields', async () => {
      await signupPage.fillUsername('johndoe');
      await signupPage.fillEmail('john@example.com');
      await signupPage.fillPassword('SecurePass123');

      await expect(signupPage.getUsername()).toHaveValue('johndoe');
      await expect(signupPage.getEmail()).toHaveValue('john@example.com');
      await expect(signupPage.getPassword()).toHaveValue('SecurePass123');
    });

    test('should allow clearing all filled fields', async () => {
      await signupPage.fillUsername('johndoe');
      await signupPage.fillEmail('john@example.com');
      await signupPage.fillPassword('SecurePass123');

      await signupPage.getUsername().clear();
      await signupPage.getEmail().clear();
      await signupPage.getPassword().clear();

      await expect(signupPage.getUsername()).toHaveValue('');
      await expect(signupPage.getEmail()).toHaveValue('');
      await expect(signupPage.getPassword()).toHaveValue('');
    });

    test('should submit form when pressing Enter key', async ({ page }) => {
      await stubSignup(page, 201, { message: 'User created successfully' });

      await signupPage.fillUsername('newuser');
      await signupPage.fillEmail('new@example.com');
      await signupPage.fillPassword('Password@123');
      await signupPage.getPassword().press('Enter');

      await expect(page).toHaveURL(/\/verify-otp\?email=/);
    });

    test('should show error on server error (500)', async ({ page }) => {
      await stubSignup(page, 500, { message: 'Internal server error' });

      await signupPage.fillUsername('newuser');
      await signupPage.fillEmail('new@example.com');
      await signupPage.fillPassword('Password@123');
      await signupPage.submit();

      await expect(page.getByText(/Signup failed/i)).toBeVisible();
    });

    test('should stay on signup page when signup fails', async ({ page }) => {
      await stubSignup(page, 400, { message: 'Email already exists' });

      await signupPage.fillUsername('someuser');
      await signupPage.fillEmail('taken@example.com');
      await signupPage.fillPassword('Password@123');
      await signupPage.submit();

      await expect(page).toHaveURL(/\/signup/);
    });

    test('should handle duplicate email with 409 Conflict status', async ({
      page,
    }) => {
      await stubSignup(page, 409, { message: 'Email already registered' });

      await signupPage.fillUsername('newuser');
      await signupPage.fillEmail('existing@example.com');
      await signupPage.fillPassword('Password@123');
      await signupPage.submit();

      await expect(
        page.getByText('Signup failed: Email already registered')
      ).toBeVisible();
    });
  });
});
