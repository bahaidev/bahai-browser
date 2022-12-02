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

  describe('Regular pages', function () {
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
  });

  describe('Multiple browse fields', function () {
    it('builds multiple browse fields', function () {
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=quran');
      cy.get('#quran-start1-1');
      cy.get('#quran-start1-2');
      cy.get('#quran-start2-1');
      cy.get('#quran-start2-2');
    });

    it('has start field trigger default for end field', function () {
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=quran');
      cy.get('#quran-end1-1').should('be.empty');
      cy.get('#quran-start1-1').type('The Cow (2)').blur();
      cy.get('#quran-end1-1').should('have.value', 'The Cow (2)');
    });
  });

  it('allows presetting of form control values', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=20&aqdas-anchor1-1=10&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Blue&color=%23&bgcolorName=Yellow&bgcolor=%23&fontSeq=Palatino%2C+serif&fontstyle=oblique&fontvariant=small-caps&fontweight=300&fontsize=14px&fontstretch=expanded&letterspacing=.2em&lineheight=1.1&header=y&footer=y&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&checked1=Yes&checked2=Yes&checked3=Yes&checked4=Yes&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=Yes');
    cy.get('input#checked1').should('be.checked');
    cy.get('input#checked2').should('be.checked');
    cy.get('input#checked9').should('not.be.checked');
    cy.get('#aqdas-start1-1').should('have.value', '1');
    cy.get('#aqdas-end1-1').should('have.value', '20');
    cy.get('#aqdas-anchor1-1').should('have.value', '10');
    cy.get(
      'select[name="anchorfield1"]'
    ).find('option').contains('Paragraph').should('be.selected');
    cy.get(
      'select[name="colorName"]'
    ).find('option[value="Blue"]').should('be.selected');
    cy.get(
      'select[name="bgcolorName"]'
    ).find('option[value="Yellow"]').should('be.selected');
    cy.get(
      'select[name="fontSeq"]'
    ).find('option[value="Palatino, serif"]').should('be.selected');
    cy.get(
      'select[name="fontstyle"]'
    ).find('option[value="oblique"]').should('be.selected');
    cy.get(
      'input[name="fontvariant"][value="small-caps"]'
    ).should('be.checked');
    cy.get(
      'input[name="fontweight"]'
    ).should('have.value', '300');
    cy.get(
      'input[name="fontsize"]'
    ).should('have.value', '14px');
    cy.get(
      'select[name="fontstretch"]'
    ).find('option[value="expanded"]').should('be.selected');
    cy.get(
      'input[name="letterspacing"]'
    ).should('have.value', '.2em');
    cy.get(
      'input[name="lineheight"]'
    ).should('have.value', '1.1');
    cy.get(
      'input[name="header"][value="y"]'
    ).should('be.checked');
    cy.get(
      'input[name="footer"][value="y"]'
    ).should('be.checked');
    cy.get(
      'input[name="headerfooterfixed"][value="Yes"]'
    ).should('be.checked');
    cy.get(
      'input[name="caption"][value="y"]'
    ).should('be.checked');
    cy.get(
      'input[name="border"][value="1"]'
    ).should('be.checked');
  });

  describe('Preferences', function () {
    beforeEach(() => {
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas');
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
      // Add our own param to ensure not caching
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&nocache');
      cy.get('#advancedformatting').should('not.be.visible');
    });

    it('reveal formatting section', function () {
      cy.get('#advancedformatting').should('be.visible');
      cy.get('button').contains('Preferences').click();
      cy.get('input#hideFormattingSection').click();
      cy.get('#advancedformatting').should('not.be.visible');
      cy.get('input#hideFormattingSection').click();
      cy.get('#advancedformatting').should('be.visible');
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

      // Add our own param to ensure not caching
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&nocache');

      cy.get('#prefLangs').find('option[value="en-US"]').should('be.selected');
      cy.get('#prefLangs').find('option[value="ar"]').should('be.selected');
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
