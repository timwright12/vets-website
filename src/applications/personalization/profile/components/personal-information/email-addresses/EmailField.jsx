import React from 'react';
import PropTypes from 'prop-types';
import {
  emailUiSchema,
  emailFormSchema,
  emailConvertDataToPayload,
} from 'applications/personalization/profile/util/emailUtils';

import { API_ROUTES, FIELD_NAMES } from '@@vap-svc/constants';

import ContactInformationField from '../ContactInformationField';

export default class EmailField extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fieldName: PropTypes.oneOf([FIELD_NAMES.EMAIL]).isRequired,
  };

  render() {
    return (
      <ContactInformationField
        title={this.props.title}
        fieldName={this.props.fieldName}
        apiRoute={API_ROUTES.EMAILS}
        convertCleanDataToPayload={emailConvertDataToPayload}
        formSchema={emailFormSchema}
        uiSchema={emailUiSchema}
        type="email"
      />
    );
  }
}
