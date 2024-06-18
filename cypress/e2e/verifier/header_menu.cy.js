describe("Tests on redirection after clicking header's menu elements", () => {
  beforeEach(() => {
    cy.visit("");
    cy.get("#account-menu").click();
    cy.get("#login-item span").click();
    cy.get("#username").type(Cypress.env("student_username"));
    cy.get("#password").type(Cypress.env("student_password"));
    cy.get('[type="submit"]').click();
  });

  it("Redirection to tasks page after clicking 'Entities -> Task'", () => {
    cy.get('#entity-menu [data-icon="table-list"] + span').click();
    cy.get("#entity-menu div .dropdown-item:nth-child(1)").click();
    cy.get("#task-heading").should("exist");
    cy.get("#task-heading").contains("button", "Refresh list").should("exist");
    cy.get("#task-heading").find("#jh-create-entity").should("exist");
    cy.url().should("include", "task?page=1&sort=id,asc");
  });

  it("Redirection to user's tasks after clicking 'Entities -> User Task'", () => {
    cy.get('#entity-menu [data-icon="table-list"] + span').click();
    cy.get("#entity-menu div .dropdown-item:nth-child(2)").click();
    cy.url().should("include", "user-task");
    cy.get("#user-task-heading").should("contain.text", "User Tasks");
  });

  it("Redirection to Swagger -> API", () => {
    cy.get("#docs-menu [aria-expanded='false'] span").click();
    cy.get("#docs-menu .dropdown-item span").click();
    cy.url().should("include", "docs/docs");
    cy.get("iframe[title='Swagger UI']").should("be.visible");
  });

  it("Switching to French", () => {
    cy.get("#docs-menu + li span").click();
    cy.get("button[value='fr']").click();
    cy.get("#header-tabs").should(($el) => {
      expect($el).to.contain.text("Accueil");
      expect($el).to.contain.text("Entités");
      expect($el).to.contain.text("Français");
      expect($el).to.contain.text("Compte");
    });
    cy.url().should("include", "?page=1&sort=id,asc");
  });

  it("Switching to Russian", () => {
    cy.get("#docs-menu + li span").click();
    cy.get("button[value='ru']").click();
    cy.get("#header-tabs").should(($el) => {
      expect($el).to.contain.text("Главная");
      expect($el).to.contain.text("Сущности");
      expect($el).to.contain.text("Русский");
      expect($el).to.contain.text("Профиль");
    });
    cy.url().should("include", "?page=1&sort=id,asc");
  });

  it("Switching to Ukrainian", () => {
    cy.get("#docs-menu + li span").click();
    cy.get("button[value='ua']").click();
    cy.get("#header-tabs").should(($el) => {
      expect($el).to.contain.text("Головна");
      expect($el).to.contain.text("Сутності");
      expect($el).to.contain.text("Українська");
      expect($el).to.contain.text("Профіль");
    });
    cy.url().should("include", "?page=1&sort=id,asc");
  });

  it("Switching to English", () => {
    cy.get("#docs-menu + li span").click();
    cy.get("button[value='en']").click();
    cy.get("#header-tabs").should(($el) => {
      expect($el).to.contain.text("Home");
      expect($el).to.contain.text("Entities");
      expect($el).to.contain.text("English");
      expect($el).to.contain.text("Account");
    });
    cy.url().should("include", "?page=1&sort=id,asc");
  });

  it("Redirection to Account Settings", () => {
    cy.get("#account-menu").click();
    cy.get(".dropdown-menu a[data-cy='settings']").click();
    cy.get("#settings-title span").should("contain.text", "User settings");
    cy.get("#settings-form").should("be.visible");
    cy.url().should("include", "account/settings");
  });

  it("Redirection to Account Password menu item", () => {
    cy.get("#account-menu").click();
    cy.get(".dropdown-menu a[data-cy='passwordItem']").click();
    cy.get("#password-title span").should("contain.text", "Password for");
    cy.get("#password-form").should("be.visible");
    cy.url().should("include", "account/password");
  });

  it("Signing out after clicking 'Sign out' button", () => {
    cy.get("#account-menu").click();
    cy.get(".dropdown-menu a[data-cy='logout']").click();
    cy.get("#app-view-container h4").should(
      "have.text",
      "Logged out successfully!"
    );
    cy.url().should("include", "logout");
  });

  it("Redirection to Home page", () => {
    cy.get("#account-menu").click();
    cy.get(".dropdown-menu a[data-cy='settings']").click();
    cy.url().should("include", "account/settings");
    cy.get("#header-tabs li:first-child").click();
    cy.url().should("include", "?page=1&sort=id,asc");
    cy.get("#task-heading").should("be.visible");
  });
});
