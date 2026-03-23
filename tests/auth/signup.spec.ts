import { test } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { mockSignupSuccess, mockSignupDuplicate } from '../utils/mockApi';

test.describe('Signup Module', () => {
  test('TC_SignUp_001 - Valid Signup', async ({ page }) => {
    const signup = new SignupPage(page);

    await mockSignupSuccess(page);
    await signup.goto();

    await signup.fillForm('testuser', 'test@example.com', 'Password1!');
    await signup.submit();

    await signup.expectRedirectToOtp();
  });

  test('TC_SignUp_002 - Empty Form', async ({ page }) => {
    const signup = new SignupPage(page);

    await signup.goto();
    await signup.submit();

    await signup.expectFieldError('Username is required');
    await signup.expectFieldError('Email is required');
    await signup.expectFieldError('Password is required');
  });

  test('TC_SignUp_003 - Invalid Email', async ({ page }) => {
    const signup = new SignupPage(page);

    await signup.goto();
    await signup.emailInput().fill('invalid');
    await signup.submit();

    await signup.expectFieldError('Please enter a valid email');
  });

  test('TC_SignUp_004 - Short Username', async ({ page }) => {
    const signup = new SignupPage(page);

    await signup.goto();
    await signup.usernameInput().fill('ab');
    await signup.submit();

    await signup.expectFieldError('Username must be at least 3 characters');
  });

  test('TC_SignUp_005 - Weak Password', async ({ page }) => {
    const signup = new SignupPage(page);

    await signup.goto();
    await signup.passwordInput().fill('weak');
    await signup.submit();

    await signup.expectFieldError('Password must be at least 8 characters');
  });

  test('TC_SignUp_006 - Duplicate Email', async ({ page }) => {
    const signup = new SignupPage(page);

    await mockSignupDuplicate(page);
    await signup.goto();

    await signup.fillForm('testuser', 'existing@example.com', 'Password1!');
    await signup.submit();

    await signup.expectToastError('User already exists');
  });

  test('TC_SignUp_007 - Password Toggle', async ({ page }) => {
    const signup = new SignupPage(page);

    await signup.goto();

    await signup.expectPasswordHidden();
    await signup.togglePassword();
    await signup.expectPasswordVisible();
  });

  test('TC_SignUp_008 - Field Error Messages', async ({ page }) => {
    const signup = new SignupPage(page);

    await signup.goto();
    await signup.emailInput().fill('invalid');
    await signup.submit();

    await signup.expectFieldError('Please enter a valid email');
  });
});
