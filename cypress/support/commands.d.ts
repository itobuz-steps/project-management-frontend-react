/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      stubAuth(statusCode?: number, body?: object): Chainable;
      loginUI(email: string, password: string): Chainable;
      stubSignup(statusCode?: number, body?: object): Chainable;
      signupUI(username: string, email: string, password: string): Chainable;
    }
  }
}

export {};
