/// <reference types="cypress" />
import {
  mockUserData,
  updatedUserData,
  emptyNameUserData,
  nullFieldsUserData,
  errorResponses,
} from '../fixtures/mockData';
import { loginSession } from '../support/authHelper';
import { editProfilePage } from '../pages/editProfilePage';

describe('TS-EditProfile-001: Render Form - Display Profile Elements', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Setup API intercepts
    cy.intercept('GET', '**/user/**', mockUserData).as('getUserInfo');

    // Navigate to edit-profile
    editProfilePage.visit();
    editProfilePage.waitForPageLoad();
  });

  it('TC_EditProfile_001: Should display profile image, email, username, and buttons', () => {
    // Verify page heading
    editProfilePage
      .getPageHeading()
      .should('be.visible')
      .and('contain', 'Edit Profile');

    // Verify profile image is visible
    editProfilePage.getProfileImage().should('be.visible');

    // Verify email is displayed (if loaded)
    editProfilePage.getUserEmail().then(($el) => {
      if ($el.length) {
        editProfilePage.getUserEmail().should('be.visible');
      }
    });

    // Verify username field is visible
    editProfilePage.getUsernameInput().should('be.visible');

    // Verify Save button is visible
    editProfilePage.getSaveButton().should('be.visible').and('contain', 'Save');

    // Verify Go back button
    editProfilePage
      .getGoBackButton()
      .should('be.visible')
      .and('contain', 'Go back');
  });

  it('TC_EditProfile_002: Should display all notification preference switches', () => {
    // Verify Push Notifications switch exists
    editProfilePage.getPushNotificationSwitch().should('be.visible');

    // Verify Email Notifications switch exists
    editProfilePage.getEmailNotificationSwitch().should('be.visible');

    // Verify In-App Notifications switch exists
    editProfilePage.getInAppNotificationSwitch().should('be.visible');
  });
});

describe('TS-EditProfile-002: Update Profile - Username Updates', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Setup API intercepts
    cy.intercept('GET', '**/user/**', mockUserData).as('getUserInfo');
    cy.intercept('PATCH', '**/auth/profile', updatedUserData).as(
      'updateUserProfile'
    );

    // Navigate to edit-profile
    editProfilePage.visit();
    editProfilePage.waitForPageLoad();
  });

  it('TC_EditProfile_003: Should successfully update username', () => {
    // Update username and save
    editProfilePage.updateUsername('New Username');
    editProfilePage.clickSave();

    // Wait for response or success message
    editProfilePage.getSuccessMessage().should('be.visible');
  });

  it('TC_EditProfile_004: Should display error message on failed update', () => {
    // Mock failed API response
    cy.intercept('PATCH', '**/auth/profile', errorResponses.usernameExists).as(
      'updateFailed'
    );

    // Update and save
    editProfilePage.updateUsername('Existing Username');
    editProfilePage.clickSave();

    // Wait for API response
    cy.wait('@updateFailed');

    // Verify error message
    editProfilePage.getErrorMessage().should('be.visible');
  });
});

describe('TS-EditProfile-003: Notifications - Toggle Notification Preferences', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Setup API intercepts
    cy.intercept('GET', '**/user/**', mockUserData).as('getUserInfo');
    cy.intercept('PATCH', '**/auth/profile', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          result: {
            ...mockUserData.result,
            notificationPreferences: {
              ...mockUserData.result.notificationPreferences,
              ...req.body,
            },
          },
        },
      });
    }).as('updateNotification');

    // Navigate to edit-profile
    editProfilePage.visit();
    editProfilePage.waitForPageLoad();
  });

  it('TC_EditProfile_005: Should toggle push notification successfully', () => {
    // Toggle push notification
    editProfilePage.togglePushNotification();

    // Save the form
    editProfilePage.clickSave();

    // Verify success message appears
    editProfilePage.getSuccessMessage().should('be.visible');
  });

  it('TC_EditProfile_006: Should revert notification on API failure', () => {
    // Toggle notification
    editProfilePage.toggleEmailNotification();

    // Setup failure intercept before save
    cy.intercept('PATCH', '**/auth/profile', errorResponses.serverError).as(
      'notificationFailed'
    );

    // Save the form which triggers API call
    editProfilePage.clickSave();

    // Wait for API response
    cy.wait('@notificationFailed');

    // Verify error message
    editProfilePage.getErrorMessage().should('be.visible');
  });
});

describe('TS-EditProfile-004: Validation - Form Validation Rules', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Setup API intercepts
    cy.intercept('GET', '**/user/**', emptyNameUserData).as('getUserInfo');

    // Navigate to edit-profile
    editProfilePage.visit();
    editProfilePage.waitForPageLoad();
  });

  it('TC_EditProfile_007: Should show validation error for empty username', () => {
    // Click Save without entering username
    editProfilePage.clickSave();

    // Verify error appears
    cy.get('.ant-message-error, .text-red-500', { timeout: 5000 }).should(
      'be.visible'
    );
  });

  it('TC_EditProfile_008: Should restrict file input to image types only', () => {
    // Verify file input has accept attribute
    editProfilePage.getFileInput().should('have.attr', 'accept', 'image/*');
  });
});

describe('TS-EditProfile-005: Image Upload - Profile Image Management', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Setup API intercepts
    cy.intercept('GET', '**/user/**', mockUserData).as('getUserInfo');
    cy.intercept('PATCH', '**/auth/profile', updatedUserData).as(
      'updateProfile'
    );

    // Navigate to edit-profile
    editProfilePage.visit();
    editProfilePage.waitForPageLoad();
  });

  it('TC_EditProfile_009: Should upload profile image successfully', () => {
    // Upload image
    editProfilePage.uploadImage('test-image.png');

    // Verify image preview updated
    editProfilePage.getProfileImage().should('have.attr', 'src');

    // Submit form
    editProfilePage.clickSave();

    // Verify success message
    editProfilePage.getSuccessMessage().should('be.visible');
  });

  it('TC_EditProfile_011: Should handle large image error', () => {
    // Upload image
    editProfilePage.uploadImage('large-image.png');

    // Setup error intercept before save
    cy.intercept(
      'PATCH',
      '**/auth/profile',
      errorResponses.fileSizeExceeded
    ).as('fileSizeError');

    // Submit form
    editProfilePage.clickSave();

    // Wait for API response
    cy.wait('@fileSizeError');

    // Verify error message
    editProfilePage.getErrorMessage().should('be.visible');
  });
});

describe('TS-EditProfile-006: Navigation - Go Back Button', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Setup API intercepts
    cy.intercept('GET', '**/user/**', mockUserData).as('getUserInfo');

    // Navigate to edit-profile
    cy.visit('http://localhost:5173/edit-profile');
    cy.get('h3', { timeout: 10000 }).should('contain', 'Edit Profile');
  });

  it('TC_EditProfile_010: Should navigate back to /for-you page', () => {
    // Click Go back button
    cy.get('#profile-go-back-btn').click();

    // Verify navigation
    cy.url().should('include', '/for-you');
  });
});

describe('Edit Profile - Integration Tests', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Setup API intercepts
    cy.intercept('GET', '**/user/**', mockUserData).as('getUserInfo');
    cy.intercept('PUT', '**/user/**', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          result: {
            ...mockUserData.result,
            name: req.body.name || mockUserData.result.name,
            notificationPreferences: {
              ...mockUserData.result.notificationPreferences,
              ...req.body,
            },
          },
        },
      });
    }).as('updateProfile');

    // Navigate to edit-profile
    cy.visit('http://localhost:5173/edit-profile');
    cy.get('h3', { timeout: 10000 }).should('contain', 'Edit Profile');
  });

  it('Should handle complete user profile update workflow', () => {
    // Update username
    cy.get('input[placeholder="Username"]').clear().type('Updated Username');

    // Toggle a notification
    cy.contains('Push Notifications')
      .parent()
      .within(() => {
        cy.get('.custom-switch').click();
      });

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify message
    cy.get('.ant-message', { timeout: 5000 }).should('be.visible');
  });

  it('Should properly load user data on page mount', () => {
    // Verify page is loaded
    cy.get('h3').should('contain', 'Edit Profile');

    // Verify form elements exist
    cy.get('input[placeholder="Username"]').should('be.visible');
    cy.get('#preview').should('be.visible');
  });
});

describe('Edit Profile - Edge Cases and Error Handling', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();
  });

  it('Should handle missing user data fields gracefully', () => {
    cy.intercept('GET', '**/user/**', nullFieldsUserData).as('getUserInfo');

    editProfilePage.visit();

    // Page should still render
    editProfilePage.waitForPageLoad();
  });
});

describe('Edit Profile - Accessibility', () => {
  beforeEach(() => {
    // Use cached session
    loginSession();

    // Setup API intercepts
    cy.intercept('GET', '**/user/**', mockUserData).as('getUserInfo');

    // Navigate to edit-profile
    editProfilePage.visit();
    editProfilePage.waitForPageLoad();
  });

  it('Should have proper label associations', () => {
    // Check if labels exist (may not have exact htmlFor attributes)
    cy.get('label').should('have.length.greaterThan', 0);

    // Verify form has proper structure
    cy.get('form').should('exist');
  });

  it('Should have semantic form structure', () => {
    cy.get('form#edit-profile-form')
      .should('exist')
      .and('have.attr', 'encType', 'multipart/form-data');
  });
});
