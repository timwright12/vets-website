import React, { useMemo } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { setData } from 'platform/forms-system/src/js/actions';
import { selectProfile, selectVAPContactInfo } from 'platform/user/selectors';

import AppointmentDisplay from './AppointmentDisplay';
import { autoSaveForm } from 'platform/forms/save-in-progress/actions';
import VeteranInformationDisplay from './VeteranInformationDisplay';

const AppointmentInfoBox = props => {
  const {
    userFullName,
    dateOfBirth,
    gender,
    addresses,
    phoneNumbers,
    appointment,
    setFormData,
    saveForm,
    form,
  } = props;

  const fullName = useMemo(
    () => {
      return [userFullName.first, userFullName.middle, userFullName.last]
        .filter(f => f)
        .map(name => name[0].toUpperCase() + name.substr(1).toLowerCase())
        .join(' ')
        .trim();
    },
    [userFullName.first, userFullName.middle, userFullName.last],
  );

  const { formId, version, data } = form;
  const veteranInfo = {
    gender,
    dateOfBirth,
    fullName,
    phoneNumbers,
    addresses,
  };

  return (
    <div>
      <AppointmentDisplay appointment={appointment} />
      <p>
        Below is the personal and contact information we have on file for you.
      </p>
      <VeteranInformationDisplay
        veteranInfo={veteranInfo}
        data={data}
        formId={formId}
        version={version}
        setFormData={setFormData}
        saveForm={saveForm}
      />
      <p>
        Note: If you need to update your personal information, please call
        Veterans Benefits Assistance at{' '}
        <a href="tel:800-827-1000">800-827-1000</a>, Monday through Friday, 8:00
        a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const vapContactInfo = selectVAPContactInfo(state);
  return {
    form: state.form,
    userFullName: profile.userFullName,
    dateOfBirth: profile.dob,
    gender: profile.gender,
    addresses: {
      residential: vapContactInfo?.residentialAddress,
      mailing: vapContactInfo?.mailingAddress,
    },
    phoneNumbers: [
      { label: 'Home', data: vapContactInfo?.homePhone },
      { label: 'Mobile', data: vapContactInfo?.mobilePhone },
      { label: 'Work', data: vapContactInfo?.workPhone },
      { label: 'Temporary', data: vapContactInfo?.temporaryPhone },
    ],
    appointment: state.questionnaireData?.context?.appointment,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
  saveForm: autoSaveForm,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AppointmentInfoBox),
);
