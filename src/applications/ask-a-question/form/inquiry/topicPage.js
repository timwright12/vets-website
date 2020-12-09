import * as topic from './topic/topic';

import fullSchema from '../0873-schema.json';

const formFields = {
  topic: 'topic',
};

const topicPage = {
  uiSchema: {
    [formFields.topic]: topic.uiSchema(),
  },
  schema: {
    type: 'object',
    required: [formFields.topic],
    properties: {
      [formFields.topic]: topic.schema(fullSchema),
    },
  },
};

export default topicPage;
