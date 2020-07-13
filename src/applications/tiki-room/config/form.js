import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import fullNameUISchema from 'platform/forms/definitions/fullName';
import EmailWidget from '../components/EmailWidget';

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'tiki-room-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'TIKI-68',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for tiki tiki.',
    noAuth: 'Please sign in again to continue your application for tiki tiki.',
  },
  title: 'Tiki Room',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        first: {
          path: 'opening',
          title: 'First Page',
          uiSchema: {
            fullName: fullNameUISchema.first,
            enjoyTheOpening: {
              'ui:title': 'Did you enjoy the opening?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string',
              },
              enjoyTheOpening: {
                type: 'boolean',
              },
            },
          },
        },
        flowers: {
          path: 'the-orchids',
          title: 'Even the Flowers Sing!',
          uiSchema: {
            enjoyTheFlowers: {
              'ui:title': 'The orchids sound lovely??',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              enjoyTheFlowers: {
                type: 'boolean',
              },
            },
          },
        },
        auth: {
          title: 'For your eyes only',
          path: 'secret',
          uiSchema: {
            email: {
              'ui:widget': EmailWidget,
            },
          },
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
        bonus: {
          path: 'bonus',
          title: 'You get a treat',
          depends: form => form.enjoyTheOpening && form.enjoyTheFlowers,

          uiSchema: {
            treatOptions: {
              'ui:title': 'What kind treat do you want for enjoying the show?',
            },
          },
          schema: {
            type: 'object',
            properties: {
              treatOptions: {
                type: 'string',
                enum: ['Ice cream', 'Churro', 'Turkey Leg', 'Dole whip'],
              },
            },
          },
        },
        finale: {
          path: 'finale',
          title: 'Ready for the finale?!!',
          uiSchema: {
            areYouReady: {
              'ui:title': 'Are you ready??',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              areYouReady: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
