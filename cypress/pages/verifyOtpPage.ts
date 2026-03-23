class VerifyOtpPage {
  visit(email?: string) {
    const url = email
      ? `http://localhost:5173/verify-otp?email=${encodeURIComponent(email)}`
      : 'http://localhost:5173/verify-otp';
    cy.visit(url);
    return this;
  }

  getOtpInput() {
    return cy.get('input#otp-input');
  }

  getVerifyButton() {
    return cy.contains('button', 'Verify');
  }

  getResendLink() {
    return cy.contains('Resend OTP');
  }

  fillOtp(otp: string) {
    this.getOtpInput().clear().type(otp);
    return this;
  }

  submit() {
    this.getVerifyButton().click();
    return this;
  }

  resend() {
    this.getResendLink().click();
    return this;
  }

  expectOtpValidation() {
    cy.contains('Please enter a valid OTP.').should('be.visible');
    return this;
  }
}

export default VerifyOtpPage;
