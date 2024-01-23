/// <reference types="cypress" />

describe("rogue-scholar", () => {
  beforeEach(() => {
    cy.visit("/about")
  })

  it("visiting about page", function () {
    cy.url().should("eq", "http://localhost:3000/about")
    cy.get("h1").contains("Science blogging")
  })
})
