/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
// TODO: this can and should be its own useSessionStorage hook, that is the next refactor
function SessionStorageWidget(props) {
  const { onReviewPage, reviewMode } = props.formContext;
  const { formId } = props.form;
  const { onChange } = props;
  const widgetId = props.id || props.idSchema.$id;
  const [currentValue, setCurrentValue] = useState(props.value || '');

  const sessionOnChange = value => {
    let form = JSON.parse(sessionStorage.getItem(formId));
    if (!form) {
      form = {};
    }
    form[widgetId] = value;
    sessionStorage.setItem(formId, JSON.stringify(form));
    console.log({ value, form });
    onChange(value);
    setCurrentValue(value);
  };

  useEffect(
    () => {
      // prefer value passed in over what is in session storage.
      if (!props.value) {
        // check session storage for value
        const form = JSON.parse(sessionStorage.getItem(formId));
        console.log('getting form', { form });
        const value = form ? form[widgetId] : '';
        setCurrentValue(value);
        onChange(value);
      }
    },
    [formId, props.value, widgetId, onChange],
  );

  const editField = () => {
    return (
      <div>
        <TextWidget
          {...props}
          value={currentValue}
          onChange={sessionOnChange}
        />
      </div>
    );
  };

  if (onReviewPage && reviewMode) {
    return <>{currentValue}</>;
  } else if (onReviewPage && !reviewMode) {
    return editField();
  } else {
    return editField();
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
)(SessionStorageWidget);
