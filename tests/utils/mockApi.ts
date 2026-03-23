import { Page } from '@playwright/test';

export async function mockVerifySuccess(page: Page) {
  await page.route('**/auth/verify', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  );
}

export async function mockVerifyFailure(page: Page) {
  await page.route('**/auth/verify', (route) =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Invalid OTP' }),
    })
  );
}

export async function mockResendOtp(page: Page) {
  await page.route('**/auth/send-otp', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  );
}

export async function mockSignupSuccess(page: Page) {
  await page.route('**/auth/signup', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  );
}

export async function mockSignupDuplicate(page: Page) {
  await page.route('**/auth/signup', (route) =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'User already exists' }),
    })
  );
}

export async function mockLoginSuccess(page: Page) {
  await page.route('**/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: 'token',
        refreshToken: 'refresh',
      }),
    })
  );
}

export async function mockLoginFailure(page: Page) {
  await page.route('**/auth/login', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Invalid credentials',
      }),
    })
  );
}
