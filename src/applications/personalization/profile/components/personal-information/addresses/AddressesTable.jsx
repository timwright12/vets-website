import React from 'react';
import PropTypes from 'prop-types';

import ContactInformationField from '~/applications/personalization/profile/components/personal-information/ContactInformationField';
import { addressConvertCleanDataToPayload } from '~/applications/personalization/profile/util/addressUtils';

import { API_ROUTES, FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import {
  getFormSchema,
  getUiSchema,
} from '@@vap-svc/components/AddressField/address-schemas';

import ProfileInfoTable from '../../ProfileInfoTable';

const AddressesTable = ({ className }) => (
  <ProfileInfoTable
    title="Addresses"
    data={[
      {
        title: 'Mailing address',
        value: (
          <ContactInformationField
            title={FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS]}
            fieldName={FIELD_NAMES.MAILING_ADDRESS}
            apiRoute={API_ROUTES.ADDRESSES}
            convertCleanDataToPayload={addressConvertCleanDataToPayload}
            deleteDisabled
            formSchema={getFormSchema()}
            uiSchema={getUiSchema()}
            type="address"
          />
        ),
      },
      {
        title: 'Home address',
        value: (
          <ContactInformationField
            title={FIELD_TITLES[FIELD_NAMES.RESIDENTIAL_ADDRESS]}
            fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS}
            apiRoute={API_ROUTES.ADDRESSES}
            convertCleanDataToPayload={addressConvertCleanDataToPayload}
            formSchema={getFormSchema()}
            uiSchema={getUiSchema()}
            type="address"
          />
        ),
      },
    ]}
    className={className}
    list
  />
);

AddressesTable.propTypes = {
  className: PropTypes.string,
};

export default AddressesTable;
