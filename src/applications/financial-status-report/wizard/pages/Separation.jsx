import React from 'react';
import { pageNames } from '../constants';
import SeparationAttorney from '../components/SeparationAttorney';

const Separation = () => <SeparationAttorney />;

export default {
  name: pageNames.separation,
  component: Separation,
};
