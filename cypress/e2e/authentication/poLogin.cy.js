import { faker } from "@faker-js/faker";
import { LoginPage } from "../../pages/loginPage";
import { ChangePasswordPage } from "../../pages/changePasswordPage";

const loginPage = new LoginPage();
const changePasswordPage = new ChangePasswordPage();

describe("Verifier: login test based on PageObject classes", () => {
  it("Check user's login attempt with new and old passwords", () => {
    let username = Cypress.env("student_username");
    let oldPassword = Cypress.env("student_password");
    let newPassword = faker.internet.password();

    loginPage.login(username, oldPassword);
    cy.containsText("#header-tabs", "Entities");
    cy.logout();

    changePasswordPage.changePassword(username, oldPassword, newPassword);
    cy.logout();

    loginPage.login(username, newPassword);
    cy.containsText("#header-tabs", "Entities");
    cy.logout();

    loginPage.login(username, oldPassword);
    cy.containsElementWithText(
      '[data-cy="loginError"]',
      "strong",
      "Failed to sign in!"
    );

    changePasswordPage.changePassword(username, newPassword, oldPassword);
  });
});
