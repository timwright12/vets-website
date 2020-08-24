import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { getLongTermAppointmentHistory } from '../api';
import FormButtons from '../components/FormButtons';
import TypeOfCareUnavailableModal from '../components/TypeOfCareUnavailableModal';
import UpdateAddressAlert from '../components/UpdateAddressAlert';
import * as actions from '../new-appointment/redux/actions.js';
import {
  getFormPageInfo,
  getNewAppointment,
  vaosDirectScheduling,
  vaosCommunityCare,
} from '../utils/selectors';

import {
  selectIsCernerOnlyPatient,
  selectVet360ResidentialAddress,
} from 'platform/user/selectors';

import useFormState from '../utils/useFormState';
import { TYPES_OF_CARE, PODIATRY_ID } from '../utils/constants';

const initialSchema = {
  type: 'object',
  required: ['typeOfCareId'],
  properties: {
    typeOfCareId: {
      type: 'string',
    },
  },
};

const uiSchema = {
  typeOfCareId: {
    'ui:title': 'Please choose a type of care',
    'ui:widget': 'radio',
  },
};

const pageKey = 'typeOfCare';
const pageTitle = 'Choose the type of care you need';

export function TypeOfCarePage({
  pageChangeInProgress,
  showCommunityCare,
  showDirectScheduling,
  addressLine1,
  hideUpdateAddressAlert,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  showModal,
  hideTypeOfCareUnavailableModal,
  clickUpdateAddressButton,
  setReduxData,
  data: userData,
}) {
  const history = useHistory();
  useEffect(() => {
    // this.props.openTypeOfCarePage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  const sortedCare = TYPES_OF_CARE.filter(
    typeOfCare => typeOfCare.id !== PODIATRY_ID || showCommunityCare,
  ).sort(
    (careA, careB) =>
      careA.name.toLowerCase() > careB.name.toLowerCase() ? 1 : -1,
  );
  const schemaWithTypes = {
    ...initialSchema,
    properties: {
      typeOfCareId: {
        type: 'string',
        enum: sortedCare.map(care => care.id || care.ccId),
        enumNames: sortedCare.map(care => care.label || care.name),
      },
    },
  };

  const { data, schema, setData } = useFormState(
    schemaWithTypes,
    uiSchema,
    userData,
  );

  function onChange(newData) {
    // When someone chooses a type of care that can be direct scheduled,
    // kick off the past appointments fetch, which takes a while
    // This could get called multiple times, but the function is memoized
    // and returns the previous promise if it eixsts
    if (showDirectScheduling) {
      getLongTermAppointmentHistory();
    }

    setData(newData);
  }

  function goBack() {
    setReduxData(data);
    routeToPreviousAppointmentPage(history, pageKey);
  }

  function goForward() {
    setReduxData(data);
    routeToNextAppointmentPage(history, pageKey);
  }

  if (!schema) {
    return null;
  }

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <UpdateAddressAlert
        address={addressLine1}
        showAlert={!hideUpdateAddressAlert}
        onHide={clickUpdateAddressButton}
      />

      <SchemaForm
        name="Type of care"
        title="Type of care"
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={goForward}
        onChange={onChange}
        data={data}
      >
        <FormButtons
          onBack={goBack}
          pageChangeInProgress={pageChangeInProgress}
          loadingText="Page change in progress"
        />
      </SchemaForm>
      <TypeOfCareUnavailableModal
        typeOfCare="Podiatry"
        showModal={showModal}
        onClose={hideTypeOfCareUnavailableModal}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const formInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);
  const address = selectVet360ResidentialAddress(state);
  return {
    ...formInfo,
    ...address,
    showModal: newAppointment.showTypeOfCareUnavailableModal,
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showDirectScheduling: vaosDirectScheduling(state),
    showCommunityCare: vaosCommunityCare(state),
    hideUpdateAddressAlert: newAppointment.hideUpdateAddressAlert,
  };
}

export default connect(
  mapStateToProps,
  {
    ...actions,
    setReduxData(data) {
      return { type: 'FORM_SET_DATA', data };
    },
  },
)(TypeOfCarePage);
