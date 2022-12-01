describe('Work select page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas');
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
        }
      ]
    });
    cy.get('div[role=main]'); // Wait until available before checking a11y
    cy.checkA11y();
  });

  it('Sets wiki user name', function () {
    cy.get('button').contains('Preferences').click();

    cy.get('input#wikilinks-existing-username')
      .click().type('Brettz9').blur().should(() => {
        expect(
          localStorage.getItem('bahai-browser-wikilinks-existing-username')
        ).to.eq('Brettz9');
      });
  });
});
