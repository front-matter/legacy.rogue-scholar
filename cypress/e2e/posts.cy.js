/// <reference types="cypress" />

describe("rogue-scholar", () => {
  beforeEach(() => {
    cy.viewport("ipad-2", "landscape")
    cy.visit("/")
  })

  it("visiting posts page", function () {
    cy.url().should("eq", "http://localhost:3000/")
    cy.get("h2.mt-2").contains("Rogue Scholar Posts")
    cy.get('[data-cy="pagination-page"]').first().contains("1")
    cy.get('[data-cy="pagination-total"]')
      .first()
      .invoke("data", "value")
      .should("be.at.least", 13000)
    cy.get('[data-cy="title"]').should("have.length.of.at.least", 8)
  })

  it("visiting posts next page", function () {
    cy.get('[data-cy="pagination-next"]').first().click()
    cy.location("search").should(
      "eq",
      "?page=2&query=&category=&generator=&tags=&language="
    )
    cy.get('[data-cy="pagination-page"]').contains("2")
    cy.get('[data-cy="pagination-total"]')
      .first()
      .invoke("data", "value")
      .should("be.at.least", 13000)
    cy.get('[data-cy="title"]').should("have.length.of.at.least", 8)
  })

  it("search posts", function () {
    cy.url().should("eq", "http://localhost:3000/")
    cy.get("input#search").type("Metascience{enter}")
    cy.get('[data-cy="pagination-total"]')
      .first()
      .invoke("data", "value")
      .should("be.at.least", 20)
    cy.get('[data-cy="title"]').should("have.length.of.at.least", 8)
  })
})
