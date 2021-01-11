// import fullSchema from 'vets-json-schema/dist/123-DD-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getDirectDepositSchemas from 'platform/forms-system/src/js/definitions/directDeposit';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'direct-deposit-test-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '123-DD',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Direct Deposit Test',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Direct Deposit',
      pages: {
        page1: {
          path: 'direct-deposit',
          title: 'Direct Deposit - Page 1',
          ...getDirectDepositSchemas({}),
        },
      },
    },
  },
};

export default formConfig;
