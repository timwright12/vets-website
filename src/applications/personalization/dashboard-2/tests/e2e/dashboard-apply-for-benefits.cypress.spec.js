import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';

import manifest from 'applications/personalization/dashboard/manifest.json';

import { mockFeatureToggles } from './helpers';

describe('The My VA Dashboard', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
  });
  describe('when there are in-progress forms', () => {
    beforeEach(() => {
      // four forms, but one will fail the `isSIPEnabledForm()` check so only
      // three will be shown on the dashboard
      const now = Date.now() / 1000;
      const oneDayInSeconds = 24 * 60 * 60;
      const oneWeekInSeconds = 24 * 60 * 60 * 7;
      const oneYearInSeconds = 24 * 60 * 60 * 365;
      const savedForms = [
        {
          form: '21P-527EZ',
          metadata: {
            version: 3,
            returnUrl: '/military/reserve-national-guard',
            savedAt: 1604951152710,
            // one day from now
            expiresAt: now + oneDayInSeconds,
            lastUpdated: 1604951152,
            inProgressFormId: 5105,
          },
          lastUpdated: 1604951152,
        },
        // This form is unknown and will be filtered out of the list of applications
        {
          form: '28-1900',
          metadata: {
            version: 0,
            returnUrl: '/communication-preferences',
            savedAt: 1611946775267,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: false,
              hasAttemptedSubmit: false,
            },
            expiresAt: now + oneDayInSeconds,
            lastUpdated: 1611946775,
            inProgressFormId: 9332,
          },
          lastUpdated: 1611946775,
        },
        {
          form: '686C-674',
          metadata: {
            version: 1,
            returnUrl: '/net-worth',
            savedAt: 1607012813063,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: false,
              hasAttemptedSubmit: false,
            },
            // one year from now
            expiresAt: now + oneYearInSeconds,
            lastUpdated: 1607012813,
            inProgressFormId: 5179,
          },
          lastUpdated: 1607012813,
        },
        {
          form: '21-526EZ',
          metadata: {
            version: 6,
            returnUrl: '/review-veteran-details/separation-location',
            savedAt: 1612535290474,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: false,
              hasAttemptedSubmit: false,
            },
            // one week from now
            expiresAt: now + oneWeekInSeconds,
            lastUpdated: 1612535290,
            inProgressFormId: 9374,
          },
          lastUpdated: 1612535290,
        },
      ];
      mockUser.data.attributes.inProgressForms = savedForms;
      cy.login(mockUser);
      mockFeatureToggles();
      cy.visit(manifest.rootUrl);
    });
    it('should show benefit applications that were saved in progress', () => {
      cy.findAllByTestId('application-in-progress').should('have.length', 3);
      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
