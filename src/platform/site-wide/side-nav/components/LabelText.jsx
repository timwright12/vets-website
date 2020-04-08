// Dependencies
import React from 'react';
import { get } from 'lodash';
// Relative
import { NavItemPropTypes } from '../prop-types';
import PropTypes from 'prop-types';

const LabelText = ({ item, isLevelOne }) => {
  // Derive item properties.
  const label = get(item, 'label', '');
  // Add vertical line to grandchild elements
  const isGrandChildItem = item && item.depth > 3;
  // Return the normal label element.
  return (
    <div
      className={`va-sidenav-item-label-text${
        isLevelOne ? ' item-lvone-color' : ''
      }${isGrandChildItem ? ' grandchild-left-line' : ''}`}
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
