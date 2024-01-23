/// <reference types="cypress" />

describe("rogue-scholar", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("visiting homepage", function () {
    cy.url().should("eq", "http://localhost:3000/")
    cy.get("h2.mt-2").contains("Rogue Scholar Posts")
    cy.get('[data-cy="pagination-page"]').contains("1")
    cy.get('[data-cy="pagination-total"]').contains("13,")
    cy.get('[data-cy="title"]')
      .first()
      .contains("Veranstaltungshinweise Februar 2024")
  })
})
