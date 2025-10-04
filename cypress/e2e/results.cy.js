/**
 * @param {Window} win
 * @param {Element} el
 * @returns {boolean}
 * @see {@link https://stackoverflow.com/a/22480938/271577}
 * @license CC-BY-SA-3.0
 */
function isScrolledIntoView (win, el) {
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  const elemBottom = rect.bottom;

  // Only completely visible elements return true:
  // const isVisible = (elemTop >= 0) &&
  //    (elemBottom <= globalThis.innerHeight);
  // Partially visible elements return true:
  const isVisible = elemTop < win.innerHeight && elemBottom >= 0;
  return isVisible;
}

describe('Results page', () => {
  beforeEach(async () => {
    if (!globalThis.navigator || !navigator.serviceWorker) {
      return null;
    }
    const registrations = await navigator.serviceWorker.getRegistrations();
    return Promise.all(registrations.map((registration) => {
      return registration.unregister();
    }));
  });

  it('passes accessibility', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=5&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');

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

  it('builds a caption', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
    cy.get('caption').contains('The Kitáb-i-Aqdas 1-15 (Paragraph)');
  });

  it('builds a header and footer', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=y&footer=y&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
    cy.get('table tfoot th').contains('Tooltips (English)');
    cy.get('.thead .th div.th-inner').should('not.exist');
  });

  it('builds a fixed header and footer', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=y&footer=y&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=Yes&result=Yes');
    cy.get('table tfoot th').contains('Tooltips (English)');
    cy.get('.thead .th div.th-inner').should('have.css', 'position').
      and('eq', 'absolute');
  });

  it('builds a footer without a header', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=0&footer=y&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=Yes&result=Yes');
    cy.get('table tfoot th').contains('Tooltips (English)');
    cy.get('.thead .th').should('not.exist');
  });

  it('builds a header and footer with interlinear', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=7%2C+8&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23da00da&bgcolorName=White&bgcolor=%23efefef&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=y&footer=y&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=No&checked6=Yes&checked7=No&checked8=No&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
    cy.get('table tfoot th').contains('Tooltips (English)');
    cy.get('.thead .th div.th-inner').should('not.exist');
    cy.get('span[lang="en"] .interlintitle').contains('English');
    cy.get('span[lang="de"] .interlintitle').contains('German');
    cy.get('span[lang="ar"] .interlintitle').contains('Arabic');
  });

  it('builds interlinear rows (with titles)', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=7%2C+8&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=No&checked3=No&checked4=No&checked5=Yes&checked6=Yes&checked7=No&checked8=No&checked9=No&checked10=No&checked11=No&headerfooterfixed=No&result=Yes');
    cy.get('th').contains('English, German, Arabic');
    cy.get('span[lang="en"] .interlintitle').contains('English');
    cy.get('span[lang="de"] .interlintitle').contains('German');
    cy.get('span[lang="ar"] .interlintitle').contains('Arabic');
  });

  it('builds interlinear rows (without titles)', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=7%2C+8&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=y&border=1&interlintitle=0&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=No&checked3=No&checked4=No&checked5=Yes&checked6=Yes&checked7=No&checked8=No&checked9=No&checked10=No&checked11=No&headerfooterfixed=No&result=Yes');
    cy.get('th').contains('English, German, Arabic');
    cy.get('span[lang="en"] .interlintitle').should('not.exist');
    cy.get('span[lang="de"] .interlintitle').should('not.exist');
    cy.get('span[lang="ar"] .interlintitle').should('not.exist');
  });

  it('builds interlinear rows (with missing lang)', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=5%2C+7&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=No&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
    cy.get('th').contains('English, Paragraph, German');
    cy.get('span[lang="en"] .interlintitle').contains('English');
    cy.get('span:not([lang]) .interlintitle').contains('Paragraph');
    cy.get('span[lang="de"] .interlintitle').contains('German');
  });

  it('builds interlinear but avoids empty ones', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=quran&quran-start1-1=The+Cow+%282%29&quran-start1-2=1&quran-end1-1=The+Cow+%282%29&quran-end1-2=10&quran-anchor1-1=The+Cow+%282%29&quran-anchor1-2=&anchorfield1=Rodwell+Sur%C3%A1h+%23&quran-start2-1=&quran-start2-2=&quran-end2-1=&quran-end2-2=&quran-anchor2-1=&quran-anchor2-2=&anchorfield2=Rodwell+Sur%C3%A1h+%23&field1=Rodwell+Sur%C3%A1h+%23&interlin1=&css1=&field2=Verse+%23&interlin2=&css2=&field3=Sur%C3%A1h+Name&interlin3=&css3=&field4=Sale+Translation&interlin4=6%2C+7%2C+8&css4=&field5=Sale%27s+Notes&interlin5=&css5=&field6=Bah%C3%A1%27%C3%AD+References+%28Central+Figures%29&interlin6=&css6=&field7=Bah%C3%A1%27%C3%AD+Translation+%28Shoghi+Effendi+unless+otherwise+noted%29&interlin7=&css7=&field8=Bah%C3%A1%27%C3%AD+References+%28Special%29&interlin8=&css8=&field9=Rodwell+Translation&interlin9=&css9=&field10=Rodwell%27s+Notes&interlin10=&css10=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=Yes&checked2=Yes&checked3=Yes&checked4=Yes&checked5=Yes&checked6=No&checked7=No&checked8=No&checked9=Yes&checked10=Yes&headerfooterfixed=No&result=Yes');
    cy.get('span[lang="en"]:nth-child(1) .interlintitle').
      contains('Sale Translation');
    cy.get('span[lang="en"]:nth-child(2) .interlintitle').should('not.exist');
  });

  it('builds interlinear with custom CSS', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=quran&quran-start1-1=The+Cow+%282%29&quran-start1-2=1&quran-end1-1=The+Cow+%282%29&quran-end1-2=10&quran-anchor1-1=The+Cow+%282%29&quran-anchor1-2=&anchorfield1=Rodwell+Sur%C3%A1h+%23&quran-start2-1=&quran-start2-2=&quran-end2-1=&quran-end2-2=&quran-anchor2-1=&quran-anchor2-2=&anchorfield2=Rodwell+Sur%C3%A1h+%23&field1=Rodwell+Sur%C3%A1h+%23&interlin1=&css1=&field2=Verse+%23&interlin2=&css2=&field3=Sur%C3%A1h+Name&interlin3=&css3=&field4=Sale+Translation&interlin4=6%2C+7%2C+8&css4=&field5=Sale%27s+Notes&interlin5=&css5=&field6=Bah%C3%A1%27%C3%AD+References+%28Central+Figures%29&interlin6=&css6=&field7=Bah%C3%A1%27%C3%AD+Translation+%28Shoghi+Effendi+unless+otherwise+noted%29&interlin7=&css7=&field8=Bah%C3%A1%27%C3%AD+References+%28Special%29&interlin8=&css8=&field9=Rodwell+Translation&interlin9=&css9=&field10=Rodwell%27s+Notes&interlin10=&css10=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=color%3A+green%3B&pagecss=&outputmode=table&rand=No&checked1=Yes&checked2=Yes&checked3=Yes&checked4=Yes&checked5=Yes&checked6=No&checked7=No&checked8=No&checked9=Yes&checked10=Yes&headerfooterfixed=No&result=Yes');
    cy.get('span[lang="en"]:nth-child(1) .interlintitle').
      contains('Sale Translation').should('have.css', 'color').
      and('eq', 'rgb(0, 128, 0)');
  });

  it('builds simple field-value aliases', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=hidden+words&hidden+words-start1-1=Persian&hidden+words-start1-2=1&hidden+words-end1-1=Persian&hidden+words-end1-2=3&hidden+words-anchor1-1=Persian&hidden+words-anchor1-2=&anchorfield1=Original+Language&field1=Original+Language&interlin1=&css1=&field2=Number&interlin2=&css2=&field3=Synopsis&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=English&interlin5=&css5=&field6=Arabic&interlin6=&css6=&field7=Persian&interlin7=&css7=&field8=Word+by+word+Persian+to+English&interlin8=&css8=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=Yes&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&headerfooterfixed=No&result=Yes');
    cy.get('td[data-col="Original Language"]').contains('2 (Persian)');
  });

  it('builds field-value aliases', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=bible&bible-start1-1=Gn+%281%29&bible-start1-2=1&bible-start1-3=1&bible-end1-1=Gn+%281%29&bible-end1-2=2&bible-end1-3=1&bible-anchor1-1=Gn+%281%29&bible-anchor1-2=&bible-anchor1-3=&anchorfield1=Book+Name&field1=Book+Name&interlin1=&css1=&field2=Chapter+%23&interlin2=&css2=&field3=Verse+%23&interlin3=&css3=&field4=King+James+Translation&interlin4=&css4=&field5=Bah%C3%A1%27%C3%AD+Translation&interlin5=&css5=&field6=Bah%C3%A1%27%C3%AD+Central+Figures+References&interlin6=&css6=&field7=Bah%C3%A1%27%C3%AD+Special+References&interlin7=&css7=&field8=Pilgrim%27s+Notes+References&interlin8=&css8=&field9=Cross-Bible+References&interlin9=&css9=&field10=Individual+Bah%C3%A1%27%C3%AD+Scholars&interlin10=&css10=&field11=Qur%27%C3%A1nic+References&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=Yes&checked2=Yes&checked3=Yes&checked4=Yes&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=Yes&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
    cy.get('td[data-col="Book Name"]').contains('Genesis (1)');
  });

  it('specifies a font-size', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=28px&fontstretch=normal&letterspacing=normal&lineheight=normal&header=0&footer=y&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=Yes&result=Yes');
    cy.get('.tbody td').should('have.css', 'font-size').
      and('eq', '28px');
  });

  it('builds custom colors', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23da00da&bgcolorName=White&bgcolor=%23efefef&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=No&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
    cy.get('.tbody td').should('have.css', 'color').
      and('eq', `rgb(${0xDA}, ${0x00}, ${0xDA})`);
    cy.get('.tbody td').should('have.css', 'background-color').
      and('eq', `rgb(${0xEF}, ${0xEF}, ${0xEF})`);
  });

  it('defaults to white background color', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=y&footer=y&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=Yes&result=Yes');
    cy.get('.anchor-table-header').should('have.css', 'background-color').
      and('eq', 'rgb(255, 255, 255)');
  });

  it('defaults to black color', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=y&footer=y&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=Yes&result=Yes');
    cy.get('.tbody td').should('have.css', 'color').
      and('eq', 'rgb(0, 0, 0)');
  });

  it('builds a table without a border by default', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=y&footer=y&caption=y&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=Yes&result=Yes');
    cy.get('table.table[border="0"]');
  });

  it('defaults to table outputmode', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=15&aqdas-anchor1-1=&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=y&border=1&interlintitle=1&interlintitle_css=&pagecss=&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
    cy.get('table');
  });

  it('builds table out of second set of browse fields', function () {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=quran&quran-start1-1=&quran-start1-2=&quran-end1-1=&quran-end1-2=&quran-anchor1-1=&quran-anchor1-2=&anchorfield1=Rodwell+Sur%C3%A1h+%23&quran-start2-1=15&quran-start2-2=3&quran-end2-1=15&quran-end2-2=8&quran-anchor2-1=&quran-anchor2-2=&anchorfield2=Rodwell+Sur%C3%A1h+%23&field1=Rodwell+Sur%C3%A1h+%23&interlin1=&css1=&field2=Verse+%23&interlin2=&css2=&field3=Sur%C3%A1h+Name&interlin3=&css3=&field4=Sale+Translation&interlin4=6%2C+7%2C+8&css4=&field5=Sale%27s+Notes&interlin5=&css5=&field6=Bah%C3%A1%27%C3%AD+References+%28Central+Figures%29&interlin6=&css6=&field7=Bah%C3%A1%27%C3%AD+Translation+%28Shoghi+Effendi+unless+otherwise+noted%29&interlin7=&css7=&field8=Bah%C3%A1%27%C3%AD+References+%28Special%29&interlin8=&css8=&field9=Rodwell+Translation&interlin9=&css9=&field10=Rodwell%27s+Notes&interlin10=&css10=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=color%3A+green%3B&pagecss=&outputmode=table&rand=No&checked1=Yes&checked2=Yes&checked3=Yes&checked4=Yes&checked5=Yes&checked6=No&checked7=No&checked8=No&checked9=Yes&checked10=Yes&headerfooterfixed=No&result=Yes');
    cy.get('td[data-col="Rodwell Suráh #"]').contains('15');
  });

  it('builds Jamilih with `serverOutput`', function () {
    cy.request('http://localhost:8000/textbrowser?lang=en-US&work=bible&bible-start1-1=Genesis+%281%29&bible-start1-2=3&bible-start1-3=15&bible-end1-1=Genesis+%281%29&bible-end1-2=5&bible-end1-3=18&bible-anchor1-1=Genesis+%281%29&bible-anchor1-2=&bible-anchor1-3=&anchorfield1=Book+Name&field1=Book+Name&interlin1=&css1=&field2=Chapter+%23&interlin2=&css2=&field3=Verse+%23&interlin3=&css3=&field4=King+James+Translation&interlin4=&css4=&field5=Bah%C3%A1%27%C3%AD+Translation&interlin5=&css5=&field6=Bah%C3%A1%27%C3%AD+Central+Figures+References&interlin6=&css6=&field7=Bah%C3%A1%27%C3%AD+Special+References&interlin7=&css7=&field8=Pilgrim%27s+Notes+References&interlin8=&css8=&field9=Cross-Bible+References&interlin9=&css9=&field10=Individual+Bah%C3%A1%27%C3%AD+Scholars&interlin10=&css10=&field11=Qur%27%C3%A1nic+References&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=Yes&checked2=Yes&checked3=Yes&checked4=Yes&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=Yes&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes&serverOutput=jamilih').
      should((response) => {
        expect(response.body[0]).to.equal('div');
      });
  });

  describe('Client-only results', function () {
    it('gives error if attempting JSON `outputmode` "json-array"', function () {
      cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=5&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=json-array&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
      cy.get('dialog[open]').contains(
        'JSON support is currently not available'
      );
    });

    it(
      'gives error if attempting JSON `outputmode` "json-object"', function () {
        cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=5&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=json-object&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
        cy.get('dialog[open]').contains(
          'JSON support is currently not available'
        );
      }
    );

    it(
      'drops down to view-independent anchor of column number (using ' +
      '`anchorfield<number>`)',
      function () {
        cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=2&aqdas-end1-1=15&aqdas-anchor1-1=10&anchorfield1=Paragraph&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');

        cy.window().then((win) => {
          cy.get(
            'tr[data-row="10"] td[data-col="Paragraph"]'
          ).then((anchor) => {
            expect(isScrolledIntoView(win, anchor[0])).to.equal(true);
          });
        });
      }
    );

    it(
      'drops down to view-independent anchor of column number (without ' +
      '`anchorfield<number>`)',
      function () {
        cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=2&aqdas-end1-1=15&aqdas-anchor1-1=10&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');

        cy.window().then((win) => {
          cy.get(
            'tr[data-row="10"] td[data-col="Paragraph"]'
          ).then((anchor) => {
            expect(isScrolledIntoView(win, anchor[0])).to.equal(true);
          });
        });
      }
    );

    it(
      'drops down to view-dependent anchor of column-row number ' +
      '(using `anchorrowcol`)',
      function () {
        cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=5&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&anchorrowcol=row3col4&result=Yes');

        cy.window().then((win) => {
          cy.get('#row3col4').then((anchor) => {
            expect(isScrolledIntoView(win, anchor[0])).to.equal(true);
          });
        });
      }
    );
  });
});
