const moment = require('moment');
const req = require('request');

// FIND & COUNT ALL VSA-PROJECT TEST CASES IN TESTRAIL

// ---------------------------------------------------------------------------
// REQUIRED PARAMS:
// --user (your TestRail login username)
// --password (your TestRail login password)

// OPTIONS:
// --monthly lets you run this every month on a specified day:
//   Examples:
//     --monthly=last runs on the last day of the month;
//     --monthly=1 runs on first day of the month;
//     --monthly=15 runs on 15th of the month;
// --verbose let's you log the 1st 100 file-paths found for each file-suffix.

// ===========================================================================
// CONFIGURATION
// TestRail hostname
const hostname = 'dsvavsp.testrail.io';
// TestRail API path
const apiPath = 'index.php?api/v2';
// TestRail API call
const apiCall = 'get_cases';
// TestRail VSA Project IDs
const vsaProjIds = {
  /* eslint-disable prettier/prettier */
  AuthdExp: 4,
  BaM1: 5,
  BaM2: 7,
  Caregiver: 10,
  eBenefits: 3,
  Facilities: 6,
  FacilityLocator: 15,
  Healthcare: 24,
  PubWeb: 8,
  VAMC: 9,
  /* eslint-enable prettier/prettier */
};
// ===========================================================================

const myArgs = process.argv.slice(2);
const userArg = myArgs.find(arg => arg.includes('u'));
const passwordArg = myArgs.find(arg => arg.includes('pw'));
const monthlyArg = myArgs.find(arg => arg.includes('monthly'));
const verboseArg = myArgs.find(arg => arg.includes('verbose'));
const mNow = moment();
const startTime = mNow.valueOf();
const niceDate = mNow.format('YYYY-MM-DD');
const dateOfMonth = mNow.date();

let monthlyArgVal;
let userArgVal;
let passwordArgVal;

/* eslint-disable no-console */

// Verbose log function
const verboseLog = msg => {
  if (verboseArg) {
    console.log(msg);
  }
};

console.log('\n\n======================================================');
console.log('\nFINDING ALL VSA-PROJECTS TEST-CASES IN TESTRAIL');

// EXIT IF --u or --pw missing or missing value

if (!userArg || !passwordArg) {
  console.log(
    '\nEXITING -- TestRail login --u (username) or --pw (password) missing!',
  );
  console.log(
    'You must provide TestRail login credentials: --u=<username> --pw=<password>',
  );
  console.log('\n======================================================\n\n');
  return;
} else {
  userArgVal = userArg ? userArg.split('=')[1] : undefined;
  passwordArgVal = passwordArg ? passwordArg.split('=')[1] : undefined;

  if (!userArgVal || !passwordArgVal) {
    console.log(
      '\nEXITING -- TestRail login --u (username) or --pw (password) missing a value!',
    );
    console.log(
      'You must provide TestRail login credentials: --u=<username> --pw=<password>',
    );
    console.log('\n======================================================\n\n');
    return;
  }
}

// EXIT IF --monthly option's detected AND
// today's not specified day of month.
if (monthlyArg) {
  monthlyArgVal = monthlyArg.split('=')[1];
  monthlyArgVal = monthlyArgVal || 1; // If no value, default to 1.

  if (monthlyArgVal === 'last') {
    console.log('Running on last day of every month...');
    const niceEndOfMonth = moment(mNow)
      .endOf('month')
      .format('YYYY-MM-DD');
    if (niceDate !== niceEndOfMonth) {
      console.log(`\nEXITING -- Today (${niceDate}) is not last day of month.`);
      console.log(
        '\n======================================================\n\n',
      );
      return;
    }
  } else {
    // date provided as number.
    console.log(`Running on day ${monthlyArgVal} of every month...`);
    if (parseInt(monthlyArgVal, 10) !== dateOfMonth) {
      console.log(
        `\nEXITING -- Today (${niceDate}) is not day ${monthlyArgVal} of month.`,
      );
      console.log(
        '\n======================================================\n\n',
      );
      return;
    }
  }
}

const reqOptions = {
  method: 'GET',
  auth: {
    user: userArgVal,
    password: passwordArgVal,
  },
  url: '',
  headers: {
    'Content-Type': 'application/json',
  },
};
const allTestCases = {};

// Get test-cases JSON for each TestRail Project

const reportTestCases = testCases => {
  let grandTotal = 0;

  for (const [key, value] of Object.entries(testCases).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    grandTotal += value;
    verboseLog('\n+++++++++++++++++++++++++++++++++++++++++++++\n');
    verboseLog(`VSA-${key} test-cases subtotal: ${value}`);
  }

  console.log('\n======================================================');
  console.log(`\nAS OF ${niceDate}:\n`);

  console.log(`VSA TESTRAIL TEST-CASES GRAND TOTAL: ${grandTotal}`);

  const duration = moment().valueOf() - startTime;
  console.log(`\nFinished in ${duration} msecs.`);
  console.log('\n======================================================\n\n');
};

for (const currProjKey of Object.keys(vsaProjIds)) {
  if (Object.prototype.hasOwnProperty.call(vsaProjIds, currProjKey)) {
    reqOptions.url = `https://${hostname}/${apiPath}/${apiCall}/${
      vsaProjIds[currProjKey]
    }`;
    req(reqOptions, (err, res) => {
      if (err) throw new Error(err);
      const testCasesCount = JSON.parse(res.body).length;
      allTestCases[currProjKey] = testCasesCount;

      if (Object.keys(allTestCases).length === Object.keys(vsaProjIds).length) {
        verboseLog('\nDONE w/ AJAX calls! ++++++++++++++++++++++++++++');
        reportTestCases(allTestCases);
      }
    });
  }
}

/* eslint-enable no-console */
