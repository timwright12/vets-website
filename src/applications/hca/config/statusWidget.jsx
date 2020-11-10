import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { VA_FORM_IDS } from 'platform/forms/constants';
import widgetTypes from '../../static-pages/widgetTypes';

export default function createHcaApplicationStatus(store) {
  const root = document.querySelector(
    `[data-widget-type="${widgetTypes.HEALTH_CARE_APP_STATUS}"]`,
  );
  if (root) {
    Promise.all([
      import(/* webpackChunkName: "hca-application-status" */
      'platform/forms/save-in-progress/ApplicationStatus'),
      import('./form'),
    ]).then(([appStatusModule, formConfigModule]) => {
      const ApplicationStatus = appStatusModule.default;
      const formConfig = formConfigModule.default;
      ReactDOM.render(
        <Provider store={store}>
          <ApplicationStatus
            formId={VA_FORM_IDS.FORM_10_10EZ}
            formConfig={formConfig}
            showApplyButton={
              root.getAttribute('data-hide-apply-button') === null
            }
            showLearnMoreLink={
              root.getAttribute('data-widget-show-learn-more') !== null
            }
            additionalText={'You can apply online right now'}
            applyHeading={'How do I apply?'}
            applyLink={'/health-care/how-to-apply/'}
            applyText={'Apply for health care benefits'}
          />
        </Provider>,
        root,
      );
    });
  }
}
