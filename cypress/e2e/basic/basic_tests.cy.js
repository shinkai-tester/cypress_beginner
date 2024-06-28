describe("Verifier basic tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should load the Verifier main page with correct elements", () => {
    const pageTitle = ".brand-title span";

    cy.urlIncludes("page=1&sort=id,asc");
    cy.checkElementVisibility(pageTitle);
    cy.hasText(pageTitle, "Sqlverifier");
    cy.containsMultipleTexts("#header-tabs", ["Home", "English", "Account"]);
    cy.containsText("#task-heading", "Tasks");
  });
});
