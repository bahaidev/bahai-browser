describe('Work select page', () => {
  beforeEach(async () => {
    if (!window.navigator || !navigator.serviceWorker) {
      return null;
    }
    const registrations = await navigator.serviceWorker.getRegistrations();
    return Promise.all(registrations.map((registration) => {
      return registration.unregister();
    }));
  });
  beforeEach(() => {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US', {
      onBeforeLoad (win) {
        // eslint-disable-next-line no-proto -- Needed here
        delete win.navigator.__proto__.ServiceWorker;
      }
    });
  });

  it('passes accessibility', function () {
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

  it('redirects to the work display page', function () {
    cy.get('select[data-name="writings"]').select('aqdas');
    cy.location('hash', {
      timeout: 10000
    }).should('eq', '#lang=en-US&work=aqdas');
  });

  it(
    'redirects to the work display page (from second pull-down)', function () {
      cy.get('select[data-name="other-writings"]').select('lights');
      cy.location('hash', {
        timeout: 10000
      }).should('eq', '#lang=en-US&work=lights');
    }
  );

  it('"Check all" checks all works', function () {
    cy.get('button').contains('Choose works to take offline').click();
    cy.get('input[value="aqdas"]').should('not.be.checked');
    cy.get('button').contains('Check all').click();
    cy.get('input[value="aqdas"]').should('be.checked');
    cy.get('button.cancel').click();
  });

  it('"Uncheck all" unchecks all works', function () {
    cy.get('button').contains('Choose works to take offline').click();
    cy.get('input[value="aqdas"]').click();
    cy.get('input[value="aqdas"]').should('be.checked');
    cy.get('button').contains('Uncheck all').click();
    cy.get('input[value="aqdas"]').should('not.be.checked');
  });

  it('offlining works', function () {
    cy.get('button').contains('Choose works to take offline').click();
    cy.get('input[value="aqdas"]').click();
    cy.get('input[value="hidden words"]').click();
    cy.get('button.submit').click();
    cy.get('h2').contains(
      'Works to offline', {timeout: 20000}
    ).should('not.be.visible');
    cy.get(
      '#installationLogContainer', {timeout: 20000}
    ).should('not.be.visible');
    cy.get('div').contains(
      'Choose the Writings you wish to browse'
    ).should('be.visible');
  });
});
