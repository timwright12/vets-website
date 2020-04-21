const E2eHelpers = require('platform/testing/e2e/helpers');
const mock = require('platform/testing/e2e/mock-helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const Auth = require('platform/testing/e2e/auth');

function initFeatureFlag(token) {
  mock(token, {
    path: '/v0/feature_toggles',
    verb: 'get',
    value: {
      data: {
        features: [
          {
            name: 'ssoe',
            value: true,
          },
        ],
      },
    },
  });
}

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  initFeatureFlag(token);
  E2eHelpers.overrideVetsGovApi(client);

  client.execute(() => {
    window.localStorage.setItem('hasSessionSSO', 'true');
  });

  Auth.logIn(token, client, '/', 3);
  // client
  //   .openUrl(E2eHelpers.baseUrl)
  //   .waitForElementVisible('body', Timeouts.normal);
  client.pause(50000);
  client.refresh().waitForElementVisible('body', Timeouts.normal);

  client.verify.urlContains('v1/sessions/idme/new');
});
