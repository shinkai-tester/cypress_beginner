const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "gfwubd",
  watchForFileChanges: false,
  e2e: {
    baseUrl: "https://sqlverifier-live-6e21ca0ed768.herokuapp.com",
    env: {
      student_username: "shurka",
      student_password: "Test123456!",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
