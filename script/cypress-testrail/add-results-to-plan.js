/* ADDS CYPRESS TEST RESULTS TO EXISTING TESTRAIL TEST PLAN:
- Adds a plan entry to existing Plan;
- Adds results to newly-added plan entry.
*/
/* eslint-disable prettier/prettier, no-undef, no-console, camelcase */
const fs = require('fs');
const path = require('path');
const convert = require('xml-js');
const request = require('request');
const moment = require('moment-timezone');

const { config } = require('./config');

const cyCfg = config.cy;
const trCfg = config.tr;
const xjCfg = config.xmlJs;

const authUser = Base64.encode( `${trCfg.auth.username}:${trCfg.auth.apiKey}`);
const authHeader = `Basic ${authUser}`;
const convertedResults = [];
const cleanResults = [];
const trResults = { results: [] };
let trResult;

// Read xml result-files, convert & combine into JS object
fs.readdirSync(cyCfg.resultsDir).forEach(file => {
  convertedResults.push(
    convert.xml2js(fs.readFileSync(`${cyCfg.resultsDir}${file}`), xjCfg.opts),
  );
});
// console.log('convertedResults:', convertedResults);

// Clean _attributes prop-keys out of converted results
const getTrCaseId = cleanCase => {
  const className = cleanCase.classname;

  return parseInt(className.trim().substr(className.lastIndexOf('C') + 1), 10);
};
const getCleanCase = convertedCase => {
  const cleanCase = convertedCase._attributes;

  cleanCase.trCaseId = getTrCaseId(cleanCase);
  if (convertedCase.failure) {
    cleanCase.failure = convertedCase.failure._attributes;
  }

  return cleanCase;
};

convertedResults.forEach(spec => {
  const rootSuite = spec.testsuites.testsuite[0];
  const testcaseSuites = spec.testsuites.testsuite.slice(1);
  const specFilePath = rootSuite._attributes.file;
  const specFileName = specFilePath.substr(
    specFilePath.lastIndexOf(path.sep) + 1,
  );

  testcaseSuites.forEach(convertedSuite => {
    const cleanCases = [];
    const cleanResult = {};

    // If testsuite has multiple testcases, suite.testcase is an array,
    // otherwise testsuite.testcase is just an object
    if (Array.isArray(convertedSuite.testcase)) {
      convertedSuite.testcase.forEach(convertedCase => {
        cleanCases.push(getCleanCase(convertedCase));
      });
    } else {
      cleanCases.push(getCleanCase(convertedSuite.testcase));
    }

    // cleanResult = {
    //   spec: {
    //     fileName: specFileName,
    //     ...convertedSuite._attributes,
    //   },
    //   cases: cleanCases,
    // }
    cleanResult.spec = {
      fileName: specFileName,
      ...convertedSuite._attributes,
    };
    cleanResult.cases = cleanCases;
    // console.log('cleanResult:', cleanResult)

    cleanResults.push(cleanResult);
  });
});
// console.log('cleanResults:', cleanResults)

// Transform cleaned results to TestRail results.
cleanResults.forEach(result => {
  result.cases.forEach(testCase => {
    const tcElapsed = testCase.time !== '0' ? testCase.time : '1';
    trResult = {
      case_id: testCase.trCaseId,
      status_id: !testCase.failure
        ? trCfg.resultStatuses.passed
        : trCfg.resultStatuses.failed,
      elapsed: `${tcElapsed}s`,
      comment: !testCase.failure
        ? `C${testCase.trCaseId}: Test-case passed.`
        : `C${testCase.trCaseId}: ${testCase.failure.type} - ${
            testCase.failure.message
          }`,
    };
    trResults.results.push(trResult);
  });
});
// console.log('trResults:', trResults)

const addResultsToRun = (runId, testsResponse, results) => {
  // Adds Results to existing TestRail Test Run.
  const testResults = [];
  const addResultsOpts = {
    method: 'POST',
    url: `https://${trCfg.hostname}${trCfg.apiPath}add_results/${runId}`,
    headers: {
      Authorization: authHeader,
      'Content-Type': trCfg.contentTypes.addResult,
    },
  };

  const getResultByCaseId = caseId => {
    return results.results.find(r => r.case_id === caseId);
  }

  // Assemble test-results.
  testsResponse.forEach(t => {
    const result = getResultByCaseId(t.case_id);
    console.log(`Current result for test_id ${t.id}:`, result);

    testResults.push({
      test_id: t.id,
      status_id: result.status_id,
      comment: result.comment,
      elapsed: result.elapsed
    });
  });
  console.log('testResults:', testResults);

  addResultsOpts.body = JSON.stringify({ results: testResults });
  console.log('Current addResultOps:', addResultsOpts);

  request(addResultsOpts, function(error, response) {
    if (error) throw new Error(error);

    console.log(
      `Results added to run_id ${runId}! TestRail response.body:\n`,
      JSON.parse(response.body),
    );
  });
};

const getTestsFromPlanEntry = (runId) => {
  // Gets Tests from existing Plan-entry.

  const getTestsOpts = {
    method: 'GET',
    url: `https://${trCfg.hostname}${
      trCfg.apiPath
    }get_tests/${runId}`,
    headers: {
      Authorization: authHeader,
      'Content-Type': trCfg.contentTypes.getTests,
    },
  };

  request(getTestsOpts, function(error, response) {
    const responseBody = JSON.parse(response.body);
    // console.log(
    //   `Tests retrieved from Run ${runId}! TestRail response.body:\n`,
    //   responseBody,
    // );

    if (error) throw new Error(error);

    addResultsToRun(runId, responseBody, trResults);
  });
};

const addEntryToPlan = (planId, results) => {
  // Adds a plan-entry to existing plan
  const niceTimestamp = moment()
    .tz(trCfg.timeZone)
    .format(trCfg.dateFormat);
  const requestBody = {
    suite_id: trCfg.suiteId,
    name: `${trCfg.runName} ${niceTimestamp}`,
    assignedto_id: trCfg.assignedtoId,
    include_all: false,
  }
  const caseIds = [];

  if (results.results.length === 0) {
    throw new Error('ERROR - No results available!');
  }

  // Get all Case IDs from results and add to request body
  results.results.forEach(r => caseIds.push(r.case_id));
  requestBody.case_ids = caseIds;

  console.log('[addEntryToPlan] requestBody:\n', requestBody);

  const addPlanEntryOpts = {
    method: 'POST',
    url: `https://${trCfg.hostname}${
      trCfg.apiPath
    }add_plan_entry/${planId}`,
    headers: {
      Authorization: authHeader,
      'Content-Type': trCfg.contentTypes.addPlanEntry,
    },
    body: JSON.stringify(requestBody),
  };

  request(addPlanEntryOpts, function(error, response) {
    const responseBody = JSON.parse(response.body);
    console.log(
      `Plan entry added to Plan ${trCfg.planId}! TestRail response run_id: ${responseBody.runs[0].id}`,
    );

    if (error) throw new Error(error);

    getTestsFromPlanEntry(responseBody.runs[0].id);
  });

};

// Add Plan Entry
// Response callback will call next function, and so on.
addEntryToPlan(trCfg.planId, trResults);

/* eslint-enable prettier/prettier, no-undef, no-console, camelcase */
