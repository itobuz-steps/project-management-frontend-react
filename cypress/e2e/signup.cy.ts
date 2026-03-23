/// <reference types="cypress" />
import SignupPage from '../pages/signupPage';

describe('Signup', () => {
  const page = new SignupPage();

  beforeEach(() => {
    page.visit();
  });

  describe('TS-Signup-001: Render Signup Form', () => {
    // TC_SignUp_001: Signup UI
    it('should display username, email, and password fields with Sign Up button', () => {
      page.getUsername().should('be.visible');
      page.getEmail().should('be.visible');
      page.getPassword().should('be.visible');
      page.getSignUpButton().should('be.visible');
    });
  });

  describe('TS-Signup-002: Form Validation', () => {
    // TC_SignUp_002: Empty Form Validation
    it('should display validation errors for all required fields when empty', () => {
      cy.contains('button', 'Sign Up').click();

      // Should show validation errors for username, email, password
      cy.get('p.text-red-400, p.dark\\:text-red-300').should(
        'have.length.at.least',
        3
      );
    });

    // TC_SignUp_003: Email Format Validation
    it('should show email validation error for invalid email format', () => {
      page
        .fillUsername('testuser')
        .fillEmail('abc')
        .fillPassword('Password@123');
      page.getEmail().focus().blur();
      cy.get('p.text-red-400, p.dark\\:text-red-300').should(
        'contain.text',
        'email'
      );
    });

    // TC_SignUp_004: Password Strength Validation
    it('should show password validation error for weak password', () => {
      page
        .fillUsername('testuser')
        .fillEmail('test@example.com')
        .fillPassword('123');
      page.getPassword().blur();
      cy.get('p.text-red-400, p.dark\\:text-red-300').should(
        'contain.text',
        'Password'
      );
    });

    // TC_SignUp_005: Username Required Validation
    it('should show username validation error when left empty', () => {
      page.fillEmail('test@example.com').fillPassword('Password@123').submit();
      cy.get('p').should('contain.text', 'Username is required');
    });
  });

  describe('TS-Signup-003: Signup Flow', () => {
    // TC_SignUp_006: Signup Success
    it('should successfully signup with valid credentials', () => {
      cy.stubSignup(201, {
        message: 'User created successfully',
        user: {
          _id: 'user-new-123',
          username: 'newuser',
          email: 'devjyoti.banerjee+3@itobuz.com',
        },
      }).as('signupRequest');

      page
        .fillUsername('newuser')
        .fillEmail('devjyoti.banerjee+3@itobuz.com')
        .fillPassword('Password@123')
        .submit();

      cy.wait('@signupRequest');

      cy.contains('Signup successful').should('be.visible');
      cy.url().should('include', '/verify-otp');
      cy.url().should('include', 'email=');
    });

    // TC_SignUp_007: Signup API Failure
    it('should show error message when signup fails with existing email', () => {
      cy.stubSignup(400, { message: 'Email already exists' }).as(
        'signupRequest'
      );
      page
        .fillUsername('someuser')
        .fillEmail('devjyoti.banerjee@itobuz.com')
        .fillPassword('Password@123')
        .submit();
      cy.wait('@signupRequest');
      cy.contains('Signup failed: Email already exists').should('be.visible');
    });
  });

  describe('TS-Signup-004: UI Interactions', () => {
    // TC_SignUp_008: Password Visibility Toggle
    it('should toggle password visibility when clicking eye icon', () => {
      page.getPassword().should('exist');
      page.togglePasswordVisibility();
      cy.get('input[type="text"][placeholder="Enter Password"]').should(
        'exist'
      );
      page.togglePasswordVisibility();
      cy.get('input[type="password"][placeholder="Enter Password"]').should(
        'exist'
      );
    });
  });

  describe('TS-Signup-005: Navigation & URL Handling', () => {
    // TC_SignUp_009: Email Encoding in URL
    it('should encode email properly in redirect URL', () => {
      const testEmail = 'test@mail.com';
      cy.stubSignup(201, {
        message: 'User created successfully',
        user: { _id: 'user-123', username: 'testuser', email: testEmail },
      }).as('signupRequest');
      page
        .fillUsername('testuser')
        .fillEmail(testEmail)
        .fillPassword('Password@123')
        .submit();
      cy.wait('@signupRequest');
      cy.url().should(
        'include',
        `/verify-otp?email=${encodeURIComponent(testEmail)}`
      );
    });
  });

  describe('TS-Signup-006: Error Handling UI', () => {
    // TC_SignUp_010: Error Message Rendering
    it('should display error messages below respective fields', () => {
      page.fillUsername('abc').fillEmail('invalid').fillPassword('weak');
      page.getEmail().focus().blur();
      cy.get('p.text-red-400, p.dark\\:text-red-300').should('exist');
    });

    // TC_SignUp_011: Prevent Invalid Submission
    it('should prevent API call when form is invalid', () => {
      let apiCalled = false;
      cy.intercept('POST', '**/auth/signup', (req) => {
        apiCalled = true;
        req.reply({ statusCode: 400, body: { message: 'Invalid data' } });
      }).as('signupRequest');
      page.submit();
      cy.wait(500);
      expect(apiCalled).to.equal(false);
    });
  });

  describe('TS-Signup-007: Button Interaction', () => {
    // TC_SignUp_012: Submit Button Behavior
    it('should trigger form submit when clicking Sign Up button', () => {
      cy.stubSignup(201, { message: 'User created successfully' }).as(
        'signupRequest'
      );
      page
        .fillUsername('newuser')
        .fillEmail('new@example.com')
        .fillPassword('Password@123')
        .submit();
      cy.wait('@signupRequest');
      cy.contains('Signup successful').should('be.visible');
    });
  });

  describe('Additional Edge Cases', () => {
    // Additional test: All fields can be typed in
    it('should allow typing in all form fields', () => {
      page
        .fillUsername('johndoe')
        .fillEmail('john@example.com')
        .fillPassword('SecurePass123');
      page.getUsername().should('have.value', 'johndoe');
      page.getEmail().should('have.value', 'john@example.com');
      page.getPassword().should('have.value', 'SecurePass123');
    });

    // Additional test: Clear fields
    it('should allow clearing all filled fields', () => {
      page
        .fillUsername('johndoe')
        .fillEmail('john@example.com')
        .fillPassword('SecurePass123');
      page.getUsername().clear();
      page.getEmail().clear();
      page.getPassword().clear();
      page.getUsername().should('have.value', '');
      page.getEmail().should('have.value', '');
      page.getPassword().should('have.value', '');
    });

    // Additional test: Form submission with Enter key
    it('should submit form when pressing Enter key', () => {
      cy.stubSignup(201, { message: 'User created successfully' }).as(
        'signupRequest'
      );
      page
        .fillUsername('newuser')
        .fillEmail('new@example.com')
        .fillPassword('Password@123{enter}');
      cy.wait('@signupRequest');
      cy.contains('Signup successful').should('be.visible');
    });

    // Additional test: Server error handling
    it('should show error on server error (500)', () => {
      cy.stubSignup(500, { message: 'Internal server error' }).as(
        'signupRequest'
      );
      page
        .fillUsername('newuser')
        .fillEmail('new@example.com')
        .fillPassword('Password@123')
        .submit();
      cy.wait('@signupRequest');
      cy.contains('Signup failed').should('be.visible');
    });

    // Additional test: No redirect on failed signup
    it('should stay on signup page when signup fails', () => {
      cy.stubSignup(400, { message: 'Email already exists' }).as(
        'signupRequest'
      );
      page
        .fillUsername('someuser')
        .fillEmail('taken@example.com')
        .fillPassword('Password@123')
        .submit();
      cy.wait('@signupRequest');
      cy.url().should('include', '/signup');
    });

    // Additional test: Duplicate email error
    it('should handle duplicate email with 409 Conflict status', () => {
      cy.stubSignup(409, { message: 'Email already registered' }).as(
        'signupRequest'
      );
      page
        .fillUsername('newuser')
        .fillEmail('existing@example.com')
        .fillPassword('Password@123')
        .submit();
      cy.wait('@signupRequest');
      cy.contains('Signup failed: Email already registered').should(
        'be.visible'
      );
    });
  });
});
