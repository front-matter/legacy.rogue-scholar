/// <reference types="cypress" />

describe("rogue-scholar", () => {
  beforeEach(() => {
    cy.viewport("ipad-2", "landscape")
    cy.visit("/")
  })

  it("visiting login page", function () {
    cy.get('[data-cy="signin"]').click()
    cy.get("h2").contains("Welcome back")
    cy.get('[data-cy="magic-link"]').click()
    cy.get('button[type="submit"]').contains("Send magic link")

    cy.get('[data-cy="password"]').click()
    cy.get('button[type="submit"]').contains("Sign in")
  })
})
