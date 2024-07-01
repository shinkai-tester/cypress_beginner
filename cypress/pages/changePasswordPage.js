import { LoginPage } from "./loginPage.js";

export class ChangePasswordPage {
  constructor() {
    this.loginPage = new LoginPage();
  }

  elements = {
    accountMenu: () => cy.get("#account-menu"),
    passwordMenu: () => cy.get("[data-cy='passwordItem']"),
    currentPasswordField: () => cy.get("#currentPassword"),
    newPasswordField: () => cy.get("#newPassword"),
    newPasswordFieldConfirmation: () => cy.get("#confirmPassword"),
    saveChangesButton: () => cy.get("#password-form button[type='submit']"),
  };

  changePassword(username, oldPassword, newPassword) {
    this.loginPage.login(username, oldPassword);
    this.elements.accountMenu().click();
    this.elements.passwordMenu().click();
    this.elements.currentPasswordField().type(oldPassword);
    this.elements.newPasswordField().type(newPassword);
    this.elements.newPasswordFieldConfirmation().type(newPassword);
    this.elements.saveChangesButton().type(newPassword);
  }
}
