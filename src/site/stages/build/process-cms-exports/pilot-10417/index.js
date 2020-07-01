"use strict";

const fs = require('fs');

const Transformer = require('./transformer');
const testNode = 'node.fda9b503-6548-46b5-985b-22aef50f063a';
// const testNode = 'paragraph.69ad7606-1cac-4769-b794-50eeb4c3e111';
// const testNode = 'node.2bddb1a7-6fb1-4503-838d-9c2fcb51c46a.json';

function run() {
  const transformer = new Transformer(testNode);
  fs.writeFileSync('output.json', transformer.getJson());
  // console.log(transformer.schemaContent);
  // console.log(transformer.nodeContent);
}

run();

