/// <reference types="cypress" />
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
    cy.get('input[type="text"][placeholder="Enter Username"]')
      .clear()
      .type(username);
    cy.get('input[type="email"][placeholder="Enter Email"]')
      .clear()
      .type(email);
    cy.get('input[type="password"][placeholder="Enter Password"]')
      .clear()
      .type(password);
    cy.contains('button', 'Sign Up').click();
  }
);

export {};
