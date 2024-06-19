const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "gfwubd",
  watchForFileChanges: false,
  e2e: {
    baseUrl: "https://sqlverifier-staging-08050d656f7a.herokuapp.com",
    env: {
      configFile: 'cypress.staging.config.js',
      student_username: "user_student",
      student_password: "user",
    },
    setupNodeEvents(on, config) {
      on('before:spec', () => {
        console.log(`Using config file: ${config.env.configFile}`);
      });

      return config;
    },
  },
});