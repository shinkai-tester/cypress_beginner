const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "gfwubd",
  watchForFileChanges: false,
  viewportWidth: 1280,
  viewportHeight: 800,
  e2e: {
    baseUrl: "https://sqlverifier-live-6e21ca0ed768.herokuapp.com",
    env: {
      configFile: "cypress.config.js",
      student_username: "shurka",
      student_password: "Test123456!",
      admin: "admin_automation",
      teacher_username: "shurka_teacher",
      teacher_password: "Test1234!",
    },
    setupNodeEvents(on, config) {
      on("before:spec", () => {
        console.log(`Using config file: ${config.env.configFile}`);
      });

      return config;
    },
  },
});
