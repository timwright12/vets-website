import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import QuestionnaireWrapper from './containers/QuestionnaireWrapper.jsx';
import URLSearchParams from 'url-search-params';

// SUMMARY: dynamic form id.
/*
  This uses the url to get the appointment id and use that as the id for the form, 
  QUESTION: is this a bad idea? 
  QUESTION: For routing, when the user is in the form and hits back, the id in the url is lost, is there a way to maintain the id across the routes? 

  TODO: Looks like I will have to create my own createRoutesWithSaveInProgress. 
  TODO: handle error flows if id is not longer in the URL ,for both /questionnaiure and /qudstionnaire/introduction
  TODO: abstract the getting id from url logic
  TODO: duplicate appointment ids in form ids
*/

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
formConfig.formId += `-${id}`;

const route = {
  path: '/',
  component: QuestionnaireWrapper,
  indexRoute: {
    onEnter: (nextState, replace) => {
      // console.log('in onEnter', { id });
      // if (id) {
      replace(`/introduction?id=${id}`);
      // } else {
      //   replace('/error');
      // }
    },
  },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
