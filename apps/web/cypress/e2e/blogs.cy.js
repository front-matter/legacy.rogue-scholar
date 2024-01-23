/// <reference types="cypress" />

describe("rogue-scholar", () => {
  beforeEach(() => {
    cy.visit("/blogs")
  })

  it("visiting blogs page", function () {
    cy.url().should("eq", "http://localhost:3000/blogs")
    cy.get("h2.mt-2").contains("Rogue Scholar Blogs")
    cy.get('[data-cy="pagination-page"]').contains("1")
    cy.get('[data-cy="pagination-total"]').contains("7")
    cy.get('[data-cy="title"]').first().contains("A blog by Ross Mounce")
  })
})
