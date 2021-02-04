import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'Who was the recipient of this debt?';

const options = [
  {
    value: pageNames.disagreeFileClaim,
    label: 'Active duty service member',
  },
  {
    value: pageNames.fileClaim,
    label: 'Veteran',
  },
  {
    value: pageNames.disagreeFileClaim,
    label: 'Spouse',
  },
  {
    value: pageNames.disagreeFileClaim,
    label: 'Dependent',
  },
];

const RecipientPage = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${pageNames.recipient}-option`}
    label={label}
    id={`${pageNames.recipient}-option`}
    options={options}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.recipient,
  component: RecipientPage,
};
