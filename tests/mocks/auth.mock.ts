import { type Page } from '@playwright/test';
import {
  LoginPayload,
  SendOtpPayload,
  SignupPayload,
  VerifyOtpPayload,
} from '../types/auth.types';

export async function stubAuth(page: Page, status: number, body: LoginPayload) {
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export async function stubSignup(
  page: Page,
  status: number,
  body: SignupPayload
) {
  await page.route('**/auth/signup', async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export async function stubVerifyOtp(
  page: Page,
  status: number,
  body: VerifyOtpPayload
) {
  await page.route('**/auth/verify', async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export async function stubSendOtp(
  page: Page,
  status: number,
  body: SendOtpPayload
) {
  await page.route('**/auth/send-otp', async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}
