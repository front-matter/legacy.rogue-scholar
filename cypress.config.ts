import { defineConfig } from "cypress"

export default defineConfig({
  projectId: "hp59u9",
  video: false,
  retries: 3,
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
})
