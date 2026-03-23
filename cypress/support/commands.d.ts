/// <reference types="cypress" />

/* eslint-disable @typescript-eslint/no-explicit-any */

declare namespace Cypress {
  interface Chainable<Subject = any> {
    stubAuth(statusCode?: number, body?: object): Chainable<Subject>;
    loginUI(email: string, password: string): Chainable<Subject>;
    stubSignup(statusCode?: number, body?: object): Chainable<Subject>;
    signupUI(
      username: string,
      email: string,
      password: string
    ): Chainable<Subject>;
    stubVerify(statusCode?: number, body?: object): Chainable<Subject>;
    stubResendOtp(statusCode?: number, body?: object): Chainable<Subject>;
    otpUI(otp: string): Chainable<Subject>;
  }
}
