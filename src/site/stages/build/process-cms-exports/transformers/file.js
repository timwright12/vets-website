const { getDrupalValue } = require('./helpers');

const formatUrl = originalUri => {
  const drupalValue = getDrupalValue(originalUri);

  return drupalValue
    ? encodeURI(drupalValue.replace('public:/', '/files'))
    : '';
};

const transform = entity => ({
  // TODO: Change this to get the actual derivative from the CMS export data
  url: formatUrl(entity.uri),
  filename: getDrupalValue(entity.filename),
});
module.exports = {
  filter: ['uri', 'filename'],
  transform,
};
