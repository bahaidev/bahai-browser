describe('Work display page', () => {
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
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas');
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
        }
      ]
    });
    cy.get('div[role=main]'); // Wait until available before checking a11y
    cy.checkA11y();
  });

  it('"Check all" enables all fields', function () {
    // Indexes
    cy.get('input#checked1').should('not.be.checked');
    // Tooltips (English)
    cy.get('input#checked2').should('be.checked');
    cy.get('input[type="button"][value="Check all"]').click();
    cy.get('input#checked1').should('be.checked');
    cy.get('input#checked2').should('be.checked');
  });

  it('"Uncheck all" disables all fields', function () {
    // Indexes
    cy.get('input#checked1').should('not.be.checked');
    // Tooltips (English)
    cy.get('input#checked2').should('be.checked');
    cy.get('input[type="button"][value="Uncheck all"]').click();
    cy.get('input#checked1').should('not.be.checked');
    cy.get('input#checked2').should('not.be.checked');
  });

  describe('Preferences', function () {
    it('hides preferences', function () {
      cy.get('#preferences').should('not.be.visible');
      cy.get('button').contains('Preferences').click();
      cy.get('#preferences').should('be.visible');
      cy.get('button').contains('Preferences').click();
      cy.get('#preferences').should('not.be.visible');
    });

    it('sets wiki user name', function () {
      cy.get('button').contains('Preferences').click();

      cy.get('input#wikilinks-existing-username')
        .click().type('Brettz9').blur().should(() => {
          expect(
            localStorage.getItem('bahai-browser-wikilinks-existing-username')
          ).to.eq('Brettz9');
        });
    });

    it.skip('checks impact of setting wiki user name', function () {
      // Todo: Check impact of settingw wiki user name
    });

    it('hides formatting section', function () {
      cy.get('#advancedformatting').should('be.visible');
      cy.get('button').contains('Preferences').click();
      cy.get('input#hideFormattingSection').click();
      cy.get('#advancedformatting').should('not.be.visible');
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas');
      cy.get('#advancedformatting').should('not.be.visible');
    });

    it('hides formatting section with URL parameter', function () {
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&formatting=0');
      cy.get('#advancedformatting').should('not.be.visible');
    });

    it.skip('localizes parameter names', function () {
      cy.get('button').contains('Preferences').click();
      cy.get('input#localizeParamNames').click();

      // Todo: complete by checking URL params
    });

    it('preferred languages influences locales selection', function () {
      cy.get('button').contains('Preferences').click();
      cy.get('#prefLangs').select(['en-US', 'ar']);

      // Speech Arabic
      cy.get('#checked4').should('not.be.checked');
      // German
      cy.get('#checked7').should('be.checked');

      cy.get(
        'input[value="Check fields whose content matches current locale"]'
      ).click();

      // Speech Arabic
      cy.get('#checked4').should('be.checked');
      // German
      cy.get('#checked7').should('not.be.checked');
    });

    it('generates bookmarks', function () {
      cy.get('button').contains('Preferences').click();

      cy.get('#code').should('not.be.visible');
      cy.get('button').contains('Generate bookmarks').click();
      cy.get('#code').should('be.visible');

      cy.get('#copy').click().focus();

      return cy.window().then(async (win) => {
        const text = await win.navigator.clipboard.readText();
        cy.get('.msg-success').should('be.visible');
        // Hidden after a timeout
        cy.get('.msg-success').should('not.be.visible');
        expect(text).to.contain('var searchEngines').and.contain(
          '"short_name":"aqdas"'
        );
      }).then(() => {
        cy.get('button').contains('Generate bookmarks').click();
        // Todo: Should not be failing but is
        // cy.get('#code').should('not.be.visible');
      });
    });
  });
});
