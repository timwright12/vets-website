describe('User Navigation', () => {
  before(() => {
    cy.on('window:before:load', window => {
      // eslint-disable-next-line no-param-reassign
      window.localStorage.setItem('DISMISSED_ANNOUNCEMENTS', '*');
    });

    cy.server();

    cy.login();
  });

  it('should sign out', () => {
    cy.visit('my-va')
      .injectAxe()
      .axeCheck();

    cy.title().should('eq', 'My VA | Veterans Affairs');

    cy.findByText('Jane').click();

    cy.findByText(/Sign Out/i)
      .should('be.visible')
      .should('have.text', 'Sign Out');

    // TODO Check sign out link goes to '/sessions/slo/new'
  });
});
