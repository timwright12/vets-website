describe('Veterans Crisis Line Modal', () => {
  before(() => {
    cy.visit('/')
      .injectAxe()
      .checkA11y(null, {
        includedImpacts: ['critical'],
        runOnly: {
          type: 'tag',
          values: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'],
        },
      });
  });

  it('opens when pressing enter on modal', () => {
    cy.findAllByText('Veterans Crisis Line')
      .first()
      .type('{enter}')
      .focused()
      .should('have.attr', 'href', 'tel:18002738255')
      .tab({ shift: true })
      .tab({ shift: true })
      .focused()
      .should('have.attr', 'href', 'https://www.veteranscrisisline.net/')
      .tab()
      .focused()
      .should('have.attr', 'aria-label', 'Close this modal')
      .type('{esc}');

    cy.get('#modal-crisisline')
      .should('not.have.class', 'va-overlay--open')
      .get('.body')
      .should('not.have.class', 'va-pos-fixed')
      .focused()
      .should('have.class', 'va-crisis-line')
      .and('have.class', 'va-overlay-trigger');
  });

  it('opens when pressing enter on vcl button', () => {
    cy.get('.homepage-button.vcl.va-overlay-trigger')
      .type('{enter}')
      .focused()
      .should('have.attr', 'href', 'tel:18002738255')
      .type('{esc}')
      .focused()
      .should('have.class', 'homepage-button')
      .and('have.class', 'vcl')
      .and('have.class', 'va-overlay-trigger');
  });

  it('opens when pressing enter on footer link', () => {
    cy.get('footer .va-button-link.va-overlay-trigger')
      .type('{enter}')
      .focused()
      .should('have.attr', 'href', 'tel:18002738255')
      .type('{esc}')
      .focused()
      .should('have.class', 'va-button-link')
      .and('have.class', 'va-overlay-trigger');
  });
});
