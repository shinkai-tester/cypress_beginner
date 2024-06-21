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

Cypress.Commands.add("urlIncludes", (path) => {
  cy.url().should("include", path);
});

Cypress.Commands.add("clickElement", (selector) => {
  cy.get(selector).click();
});

Cypress.Commands.add("checkElementVisibility", (selector) => {
  cy.get(selector).should("be.visible");
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
