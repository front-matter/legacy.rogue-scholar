import { defineConfig } from "cypress"

export default defineConfig({
  projectId: "hp59u9",
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
  },
})
