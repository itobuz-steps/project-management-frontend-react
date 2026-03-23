import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async visit() {
    await this.page.goto('http://localhost:5173/login');
  }

  getEmail() {
    return this.page.locator('input[type="email"]');
  }

  getPassword() {
    return this.page.locator('input[name="password"]');
  }

  getLoginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  getForgotLink() {
    return this.page.getByRole('link', { name: 'Forgot password?' });
  }

  async fillEmail(email: string) {
    await this.getEmail().fill(email);
  }

  async fillPassword(password: string) {
    await this.getPassword().fill(password);
  }

  async submit() {
    await this.getLoginButton().click();
  }

  async togglePasswordVisibility() {
    await this.page.locator('button[type="button"]').first().click();
  }

  getValidationErrors() {
    return this.page.locator('p.text-red-400, p.dark\\:text-red-300');
  }
}
