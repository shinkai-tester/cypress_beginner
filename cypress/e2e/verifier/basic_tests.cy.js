describe("Verifier basic tests", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("Check that Verifier main page is loaded", () => {
    cy.url().should("include", "page=1&sort=id,asc");
    cy.contains("Sqlverifier").should("be.visible");
    cy.get("#header-tabs")
      .should("contain.text", "Home")
      .and("contain.text", "Account");
    cy.get("#task-heading").should("contain.text", "Tasks");
  });
});
