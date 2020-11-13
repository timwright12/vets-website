import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Diary Codes - Next Steps', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.visit('/manage-va-debt/your-debt/');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('C1237 renders a debt card with next step', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.get('[data-testid="diary-codes-next-step"]')
      .first()
      .findByText(/Next step:/i)
      .should('exist');
  });

  it('C1238 renders a debt card without next step', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.get('[data-testid="diary-codes-next-step"]')
      .last()
      .findByText(/Next step:/i)
      .should('not.exist');
  });

  it('C1239 renders debt details with next step', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.get('.usa-button')
      .first()
      .click();
    cy.get('.debt-details-nextstep').contains('Next step');
  });

  it('C1240 renders debt details with information alert when there is no next step', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.get('.usa-button')
      .last()
      .click();
    cy.get('.debt-details-alert').contains(
      'We’re reviewing your compromise offer',
    );
  });
});
