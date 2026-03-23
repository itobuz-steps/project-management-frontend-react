class LoginPage {
  visit() {
    cy.visit('http://localhost:5173/login');
    return this;
  }

  getEmail() {
    return cy.get('input[type="email"]');
  }

  getPassword() {
    return cy.get('input[name="password"]');
  }

  getLoginButton() {
    return cy.contains('button', 'Login');
  }

  getForgotLink() {
    return cy.contains('a', 'Forgot password?');
  }

  fillEmail(email: string) {
    this.getEmail().clear().type(email);
    return this;
  }

  fillPassword(password: string) {
    this.getPassword().clear().type(password);
    return this;
  }

  submit() {
    this.getLoginButton().click();
    return this;
  }

  togglePasswordVisibility() {
    cy.get('button[type="button"]').first().click();
    return this;
  }

  expectValidationErrors(min = 1) {
    cy.get('p.text-red-400, p.dark\\:text-red-300').should(
      'have.length.at.least',
      min
    );
    return this;
  }
}

export default LoginPage;
