require('dotenv').config()
import { defineConfig } from "cypress"

export default defineConfig({
  projectId: "66vv8z",
  video: false,
  retries: 3,
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
  env: {
    supabase_email: process.env.SUPABASE_EMAIL,
    supabase_password: process.env.SUPABASE_PASSWORD,
    supabase_hostname: process.env.SUPABASE_HOSTNAME,
  },
    
})
