/// <reference types="cypress" />
import { forgotPasswordPage } from '../pages/forgotPasswordPage';
import {
  otpSentSuccess,
  otpSendFailure,
  passwordResetSuccess,
  invalidOtpError,
  passwordResetFailure,
} from '../fixtures/mockData';

describe('TS-FP-001: Forgot Password - Render Forgot Password Form', () => {
  beforeEach(() => {
    forgotPasswordPage.visit();
    forgotPasswordPage.waitForPageLoad();
  });

  it('TC_FP_001: Should display all form elements correctly', () => {
    // Verify page heading
    cy.get('h1').should('be.visible').and('contain', 'Reset Password');

    // Verify email input
    forgotPasswordPage.getEmailInput().should('be.visible');

    // Verify Send OTP button
    forgotPasswordPage
      .getSendOtpButton()
      .should('be.visible')
      .and('contain', 'Send OTP');

    // Verify OTP input is disabled initially
    forgotPasswordPage.getOtpInput().should('be.visible').and('be.disabled');

    // Verify password input is disabled initially
    forgotPasswordPage
      .getPasswordInput()
      .should('be.visible')
      .and('be.disabled');

    // Verify Reset button
    forgotPasswordPage
      .getResetButton()
      .should('be.visible')
      .and('contain', 'Reset Password');

    // Verify Back to Login link
    forgotPasswordPage
      .getBackToLoginLink()
      .should('be.visible')
      .and('contain', 'Back to Login');
  });
});

describe('TS-FP-002: Forgot Password - Send OTP Flow', () => {
  beforeEach(() => {
    forgotPasswordPage.visit();
    forgotPasswordPage.waitForPageLoad();
  });

  it('TC_FP_002: Should send OTP successfully with valid email', () => {
    // Mock successful OTP response
    cy.intercept('POST', '**/auth/send-otp', otpSentSuccess).as('sendOtp');

    // Enter valid email and send OTP
    forgotPasswordPage.fillEmail('test@example.com');
    forgotPasswordPage.sendOtp();

    // Wait for API response
    cy.wait('@sendOtp');

    // Verify success toast
    cy.get('.Toastify__toast--success', { timeout: 5000 }).should('be.visible');

    // Verify OTP field is enabled
    forgotPasswordPage.getOtpInput().should('not.be.disabled');

    // Verify password field is enabled
    forgotPasswordPage.getPasswordInput().should('not.be.disabled');
  });

  it('TC_FP_003: Should show validation error for invalid email', () => {
    // Enter invalid email
    forgotPasswordPage.fillEmail('abc');

    // Blur to trigger validation
    forgotPasswordPage.getEmailInput().blur();

    // Verify validation error is shown
    cy.get('.mr-auto p.text-red-400', { timeout: 5000 }).should('be.visible');

    // Verify Send OTP button is still visible
    forgotPasswordPage.getSendOtpButton().should('be.visible');
  });

  it('TC_FP_004: Should handle OTP send API failure', () => {
    // Mock OTP send failure
    cy.intercept('POST', '**/auth/send-otp', otpSendFailure).as('sendOtpFail');

    // Enter email and send OTP
    forgotPasswordPage.fillEmail('test@example.com');
    forgotPasswordPage.sendOtp();

    // Wait for API response
    cy.wait('@sendOtpFail');

    // Verify error toast is displayed
    cy.get('.Toastify__toast--error', { timeout: 5000 }).should('be.visible');
  });

  it('TC_FP_005: Should enforce OTP cooldown timer', () => {
    // Mock successful OTP response
    cy.intercept('POST', '**/auth/send-otp', otpSentSuccess).as('sendOtp');

    // Send OTP first time
    forgotPasswordPage.fillEmail('test@example.com');
    forgotPasswordPage.sendOtp();

    // Wait for API response
    cy.wait('@sendOtp');

    // Verify Send OTP button is disabled
    forgotPasswordPage.getSendOtpButton().should('be.disabled');

    // Wait a moment and verify it's still disabled
    cy.wait(2000);
    forgotPasswordPage.getSendOtpButton().should('be.disabled');
  });
});

describe('TS-FP-003: Forgot Password - Field State Management', () => {
  beforeEach(() => {
    forgotPasswordPage.visit();
    forgotPasswordPage.waitForPageLoad();
  });

  it('TC_FP_006: Should have OTP and password fields disabled initially', () => {
    // Verify OTP input is disabled
    forgotPasswordPage.getOtpInput().should('be.disabled');

    // Verify password input is disabled
    forgotPasswordPage.getPasswordInput().should('be.disabled');
  });

  it('TC_FP_007: Should enable fields after OTP is sent', () => {
    // Mock successful OTP response
    cy.intercept('POST', '**/auth/send-otp', otpSentSuccess).as('sendOtp');

    // Send OTP
    forgotPasswordPage.fillEmail('test@example.com');
    forgotPasswordPage.sendOtp();

    // Wait for API response
    cy.wait('@sendOtp');

    // Verify OTP field is enabled
    forgotPasswordPage.getOtpInput().should('not.be.disabled');

    // Verify password field is enabled
    forgotPasswordPage.getPasswordInput().should('not.be.disabled');
  });
});

describe('TS-FP-004: Forgot Password - Reset Password Flow', () => {
  beforeEach(() => {
    forgotPasswordPage.visit();
    forgotPasswordPage.waitForPageLoad();

    // Mock successful OTP send to enable fields
    cy.intercept('POST', '**/auth/send-otp', otpSentSuccess).as('sendOtp');
    forgotPasswordPage.fillEmail('test@example.com');
    forgotPasswordPage.sendOtp();
    cy.wait('@sendOtp');
  });

  it('TC_FP_008: Should successfully reset password', () => {
    // Mock successful reset response
    cy.intercept('POST', '**/auth/reset-password', passwordResetSuccess).as(
      'resetPassword'
    );

    // Fill form and submit
    forgotPasswordPage.fillOtp('123456');
    forgotPasswordPage.fillPassword('NewPassword@123');
    forgotPasswordPage.submitReset();

    // Wait for API response
    cy.wait('@resetPassword');

    // Verify success toast
    cy.get('.Toastify__toast--success', { timeout: 5000 }).should('be.visible');

    // Verify redirect to login page
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('TC_FP_009: Should handle invalid OTP error', () => {
    // Mock invalid OTP error
    cy.intercept('POST', '**/auth/reset-password', invalidOtpError).as(
      'resetPasswordFail'
    );

    // Fill form with wrong OTP
    forgotPasswordPage.fillOtp('000000');
    forgotPasswordPage.fillPassword('NewPassword@123');
    forgotPasswordPage.submitReset();

    // Wait for API response
    cy.wait('@resetPasswordFail');

    // Verify error toast
    cy.get('.Toastify__toast--error', { timeout: 5000 }).should('be.visible');
  });

  it('TC_FP_010: Should validate password strength', () => {
    // Enter weak password
    forgotPasswordPage.fillOtp('123456');
    forgotPasswordPage.fillPassword('123');

    // Blur to trigger validation
    forgotPasswordPage.getPasswordInput().blur();

    // Verify validation error is shown
    cy.get('.mr-auto p.text-red-400', { timeout: 5000 }).should('be.visible');
  });

  it('TC_FP_011: Should handle reset API failure', () => {
    // Mock reset failure
    cy.intercept('POST', '**/auth/reset-password', passwordResetFailure).as(
      'resetPasswordFail'
    );

    // Fill form and submit
    forgotPasswordPage.fillOtp('123456');
    forgotPasswordPage.fillPassword('NewPassword@123');
    forgotPasswordPage.submitReset();

    // Wait for API response
    cy.wait('@resetPasswordFail');

    // Verify error toast
    cy.get('.Toastify__toast--error', { timeout: 5000 }).should('be.visible');
  });
});

describe('TS-FP-005: Forgot Password - Form Validation', () => {
  beforeEach(() => {
    forgotPasswordPage.visit();
    forgotPasswordPage.waitForPageLoad();
  });

  it('TC_FP_012: Should show validation errors on empty form submission', () => {
    // Try to send OTP without email
    forgotPasswordPage.getSendOtpButton().click();

    // Verify validation error appears
    cy.get('.mr-auto p.text-red-400', { timeout: 5000 }).should('be.visible');
  });

  it('TC_FP_013: Should prevent reset without OTP being sent', () => {
    // Verify that OTP and password fields are disabled initially
    forgotPasswordPage.getOtpInput().should('be.disabled');
    forgotPasswordPage.getPasswordInput().should('be.disabled');

    // Verify reset button is still visible but form can't be submitted with disabled fields
    forgotPasswordPage.getResetButton().should('be.visible');

    // The form validation will prevent submission without required fields
  });
});

describe('TS-FP-006: Forgot Password - UI Interactions', () => {
  beforeEach(() => {
    forgotPasswordPage.visit();
    forgotPasswordPage.waitForPageLoad();

    // Mock successful OTP send to enable password field
    cy.intercept('POST', '**/auth/send-otp', otpSentSuccess).as('sendOtp');
    forgotPasswordPage.fillEmail('test@example.com');
    forgotPasswordPage.sendOtp();
    cy.wait('@sendOtp');
  });

  it('TC_FP_014: Should toggle password visibility', () => {
    // Fill password
    forgotPasswordPage.fillPassword('TestPassword@123');

    // Verify password is initially hidden (type="password")
    forgotPasswordPage
      .getPasswordInput()
      .should('have.attr', 'type', 'password');

    // Toggle visibility
    forgotPasswordPage.togglePasswordVisibility();

    // Verify password is now visible (type="text")
    forgotPasswordPage.getPasswordInput().should('have.attr', 'type', 'text');

    // Toggle again
    forgotPasswordPage.togglePasswordVisibility();

    // Verify password is hidden again
    forgotPasswordPage
      .getPasswordInput()
      .should('have.attr', 'type', 'password');
  });

  it('TC_FP_015: Should navigate back to login page', () => {
    // Click back to login link
    forgotPasswordPage.getBackToLoginLink().click();

    // Verify redirect to login
    cy.url().should('include', '/login');
  });
});
