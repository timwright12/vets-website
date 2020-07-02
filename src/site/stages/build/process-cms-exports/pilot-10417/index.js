"use strict";

const fs = require('fs');

const Transformer = require('./transformer');
const testNode = 'node.fda9b503-6548-46b5-985b-22aef50f063a';
// const testNode = 'paragraph.3a76cbda-2e99-4c2a-b417-ce837646d19b';
// const testNode = 'node.2bddb1a7-6fb1-4503-838d-9c2fcb51c46a.json';

function run() {
  const transformer = new Transformer(testNode);
  const outJson = transformer.getJson();
  const prettyOutJson = JSON.stringify(outJson, null, 2);
  fs.writeFileSync('output.json', prettyOutJson);
  // console.log(transformer.schemaContent);
  // console.log(transformer.nodeContent);
}

run();

