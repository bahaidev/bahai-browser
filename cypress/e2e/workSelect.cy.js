describe('Work select page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US');
  });

  it('Accessibility', function () {
    // See https://github.com/component-driven/cypress-axe
    cy.injectAxe();
    cy.configureAxe({
      rules: [
        // A bit ugly if visually adding, but could add
        {
          id: 'page-has-heading-one',
          enabled: false
        },
        // Could add
        {
          id: 'select-name',
          enabled: false
        }
      ]
    });
    cy.get('div[role=main]'); // Wait until available before checking a11y
    cy.checkA11y();
  });

  it('Redirects to the work display page', function () {
    cy.get('select[data-name="writings"]').select('aqdas');
    cy.location('hash', {
      timeout: 10000
    }).should('eq', '#lang=en-US&work=aqdas');
  });
});
