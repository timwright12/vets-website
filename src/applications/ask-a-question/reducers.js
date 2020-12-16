import formConfig from './form/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

const saveInProgressFormReducer = createSaveInProgressFormReducer(formConfig);

function formState(state, action) {
  let initialData = {};

  if (action.type === 'TOPIC_SELECTED') {
    initialData = {
      topic: action.topics,
    };
  }
  const form = saveInProgressFormReducer(state, action);
  return { ...form, initialData };
}

export default {
  form: formState,
};
