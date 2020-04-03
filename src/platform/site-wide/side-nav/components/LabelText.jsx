// Dependencies
import React from 'react';
import { get } from 'lodash';
// Relative
import { NavItemPropTypes } from '../prop-types';
import PropTypes from 'prop-types';

const LabelText = ({ item, isLevelOne }) => {
  // Derive item properties.
  const label = get(item, 'label', '');
  // Return the normal label element.
  return (
    <div
      className={`va-sidenav-item-label-text${
        isLevelOne ? ' item-lvone-color' : ''
      }`}
    >
      {label}
    </div>
  );
};

LabelText.propTypes = {
  item: NavItemPropTypes,
  isLevelOne: PropTypes.bool,
};

export default LabelText;
