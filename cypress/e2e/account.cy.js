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

  it("login", function () {
    cy.login(Cypress.env("supabase_email"), Cypress.env("supabase_password"))
    cy.get("p.chakra-text").contains("This is a private page that shows the blogs managed by you.")
  })

  it("register blog", function () {
    cy.login(Cypress.env("supabase_email"), Cypress.env("supabase_password"))
    cy.get("p.chakra-text").contains("This is a private page that shows the blogs managed by you.")
    cy.get('[data-cy="create-blog-button"]').click()
    cy.get('input[name=home_page_url]').type(`https://roguescholar.xyz{enter}`)
    cy.url().should("eq", "http://localhost:3000/app")
    cy.get('table tbody tr:nth-child(1)').contains("roguescholar.xyz")

    cy.get('[data-cy="edit-blog-button"]').first().click()
    cy.get('input[name=home_page_url]').type(`{enter}`)
  })

  // it("login wrong password", function () {
  //   cy.login(Cypress.env("supabase_email"), "wrongpassword")

  //   cy.get("p.chakra-text").contains("This is a private page that shows the blogs managed by you.")
  // })
})
