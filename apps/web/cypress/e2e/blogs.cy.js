/// <reference types="cypress" />

describe("rogue-scholar", () => {
  beforeEach(() => {
    cy.viewport("ipad-2", "landscape")
    cy.visit("/blogs")
  })

  it("visiting blogs page", function () {
    cy.url().should("eq", "http://localhost:3000/blogs")
    cy.get("h2.mt-2").contains("Rogue Scholar Blogs")
    cy.get('[data-cy="pagination-page"]').first().contains("1")
    cy.get('[data-cy="pagination-total"]')
      .first()
      .invoke("data", "value")
      .should("be.at.least", 70)
    cy.get('[data-cy="title"]').should("have.length", 10)
  })

  it("visiting blogs next page", function () {
    cy.get('[data-cy="pagination-next"]').first().click()
    cy.location("search").should(
      "eq",
      "?page=2&query=&category=&generator=&tags=&language="
    )
    cy.get('[data-cy="pagination-page"]').contains("2")
    cy.get('[data-cy="pagination-total"]')
      .first()
      .invoke("data", "value")
      .should("be.at.least", 70)
    cy.get('[data-cy="title"]').should("have.length", 10)
  })

  it("search blogs", function () {
    cy.url().should("eq", "http://localhost:3000/blogs")
    cy.get("input#search").type("metascience{enter}")
    cy.get('[data-cy="pagination-total"]')
      .first()
      .invoke("data", "value")
      .should("be.at.least", 2)
    cy.get('[data-cy="title"]').should("have.length", 2)
  })

  it("search blogs by issn", function () {
    cy.url().should("eq", "http://localhost:3000/blogs")
    cy.get("input#search").type("2051-8188{enter}")
    cy.get('[data-cy="pagination-page"]').contains("1")
    cy.get('[data-cy="title"]').should("have.length", 1)
    cy.get('[data-cy="issn"]').contains("2051-8188")
  })

  it("search blogs by platform", function () {
    cy.url().should("eq", "http://localhost:3000/blogs")
    cy.get("input#search").type("jekyll{enter}")
    cy.get('[data-cy="pagination-total"]')
      .first()
      .invoke("data", "value")
      .should("be.at.least", 5)
    cy.get('[data-cy="title"]').should("have.length.of.at.least", 5)
  })
})
