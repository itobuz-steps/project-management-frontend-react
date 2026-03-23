/// <reference types="cypress" />
import LoginPage from '../pages/loginPage';

describe('Login', () => {
  const page = new LoginPage();

  beforeEach(() => {
    page.visit();
  });

  describe('TS-Login-001: Render Login Form', () => {
    // TC_Login_001: Login UI
    it('should display email and password fields with forgot password link and login button', () => {
      page
        .getEmail()
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Enter Email');
      page.getPassword().should('be.visible');
      page.getLoginButton().should('be.visible');
      page.getForgotLink().should('be.visible');
    });
  });

  describe('TS-Login-002: Login Flow', () => {
    // TC_Login_002: Login Success
    it('should successfully login with valid credentials', () => {
      cy.stubAuth(200, {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        user: { _id: 'user-123', email: 'devjyoti.banerjee@itobuz.com' },
      }).as('loginRequest');

      page
        .fillEmail('devjyoti.banerjee@itobuz.com')
        .fillPassword('Password@123')
        .submit();

      cy.wait('@loginRequest');

      cy.contains('Login successful').should('be.visible');

      cy.window().then((win) => {
        expect(win.localStorage.getItem('access_token')).to.equal(
          'valid-access-token'
        );
        expect(win.localStorage.getItem('refresh_token')).to.equal(
          'valid-refresh-token'
        );
      });

      cy.url().should('include', '/for-you');
    });

    // TC_Login_006: Login API Failure
    it('should show error toast on invalid credentials', () => {
      cy.stubAuth(401, { message: 'Invalid credentials' }).as('loginRequest');
      page.fillEmail('wrong@mail.com').fillPassword('wrongpass').submit();
      cy.wait('@loginRequest');
      cy.contains('Login failed: Invalid credentials').should('be.visible');
    });
  });

  describe('TS-Login-003: Form Validation', () => {
    // TC_Login_003: Empty Form Validation
    it('should display validation errors when form is empty', () => {
      page.submit();
      page.expectValidationErrors(2);
    });

    // TC_Login_004: Email Format Validation
    it('should show email validation error for invalid email format', () => {
      page.fillEmail('abc').fillPassword('password123');
      page.getEmail().focus().blur();
      cy.get('p.text-red-400, p.dark\\:text-red-300').should(
        'contain',
        'email'
      );
    });

    // TC_Login_005: Password Length Validation
    it('should show password validation error for short password', () => {
      page.fillEmail('devjyoti.banerjee@itobuz.com').fillPassword('PASS');
      page.getPassword().blur();
      cy.get('p.text-red-400, p.dark\\:text-red-300').should(
        'contain.text',
        'Password'
      );
    });
  });

  describe('TS-Login-004: UI Interactions', () => {
    // TC_Login_007: Password Visibility Toggle
    it('should toggle password visibility when clicking eye icon', () => {
      page.getPassword().should('exist');
      page.togglePasswordVisibility();
      cy.get('input[type="text"][placeholder="Enter Password"]').should(
        'exist'
      );
      page.togglePasswordVisibility();
      cy.get('input[type="password"]').should('exist');
    });
  });

  describe('TS-Login-005: Navigation', () => {
    // TC_Login_008: Forgot Password Navigation
    it('should navigate to forgot password page when clicking the link', () => {
      page.getForgotLink().click();
      cy.url().should('include', '/forgot-password');
    });

    // TC_Login_009: Redirect After Login
    it('should redirect to For You page after successful login', () => {
      cy.stubAuth(200, { accessToken: 'token', refreshToken: 'refresh' }).as(
        'loginRequest'
      );
      page
        .fillEmail('devjyoti.banerjee@itobuz.com')
        .fillPassword('Password@123')
        .submit();
      cy.wait('@loginRequest');
      cy.url().should('include', '/for-you');
    });
  });

  describe('TS-Login-006: Data Persistence', () => {
    // TC_Login_010: Token Storage
    it('should store access_token and refresh_token in localStorage after successful login', () => {
      cy.stubAuth(200, {
        accessToken: 'test-access-token-12345',
        refreshToken: 'test-refresh-token-12345',
      }).as('loginRequest');
      page
        .fillEmail('devjyoti.banerjee@itobuz.com')
        .fillPassword('Password@123')
        .submit();
      cy.wait('@loginRequest');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('access_token')).to.equal(
          'test-access-token-12345'
        );
        expect(win.localStorage.getItem('refresh_token')).to.equal(
          'test-refresh-token-12345'
        );
      });
    });
  });

  describe('Additional Edge Cases', () => {
    // Additional test: User not found
    it('should show error when user is not found', () => {
      cy.stubAuth(404, { message: 'User not found' }).as('loginRequest');
      page
        .fillEmail('nonexistent@example.com')
        .fillPassword('Password@123')
        .submit();
      cy.wait('@loginRequest');
      cy.contains('Login failed: User not found').should('be.visible');
    });

    // Additional test: Server error
    it('should show error on server error (500)', () => {
      cy.stubAuth(500, { message: 'Internal server error' }).as('loginRequest');
      page.fillEmail('test@example.com').fillPassword('Password@123').submit();
      cy.wait('@loginRequest');
      cy.contains('Login failed').should('be.visible');
    });

    // Additional test: Form submission with Enter key
    it('should submit form when pressing Enter key', () => {
      cy.stubAuth(200, { accessToken: 'token', refreshToken: 'refresh' }).as(
        'loginRequest'
      );
      page.fillEmail('test@example.com').fillPassword('Password@123{enter}');
      cy.wait('@loginRequest');
      cy.contains('Login successful').should('be.visible');
    });

    // Additional test: Tokens NOT stored on failed login
    it('should not store tokens in localStorage on failed login', () => {
      cy.stubAuth(401, { message: 'Invalid credentials' }).as('loginRequest');
      page.fillEmail('test@example.com').fillPassword('WrongPassword').submit();
      cy.wait('@loginRequest');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('access_token')).to.equal(null);
        expect(win.localStorage.getItem('refresh_token')).to.equal(null);
      });
    });

    // Additional test: Clear and retype
    it('should allow clearing and retyping fields', () => {
      page.fillEmail('wrong@example.com').fillPassword('WrongPass');
      page.getEmail().clear();
      page.getPassword().clear();
      page.getEmail().should('have.value', '');
      page.getPassword().should('have.value', '');
      page.fillEmail('correct@example.com').fillPassword('CorrectPass@123');
      page.getEmail().should('have.value', 'correct@example.com');
      page.getPassword().should('have.value', 'CorrectPass@123');
    });
  });
});
