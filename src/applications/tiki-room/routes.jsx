import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
// import App from './containers/App.jsx';
import AppWrapper from './components/RoomWrapper';

const route = {
  path: '/',
  component: AppWrapper,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
