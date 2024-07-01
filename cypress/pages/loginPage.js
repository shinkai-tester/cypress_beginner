export class LoginPage {
  elements = {
    usernameField: () => cy.get("#username"),
    passwordField: () => cy.get("#password"),
    loginButton: () => cy.get("[type='submit']"),
  };

  login(username, password) {
    cy.visit("/login");
    this.elements.usernameField().type(username);
    this.elements.passwordField().type(password);
    this.elements.loginButton().click();
  }
}
