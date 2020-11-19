/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const getAllFilesRecursive = (dirPath, filesArr = []) => {
  const files = fs.readdirSync(dirPath);

  let myFilesArr = filesArr;

  files.forEach(function(file) {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      myFilesArr = getAllFilesRecursive(`${dirPath}/${file}`, myFilesArr);
    } else {
      myFilesArr.push(path.join(__dirname, dirPath, '/', file));
    }
  });

  return myFilesArr;
};

module.exports = {
  getAllFilesRecursive,
};
/* eslint-enable no-console */
