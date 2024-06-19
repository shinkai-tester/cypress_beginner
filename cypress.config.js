const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "gfwubd",
  watchForFileChanges: false,
  e2e: {
    baseUrl: "https://sqlverifier-live-6e21ca0ed768.herokuapp.com",
    env: {
      configFile: 'cypress.config.js',
      student_username: "shurka",
      student_password: "Test123456!",
    },
    setupNodeEvents(on, config) {
      on('before:spec', () => {
        console.log(`Using config file: ${config.env.configFile}`);
      });

      return config;
    },
  },
});
