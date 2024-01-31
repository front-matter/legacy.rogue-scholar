Cypress.Commands.add("login", (email, password) => {
  cy.visit('/auth/signin')

  // click tab to show password dialog
  cy.get('[data-cy="password"]').click()
  cy.get('input[name=email]').type(email, { log: false })

  // {enter} causes the form to submit
  cy.get('input[name=password]').type(`${password}{enter}`, { log: false })

  // we should be redirected to /dashboard
  cy.url().should('include', '/app')

  // our auth cookie should be present
  cy.getCookie(Cypress.env('supabase_hostname') + "-auth-token").should('exist')

  // UI should reflect this user being logged in
  cy.get('h2').should('contain', "Dashboard")
})
