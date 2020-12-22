import React from 'react';
import PropTypes from 'prop-types';

import ContactInformationField from '~/applications/personalization/profile/components/personal-information/ContactInformationField';
import { addressConvertCleanDataToPayload } from '~/applications/personalization/profile/util/addressUtils';

import { API_ROUTES, FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';

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
