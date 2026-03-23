import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { mockLoginSuccess, mockLoginFailure } from '../utils/mockApi';

test.describe('Login Module', () => {
  test('TC_Login_001 - Valid Login', async ({ page }) => {
    const login = new LoginPage(page);

    await mockLoginSuccess(page);
    await login.goto();

    await login.fillForm('test@example.com', 'Password1!');
    await login.submit();

    await login.expectRedirectToHome();
  });

  test('TC_Login_002 - Empty Form', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.submit();

    await login.expectFieldError('Email is required');
  });

  test('TC_Login_003 - Invalid Email', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.emailInput().fill('invalid');

    await login.expectFieldError('Please enter a valid email');
  });

  test('TC_Login_005 - Wrong Credentials', async ({ page }) => {
    const login = new LoginPage(page);

    await mockLoginFailure(page);
    await login.goto();

    await login.fillForm('test@example.com', 'wrongpass');
    await login.submit();

    await login.expectToastError('Invalid credentials');
  });

  test('TC_Login_007 - Password Toggle', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();

    await login.expectPasswordHidden();
    await login.togglePassword();
    await login.expectPasswordVisible();
  });

  test('TC_Login_008 - Forgot Password Navigation', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.clickForgotPassword();

    await login.expectForgotPasswordRedirect();
  });
});
