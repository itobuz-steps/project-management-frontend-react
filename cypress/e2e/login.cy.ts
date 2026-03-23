/// <reference types="cypress" />

describe('Login Module', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('TC_Login_001 - Valid Login', () => {
    cy.stubAuth(200, {
      accessToken: 'token',
      refreshToken: 'refresh',
    }).as('login');

    cy.loginUI('test@example.com', 'Password1!');

    cy.wait('@login');

    cy.url().should('include', '/for-you');
  });

  it('TC_Login_002 - Empty Form', () => {
    cy.contains('button', 'Login').click();

    cy.get('form').within(() => {
      cy.contains('Email is required').should('be.visible');
    });
  });

  it('TC_Login_003 - Invalid Email', () => {
    cy.get('input[type="email"]').type('invalid');

    cy.contains('Please enter a valid email').should('be.visible');
  });

  it('TC_Login_005 - Wrong Credentials', () => {
    cy.stubAuth(401, {
      message: 'Invalid credentials',
    }).as('login');

    cy.loginUI('test@example.com', 'wrongpass');

    cy.wait('@login');

    cy.contains('Invalid credentials').should('be.visible');
  });

  it('TC_Login_007 - Password Toggle', () => {
    cy.get('input[type="password"]').should('have.attr', 'type', 'password');

    cy.get('button[type="button"]').click();

    cy.get('input[placeholder="Enter Password"]').should(
      'have.attr',
      'type',
      'text'
    );
  });

  it('TC_Login_008 - Forgot Password Navigation', () => {
    cy.contains('Forgot password?').click();

    cy.url().should('include', '/forgot-password');
  });

  it('TC_Login_009 - Token Storage', () => {
    cy.stubAuth(200, {
      accessToken: 'token123',
      refreshToken: 'refresh123',
    }).as('login');

    cy.loginUI('test@example.com', 'Password1!');

    cy.wait('@login');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).to.eq('token123');
      expect(win.localStorage.getItem('refresh_token')).to.eq('refresh123');
    });
  });
});
