import "cypress-each";
import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.visit("/login");
});

const commonMenuTexts = ["Home", "Entities", "English", "Account"];
const adminMenuTexts = [
  "User management",
  "Metrics",
  "Health",
  "Configuration",
  "Logs",
];
const loginErrorSelector = '[data-cy="loginError"]';

const testCases = [
  {
    role: "admin",
    username: Cypress.env("admin"),
    password: Cypress.env("admin"),
    menuTexts: commonMenuTexts,
    adminMenuVisible: true,
  },
  {
    role: "student",
    username: Cypress.env("student_username"),
    password: Cypress.env("student_password"),
    menuTexts: commonMenuTexts,
    adminMenuVisible: false,
  },
  {
    role: "teacher",
    username: Cypress.env("teacher_username"),
    password: Cypress.env("teacher_password"),
    menuTexts: commonMenuTexts,
    adminMenuVisible: false,
  },
];

const negativeData = [
  {
    description: "Unsuccessful log in with invalid username",
    username: faker.internet.userName().toLowerCase().replace(/\./g, "_"),
    password: Cypress.env("student_password"),
    error: "Failed to sign in!",
    details: "Please check your credentials and try again.",
  },
  {
    description: "Unsuccessful log in with invalid password",
    username: Cypress.env("admin"),
    password: faker.internet.password(),
    error: "Failed to sign in!",
    details: "Please check your credentials and try again.",
  },
];

describe("Positive Sign in checks", () => {
  testCases.forEach(
    ({ role, username, password, menuTexts, adminMenuVisible }) => {
      it(`Log in as ${role}`, () => {
        cy.login(username, password);
        cy.containsMultipleTexts("#header-tabs", menuTexts);

        if (adminMenuVisible) {
          cy.containsMultipleTexts(
            "#admin-menu .dropdown-menu",
            adminMenuTexts
          );
        } else {
          cy.checkElementNotExist("#admin-menu");
        }
      });
    }
  );
});

describe("Negative Sign in checks", () => {
  negativeData.forEach(
    ({ description, username, password, error, details }) => {
      it(description, () => {
        cy.login(username, password);
        cy.containsElementWithText(loginErrorSelector, "strong", error);
        cy.containsElementWithText(loginErrorSelector, "span", details);
      });
    }
  );

  it("Unsuccessful log in with empty fields", () => {
    cy.login("", "");
    cy.clickElement("#rememberMe");
    cy.hasText("#username + .invalid-feedback", "Username cannot be empty!");
    cy.hasText("#password + .invalid-feedback", "Password cannot be empty!");
  });
});

describe("Check redirections on Sign in page", () => {
  it("Redirection to forget password page", () => {
    cy.clickElement('[href="/account/reset/request"]');
    cy.urlIncludes("/account/reset/request");
  });

  it("redirection to registration page", () => {
    cy.clickElement('.alert-warning [href="/account/register"]');
    cy.urlIncludes("/account/register");
  });
});
