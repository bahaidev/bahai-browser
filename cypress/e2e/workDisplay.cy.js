describe('Work select page', () => {
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
});
