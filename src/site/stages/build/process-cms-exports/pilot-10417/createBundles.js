const fs = require('fs');
const parse = require('csv-parse/lib/sync');
// Probably could skip using lodash, depending on the version of js we use
const _ = require('lodash');


/*
* DRUPAL
* node content https://staging.cms.va.gov/coronavirus-veteran-frequently-asked-questions
* content type: Benefits detail page 
* machine name: page
* Field definitions: https://staging.cms.va.gov/admin/structure/types/manage/page/fields
*
* EXported
* node content exported node JSON: cms-export/content/fda9b503-6548-46b5-985b-22aef50f063a.json
*
*/

/*
* Parse the CSV definition files for the bundles and the fields
* and load into data structures
*/
function parseCSV() {

  const csvBundles = fs.readFileSync('./bundles.csv');
  // Parse and convert into an object where each column in the sheet is a field
  const bundles = parse(csvBundles, {columns:true});
  bundleObj = {};
  _.map(bundles, (value, key) => {
    const bundleType = value['Type'];
    const bundleName = value['Name'];
    console.log(bundleName, bundleType);
    if(bundleName) {
      value.fields = {}; // Bundle's fields will go in here
      // both paragaph type and contenet type can have the same bundle name such as "alert"
      // so we prefix with type to differentiate them.
      const fullName = `${bundleType}.${bundleName}`;
      bundleObj[fullName] =  value;
    }
  });

  // Parse and load field info
  const csvfields = fs.readFileSync('./fields.csv');
  const fields = parse(csvfields, {columns:true});
  _.map(fields, (value, key) => {
    const bundleName = value['Bundle'];
    const bundleType = value['#REF!'];
    const fullName = `${bundleType}.${bundleName}`;
    const fieldObj = bundleObj[fullName];
    if(fieldObj) {
      const machineName = value['Machine name'];
      fieldObj.fields[machineName] = value;
    } else {
      console.error(`Bundle ${bundleName} does not exist`);
    }
  });

  // We migrate to using machine name as the key for the bundle object
  _.map(bundleObj, (value, key) => {
    const machineName = value['Machine name'];
    const bundleType = _.snakeCase(value['Type']);
    const fullName = `${bundleType}.${machineName}`;
    bundleObj[fullName] = value;
    bundleObj[fullName].fields = _.sortBy(bundleObj[fullName].fields, 'Machine name');
    delete bundleObj[key];
  });

  return(bundleObj);
  // showUniqFieldTypes(fields);
}


/*
* Show a list of field type we use
*/

function showUniqFieldTypes(fields) {
  // Get the "Field type" from the object
  const fieldsMap = _.map(fields, 'Field type');
  // Get the unique field types
  const uniq = _.sortBy(_.uniq(fieldsMap));
  // console.log(uniq);
}

const bundleFields = parseCSV();
const output = JSON.stringify(bundleFields, null, 2);
// console.log(output);
fs.writeFileSync('bundles.json', output);
