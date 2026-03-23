/// <reference types="cypress" />

describe('Signup Module', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('TC_SignUp_001 - Valid Signup', () => {
    cy.stubSignup(200, { success: true }).as('signup');

    cy.signupUI('testuser', 'test@example.com', 'Password1!');

    cy.wait('@signup');

    cy.url().should('include', '/verify-otp');
  });

  it('TC_SignUp_002 - Empty Form', () => {
    cy.contains('button', 'Sign Up').click();

    cy.get('form').within(() => {
      cy.contains('Username is required').should('be.visible');
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });
  });

  it('TC_SignUp_003 - Invalid Email', () => {
    cy.get('input[type="email"]').type('invalid');
    cy.contains('button', 'Sign Up').click();

    cy.contains('Please enter a valid email').should('be.visible');
  });

  it('TC_SignUp_004 - Short Username', () => {
    cy.get('input[name="username"]').type('ab');
    cy.contains('button', 'Sign Up').click();

    cy.contains('Username must be at least 3 characters').should('be.visible');
  });

  it('TC_SignUp_005 - Weak Password', () => {
    cy.get('input[name="password"]').type('weak');
    cy.contains('button', 'Sign Up').click();

    cy.contains('Password must be at least 8 characters').should('be.visible');
  });

  it('TC_SignUp_006 - Duplicate Email', () => {
    cy.stubSignup(400, { message: 'User already exists' }).as('signup');

    cy.signupUI('testuser', 'existing@example.com', 'Password1!');

    cy.wait('@signup');

    cy.contains('User already exists').should('be.visible');
  });

  it('TC_SignUp_007 - Password Toggle', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');

    cy.get('button[type="button"]').click();

    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
  });

  it('TC_SignUp_008 - Field Error Messages', () => {
    cy.get('input[type="email"]').type('invalid');
    cy.contains('button', 'Sign Up').click();

    cy.contains('Please enter a valid email').should('be.visible');
  });
});
