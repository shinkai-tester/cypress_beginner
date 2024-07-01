// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const SELECTORS = {
  adminMenu: "#admin-menu",
  accountMenu: "#account-menu",
  userManagementLink: '[href="/admin/user-management"]',
  registerSubmit: "#register-submit",
  lastPageButton: 'button[aria-label="Last"]',
  usernameInput: "#username",
  emailInput: "#email",
  passwordInput: "#password",
  firstPasswordInput: "#firstPassword",
  secondPasswordInput: "#secondPassword",
  loginSubmit: '[type="submit"]',
};

Cypress.Commands.add("urlIncludes", (path) => {
  cy.url().should("include", path);
});

Cypress.Commands.add("clickElement", (selector) => {
  cy.get(selector).click();
});

Cypress.Commands.add("enterText", (selector, text) => {
  cy.get(selector).type(`${text}{enter}`);
});

Cypress.Commands.add("clearText", (selector) => {
  cy.get(selector).clear();
});

Cypress.Commands.add("checkElementVisibility", (selector, timeout = 1000) => {
  cy.get(selector, { timeout: timeout }).should("be.visible");
});

Cypress.Commands.add("checkElementNotExist", (selector) => {
  cy.get(selector).should("not.exist");
});

Cypress.Commands.add("checkElementHasClass", (selector, className) => {
  cy.get(selector).should("have.class", className);
});

Cypress.Commands.add("hasText", (selector, text) => {
  cy.get(selector).should("have.text", text);
});

Cypress.Commands.add("containsText", (selector, text) => {
  cy.get(selector).should("contain.text", text);
});

Cypress.Commands.add("containsMultipleTexts", (selector, texts) => {
  texts.forEach((text) => {
    cy.get(selector).should("contain.text", text);
  });
});

Cypress.Commands.add(
  "containsElementWithText",
  (parentSelector, childSelector, text) => {
    cy.get(parentSelector).contains(childSelector, text);
  }
);

Cypress.Commands.add("checkCssPropertyValue", (selector, property, value) => {
  cy.get(selector).should("have.css", property, value);
});

Cypress.Commands.add("cleanupUserViaAPI", (username) => {
  cy.request({
    method: "POST",
    url: "/api/authenticate",
    body: {
      username: Cypress.env("admin"),
      password: Cypress.env("admin"),
      rememberMe: true,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    let idToken = response.body.id_token;

    cy.request({
      method: "DELETE",
      url: `/api/admin/users/${username}`,
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(204);
    });
  });
});

Cypress.Commands.add(
  "registerUser",
  (username, email, password, confirmPassword) => {
    cy.visit("/account/register");
    cy.enterText(SELECTORS.usernameInput, username);
    cy.enterText(SELECTORS.emailInput, email);
    cy.enterText(SELECTORS.firstPasswordInput, password);
    cy.enterText(SELECTORS.secondPasswordInput, confirmPassword);
    cy.clickElement(SELECTORS.registerSubmit);
  }
);

Cypress.Commands.add("login", (username, password) => {
  cy.visit("/login");
  cy.enterText(SELECTORS.usernameInput, username);
  cy.enterText(SELECTORS.passwordInput, password);
  cy.clickElement(SELECTORS.loginSubmit);
});

Cypress.Commands.add("logout", () => {
  cy.clickElement(SELECTORS.accountMenu);
  cy.contains("Sign out").click();
});

Cypress.Commands.add("checkNewUserInTableByAdmin", (username) => {
  cy.login(Cypress.env("admin"), Cypress.env("admin"));
  cy.clickElement(SELECTORS.adminMenu);
  cy.clickElement(SELECTORS.userManagementLink);
  cy.clickElement(SELECTORS.lastPageButton);
  cy.checkElementVisibility(`#${username}`);
});
