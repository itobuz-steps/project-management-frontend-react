/// <reference types="cypress" />

describe('Verify OTP Module', () => {
  const email = 'test@example.com';

  const visitPage = () => cy.visit(`/verify-otp?email=${email}`);

  it('TC_VerifyOTP_001 - Valid OTP', () => {
    cy.stubVerify(200, { success: true }).as('verify');

    visitPage();
    cy.otpUI('123456');

    cy.wait('@verify');
    cy.url().should('include', '/login');
  });

  it('TC_VerifyOTP_002 - Invalid OTP', () => {
    cy.stubVerify(400, { message: 'Invalid OTP' }).as('verify');

    visitPage();
    cy.otpUI('000000');

    cy.wait('@verify');
    cy.contains(/Invalid OTP/i).should('be.visible');
  });

  it('TC_VerifyOTP_003 - Empty OTP', () => {
    visitPage();

    cy.contains('button', 'Verify').click();

    cy.get('form').within(() => {
      cy.contains(/Please enter a valid OTP/i).should('be.visible');
    });
  });

  it('TC_VerifyOTP_004 - OTP Length Validation', () => {
    visitPage();

    cy.otpUI('123');

    cy.get('form').within(() => {
      cy.contains(/Please enter a valid OTP/i).should('be.visible');
    });
  });

  it('TC_VerifyOTP_005 - Resend OTP', () => {
    cy.stubResendOtp(200, { success: true }).as('resend');

    visitPage();

    cy.contains('Resend OTP').click();

    cy.wait('@resend');
    cy.contains(/OTP resent successfully/i).should('be.visible');
  });

  it('TC_VerifyOTP_006 - Missing Email', () => {
    cy.visit('/verify-otp');
    cy.url().should('include', '/signup');
  });
});
