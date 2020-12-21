import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_NAMES, FIELD_TITLES, API_ROUTES } from '@@vap-svc/constants';

import ProfileInfoTable from '../../ProfileInfoTable';

import {
  phoneUiSchema,
  phoneFormSchema,
  phoneConvertCleanDataToPayload,
} from '~/applications/personalization/profile/util/phoneUtils';
import ContactInformationField from '~/applications/personalization/profile/components/personal-information/ContactInformationField';

const PhoneNumbersTable = ({ className }) => (
  <ProfileInfoTable
    title="Phone numbers"
    data={[
      {
        title: 'Home',
        value: (
          <ContactInformationField
            apiRoute={API_ROUTES.TELEPHONES}
            convertCleanDataToPayload={phoneConvertCleanDataToPayload}
            formSchema={phoneFormSchema}
            uiSchema={phoneUiSchema}
            type="phone"
            title={FIELD_TITLES[FIELD_NAMES.HOME_PHONE]}
            fieldName={FIELD_NAMES.HOME_PHONE}
          />
        ),
      },
      {
        title: 'Work',
        value: (
          <ContactInformationField
            apiRoute={API_ROUTES.TELEPHONES}
            convertCleanDataToPayload={phoneConvertCleanDataToPayload}
            formSchema={phoneFormSchema}
            uiSchema={phoneUiSchema}
            type="phone"
            title={FIELD_TITLES[FIELD_NAMES.WORK_PHONE]}
            fieldName={FIELD_NAMES.WORK_PHONE}
          />
        ),
      },
      {
        title: 'Mobile',
        value: (
          <ContactInformationField
            apiRoute={API_ROUTES.TELEPHONES}
            convertCleanDataToPayload={phoneConvertCleanDataToPayload}
            formSchema={phoneFormSchema}
            uiSchema={phoneUiSchema}
            type="phone"
            title={FIELD_TITLES[FIELD_NAMES.MOBILE_PHONE]}
            fieldName={FIELD_NAMES.MOBILE_PHONE}
          />
        ),
      },
      {
        title: 'Fax',
        value: (
          <ContactInformationField
            apiRoute={API_ROUTES.TELEPHONES}
            convertCleanDataToPayload={phoneConvertCleanDataToPayload}
            formSchema={phoneFormSchema}
            uiSchema={phoneUiSchema}
            type="phone"
            title={FIELD_TITLES[FIELD_NAMES.FAX_NUMBER]}
            fieldName={FIELD_NAMES.FAX_NUMBER}
          />
        ),
      },
    ]}
    list
    className={className}
  />
);

PhoneNumbersTable.propTypes = {
  className: PropTypes.string,
};

export default PhoneNumbersTable;
