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

export async function mockSendOtpSuccess(page: Page) {
  await page.route('**/auth/send-otp', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'OTP sent' }),
    })
  );
}

export async function mockSendOtpFailure(page: Page) {
  await page.route('**/auth/send-otp', (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'User not found' }),
    })
  );
}

export async function mockResetPasswordSuccess(page: Page) {
  await page.route('**/auth/reset-password', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Password reset successful' }),
    })
  );
}

export async function mockResetPasswordInvalidOtp(page: Page) {
  await page.route('**/auth/reset-password', (route) =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Invalid OTP' }),
    })
  );
}

export async function mockProfileApis(page: Page) {
  let currentUser = {
    name: 'OldUser',
    email: 'test@example.com',
    profileImage: '/profile.png',
    notificationPreferences: {
      push: true,
      email: true,
      inApp: true,
    },
  };

  await page.route('**/auth/profile', async (route, request) => {
    if (request.method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: currentUser }),
      });
    }

    if (request.method() === 'PATCH') {
      let name = currentUser.name;

      const contentType = request.headers()['content-type'] || '';

      try {
        if (contentType.includes('application/json')) {
          const body = request.postDataJSON();
          name = body.name ?? name;
        } else {
          // handle multipart/form-data safely
          const raw = request.postData() || '';
          const match = raw.match(/name="name"\r\n\r\n(.+)\r\n/);
          if (match) name = match[1];
        }
      } catch {
        // do nothing → don't break test
      }

      currentUser = {
        ...currentUser,
        name,
      };

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: currentUser }),
      });
    }

    return route.continue();
  });
}
