class SignupPage {
  visit() {
    cy.visit('http://localhost:5173/signup');
    return this;
  }

  getUsername() {
    return cy.get('input[type="text"][placeholder="Enter Username"]');
  }

  getEmail() {
    return cy.get('input[type="email"][placeholder="Enter Email"]');
  }

  getPassword() {
    return cy.get(
      'input[type="password"][placeholder="Enter Password"], input[type="text"][placeholder="Enter Password"]'
    );
  }

  getSignUpButton() {
    return cy.contains('button', 'Sign Up');
  }

  fillUsername(username: string) {
    this.getUsername().clear().type(username);
    return this;
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
    this.getSignUpButton().click();
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

export default SignupPage;
