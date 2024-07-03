import { faker } from "@faker-js/faker";

const baseURL = Cypress.config("baseUrl");
let token;

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const STATUS_NO_CONTENT = 204;
const STATUS_BAD_REQUEST = 400;
const STATUS_UNAUTHORIZED = 401;
const STATUS_NOT_FOUND = 404;

const testsMissingParamCreate = [
  {
    description: "missing text",
    body: {
      answer: faker.lorem.sentence(),
      title: faker.lorem.words(5),
    },
  },
  {
    description: "missing answer",
    body: {
      text: faker.hacker.phrase(),
      title: faker.lorem.words(5),
    },
  },
  {
    description: "missing title",
    body: {
      text: faker.hacker.phrase(),
      answer: faker.lorem.sentence(),
    },
  },
];

const testCasesPartialUpdate = [
  {
    description: "Update only task title",
    updateField: { title: faker.lorem.words(3) },
    fieldName: "title",
  },
  {
    description: "Update only task answer",
    updateField: { answer: faker.lorem.sentence() },
    fieldName: "answer",
  },
  {
    description: "Update only task text",
    updateField: { text: faker.hacker.phrase() },
    fieldName: "text",
  },
];

before(() => {
  cy.request({
    method: "POST",
    url: `${baseURL}/api/authenticate`,
    body: {
      username: Cypress.env("admin"),
      password: Cypress.env("admin"),
      rememberMe: true,
    },
  }).then((response) => {
    expect(response.status).to.eq(STATUS_OK);
    token = response.body.id_token;
    Cypress.env("token", token);
  });
});

describe("Task API tests: create", () => {
  it("Cteate task", () => {
    let sentText = faker.hacker.phrase();
    let sentAnswer = faker.lorem.sentence();
    let sentTitle = faker.lorem.words(5);

    cy.request({
      method: "POST",
      url: `${baseURL}/api/tasks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        text: sentText,
        answer: sentAnswer,
        title: sentTitle,
      },
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CREATED);
      expect(response.body)
        .to.have.property("id")
        .and.to.be.a("number")
        .and.to.be.above(0);
      expect(response.body.text).to.eq(sentText);
      expect(response.body.answer).to.eq(sentAnswer);
      expect(response.body.title).to.eq(sentTitle);

      cy.cleanupTaskViaAPI(token, response.body.id);
    });
  });

  it("Create task without token", () => {
    cy.request({
      method: "POST",
      url: `${baseURL}/api/tasks`,
      failOnStatusCode: false,
      body: {
        text: faker.hacker.phrase(),
        answer: faker.lorem.sentence(),
        title: faker.lorem.words(5),
      },
    }).then((response) => {
      expect(response.status).to.eq(STATUS_UNAUTHORIZED);
    });
  });

  testsMissingParamCreate.forEach(({ description, body }) => {
    it.skip(`Should return 400 when ${description}`, () => {
      cy.request({
        method: "POST",
        url: `${baseURL}/api/tasks`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_BAD_REQUEST); // must return 400 Bad Request, but there is a bug: returns 500
      });
    });
  });
});

describe("Task API tests: task update", () => {
  it("Full task update", () => {
    let text = faker.hacker.phrase();
    let answer = faker.lorem.sentence();
    let title = faker.lorem.words(5);

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      let updText = faker.hacker.phrase();
      let updAnswer = faker.lorem.sentence();
      let updTitle = faker.lorem.words(3);

      cy.log(`Created task with ID: ${taskId}`);

      cy.request({
        method: "PUT",
        url: `${baseURL}/api/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          id: taskId,
          text: updText,
          answer: updAnswer,
          title: updTitle,
        },
      }).then((response) => {
        expect(response.status).to.eq(STATUS_OK);
        expect(response.body.id).to.eq(taskId);
        expect(response.body.text).to.eq(updText);
        expect(response.body.answer).to.eq(updAnswer);
        expect(response.body.title).to.eq(updTitle);

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });

  it("Full task update without token", () => {
    let text = faker.hacker.phrase();
    let answer = faker.lorem.sentence();
    let title = faker.lorem.words(5);

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      cy.request({
        method: "PUT",
        url: `${baseURL}/api/tasks/${taskId}`,
        body: {
          id: taskId,
          text: faker.hacker.phrase(),
          answer: faker.lorem.sentence(),
          title: faker.lorem.words(3),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_UNAUTHORIZED);

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });

  it.skip("Full update of not existing task", () => {
    cy.request({
      method: "PUT",
      url: `${baseURL}/api/tasks/123`,
      body: {
        id: 123,
        text: faker.hacker.phrase(),
        answer: faker.lorem.sentence(),
        title: faker.lorem.words(3),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_BAD_REQUEST); // must return 404 Not Found, but returns 400 Bad Request

      cy.cleanupTaskViaAPI(token, taskId);
    });
  });

  it.skip("Full update - not all parameters are speicifed", () => {
    let text = faker.hacker.phrase();
    let answer = faker.lorem.sentence();
    let title = faker.lorem.words(5);

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      cy.request({
        method: "PUT",
        url: `${baseURL}/api/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          id: taskId,
          text: faker.hacker.phrase(),
          answer: faker.lorem.sentence(),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_BAD_REQUEST); // must return 400 Bad Request, but returns 500

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });

  testCasesPartialUpdate.forEach(({ description, updateField, fieldName }) => {
    it(description, () => {
      let initText = faker.hacker.phrase();
      let initAnswer = faker.lorem.sentence();
      let initTitle = faker.lorem.words(5);

      cy.createTaskViaAPI(token, initText, initAnswer, initTitle).then(
        (taskId) => {
          const requestBody = { id: taskId, ...updateField };

          cy.request({
            method: "PATCH",
            url: `${baseURL}/api/tasks/${taskId}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: requestBody,
          }).then((response) => {
            expect(response.status).to.eq(STATUS_OK);
            expect(response.body.id).to.eq(taskId);
            expect(response.body.text).to.eq(
              fieldName === "text" ? requestBody.text : initText
            );
            expect(response.body.answer).to.eq(
              fieldName === "answer" ? requestBody.answer : initAnswer
            );
            expect(response.body.title).to.eq(
              fieldName === "title" ? requestBody.title : initTitle
            );

            cy.cleanupTaskViaAPI(token, taskId);
          });
        }
      );
    });
  });

  it("Partial update: no update of any field", () => {
    let text = faker.hacker.phrase();
    let answer = faker.lorem.sentence();
    let title = faker.lorem.words(5);

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      cy.request({
        method: "PATCH",
        url: `${baseURL}/api/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          id: taskId,
        },
      }).then((response) => {
        expect(response.status).to.eq(STATUS_OK);
        expect(response.body.id).to.eq(taskId);
        expect(response.body.text).to.eq(text);
        expect(response.body.answer).to.eq(answer);
        expect(response.body.title).to.eq(title);

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });
});

describe("Task API tests: task delete", () => {
  it("Delete existing task", () => {
    let text = faker.hacker.phrase();
    let answer = faker.lorem.sentence();
    let title = faker.lorem.words(5);

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      cy.request({
        method: "DELETE",
        url: `${baseURL}/api/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(STATUS_NO_CONTENT);

        cy.getTaskByIdViaAPI(token, taskId).then((response) => {
          expect(response.status).to.eq(STATUS_NOT_FOUND);
        });
      });
    });
  });

  it("Delete not existing task", () => {
    cy.request({
      method: "DELETE",
      url: `${baseURL}/api/tasks/123`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_NO_CONTENT);
    });
  });

  it("Delete with invalid task id format", () => {
    cy.request({
      method: "DELETE",
      url: `${baseURL}/api/tasks/test`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_BAD_REQUEST);
      expect(response.body.detail).to.include("Failed to convert 'id'");
    });
  });

  it("Delete task without token", () => {
    let text = faker.hacker.phrase();
    let answer = faker.lorem.sentence();
    let title = faker.lorem.words(5);

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      cy.request({
        method: "DELETE",
        url: `${baseURL}/api/tasks/${taskId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_UNAUTHORIZED);

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });
});
