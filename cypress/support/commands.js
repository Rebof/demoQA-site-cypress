// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "cypress-file-upload";

Cypress.Commands.add('PageCheck', (link, title) => {
  cy.visit(`/${link}`)
  cy.url().should('include', `https://demoqa.com/${link}`)
  cy.get('.text-center').should('have.text', title)
})


Cypress.Commands.add("getIframeBody", (selector) => {
  return cy
    .get(selector)
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
});

