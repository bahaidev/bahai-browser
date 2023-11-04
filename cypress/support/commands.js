import 'cypress-axe';

Cypress.Commands.add(
  'typeAndBlur',
  /**
   * @param {string} sel
   * @param {string} text
   * @returns {void}
   */
  (sel, text) => {
    cy.get(sel).type(text);
    cy.get(sel).blur();
  }
);
