/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('stubAuth', (statusCode = 200, body = {}) => {
  return cy.intercept('POST', '**/auth/login', {
    statusCode,
    body,
  });
});

Cypress.Commands.add('loginUI', (email: string, password: string) => {
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type(password);
  cy.contains('button', 'Login').click();
});

Cypress.Commands.add('stubSignup', (statusCode = 201, body = {}) => {
  return cy.intercept('POST', '**/auth/signup', {
    statusCode,
    body,
  });
});

Cypress.Commands.add(
  'signupUI',
  (username: string, email: string, password: string) => {
    cy.get('input[name="username"]').clear().type(username);
    cy.get('input[type="email"]').clear().type(email);
    cy.get('input[name="password"]').clear().type(password);
    cy.contains('button', 'Sign Up').click();
  }
);

Cypress.Commands.add('stubVerify', (statusCode = 200, body = {}) => {
  return cy.intercept('POST', '**/auth/verify', {
    statusCode,
    body,
  });
});

Cypress.Commands.add('stubResendOtp', (statusCode = 200, body = {}) => {
  return cy.intercept('POST', '**/auth/send-otp', {
    statusCode,
    body,
  });
});

Cypress.Commands.add('otpUI', (otp: string) => {
  cy.get('input[placeholder="Enter OTP"]').clear().type(otp);
  cy.contains('button', 'Verify').click();
});

export {};
