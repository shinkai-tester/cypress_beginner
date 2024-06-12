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
});
