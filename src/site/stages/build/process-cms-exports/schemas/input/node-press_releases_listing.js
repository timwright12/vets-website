/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    created: { $ref: 'GenericNestedString' },
    title: { $ref: 'GenericNestedString' },
    field_intro_text: { $ref: 'GenericNestedString' },
  },
  required: ['created', 'title', 'field_intro_text'],
};

/*
fieldIntroText

*/