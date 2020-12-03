import merge from 'lodash/merge';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import { hasSession } from 'platform/user/profile/utilities';

export const uiSchema = {
  veteranFullName: merge(fullNameUI, {
    first: {
      'ui:title': 'First name',
    },
    last: {
      'ui:title': 'Last name',
    },
    middle: {
      'ui:title': 'Middle name',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    'ui:order': ['first', 'middle', 'last', 'suffix'],
  }),
  veteranDateOfBirth: merge(currentOrPastDateUI('Date of birth'), {
    'ui:required': () => !hasSession(),
  }),
  email: emailUI(),
  phone: {
    ...phoneUI(),
    'ui:options': {
      classNames: 'input-width',
    },
  },
};
