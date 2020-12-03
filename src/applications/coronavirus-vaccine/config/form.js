// import fullSchema from 'vets-json-schema/dist/12345-schema.json';
import fullSchema from './tempSchema.json';
import { uiSchema } from '../pages/coronavirusVaccineUISchema';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import environment from 'platform/utilities/environment';
import { hasSession } from 'platform/user/profile/utilities';

import definitions from 'vets-json-schema/dist/definitions.json';

const { fullName, email, usaPhone, date, usaPostalCode } = definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/api`,
  trackingPrefix: 'coronavirus-vaccine-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '12345',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to complete your coronavirus vaccine registration.',
    noAuth:
      'Please sign in again to continue your coronavirus vaccine registration.',
  },
  title: 'Vaccine information',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Vaccine information',
      pages: {
        // Authenticated Flow TODO
        demographicsStaticPage: {
          depends: () => hasSession(),
          path: 'demographics',
          hideHeaderRow: true,
          title: 'Veteran information',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {
              veteranInfo: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        // Unauthenticated flow
        page1: {
          depends: () => !hasSession(),
          path: 'vaccine-information',
          hideHeaderRow: true,
          title: 'Vaccine information',
          uiSchema,
          schema: {
            required: fullSchema.required,
            type: 'object',
            properties: {
              veteranFullName: fullName,
              veteranDateOfBirth: date,
              email,
              phone: usaPhone,
              zipCode: usaPostalCode,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
