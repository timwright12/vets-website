const { getDrupalValue, utcToEpochTime } = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'press_releases_listing',
  // Ignoring this for now as uid is causing issues
  // uid: entity.uid[0],
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
});

module.exports = {
  filter: ['title', 'created', 'field_intro_text'],
  transform,
};
