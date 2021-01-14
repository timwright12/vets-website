/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    created: { $ref: 'GenericNestedString' },
    title: { $ref: 'GenericNestedString' },
  },
  required: ['created', 'title'],
};
