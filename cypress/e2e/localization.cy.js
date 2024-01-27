/// <reference types="cypress" />

describe("rogue-scholar", () => {
  const languages = ["de","es", "fr", "it", "pt", "tr", "en", ]
  const posts = {de: "Beiträge", es: "Publicaciones", fr: "Des postes", it: "Messaggi", pt: "Postagens", tr: "Mesajlar", en: "Posts"}
  
  beforeEach(() => {
    cy.viewport("ipad-2", "landscape")
    cy.visit("/")
  })

  languages.forEach((lang) => {
    it(`switch to ${lang} language`, function () {
      cy.get('[data-cy="language-switch"]').click()
      cy.get('div.chakra-menu__group').should("be.visible")
      cy.get(`[value=${lang}]`).click()
      if (lang == "en") {
        cy.url().should("eq", `http://localhost:3000/`)
      } else {
        cy.url().should("eq", `http://localhost:3000/${lang}`)
        cy.getCookie("NEXT_LOCALE").should("have.property", "value", lang)
      }
      cy.get('[data-cy="nav-menu"]').first().contains(posts[lang])
    })
  })
})
