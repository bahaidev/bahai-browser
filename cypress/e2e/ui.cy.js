describe('empty spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/');
  });

  it('Accessibility', function () {
    // See https://github.com/component-driven/cypress-axe
    cy.injectAxe();
    cy.configureAxe({
      rules: [
        // No real content on main page
        {
          id: 'page-has-heading-one',
          enabled: false
        },
        // Don't want to have a label introducing languages which is biased
        //   toward a language
        {
          id: 'select-name',
          enabled: false
        }
      ]
    });
    cy.get('div[role=main]'); // Wait until available before checking a11y
    cy.checkA11y();
  });

  it(`Bahá'í Writings: Installing`, () => {
    cy.get('#installationLogContainer');
    cy.log('Check for installation container');
  });

  it(`Bahá'í Writings: Language selection screen`, () => {
    cy.get('#languageSelectionContainer');
    cy.log('Found language selection container');

    cy.window().then((win) => {
      expect(
        win.document.documentElement.lang
      ).to.equal('en-US', 'Got language');
      expect(win.document.dir).to.equal('ltr', 'Got direction');
    });
  });
});
