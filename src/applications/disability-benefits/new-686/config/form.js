import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Chapter imports
import { formerSpouseInformation } from './chapters/report-divorce';
import { deceasedDependentInformation } from './chapters/report-dependent-death';
import { reportChildMarriage } from './chapters/report-marriage-of-child';
import { reportChildStoppedAttendingSchool } from './chapters/report-child-stopped-attending-school';
import { wizard } from './chapters/taskWizard';
import {
  veteranInformation,
  veteranAddress,
} from './chapters/veteran-information';

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'new-686-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-686',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for declare or remove a dependent.',
    noAuth:
      'Please sign in again to continue your application for declare or remove a dependent.',
  },
  title: 'New 686',
  defaultDefinitions: {},
  chapters: {
    optionSelection: {
      title: '686c Options',
      pages: {
        wizard: {
          title: '686c Options',
          path: '686-options-selection',
          uiSchema: wizard.uiSchema,
          schema: wizard.schema,
        },
      },
    },
    veteranInformation: {
      title: "Veteran's Information",
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran Address',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
      },
    },
    reportDivorce: {
      title: 'Information needed to report a divorce',
      pages: {
        formerSpouseDetails: {
          title: 'Information needed to report a divorce',
          path: 'report-a-divorce',
          uiSchema: formerSpouseInformation.uiSchema,
          schema: formerSpouseInformation.schema,
        },
      },
    },
    deceasedDependents: {
      title: 'Report the death of a dependent',
      pages: {
        dependentInformation: {
          title: 'Report the death of a dependent',
          path: '686-report-dependent-death',
          uiSchema: deceasedDependentInformation.uiSchema,
          schema: deceasedDependentInformation.schema,
        },
      },
    },
    reportChildMarriage: {
      title: 'Information needed to report the marriage of a child under 18',
      pages: {
        childInformation: {
          title:
            'Information needed to report the marriage of a child under 18',
          path: '686-report-marriage-of-child',
          uiSchema: reportChildMarriage.uiSchema,
          schema: reportChildMarriage.schema,
        },
      },
    },
    reportChildStoppedAttendingSchool: {
      title:
        'Information needed to report a child 18-23 years old stopped attending school',
      pages: {
        childNoLongerInSchool: {
          title:
            'Information needed to report a child 18-23 years old stopped attending school',
          path: 'report-child-stopped-attending-school',
          uiSchema: reportChildStoppedAttendingSchool.uiSchema,
          schema: reportChildStoppedAttendingSchool.schema,
        },
      },
    },
  },
};

export default formConfig;
