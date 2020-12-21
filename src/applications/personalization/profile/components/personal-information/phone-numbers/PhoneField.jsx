import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';

import { API_ROUTES, FIELD_NAMES, PHONE_TYPE, USA } from '@@vap-svc/constants';

import ContactInformationField from '../ContactInformationField';

import {
  phoneUiSchema,
  phoneFormSchema,
  phoneConvertNextValueToCleanData,
  phoneConvertCleanDataToPayload,
} from 'applications/personalization/profile/util/phoneUtils';

export default class PhoneField extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fieldName: PropTypes.oneOf([
      FIELD_NAMES.HOME_PHONE,
      FIELD_NAMES.MOBILE_PHONE,
      FIELD_NAMES.TEMP_PHONE,
      FIELD_NAMES.WORK_PHONE,
      FIELD_NAMES.FAX_NUMBER,
    ]).isRequired,
  };

  render() {
    return (
      <ContactInformationField
        apiRoute={API_ROUTES.TELEPHONES}
        convertCleanDataToPayload={phoneConvertCleanDataToPayload}
        fieldName={this.props.fieldName}
        formSchema={phoneFormSchema}
        title={this.props.title}
        uiSchema={phoneUiSchema}
        type="phone"
      />
    );
  }
}
