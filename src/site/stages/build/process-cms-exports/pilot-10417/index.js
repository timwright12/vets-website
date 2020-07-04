"use strict";

const fs = require('fs');

const Transformer = require('./transformer');
// const testNode = 'node.fda9b503-6548-46b5-985b-22aef50f063a'; // coronavirus faq
//const testNode = 'node.18ca8756-9f78-43ef-95ea-04bd106063c5';
// const testNode = 'node.002a617c-a548-4bca-8788-d97f2771f217';
// const testNode = 'node.1e11ce74-b312-49d0-aedc-ee9ea1999fac';
const testNode = 'node.530e8eb3-ff6e-4669-9118-cdd71d251660';

function loadOne() {
  const transformer = new Transformer(testNode, true);
  const outJson = transformer.getJson();
  const prettyOutJson = JSON.stringify(outJson, null, 2);
  fs.writeFileSync('output.json', prettyOutJson);
  // console.log(transformer.schemaContent);
  // console.log(transformer.nodeContent);
}

function loadMany() {
  Transformer.loadNodes(5000);
}

// loadOne();
loadMany();
