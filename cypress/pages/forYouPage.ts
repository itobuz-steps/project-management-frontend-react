// For You Page (Dashboard) Object
export class ForYouPage {
  visit() {
    cy.visit('http://localhost:5173/for-you');
  }

  waitForPageLoad() {
    cy.get('h2', { timeout: 10000 }).should('exist');
  }

  getLogoutButton() {
    return cy.get('button').then(($buttons) => {
      const logoutBtn = $buttons.filter((_, el) =>
        el.textContent?.includes('Logout')
      );
      if (logoutBtn.length > 0) {
        return cy.wrap(logoutBtn);
      } else {
        return cy.get('#logout-btn').parent('button');
      }
    });
  }

  clickLogout() {
    this.getLogoutButton().click();
  }
}

export const forYouPage = new ForYouPage();
