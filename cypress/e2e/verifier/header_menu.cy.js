describe("Tests on redirection after clicking header's menu elements", () => {
  const entityMenu = '#entity-menu [data-icon="table-list"] + span';
  const langMenu = "#docs-menu + li span";
  const headers = "#header-tabs";
  const mainPagePath = "?page=1&sort=id,asc";
  const accountMenu = "#account-menu";
  const accountSettings = ".dropdown-menu a[data-cy='settings']";
  const taskHeading = "#task-heading";

  beforeEach(() => {
    cy.visit("/");
    cy.clickElement("#account-menu");
    cy.clickElement("#login-item span");
    cy.get("#username").type(Cypress.env("student_username"));
    cy.get("#password").type(Cypress.env("student_password"));
    cy.clickElement('[type="submit"]');
  });

  it("Redirection to tasks page after clicking 'Entities -> Task'", () => {
    cy.clickElement(entityMenu);
    cy.clickElement("#entity-menu div .dropdown-item:nth-child(1)");
    cy.urlIncludes(mainPagePath);
    cy.checkElementVisibility(taskHeading);
    cy.containsElementWithText(taskHeading, "button", "Refresh list");
    cy.containsElementWithText(
      taskHeading,
      "#jh-create-entity",
      "Create a new Task"
    );
  });

  it("Redirection to user's tasks after clicking 'Entities -> User Task'", () => {
    cy.clickElement(entityMenu);
    cy.clickElement("#entity-menu div .dropdown-item:nth-child(2)");
    cy.urlIncludes("user-task");
    cy.containsText("#user-task-heading", "User Tasks");
  });

  it("Redirection to Swagger -> API", () => {
    cy.clickElement("#docs-menu [aria-expanded='false'] span");
    cy.clickElement("#docs-menu .dropdown-item span");
    cy.urlIncludes("docs/docs");
    cy.checkElementVisibility("iframe[title='Swagger UI']");
  });

  it("Switching to French", () => {
    cy.clickElement(langMenu);
    cy.clickElement("button[value='fr']");
    cy.containsMultipleTexts(headers, [
      "Accueil",
      "Entités",
      "Français",
      "Compte",
    ]);
    cy.urlIncludes(mainPagePath);
  });

  it("Switching to Russian", () => {
    cy.clickElement(langMenu);
    cy.clickElement("button[value='ru']");
    cy.containsMultipleTexts(headers, [
      "Главная",
      "Сущности",
      "Русский",
      "Профиль",
    ]);
    cy.urlIncludes(mainPagePath);
  });

  it("Switching to Ukrainian", () => {
    cy.clickElement(langMenu);
    cy.clickElement("button[value='ua']");
    cy.containsMultipleTexts(headers, [
      "Головна",
      "Сутності",
      "Українська",
      "Профіль",
    ]);
    cy.urlIncludes(mainPagePath);
  });

  it("Switching to English", () => {
    cy.clickElement(langMenu);
    cy.clickElement("button[value='en']");
    cy.containsMultipleTexts(headers, [
      "Home",
      "Entities",
      "English",
      "Account",
    ]);
    cy.urlIncludes(mainPagePath);
  });

  it("Redirection to Account Settings", () => {
    cy.clickElement(accountMenu);
    cy.clickElement(accountSettings);
    cy.urlIncludes("account/settings");
    cy.checkElementVisibility("#settings-form");
    cy.containsText("#settings-title span", "User settings");
  });

  it("Redirection to Account Password menu item", () => {
    cy.clickElement(accountMenu);
    cy.clickElement(".dropdown-menu a[data-cy='passwordItem']");
    cy.urlIncludes("account/password");
    cy.checkElementVisibility("#password-form");
    cy.containsText("#password-title span", "Password for");
  });

  it("Signing out after clicking 'Sign out' button", () => {
    cy.clickElement(accountMenu);
    cy.clickElement(".dropdown-menu a[data-cy='logout']");
    cy.urlIncludes("logout");
    cy.hasText("#app-view-container h4", "Logged out successfully!");
  });

  it("Redirection to Home page", () => {
    cy.clickElement(accountMenu);
    cy.clickElement(accountSettings);
    cy.urlIncludes("account/settings");
    cy.clickElement("#header-tabs li:first-child");
    cy.urlIncludes(mainPagePath);
    cy.checkElementVisibility(taskHeading);
  });
});
