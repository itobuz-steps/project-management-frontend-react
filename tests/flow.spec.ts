import { test, expect } from '@playwright/test';

test('full auth flow: signup → verify → login', async ({ page }) => {
  // mock all APIs
  await page.route('**/auth/signup', (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
  );

  await page.route('**/auth/verify', (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
  );

  await page.route('**/auth/login', (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        accessToken: 'token',
        refreshToken: 'refresh',
      }),
    })
  );

  // SIGNUP
  await page.goto('http://localhost:5173/signup');

  await page.getByPlaceholder('Enter Username').fill('testuser');
  await page.getByPlaceholder('Enter Email').fill('test@example.com');
  await page.getByPlaceholder('Enter Password').fill('Password1!');
  await page.getByRole('button', { name: 'Sign Up' }).click();

  await expect(page).toHaveURL(/verify-otp/);

  // VERIFY OTP
  await page.getByPlaceholder('Enter OTP').fill('123456');
  await page.getByRole('button', { name: 'Verify' }).click();

  await expect(page).toHaveURL(/login/);

  // LOGIN
  await page.getByPlaceholder('Enter Email').fill('test@example.com');
  await page.getByPlaceholder('Enter Password').fill('Password1!');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/for-you/);
});
