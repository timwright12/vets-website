module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['press_releases_listing'] },
    title: { type: 'string' },
    created: { type: 'number' },
  },
  required: ['title', 'created'],
};
