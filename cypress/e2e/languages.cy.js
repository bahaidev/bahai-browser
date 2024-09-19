describe('Languages page', () => {
  beforeEach(async () => {
    if (!window.navigator || !navigator.serviceWorker) {
      return null;
    }
    const registrations = await navigator.serviceWorker.getRegistrations();
    return Promise.all(registrations.map((registration) => {
      return registration.unregister();
    }));
  });
  // eslint-disable-next-line mocha/no-sibling-hooks -- Different for Cypress
  beforeEach(() => {
    cy.visit('http://localhost:8000/index-instrumented.html');
  });

  it('passes accessibility', function () {
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

  it('Redirects to the work selection page', function () {
    // Clicking or selecting the option is not sufficient for Cypress;
    //  likewise where `selectedOptions` is used
    cy.get('select[name="lang"]').invoke('prop', 'selectedIndex', 0);
    cy.get('select[name="lang"] option[value="en-US"]').click();

    cy.location('hash', {
      timeout: 10000
    }).should('eq', '#lang=en-US');
  });

  it(
    'Shows selected item still highlighted if using back button', function () {
      // Clicking or selecting the option is not sufficient for Cypress;
      //  likewise where `selectedOptions` is used
      cy.get('select[name="lang"]').invoke('prop', 'selectedIndex', 0);
      cy.get('select[name="lang"] option[value="en-US"]').click();
      cy.location('hash', {
        timeout: 10000
      }).should('eq', '#lang=en-US');
      cy.go('back');
      cy.get(
        'select[name="lang"] option[value="en-US"]'
      ).should('be.selected');
    }
  );
});
