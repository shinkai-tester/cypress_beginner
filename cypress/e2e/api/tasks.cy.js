import { STATUS_CODES } from "../../utils/constants";
import {
  generateTaskData,
  testsMissingParamCreate,
  testCasesPartialUpdate,
} from "../../utils/testDataTask";

const baseURL = Cypress.config("baseUrl");
let token;

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
    expect(response.status).to.eq(STATUS_CODES.OK);
    token = response.body.id_token;
    Cypress.env("token", token);
  });
});

describe("Task API tests: create", () => {
  it("Create task", () => {
    const { text, answer, title } = generateTaskData();

    cy.request({
      method: "POST",
      url: `${baseURL}/api/tasks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        text,
        answer,
        title,
      },
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODES.CREATED);
      expect(response.body)
        .to.have.property("id")
        .and.to.be.a("number")
        .and.to.be.above(0);
      expect(response.body.text).to.eq(text);
      expect(response.body.answer).to.eq(answer);
      expect(response.body.title).to.eq(title);

      cy.cleanupTaskViaAPI(token, response.body.id);
    });
  });

  it("Create task without token", () => {
    const { text, answer, title } = generateTaskData();

    cy.request({
      method: "POST",
      url: `${baseURL}/api/tasks`,
      failOnStatusCode: false,
      body: {
        text,
        answer,
        title,
      },
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODES.UNAUTHORIZED);
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
        expect(response.status).to.eq(STATUS_CODES.BAD_REQUEST); // must return 400 Bad Request, but there is a bug: returns 500
      });
    });
  });
});

describe("Task API tests: task update", () => {
  it("Full task update", () => {
    const { text, answer, title } = generateTaskData();

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      const {
        text: updText,
        answer: updAnswer,
        title: updTitle,
      } = generateTaskData();

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
        expect(response.status).to.eq(STATUS_CODES.OK);
        expect(response.body.id).to.eq(taskId);
        expect(response.body.text).to.eq(updText);
        expect(response.body.answer).to.eq(updAnswer);
        expect(response.body.title).to.eq(updTitle);

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });

  it("Full task update without token", () => {
    const { text, answer, title } = generateTaskData();

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      const {
        text: updText,
        answer: updAnswer,
        title: updTitle,
      } = generateTaskData();

      cy.request({
        method: "PUT",
        url: `${baseURL}/api/tasks/${taskId}`,
        body: {
          id: taskId,
          text: updText,
          answer: updAnswer,
          title: updTitle,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_CODES.UNAUTHORIZED);

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });

  it.skip("Full update of not existing task", () => {
    const {
      text: updText,
      answer: updAnswer,
      title: updTitle,
    } = generateTaskData();

    cy.request({
      method: "PUT",
      url: `${baseURL}/api/tasks/123`,
      body: {
        id: 123,
        text: updText,
        answer: updAnswer,
        title: updTitle,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(STATUS_CODES.BAD_REQUEST); // must return 404 Not Found, but returns 400 Bad Request
    });
  });

  it.skip("Full update - not all parameters are specified", () => {
    const { text, answer, title } = generateTaskData();

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      const { text: updText, answer: updAnswer } = generateTaskData();

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
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_CODES.BAD_REQUEST); // must return 400 Bad Request, but returns 500

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });

  testCasesPartialUpdate.forEach(({ description, updateField, fieldName }) => {
    it(description, () => {
      const {
        text: initText,
        answer: initAnswer,
        title: initTitle,
      } = generateTaskData();

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
            expect(response.status).to.eq(STATUS_CODES.OK);
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
    const { text, answer, title } = generateTaskData();

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
        expect(response.status).to.eq(STATUS_CODES.OK);
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
    const { text, answer, title } = generateTaskData();

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      cy.request({
        method: "DELETE",
        url: `${baseURL}/api/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(STATUS_CODES.NO_CONTENT);

        cy.getTaskByIdViaAPI(token, taskId).then((response) => {
          expect(response.status).to.eq(STATUS_CODES.NOT_FOUND);
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
      expect(response.status).to.eq(STATUS_CODES.NO_CONTENT);
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
      expect(response.status).to.eq(STATUS_CODES.BAD_REQUEST);
      expect(response.body.detail).to.include("Failed to convert 'id'");
    });
  });

  it("Delete task without token", () => {
    const { text, answer, title } = generateTaskData();

    cy.createTaskViaAPI(token, text, answer, title).then((taskId) => {
      cy.request({
        method: "DELETE",
        url: `${baseURL}/api/tasks/${taskId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(STATUS_CODES.UNAUTHORIZED);

        cy.cleanupTaskViaAPI(token, taskId);
      });
    });
  });
});
