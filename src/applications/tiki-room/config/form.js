import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import fullNameUISchema from 'platform/forms/definitions/fullName';
import EmailyWidget from '../components/EmailyWidget';
import SavableWidget from '../components/SavableWidget';
import SessionStorageWidget from '../components/SessionStorageWidget';
import AuthRecommendedWidget from '../components/AuthRecommendedWidget';
import AuthRecommendedFullNameWidget from '../components/AuthRecommendedFullNameWidget';

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
        opening: {
          path: 'opening',
          title: 'Even the Flowers Sing!',
          uiSchema: {
            primaryReason: {
              'ui:title': 'What is the primary reason for your visit?',
              'ui:widget': SessionStorageWidget,
            },
          },
          schema: {
            type: 'object',
            properties: {
              primaryReason: {
                type: 'string',
              },
            },
          },
        },

        who: {
          title: 'For your eyes only',
          path: 'identity',
          uiSchema: {
            fullName: {
              'ui:widget': AuthRecommendedFullNameWidget,
            },
            email: {
              'ui:title': 'Email Address',
              'ui:widget': AuthRecommendedWidget,
            },
          },
          schema: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string',
              },
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
            drinker: {
              'ui:title': 'Do you ever drink alcohol?',
              'ui:widget': 'yesNo',
            },
            howMuchDrinks: {
              'ui:title': 'How often do you consume drinks with alcohol?',
              'ui:widget': 'radio',

              'ui:options': {
                hideIf: formData => !formData.drinker,
                expandUnder: 'drinker',
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              drinker: {
                type: 'boolean',
              },
              howMuchDrinks: {
                type: 'string',
                enum: [
                  'Select one',
                  '1-3 drinks a month',
                  '1-3 drinks a week',
                  '1 -3 drinks a day',
                  '3+ drinks in a sitting',
                ],
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
