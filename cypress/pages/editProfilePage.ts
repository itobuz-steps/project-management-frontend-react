// Edit Profile Page Object
export class EditProfilePage {
  visit() {
    cy.visit('http://localhost:5173/edit-profile');
  }

  waitForPageLoad() {
    cy.get('h3', { timeout: 10000 }).should('contain', 'Edit Profile');
  }

  getPageHeading() {
    return cy.get('h3');
  }

  getProfileImage() {
    return cy.get('#preview');
  }

  getUserEmail() {
    return cy.get('#user-email');
  }

  getUsernameInput() {
    return cy.get('input[placeholder="Username"]');
  }

  getSaveButton() {
    return cy.get('button[type="submit"]');
  }

  getGoBackButton() {
    return cy.get('#profile-go-back-btn');
  }

  getPushNotificationSwitch() {
    return cy
      .contains('Push Notifications')
      .parent()
      .within(() => {
        return cy.get('.custom-switch');
      });
  }

  getEmailNotificationSwitch() {
    return cy
      .contains('Email Notifications')
      .parent()
      .within(() => {
        return cy.get('.custom-switch');
      });
  }

  getInAppNotificationSwitch() {
    return cy
      .contains('In-App Notifications')
      .parent()
      .within(() => {
        return cy.get('.custom-switch');
      });
  }

  getFileInput() {
    return cy.get('input[type="file"]');
  }

  getSuccessMessage() {
    return cy.get('.ant-message', { timeout: 5000 });
  }

  getErrorMessage() {
    return cy.get('.ant-message', { timeout: 5000 });
  }

  updateUsername(newUsername: string) {
    this.getUsernameInput().clear().type(newUsername);
  }

  clickSave() {
    this.getSaveButton().click();
  }

  clickGoBack() {
    this.getGoBackButton().click();
  }

  togglePushNotification() {
    this.getPushNotificationSwitch().click();
  }

  toggleEmailNotification() {
    this.getEmailNotificationSwitch().click();
  }

  toggleInAppNotification() {
    this.getInAppNotificationSwitch().click();
  }

  uploadImage(fileName: string) {
    this.getFileInput().selectFile({
      contents: Cypress.Buffer.from('fake image content'),
      fileName: fileName,
      mimeType: 'image/png',
    });
  }
}

export const editProfilePage = new EditProfilePage();
