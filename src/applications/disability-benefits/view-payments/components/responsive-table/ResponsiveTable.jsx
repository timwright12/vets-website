import React, { Component } from 'react';
import classNames from 'classnames';
import './ResponsiveTable.scss';

class ResponsiveTable extends Component {
  renderHeader = field => {
    if (field.nonSortable) {
      return <th key={field.value}>{field.label}</th>;
    }

    // Determine what sort order the header will yield on the next click.
    // By default, clicking this header will sort in ascending order.
    // If it’s already ascending, next click will sort it in descending order.
    let nextSortOrder = 'ASC';
    let sortIcon;

    if (this.props.currentSort.value === field.value) {
      const iconClass = classNames({
        fa: true,
        'fas fa-caret-down': this.props.currentSort.order === 'DESC',
        'fas fa-caret-up': this.props.currentSort.order === 'ASC',
      });

      sortIcon = <i className={iconClass} />;

      if (this.props.currentSort.order === 'ASC') {
        nextSortOrder = 'DESC';
      }
    }

    return (
      <th key={field.value}>
        <button
          className="va-button-link vads-u-font-weight--bold vads-u-color--base vads-u-text-decoration--none"
          tabIndex="0"
        >
          {field.label}
          {sortIcon}
        </button>
      </th>
    );
  };

  renderRow = item => {
    const { fields } = this.props;

    return (
      <tr key={item.id} className={item.rowClass}>
        {fields.map(field => (
          <td data-label={field.value} key={`${item.id}-${field.value}`}>
            {item[field.value]}
          </td>
        ))}
      </tr>
    );
  };

  render() {
    const { className, data, fields } = this.props;
    const headers = fields.map(this.renderHeader);
    const rows = data.map(this.renderRow);

    return (
      <table className="responsive">
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default ResponsiveTable;
