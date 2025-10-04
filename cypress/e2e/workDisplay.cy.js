describe('Work display page', () => {
  beforeEach(async () => {
    if (!globalThis.navigator || !navigator.serviceWorker) {
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

    it('submits query by click', function () {
      cy.get('#aqdas-start1-1').type('2');
      cy.get('#aqdas-end1-1').type('15');
      cy.get('input[type="submit"][value="Go"]').click();
      cy.location('hash', {
        timeout: 10000
      }).should(
        'eq',
        '#lang=en-US&work=aqdas&aqdas-start1-1=2&aqdas-end1-1=15&aqdas-' +
        'anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28' +
        'English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2' +
        '=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech' +
        '+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=' +
        'English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=' +
        'Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=' +
        '&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+' +
        'wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White' +
        '&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&' +
        'fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal' +
        '&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0' +
        '&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=' +
        'table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&' +
        'checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&' +
        'checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes'
      );
    });

    it('submits query by enter', function () {
      cy.get('#aqdas-start1-1').type('2');
      cy.get('#aqdas-end1-1').type('15{enter}');
      cy.location('hash', {
        timeout: 10000
      }).should(
        'eq',
        '#lang=en-US&work=aqdas&aqdas-start1-1=2&aqdas-end1-1=15&aqdas-' +
        'anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28' +
        'English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2' +
        '=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech' +
        '+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=' +
        'English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=' +
        'Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=' +
        '&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+' +
        'wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White' +
        '&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&' +
        'fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal' +
        '&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0' +
        '&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=' +
        'table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&' +
        'checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&' +
        'checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes'
      );
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

    it('Retains fields after back button', function () {
      // Indexes
      cy.get('input#checked1').should('not.be.checked');
      // Tooltips (English)
      cy.get('input#checked2').should('be.checked');
      cy.get('input[type="button"][value="Check all"]').click();

      cy.get('#aqdas-start1-1').type('2');
      cy.get('#aqdas-end1-1').type('15{enter}');

      cy.go('back');

      cy.get('input#checked1').should('be.checked');
      cy.get('input#checked2').should('be.checked');
    });

    it('saves settings as URL', function () {
      cy.get('input[type="button"][value="Check all"]').click();
      cy.get('#settings-URL').should('be.empty');
      cy.get('input[type="button"][value="Save settings as URL"]').click();
      cy.get('#settings-URL').should(
        'have.value',
        'http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=&aqdas-end1-1=&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&checked1=Yes&checked2=Yes&checked3=Yes&checked4=Yes&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=Yes&checked10=Yes&checked11=Yes&headerfooterfixed=No'
      );
    });

    it('copies shortcut URL', function () {
      cy.get('button').contains('Copy shortcut URL').click();
      return cy.window().then(async (win) => {
        const text = await win.navigator.clipboard.readText();
        expect(text).to.equal('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes&work=aqdas&aqdas-startEnd1=%s');
      });
    });
  });

  describe('Multiple browse fields', function () {
    beforeEach(() => {
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=quran');
    });

    it('builds multiple browse fields', function () {
      cy.get('#quran-start1-1');
      cy.get('#quran-start1-2');
      cy.get('#quran-start2-1');
      cy.get('#quran-start2-2');
    });

    it('has start field trigger default for end field', function () {
      cy.get('#quran-end1-1').should('be.empty');
      cy.typeAndBlur('#quran-start1-1', 'The Cow (2)');
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

      cy.get('input#wikilinks-existing-username').click();
      cy.get('input#wikilinks-existing-username').type('Brettz9');
      cy.get('input#wikilinks-existing-username').blur();
      cy.get('input#wikilinks-existing-username').should(() => {
        expect(
          localStorage.getItem('bahai-browser-wikilinks-existing-username')
        ).to.eq('Brettz9');
      });
    });

    // eslint-disable-next-line mocha/no-pending-tests -- Todo
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

    it('localizes parameter names', function () {
      cy.get('button').contains('Preferences').click();
      cy.get('input#localizeParamNames').click();
      cy.get('input#localizeParamNames').click();

      cy.get('input#localizeParamNames').should('be.checked').should(() => {
        expect(
          localStorage.getItem('bahaiwritings-localizeParamNames')
        ).to.eq('true');
      });
    });

    // eslint-disable-next-line mocha/no-pending-tests -- Todo
    it.skip('checks localized parameter names', function () {
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

      cy.get('#copy').click();
      cy.get('#copy').focus();

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

  describe('Offlining', function () {
    beforeEach((done) => {
      const dbName = 'bahaiwritings-textbrowser-cache-data';
      const req = indexedDB.deleteDatabase(dbName);
      req.onsuccess = () => {
        done();
      };
    });
    // eslint-disable-next-line mocha/no-sibling-hooks -- Different for Cypress
    beforeEach(() => {
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas');
    });

    it('indicates offline available status', function () {
      cy.get('#offline-available').should('not.be.checked');
      cy.get(
        '#installationLogContainer'
      ).should('not.be.visible');
      cy.get('#offline-available').click();
      cy.get(
        '#installationLogContainer'
      ).should('be.visible');

      cy.get(
        '#installationLogContainer',
        {
          timeout: 25000
        }
      ).should('not.be.visible');

      cy.get('#offline-available', {
        timeout: 25000
      }).should('be.checked');

      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&nocache');
      cy.get('#offline-available', {
        timeout: 25000
      }).should('be.checked');
      cy.get(
        '#installationLogContainer'
      ).should('not.be.visible');
      cy.get('#offline-available').click({
        timeout: 25000
      });

      cy.get(
        '#installationLogContainer'
      ).should('be.visible');

      cy.get(
        '#installationLogContainer',
        {
          timeout: 25000
        }
      ).should('not.be.visible');

      cy.get('#offline-available', {
        timeout: 25000
      }).should('not.be.checked');
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&nocache2');
    });
  });
});
