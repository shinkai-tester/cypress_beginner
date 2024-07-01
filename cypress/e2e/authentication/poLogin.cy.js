import { faker } from "@faker-js/faker";

describe("Verifier: test based on PageObject, fixtures, commands", () => {
  it("Check user's login attempt with new and old passwords", () => {
    let username = Cypress.env("student_username");
    let oldPassword = Cypress.env("student_password");
    let newPassword = faker.internet.password();

    cy.login(username, oldPassword);
    cy.containsText("#header-tabs", "Entities");
    cy.logout();

    cy.changePassword(username, oldPassword, newPassword);
    cy.logout();

    cy.login(username, newPassword);
    cy.containsText("#header-tabs", "Entities");
    cy.logout();

    cy.login(username, oldPassword);
    cy.containsElementWithText(
      '[data-cy="loginError"]',
      "strong",
      "Failed to sign in!"
    );

    cy.changePassword(username, newPassword, oldPassword);
  });
});
