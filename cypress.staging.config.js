const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  projectId: "gfwubd",
  watchForFileChanges: false,
  e2e: {
    baseUrl: "https://sqlverifier-staging-08050d656f7a.herokuapp.com",
    env: {
      student_username: "user_student",
      student_password: "user",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
