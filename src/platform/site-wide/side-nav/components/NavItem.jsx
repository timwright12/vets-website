// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
// Relative
// import DuplicateLineLabel from './DuplicateLineLabel';
import NavItemRow from './NavItemRow';
import { NavItemPropTypes } from '../prop-types';

const NavItem = ({
  depth,
  item,
  index,
  renderChildItems,
  // eslint-disable-next-line no-unused-vars
  sortedNavItems,
  // eslint-disable-next-line no-unused-vars
  skipLine,
  toggleItemExpanded,
}) => {
  // Derive the item properties.
  const expanded = get(item, 'expanded');
  const hasChildren = get(item, 'hasChildren');
  const id = get(item, 'id');
  // Derive the depth booleans.
  const isFirstLevel = depth === 1;

  // Determine if we are the last nav item.
  // const isLastNavItem = index === sortedNavItems.length - 1;
  // Expanded
  const expandedItem = expanded && depth === 2 ? item : null;
  return (
    <li className={`va-sidenav-level-${depth}`} key={id}>
      {/* isFirstLevel && index !== 0 && !expandedItem && <div className="line" /> */}
      {isFirstLevel &&
        index !== 0 &&
        !expandedItem &&
        // eslint-disable-next-line no-console
        console.log('NormalLIne')}
      {/* Nav Item Row */}
      <NavItemRow
        depth={depth}
        item={item}
        toggleItemExpanded={toggleItemExpanded}
      />
      {/* Child Items */}
      {expanded &&
        hasChildren && (
          <ul>{renderChildItems(id, depth + 1, !!expandedItem)}</ul>
        )}
      {expandedItem && hasChildren && <div className="line-expanded" />}
      {/* eslint-disable-next-line no-console */}
      {expandedItem && hasChildren && console.log('LineExpanded')}
      {/* eslint-disable-next-line no-console */}
      {expandedItem && hasChildren && console.log({ expandedItem })}
    </li>
  );
};

NavItem.propTypes = {
  depth: PropTypes.number.isRequired,
  skipLine: PropTypes.bool.isRequired,
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
