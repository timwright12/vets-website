import path from 'path';

Cypress.Commands.add('checkSearch', () => {
  cy.axeCheck();

  // Search
  cy.get('#street-city-state-zip').type('Austin, TX');
  cy.get('#facility-type-dropdown').select('VA health');
  cy.get('#facility-search').click();

  // Search title
  cy.get('#search-results-subheader').should('exist');

  // Tabs
  cy.get('#react-tabs-0').contains('View List');
  cy.get('#react-tabs-2').contains('View Map');

  // Result list
  cy.get('.facility-result').should('exist');

  // Switch tab map
  cy.get('#react-tabs-2').click();

  // Ensure map is visible
  cy.get('#map-id').should('be.visible');

  // Pin
  cy.get('.i-pin-card-map')
    .should('be.visible')
    .contains('A');

  // Back to Result list
  cy.get('#react-tabs-0').click();
  cy.get('#street-city-state-zip').clear();
});

describe('Mobile', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  it.only('should render in mobile layouts and tabs actions work', () => {
    Cypress.env().vaTop5MobileViewports.forEach((viewportData) => {
      const { name, width, height, percentTraffic, percentTrafficPeriod } = viewportData;

      cy.log(`Device Group: ${name}`);
      cy.log(`% traffic for the month of ${percentTrafficPeriod}: ${percentTraffic}%`);

      cy.visit('/find-locations');
      cy.injectAxe();
      cy.viewport(width, height);
      cy.checkSearch();
    });

    cy.log("Testing new 'cy.viewportPreset() custom command with default params:");
    cy.visit('/find-locations');
    cy.injectAxe();
    cy.viewportPreset('mobile-top5-3');
    cy.checkSearch();

    cy.log("Testing new 'cy.viewportPreset() custom command with 'orientation' param set to 'portrait' and 'options' param  set to { log: false }");
    cy.visit('/find-locations');
    cy.injectAxe();
    cy.viewportPreset('mobile-top5-3', 'portrait', { log: false });
    cy.checkSearch();

    // test will fail but call to cy.viewportPreset('mobile-top5-3', 'landscape') is successful
    cy.log("Testing new 'cy.viewportPreset() custom command with 'orientation' param set to 'landscape'");
    cy.visit('/find-locations');
    cy.injectAxe();
    cy.viewportPreset('mobile-top5-3', 'landscape');
    cy.checkSearch();
  });

  it('should render the appropriate elements at each breakpoint', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    // desktop - large
    cy.viewport(1008, 1000);
    cy.axeCheck();
    cy.get('#facility-search').then($element => {
      expect($element.width()).closeTo(48, 2);
    });
    cy.get('.desktop-map-container').should('exist');
    cy.get('.react-tabs').should('not.exist');

    // desktop - small
    cy.viewport(1007, 1000);
    cy.axeCheck();
    cy.get('#facility-search').then($element => {
      expect($element.width()).closeTo(899, 2);
    });
    cy.get('.desktop-map-container').should('exist');
    cy.get('.react-tabs').should('not.exist');

    // tablet
    cy.viewport(768, 1000);
    cy.axeCheck();
    cy.get('#facility-search').then($element => {
      expect($element.width()).closeTo(660, 2);
    });
    cy.get('.desktop-map-container').should('exist');
    cy.get('.react-tabs').should('not.exist');

    // mobile
    cy.viewport(481, 1000);
    cy.axeCheck();
    cy.get('#facility-search').then($element => {
      expect($element.width()).closeTo(397, 2);
    });
    cy.get('.desktop-map-container').should('not.exist');
    cy.get('.react-tabs').should('exist');
  });
});
