"use strict";

const fs = require('fs');

const Transformer = require('./transformer');
// const testNode = 'node.fda9b503-6548-46b5-985b-22aef50f063a'; // coronavirus faq
const testNode = 'node.ffe5dd82-3126-4db4-a65f-1c81d6f9f6e8';
// const testNode = 'node.002a617c-a548-4bca-8788-d97f2771f217';

function loadOne() {
  const transformer = new Transformer(testNode, true);
  const outJson = transformer.getJson();
  Transformer.saveFile('output.json', outJson);
}

function loadMany() {
  Transformer.loadNodes();
}

// loadOne();
loadMany();
