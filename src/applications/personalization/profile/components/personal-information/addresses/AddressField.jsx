import React from 'react';
import PropTypes from 'prop-types';

import { API_ROUTES, FIELD_NAMES } from '@@vap-svc/constants';

import { addressConvertCleanDataToPayload } from 'applications/personalization/profile/util/addressUtils';

import ContactInformationField from '../ContactInformationField';

import {
  getFormSchema,
  getUiSchema,
} from '@@vap-svc/components/AddressField/address-schemas';

function AddressField({ title, fieldName, deleteDisabled }) {
  return (
    <ContactInformationField
      title={title}
      fieldName={fieldName}
      apiRoute={API_ROUTES.ADDRESSES}
      convertCleanDataToPayload={addressConvertCleanDataToPayload}
      deleteDisabled={deleteDisabled}
      formSchema={getFormSchema()}
      uiSchema={getUiSchema()}
      type="address"
    />
  );
}

AddressField.propTypes = {
  title: PropTypes.string.isRequired,
  deleteDisabled: PropTypes.bool,
  fieldName: PropTypes.oneOf([
    FIELD_NAMES.MAILING_ADDRESS,
    FIELD_NAMES.RESIDENTIAL_ADDRESS,
  ]).isRequired,
};

export default AddressField;
