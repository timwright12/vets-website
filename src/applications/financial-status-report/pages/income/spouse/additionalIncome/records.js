import ItemLoop from '../../../../components/ItemLoop';
import TableDetailsView from '../../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../../components/Typeahead';
import {
  formatOptions,
  incomeTypes,
} from '../../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  additionalIncome: {
    spouse: {
      additionalIncomeRecords: {
        'ui:field': ItemLoop,
        'ui:description':
          'Tell us how much you get each month for each type of income.',
        'ui:options': {
          viewType: 'table',
          viewField: TableDetailsView,
          doNotScroll: true,
          showSave: true,
          itemName: 'income',
        },
        items: {
          'ui:options': {
            classNames: 'horizonal-field-container no-wrap',
          },
          incomeType: {
            'ui:title': 'Type of income',
            'ui:field': Typeahead,
            'ui:options': {
              classNames: 'input-size-4',
              getOptions: () => formatOptions(incomeTypes),
            },
          },
          monthlyAmount: _.merge(currencyUI('Monthly amount'), {
            'ui:options': {
              widgetClassNames: 'input-size-2',
            },
          }),
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          properties: {
            additionalIncomeRecords: {
              type: 'array',
              items: {
                type: 'object',
                required: ['incomeType', 'monthlyAmount'],
                properties: {
                  incomeType: {
                    type: 'string',
                  },
                  monthlyAmount: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
