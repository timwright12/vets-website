const fs = require('fs');
const path = require('path');
const moment = require('moment');

// FIND ALL AUTOMATED TEST FILES IN
// VETS-WEBSITE APPS

// ===========================================================================
// CONFIGURATION
// Your local vets-website applications folder [absolute path]
const parentDir = './src/applications/';
// File suffixes to find & count
const fileSuffixes = ['.unit.spec.js', '.e2e.spec.js', '.cypress.spec.js'];
// ===========================================================================

const myArgs = process.argv.slice(2);
const monthlyArg = myArgs.find(arg => arg.includes('monthly'));
const verboseArg = myArgs.find(arg => arg.includes('verbose'));
const mNow = moment();
const startTime = mNow.valueOf();
const niceDate = mNow.format('YYYY-MM-DD');
const dateOfMonth = mNow.date();
const filteredResults = {};

let monthlyArgVal;

/* eslint-disable no-console */

// VERBOSE LOG FUNCTION
const verboseLog = msg => {
  if (verboseArg) {
    console.log(msg);
  }
};

// RECURSIVE FILE-READ FUNCTION
const getAllFiles = (dirPath, arrayOfFiles) => {
  let filesArr = arrayOfFiles || [];

  let files;

  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    console.log(e);
    return undefined;
  }

  for (const file of files) {
    /* eslint-disable prefer-template */
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      filesArr = getAllFiles(dirPath + '/' + file, filesArr);
    } else {
      filesArr.push(path.join(__dirname, dirPath, '/', file));
    }
    /* eslint-enable prefer-template */
  }

  return filesArr;
};

console.log('\n\n====================================================');
console.log('\nFINDING ALL AUTOMATED TEST-FILES IN vets-website APPS');

// EXIT if --monthly option's detected, and
// today's not specified day of the month.
if (monthlyArg) {
  verboseLog('monthlyArg found.');
  monthlyArgVal = monthlyArg.split('=')[1];
  monthlyArgVal = monthlyArgVal || 1; // If no value, default to 1.
  verboseLog(`monthlyArgVal: ${monthlyArgVal}`);

  if (monthlyArgVal === 'last') {
    console.log('Running on last day of month...');
    const niceEndOfMonth = moment(mNow)
      .endOf('month')
      .format('YYYY-MM-DD');
    if (niceDate !== niceEndOfMonth) {
      console.log(`\nEXITING -- Today (${niceDate}) is not last day of month.`);
      console.log('\n====================================================\n\n');
      return;
    }
  } else {
    // date provided as number.
    console.log(`Running on day ${monthlyArgVal} of month...`);
    if (parseInt(monthlyArgVal, 10) !== dateOfMonth) {
      console.log(
        `\nEXITING -- Today (${niceDate}) is not day ${monthlyArgVal} of month.`,
      );
      console.log('\n====================================================\n\n');
      return;
    }
  }
} else {
  verboseLog('monthlyArg NOT found.');
}

// Read all files under parentDir
const allFilesResult = getAllFiles(parentDir);

// Filter allFilesResult by fileSuffixes.
// Log all files --verbose option is detected.
for (const suffix of fileSuffixes) {
  verboseLog('\n++++++++++++++++++++++++++++++++++++++++\n');
  verboseLog(`ALL *${suffix} FILES UNDER ${parentDir} (recursive)...\n`);

  filteredResults[suffix] = allFilesResult.filter(f => {
    return f.includes(suffix);
  });
  verboseLog(filteredResults[suffix]);
}

// Log summary with total-count per file-suffix.
console.log('\n++++++++++++++++++++++++++++++++++++++++');
console.log(`\nAS OF ${niceDate}:\n`);

for (const key of Object.keys(filteredResults)) {
  if (Object.prototype.hasOwnProperty.call(filteredResults, key)) {
    console.log(`*${key} files TOTAL COUNT: ${filteredResults[key].length}`);
  }
}

const duration = moment().valueOf() - startTime;
console.log(`\nFinished in ${duration} msecs.`);
console.log('\n====================================================\n\n');

/* eslint-enable no-console */
