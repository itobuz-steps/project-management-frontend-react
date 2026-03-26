// Forgot Password Page Object
export class ForgotPasswordPage {
  visit() {
    cy.visit('http://localhost:5173/forgot-password');
  }

  waitForPageLoad() {
    cy.get('h1').should('contain', 'Reset Password');
  }

  getEmailInput() {
    return cy.get('#email-input');
  }

  getSendOtpButton() {
    return cy.get('.send');
  }

  getOtpInput() {
    return cy.get('#otp-input');
  }

  getPasswordInput() {
    return cy.get('#password-input');
  }

  getPasswordToggleButton() {
    return cy.get('.new-password button[type="button"]');
  }

  getResetButton() {
    return cy.get('.reset-button');
  }

  getBackToLoginLink() {
    return cy.get('a').contains('Back to Login');
  }

  fillEmail(email: string) {
    this.getEmailInput().type(email);
    return this;
  }

  sendOtp() {
    this.getSendOtpButton().click();
    return this;
  }

  fillOtp(otp: string) {
    this.getOtpInput().type(otp);
    return this;
  }

  fillPassword(password: string) {
    // Wait for field to be enabled
    this.getPasswordInput().should('not.be.disabled');
    // Type password (clear with force if needed)
    this.getPasswordInput().type(password, { force: true });
    return this;
  }

  togglePasswordVisibility() {
    this.getPasswordToggleButton().click();
    return this;
  }

  submitReset() {
    this.getResetButton().click();
    return this;
  }

  getEmailError() {
    return cy.get('.mr-auto').contains('p', /email/i);
  }

  getOtpError() {
    return cy.get('.mr-auto').contains('p', /otp/i);
  }

  getPasswordError() {
    return cy.get('.mr-auto').contains('p', /password/i);
  }

  getErrorMessages() {
    return cy.get('.mr-auto p.text-red-400');
  }
}

export const forgotPasswordPage = new ForgotPasswordPage();
