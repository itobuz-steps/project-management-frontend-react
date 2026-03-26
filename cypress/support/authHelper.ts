// Common authentication helper for all tests
export const loginSession = (sessionName: string = 'auth_session') => {
  cy.session(sessionName, () => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[type="email"]').type('shaswata.biswas@itobuz.com');
    cy.get('input[type="password"]').type('Shaswata@123');
    cy.contains('button', 'Login').click();
    cy.url().should('include', '/for-you', { timeout: 10000 });
  });
};
