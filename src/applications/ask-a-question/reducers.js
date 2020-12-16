import formConfig from './form/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

const saveInProgressFormReducer = createSaveInProgressFormReducer(formConfig);

function formState(state, action) {
  let newData = {};

  if (action.type === 'TOPIC_SELECTED') {
    newData = {
      topic: action.topics,
    };
  }
  const form = saveInProgressFormReducer(state, action);
  return { ...form, data: { ...form.data, ...newData } };
}

export default {
  form: formState,
};
