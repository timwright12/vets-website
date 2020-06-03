describe('Va.gov', () => {
  it('renders the introduction page', () => {
    cy.visit('/')
      .injectAxe()
      .checkA11y(null, {
        includedImpacts: ['critical'],
        runOnly: {
          type: 'tag',
          values: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'],
        },
      })
      .get('body')
      .should('be.visible');
  });
});
