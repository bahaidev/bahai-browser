describe('Work select page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/index-instrumented.html#lang=en-US&work=aqdas&aqdas-start1-1=1&aqdas-end1-1=5&aqdas-anchor1-1=&anchorfield1=Indexes+%28English%29&field1=Indexes+%28English%29&interlin1=&css1=&field2=Tooltips+%28English%29&interlin2=&css2=&field3=Locally-stored+notes&interlin3=&css3=&field4=Speech+Arabic&interlin4=&css4=&field5=Paragraph&interlin5=&css5=&field6=English&interlin6=&css6=&field7=German&interlin7=&css7=&field8=Arabic&interlin8=&css8=&field9=Editable+wiki+page&interlin9=&css9=&field10=Links+to+wiki&interlin10=&css10=&field11=Links+to+user+wiki&interlin11=&css11=&colorName=Black&color=%23&bgcolorName=White&bgcolor=%23&fontSeq=Times+New+Roman%2C+serif&fontstyle=normal&fontvariant=normal&fontweight=normal&fontsize=&fontstretch=normal&letterspacing=normal&lineheight=normal&header=n&footer=0&caption=0&border=1&interlintitle=1&interlintitle_css=&pagecss=&outputmode=table&rand=No&checked1=No&checked2=Yes&checked3=Yes&checked4=No&checked5=Yes&checked6=Yes&checked7=Yes&checked8=Yes&checked9=No&checked10=Yes&checked11=Yes&headerfooterfixed=No&result=Yes');
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
});
