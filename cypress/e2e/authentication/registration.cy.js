import { faker } from "@faker-js/faker";
const usernameData = require("../../fixtures/usernames.json");
const emailData = require("../../fixtures/emails.json");
const passwordData = require("../../fixtures/passwords.json");

let userName;
const usernameField = "#username";
const emailField = "#email";
const passwordField = "#firstPassword";
const passwordConfirmField = "#secondPassword";

beforeEach(() => {
  cy.visit("/account/register");
});

describe("Basic registration tests", () => {
  it("Check successful user registration", () => {
    let password = faker.internet.password();
    let userName = faker.internet.userName().toLowerCase().replace(/\./g, "_");
    let email = faker.internet.email();

    cy.registerUser(userName, email, password, password);
    cy.checkNewUserInTableByAdmin(userName);
    cy.cleanupUserViaAPI(userName);
  });

  it("Check registration when all fields are not filled", () => {
    cy.registerUser("", "", "", "");
    cy.containsMultipleTexts("#register-form", [
      "Your username is required.",
      "Your email is required.",
      "Your password is required.",
      "Your confirmation password is required.",
    ]);
  });
});

describe("Username field validation tests", () => {
  it("Check valid username", () => {
    let usernames = usernameData.good_usernames;
    usernames.forEach((element) => {
      cy.enterText(usernameField, element);
      cy.checkElementHasClass(usernameField, "is-valid");
      cy.clearText(usernameField);
    });
  });

  it("Negative checks on username", () => {
    let usernames = usernameData.bad_usernames;
    usernames.forEach((element) => {
      cy.enterText(usernameField, element);
      cy.checkElementHasClass(usernameField, "is-invalid");
      cy.clearText(usernameField);
    });
  });
});

describe("Email field validation tests", () => {
  it("Check valid email", () => {
    let emails = emailData.good_emails;
    emails.forEach((element) => {
      cy.enterText(emailField, element);
      cy.checkElementHasClass(emailField, "is-valid");
      cy.clearText(emailField);
    });
  });

  it("Negative checks on email", () => {
    let emails = emailData.bad_emails;
    emails.forEach((element) => {
      cy.enterText(emailField, element);
      cy.clickElement(emailField);
      cy.checkElementHasClass(emailField, "is-invalid");
      cy.clearText(emailField);
    });
  });
});

describe("Password field validation tests", () => {
  it("Check password strength levels", () => {
    let passwords = passwordData.password_strength;
    passwords.forEach((item) => {
      cy.enterText(passwordField, item.password);
      cy.checkElementHasClass(passwordField, "is-valid");
      cy.checkCssPropertyValue(
        "#strengthBar li:first-child",
        "background-color",
        item.color
      );
      cy.clearText(passwordField);
    });
  });

  it("Check password length positive", () => {
    let passwords = passwordData.password_length_ok;
    passwords.forEach((item) => {
      cy.enterText(passwordField, item.password);
      cy.checkElementHasClass(passwordField, item.validity);
      cy.clearText(passwordField);
    });
  });

  it("Check password length negative", () => {
    let passwords = passwordData.password_length_nok;
    passwords.forEach((item) => {
      cy.enterText(passwordField, item.password);
      cy.checkElementHasClass(passwordField, item.validity);
      cy.hasText(passwordField + " + .invalid-feedback", item.feedback);
      cy.clearText(passwordField);
    });
  });

  it("Password confirmation tests", () => {
    let passwords = passwordData.password_confirmation;
    passwords.forEach((item) => {
      cy.enterText(passwordField, item.first);
      cy.enterText(passwordConfirmField, item.second);
      cy.checkElementHasClass(passwordConfirmField, item.validity);
      if (item.validity === "is-invalid") {
        cy.hasText(
          passwordConfirmField + " + .invalid-feedback",
          "The password and its confirmation do not match!"
        );
      }
      cy.clearText(passwordField);
      cy.clearText(passwordConfirmField);
    });
  });
});
