/* eslint-disable no-undef */
const config = {
  cy: {
    resultsDir: 'cypress/results/applications/debt-letters/tests/e2e/',
    screenshotsDir: 'cypress/screenshots/',
    videosDir: 'cypress/videos/',
  },
  tr: {
    hostname: 'dsvavsp.testrail.io',
    apiPath: '/index.php?/api/v2/',
    auth: {
      username: $TR_USERNAME,
      password: $TR_PASSWORD,
      apiKey: $TR_API_KEY,
    },
    resultStatuses: {
      passed: 1,
      failed: 5,
    },
    projId: $TR_PROJECT_ID,
    suiteId: $TR_SUITE_ID,
    planId: $TR_PLAN_ID,
    runName: $TR_RUN_NAME,
    assignedtoId: $TR_ASSIGNEDTO_ID,
    contentTypes: {
      addRun: 'application/json',
      addResult: 'application/json',
      addPlanEntry: 'application/json',
      getTests: 'application/json',
      addAttachment: null,
    },
    dateFormat: 'YYYY-MM-DD h:mm:ss a z',
    timeZone: 'America/New_York',
  },
  xmlJs: {
    opts: {
      compact: true,
      trim: true,
      ignoreDeclaration: true,
      ignoreInstruction: true,
      ignoreComment: true,
      ignoreDoctype: true,
      ignoreCdata: true,
      ignoreText: true,
    },
  },
};

module.exports = { config };

/* eslint-enable no-undef */
