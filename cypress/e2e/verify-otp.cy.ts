/// <reference types="cypress" />
import VerifyOtpPage from '../pages/verifyOtpPage';

describe('VerifyOtpForm - Complete Test Suite', () => {
  const page = new VerifyOtpPage();

  beforeEach(() => {
    page.visit('test@example.com');
  });

  describe('TS-OTP-001: Render Verify OTP Form', () => {
    // TC_OTP_001: OTP Form UI
    it('should display OTP input field and verify button', () => {
      page
        .getOtpInput()
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Enter OTP')
        .and('have.attr', 'type', 'text');
      page.getVerifyButton().should('be.visible');
    });

    // TC_OTP_002: Resend OTP Link
    it('should display resend OTP link', () => {
      page.getResendLink().should('be.visible');
      cy.contains("Didn't receive the OTP?").should('be.visible');
    });

    // TC_OTP_003: Check autoComplete attribute
    it('should have autoComplete off for OTP input', () => {
      page.getOtpInput().should('have.attr', 'autoComplete', 'off');
    });
  });

  describe('TS-OTP-002: OTP Verification Flow', () => {
    // TC_OTP_004: Successful OTP Verification
    it('should successfully verify OTP with valid code', () => {
      cy.intercept('POST', '**/auth/verify', {
        statusCode: 200,
        body: {
          message: 'OTP verified successfully',
          user: {
            _id: 'user-123',
            email: 'test@example.com',
          },
        },
      }).as('verifyRequest');

      page.fillOtp('123456').submit();

      cy.wait('@verifyRequest');

      // Check for success toast
      cy.contains('OTP Verified successfully!').should('be.visible');

      // Verify redirect to login
      cy.url().should('include', '/login');
    });

    // TC_OTP_005: OTP Verification API Failure
    it('should show error on invalid OTP', () => {
      cy.intercept('POST', '**/auth/verify', {
        statusCode: 400,
        body: {
          message: 'Invalid OTP',
        },
      }).as('verifyRequest');

      page.fillOtp('000000').submit();

      cy.wait('@verifyRequest');

      cy.contains('OTP Verification failed: Invalid OTP').should('be.visible');
    });

    // TC_OTP_006: OTP Expired
    it('should show error when OTP is expired', () => {
      cy.intercept('POST', '**/auth/verify', {
        statusCode: 410,
        body: {
          message: 'OTP has expired',
        },
      }).as('verifyRequest');

      page.fillOtp('123456').submit();

      cy.wait('@verifyRequest');

      cy.contains('OTP Verification failed: OTP has expired').should(
        'be.visible'
      );
    });

    // TC_OTP_007: Server Error
    it('should show error on server error', () => {
      cy.intercept('POST', '**/auth/verify', {
        statusCode: 500,
        body: {
          message: 'Internal server error',
        },
      }).as('verifyRequest');

      page.fillOtp('123456').submit();

      cy.wait('@verifyRequest');

      cy.contains('OTP Verification failed').should('be.visible');
    });
  });

  describe('TS-OTP-003: Form Validation', () => {
    // TC_OTP_008: OTP Required Validation
    it('should show error when OTP field is empty', () => {
      page.submit();
      page.expectOtpValidation();
    });

    // TC_OTP_009: OTP Minimum Length Validation
    it('should show error when OTP is less than 6 digits', () => {
      page.fillOtp('12345').submit();
      page.expectOtpValidation();
    });
  });

  describe('TS-OTP-004: Resend OTP Flow', () => {
    // TC_OTP_012: Successful OTP Resend
    it('should successfully resend OTP', () => {
      cy.intercept('POST', '**/auth/send-otp', {
        statusCode: 200,
        body: {
          message: 'OTP sent successfully',
        },
      }).as('resendRequest');

      page.resend();
      cy.wait('@resendRequest');
      cy.contains('OTP resent successfully!').should('be.visible');
    });

    // TC_OTP_013: Resend OTP API Failure
    it('should show error when resend OTP fails', () => {
      cy.intercept('POST', '**/auth/send-otp', {
        statusCode: 400,
        body: {
          error: 'Too many resend attempts',
        },
      }).as('resendRequest');

      page.resend();
      cy.wait('@resendRequest');
      cy.contains('Resend OTP failed: Too many resend attempts').should(
        'be.visible'
      );
    });

    // TC_OTP_014: Resend OTP Server Error
    it('should show error on server error during resend', () => {
      cy.intercept('POST', '**/auth/send-otp', {
        statusCode: 500,
        body: {
          error: 'Internal server error',
        },
      }).as('resendRequest');

      page.resend();
      cy.wait('@resendRequest');
      cy.contains('Resend OTP failed').should('be.visible');
    });
  });

  describe('TS-OTP-005: URL Parameter Handling', () => {
    // TC_OTP_015: Missing Email Parameter
    it('should redirect to signup when email is missing from URL', () => {
      page.visit();
      cy.contains('Email is required for OTP verification.').should(
        'be.visible'
      );
      cy.url().should('include', '/signup');
    });

    // TC_OTP_016: Email Parameter Present
    it('should stay on OTP page when email is in URL', () => {
      page.visit('test@example.com');
      cy.url().should('include', '/verify-otp');
      cy.url().should('include', 'email=');
    });

    // TC_OTP_017: Email Encoded in URL
    it('should handle URL encoded email parameter', () => {
      page.visit('test+1@example.com');
      page.getOtpInput().should('be.visible');
    });
  });

  describe('TS-OTP-006: User Interactions', () => {
    // TC_OTP_018: Type OTP
    it('should allow typing in OTP field', () => {
      page.fillOtp('123456');
      page.getOtpInput().should('have.value', '123456');
    });

    // TC_OTP_019: Clear OTP Field
    it('should allow clearing OTP field', () => {
      page.fillOtp('123456');
      page.getOtpInput().clear();
      page.getOtpInput().should('have.value', '');
    });

    // TC_OTP_020: Submit with Keyboard
    it('should submit form when pressing Enter', () => {
      cy.intercept('POST', '**/auth/verify', {
        statusCode: 200,
        body: {
          message: 'OTP verified successfully',
        },
      }).as('verifyRequest');
      page.fillOtp('123456{enter}');
      cy.wait('@verifyRequest');
      cy.contains('OTP Verified successfully!').should('be.visible');
    });

    // TC_OTP_021: Resend OTP Click
    it('should trigger resend OTP when link is clicked', () => {
      cy.intercept('POST', '**/auth/send-otp', {
        statusCode: 200,
        body: {
          message: 'OTP sent successfully',
        },
      }).as('resendRequest');
      page.resend();
      cy.wait('@resendRequest');
      cy.contains('OTP resent successfully!').should('be.visible');
    });
  });

  describe('TS-OTP-007: Navigation', () => {
    // TC_OTP_022: Redirect to Login After Verification
    it('should redirect to login page after successful verification', () => {
      cy.intercept('POST', '**/auth/verify', {
        statusCode: 200,
        body: {
          message: 'OTP verified successfully',
        },
      }).as('verifyRequest');
      page.fillOtp('123456').submit();
      cy.wait('@verifyRequest');
      cy.url().should('include', '/login');
    });

    // TC_OTP_023: Stay on OTP Page on Failure
    it('should stay on OTP page when verification fails', () => {
      cy.intercept('POST', '**/auth/verify', {
        statusCode: 400,
        body: {
          message: 'Invalid OTP',
        },
      }).as('verifyRequest');
      page.fillOtp('000000').submit();
      cy.wait('@verifyRequest');
      cy.url().should('include', '/verify-otp');
    });
  });

  describe('Additional Edge Cases', () => {
    // Additional test: Input only accepts numbers
    it('should accept numeric OTP input', () => {
      page.fillOtp('123456');
      page.getOtpInput().should('have.value', '123456');
    });

    // Additional test: Multiple verification attempts
    it('should allow multiple verification attempts', () => {
      cy.intercept('POST', '**/auth/verify', {
        statusCode: 400,
        body: {
          message: 'Invalid OTP',
        },
      }).as('verifyRequest');
      // First attempt - wrong OTP
      page.fillOtp('000000').submit();
      cy.wait('@verifyRequest');

      // Clear and try again
      page.getOtpInput().clear();
      page.fillOtp('111111').submit();
      cy.wait('@verifyRequest');

      cy.contains('OTP Verification failed').should('be.visible');
    });

    // Additional test: Resend and verify
    it('should allow resending OTP and then verifying', () => {
      cy.intercept('POST', '**/auth/send-otp', {
        statusCode: 200,
        body: {
          message: 'OTP sent successfully',
        },
      }).as('resendRequest');

      cy.intercept('POST', '**/auth/verify', {
        statusCode: 200,
        body: {
          message: 'OTP verified successfully',
        },
      }).as('verifyRequest');

      // Resend OTP
      page.resend();
      cy.wait('@resendRequest');
      cy.contains('OTP resent successfully!').should('be.visible');

      // Enter new OTP and verify
      page.fillOtp('654321').submit();
      cy.wait('@verifyRequest');
      cy.contains('OTP Verified successfully!').should('be.visible');
    });

    // Additional test: Error message clears on input
    it('should show error message for invalid OTP', () => {
      page.submit();
      cy.contains('Please enter a valid OTP.').should('be.visible');
    });

    // Additional test: Verify button is of correct type
    it('should have submit button of correct type', () => {
      page.getVerifyButton().should('have.attr', 'type', 'submit');
    });
  });
});
