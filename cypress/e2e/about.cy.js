/// <reference types="cypress" />

describe("rogue-scholar", () => {
  beforeEach(() => {
    cy.viewport("ipad-2", "landscape")
    cy.visit("/about")
  })

  it("visiting about page", function () {
    cy.url().should("eq", "http://localhost:3000/about")
    cy.get("h1").contains("Science blogging")
  })

  it("faq section", function () {
    const faq = cy.get("section#faq")

    faq.get("h2").contains("Frequently asked questions")
    faq.get("ul li ul li").its("length").should("eq", 11)
    faq
      .get("ul li ul li")
      .eq(0)
      .get("h3")
      .contains("When does the Rogue Scholar launch?")
    faq
      .get("ul li ul li")
      .eq(0)
      .get("p")
      .contains(
        "The Rogue Scholar is available with limited functionality since April 1, 2023"
      )
  })

  it("stats section", function () {
    const stats = cy.get("section#stats")

    stats.get("h2").contains("Statistics")
    stats.get("ul li ul").its("length").should("eq", 6)
    stats.get("ul li ul").eq(0).get("h4").contains("Category")
    stats.get("ul li ul").eq(1).get("h4").contains("Language")
    stats.get("ul li ul").eq(1).get("h4").contains("Platform")
  })
})
