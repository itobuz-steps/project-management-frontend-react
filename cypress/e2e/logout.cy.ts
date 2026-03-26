/// <reference types="cypress" />

import { loginSession } from '../support/authHelper';
import { forYouPage } from '../pages/forYouPage';
import LoginPage from '../pages/loginPage';

describe('TS-Logout-001: Logout - Sidebar Logout Action', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Navigate to dashboard/for-you page
    forYouPage.visit();
    forYouPage.waitForPageLoad();
  });

  it('TC_Logout_001: Should logout successfully and redirect to login page', () => {
    // Find and click logout button
    forYouPage.clickLogout();

    // Verify redirect to login page
    cy.url().should('include', '/login', { timeout: 10000 });

    // Verify login page is displayed
    const loginPage = new LoginPage();
    loginPage.getEmail().should('be.visible');
    loginPage.getPassword().should('be.visible');
  });

  it('TC_Logout_002: Should clear tokens from localStorage after logout', () => {
    // Get tokens before logout
    cy.window().then((win) => {
      const accessTokenBefore = win.localStorage.getItem('accessToken');
      cy.log(
        'Access token before logout: ' + (accessTokenBefore ? 'exists' : 'none')
      );

      // Find and click logout button
      forYouPage.clickLogout();

      // Verify redirect to login
      cy.url().should('include', '/login', { timeout: 10000 });

      // Verify tokens are cleared
      cy.window().then((winAfter) => {
        const accessTokenAfter = winAfter.localStorage.getItem('accessToken');
        const refreshTokenAfter = winAfter.localStorage.getItem('refreshToken');

        expect(accessTokenAfter).to.equal(null);
        expect(refreshTokenAfter).to.equal(null);
      });
    });
  });

  it('TC_Logout_003: Should prevent access to protected pages after logout', () => {
    // Find and click logout button
    forYouPage.clickLogout();

    // Verify redirect to login
    cy.url().should('include', '/login', { timeout: 10000 });

    // Try to access protected page directly
    cy.visit('http://localhost:5173/edit-profile', { failOnStatusCode: false });

    // Should redirect back to login
    cy.url().should('include', '/login', { timeout: 10000 });
  });
});

describe('TS-Logout-002: Logout - Session Cleanup', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Navigate to dashboard
    forYouPage.visit();
    forYouPage.waitForPageLoad();
  });

  it('TC_Logout_004: Should display logout confirmation or immediate logout', () => {
    // Find and click logout button
    forYouPage.clickLogout();

    // Verify user is logged out (either direct redirect or after confirmation)
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('TC_Logout_005: Should not show user data after logout', () => {
    // Verify user data is visible before logout
    cy.get('button').should('exist'); // Page should be loaded

    // Find and click logout button
    forYouPage.clickLogout();

    // Verify on login page
    cy.url().should('include', '/login', { timeout: 10000 });

    // Verify login form is shown (not user data)
    const loginPage = new LoginPage();
    loginPage.getEmail().should('be.visible');
    loginPage.getPassword().should('be.visible');
  });
});

describe('TS-Logout-003: Logout - Navigation after Logout', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Navigate to dashboard
    forYouPage.visit();
    forYouPage.waitForPageLoad();
  });

  it('TC_Logout_006: Should display login page with proper elements after logout', () => {
    // Find and click logout button
    forYouPage.clickLogout();

    // Verify login page elements
    cy.url().should('include', '/login', { timeout: 10000 });
    const loginPage = new LoginPage();
    loginPage.getEmail().should('be.visible');
    loginPage.getPassword().should('be.visible');
    cy.get('button').should('contain', 'Login').and('be.visible');
  });

  it('TC_Logout_007: Should allow login again after logout', () => {
    // Find and click logout button
    forYouPage.clickLogout();

    // Verify on login page
    cy.url().should('include', '/login', { timeout: 10000 });

    // Login again using page object
    const loginPage = new LoginPage();
    loginPage.fillEmail('shaswata.biswas@itobuz.com');
    loginPage.fillPassword('Shaswata@123');
    loginPage.submit();

    // Verify successful login - should redirect to for-you page
    cy.url().should('include', '/for-you', { timeout: 10000 });
  });
});
