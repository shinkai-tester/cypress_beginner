Cypress.Commands.add("cleanupTaskViaAPI", (token, taskId) => {
  cy.request({
    method: "DELETE",
    url: `${Cypress.config("baseUrl")}/api/tasks/${taskId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((deleteResponse) => {
    expect(deleteResponse.status).to.eq(204);
  });
});

Cypress.Commands.add("createTaskViaAPI", (token, text, answer, title) => {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.config("baseUrl")}/api/tasks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        text: text,
        answer: answer,
        title: title,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body)
        .to.have.property("id")
        .and.to.be.a("number")
        .and.to.be.above(0);

      return cy.wrap(response.body.id);
    });
});

Cypress.Commands.add("getTaskByIdViaAPI", (token, id) => {
  return cy.request({
    method: "GET",
    url: `${Cypress.config("baseUrl")}/api/tasks/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  });
});
