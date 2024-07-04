import { faker } from "@faker-js/faker";
export { faker };

export const generateTaskData = () => ({
  text: faker.hacker.phrase(),
  answer: faker.lorem.sentence(),
  title: faker.lorem.words(5),
});

export const testsMissingParamCreate = [
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

export const testCasesPartialUpdate = [
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
