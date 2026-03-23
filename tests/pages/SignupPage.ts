import { type Page } from '@playwright/test';

export class SignupPage {
  constructor(private readonly page: Page) {}

  async visit() {
    await this.page.goto('http://localhost:5173/signup');
  }

  getUsername() {
    return this.page.locator('input[name="username"]');
  }

  getEmail() {
    return this.page.locator('input[type="email"]');
  }

  getPassword() {
    return this.page.locator('input[name="password"]');
  }

  getSignUpButton() {
    return this.page.getByRole('button', { name: 'Sign Up' });
  }

  async fillUsername(username: string) {
    await this.getUsername().fill(username);
  }

  async fillEmail(email: string) {
    await this.getEmail().fill(email);
  }

  async fillPassword(password: string) {
    await this.getPassword().fill(password);
  }

  async submit() {
    await this.getSignUpButton().click();
  }

  async togglePasswordVisibility() {
    await this.page.locator('button[type="button"]').first().click();
  }

  getValidationErrors() {
    return this.page.locator('p.text-red-400, p.dark\\:text-red-300');
  }
}
