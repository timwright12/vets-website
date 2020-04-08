// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
// Relative
// import DuplicateLineLabel from './DuplicateLineLabel';
import NavItemRow from './NavItemRow';
import { NavItemPropTypes } from '../prop-types';

const removeLine = id => {
  setTimeout(() => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  }, 1);
};

const NavItem = ({
  depth,
  item,
  index,
  renderChildItems,
  sortedNavItems,
  toggleItemExpanded,
}) => {
  // Derive the item properties.
  const expanded = get(item, 'expanded');
  const hasChildren = get(item, 'hasChildren');
  const id = get(item, 'id');
  const isSelected = get(item, 'isSelected');
  // Derive the depth booleans.
  const isFirstLevel = depth === 1;

  // Determine if we are the last nav item.
  const isLastNavItem = index === sortedNavItems.length - 1;
  // Expanded
  const expandedItem = expanded && depth === 2 ? item : null;
  return (
    <li className={`va-sidenav-level-${depth}`} key={id}>
      {/* Nav Item Row */}
      <NavItemRow
        depth={depth}
        item={item}
        toggleItemExpanded={toggleItemExpanded}
      />
      {/* Child Items auto expand if grand children */}
      {(expanded || depth >= 3) &&
        hasChildren && <ul>{renderChildItems(id, depth + 1)}</ul>}
      {expandedItem && hasChildren && <div className="line-expanded" />}
      {/* eslint-disable-next-line no-console */}
      {expandedItem && hasChildren && console.log('LineExpanded')}

      {isFirstLevel &&
        !isLastNavItem && <div id={`${item.id}-line`} className="line" />}

      {isSelected && removeLine(item.parentID && `${item.parentID}-line`)}
    </li>
  );
};

NavItem.propTypes = {
  depth: PropTypes.number.isRequired,
  item: NavItemPropTypes,
  index: PropTypes.number.isRequired,
  renderChildItems: PropTypes.func.isRequired,
  sortedNavItems: PropTypes.arrayOf(NavItemPropTypes).isRequired,
  toggleItemExpanded: PropTypes.func.isRequired,
};

NavItem.defaultProps = {
  item: {},
  renderChildItems: () => {},
  sortedNavItems: [],
  toggleItemExpanded: () => {},
};

export default NavItem;
