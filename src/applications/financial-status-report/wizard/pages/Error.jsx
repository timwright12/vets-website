import React from 'react';
import { pageNames } from '../constants';
import ContactDMC from '../components/ContactDMC';

const DebtError = () => <ContactDMC />;

export default {
  name: pageNames.error,
  component: DebtError,
};
