const fs = require('fs');
const path = require('path');

const { config } = require('./config.js');

// Remove all .xml result files
// Cypress doesn't delete them if configured to include hashes in filenames
const rmDir = (dirPath, removeSelf = true) => {
  let files;

  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }

  if (files.length > 0)
    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(dirPath, files[i]);
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDir(filePath);
    }

  if (removeSelf) fs.rmdirSync(dirPath);
};

rmDir(config.cy.resultsDir, false);
