/* eslint-disable no-console */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

// eslint-disable-next-line react/prefer-stateless-function
class SavableWidget extends Component {
  state = {
    value: this.props.value,
    widgetId: this.props.id || this.props.idSchema.$id,
  };
  sessionOnSave = value => {
    let form = JSON.parse(sessionStorage.getItem(this.props.form.formId));
    if (!form) {
      form = {};
    }

    form[this.state.widgetId] = value;

    sessionStorage.setItem(this.props.form.formId, JSON.stringify(form));
    console.log({ value, form });
    this.updateStateWithValue(value);
  };

  getValueFromSessionStorage = () => {
    const form = JSON.parse(sessionStorage.getItem(this.props.form.formId));
    console.log('getting form', { form });
    return form ? form[this.state.widgetId] : null;
  };

  updateStateWithValue = value => {
    console.log('updating value', { value });
    if (value || value === '' || value === 0) {
      this.setState({ value }, () => {
        this.props.onChange(this.state.value);
      });
    }
  };

  componentDidMount() {
    console.log('cdm', this.props);
    if (!this.props.value) {
      // get from session storage
      const value = this.getValueFromSessionStorage();
      this.updateStateWithValue(value);
    }
  }

  field = () => {
    return (
      <div>
        <TextWidget
          {...this.props}
          value={this.state.value}
          onChange={this.sessionOnSave}
        />
      </div>
    );
  };

  render() {
    const { onReviewPage } = this.props.formContext;
    if (onReviewPage) {
      return <>{this.state.value}</>;
    } else {
      return this.field();
    }
  }
}

const mapStateToProps = state => ({
  form: state.form,
  user: state.user,
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SavableWidget);
