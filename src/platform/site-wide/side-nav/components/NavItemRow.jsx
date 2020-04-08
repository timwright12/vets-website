// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
// Relative
// import ExpandCollapseIcon from './ExpandCollapseIcon';
import LabelText from './LabelText';
import { NavItemPropTypes } from '../prop-types';

const NavItemRow = ({ depth, item, toggleItemExpanded }) => {
  // Derive item properties.
  const hasChildren = get(item, 'hasChildren');
  const href = get(item, 'href');
  const id = get(item, 'id');
  const isSelected = get(item, 'isSelected');
  const label = get(item, 'label', '');
  const expanded = get(item, 'expanded');

  // Derive depth booleans.
  const isFirstLevel = depth === 1;
  const isDeeperThanSecondLevel = depth >= 2;

  // Calculate the indentation for the child items.
  const indentation = isDeeperThanSecondLevel ? 20 * (depth - 1) : 20;

  // Render the row not as a link when there are child nav items.
  if (hasChildren) {
    // Expanded
    const expandedItem = !!(expanded && depth === 2);
    // console.log({ expandedItem });
    let clsName;
    if (expandedItem) {
      clsName = classNames(
        'va-sidenav-item-label',
        'va-sidenav-item-label-underlined',
        {
          'va-sidenav-item-label-bold': isFirstLevel,
          'item-selected': isSelected,
        },
        'parent-children-open',
      );
    } else {
      clsName = classNames(
        'va-sidenav-item-label',
        'va-sidenav-item-label-underlined',
        {
          'va-sidenav-item-label-bold': isFirstLevel,
          'item-selected': isSelected,
        },
      );
    }
    return (
      <a
        aria-label={label}
        id={item.id}
        className={clsName}
        onClick={toggleItemExpanded(id)}
        href={isSelected ? '/pittsburgh-health-care' : href}
        rel="noopener noreferrer"
        style={{ paddingLeft: indentation }}
      >
        {/* Label */}
        <LabelText item={item} isLevelOne={isFirstLevel} />
        {/* Expand/Collapse Button */}
        {/* <ExpandCollapseIcon depth={depth} item={item} /> */}
      </a>
    );
  }

  return (
    <a
      className={classNames(
        'va-sidenav-item-label',
        'va-sidenav-item-label-underlined',
        {
          'item-selected': isSelected,
        },
      )}
      rel="noopener noreferrer"
      href={isSelected ? '/pittsburgh-health-care' : href}
      style={{ paddingLeft: indentation }}
    >
      {/* Label */}
      <LabelText item={item} />
    </a>
  );
};

NavItemRow.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropTypes,
  toggleItemExpanded: PropTypes.func.isRequired,
};

export default NavItemRow;
