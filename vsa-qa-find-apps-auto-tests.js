const fs = require('fs');
const path = require('path');
const moment = require('moment');

// FIND & COUNT ALL AUTOMATED TEST FILES IN
// VETS-WEBSITE APPS

// ---------------------------------------------------------------------------
// OPTIONS:
// --monthly lets you run this every month on a specified day:
//   Examples:
//     --monthly=last runs on the last day of the month;
//     --monthly=1 runs on first day of the month;
//     --monthly=15 runs on 15th of the month;
// --verbose let's you log the 1st 100 file-paths found for each file-suffix.

// ===========================================================================
// CONFIGURATION
// React apps directory [project-root-relative]
const parentDir = './src/applications/';
// File suffixes to find & count
const fileSuffixes = {
  unit: ['.unit.spec.js'],
  e2e: ['.e2e.spec.js', '.cypress.spec.js'],
};
// ===========================================================================

const myArgs = process.argv.slice(2);
const monthlyArg = myArgs.find(arg => arg.includes('monthly'));
const verboseArg = myArgs.find(arg => arg.includes('verbose'));
const mNow = moment();
const startTime = mNow.valueOf();
const niceDate = mNow.format('YYYY-MM-DD');
const dateOfMonth = mNow.date();

let monthlyArgVal;

/* eslint-disable no-console */

// Verbose log function
const verboseLog = msg => {
  if (verboseArg) {
    console.log(msg);
  }
};

// Recursive read-file function
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

console.log('\n\n======================================================');
console.log('\nFINDING ALL AUTOMATED TEST-FILES IN vets-website APPS');

// EXIT if --monthly option's detected, and
// today's not specified day of the month.
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

// Read all files under parentDir
const allFilesResult = getAllFiles(parentDir);

// Filter allFilesResult by fileSuffixes.
// Log all file-paths IF --verbose option is detected.
const filteredResults = {};

for (const testType of Object.keys(fileSuffixes)) {
  if (Object.prototype.hasOwnProperty.call(fileSuffixes, testType)) {
    filteredResults[testType] = {};
    for (const suffix of fileSuffixes[testType]) {
      verboseLog('\n++++++++++++++++++++++++++++++++++++++++\n');
      verboseLog(`ALL *${suffix} FILES UNDER ${parentDir} (recursive)...\n`);
      filteredResults[testType][suffix] = {};
      filteredResults[testType][suffix].filePaths = allFilesResult.filter(f => {
        return f.includes(suffix);
      });
      filteredResults[testType][suffix].fileCount =
        filteredResults[testType][suffix].filePaths.length;
      verboseLog(filteredResults[testType][suffix].filePaths);
    }
  }
}

// SUMMARY: Log total-count per file-suffix.
console.log('\n++++++++++++++++++++++++++++++++++++++++');
console.log(`\nAS OF ${niceDate}:\n`);

const testTypeKeys = Object.keys(filteredResults);

for (const testType of testTypeKeys) {
  for (const suffix of Object.keys(filteredResults[testType])) {
    console.log(
      `*${suffix} files total: ${filteredResults[testType][suffix].fileCount}`,
    );
  }
}

console.log('\n--------------------------------------------\n');

for (const testType of testTypeKeys) {
  let testTypeFileCount = 0;
  for (const suffix of Object.keys(filteredResults[testType])) {
    testTypeFileCount += filteredResults[testType][suffix].fileCount;
  }
  console.log(
    `${testType.toUpperCase()}-TEST FILES TOTAL: ${testTypeFileCount}`,
  );
}

console.log('\n--------------------------------------------');

const duration = moment().valueOf() - startTime;
console.log(`\nFinished in ${duration} msecs.`);
console.log('\n======================================================\n\n');

/* eslint-enable no-console */
