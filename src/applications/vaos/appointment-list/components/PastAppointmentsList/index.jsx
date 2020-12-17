import React from 'react';
import useSWR from 'swr';
import {
  getVAAppointmentLocationId,
  isValidPastAppointment,
  sortByDateDescending,
  getBookedAppointments,
} from '../../../services/appointment';
import { getAdditionalFacilityInfo } from '../../redux/actions';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { APPOINTMENT_TYPES } from '../../../utils/constants';
import ConfirmedAppointmentListItem from '../cards/confirmed/ConfirmedAppointmentListItem';

export default function PastAppointmentsList() {
  const startOfToday = moment().startOf('day');

  // pastAppointments, error, and isValidating (loading status) come from swr
  // instead of our redux state.  We also call getBookedAppointments directly
  // instead going through our action creator
  const { data: pastAppointments = [], error, isValidating } = useSWR(
    'pastAppointments',
    () =>
      getBookedAppointments(
        startOfToday
          .clone()
          .subtract(3, 'months')
          .format(),
        startOfToday
          .clone()
          .subtract(3, 'months')
          .format(),
      ),
  );

  // Once our appointments are fetched, fetch additional facility info.  SWR
  // knows that this facilityData call is dependent on pastAppointments because
  // a function is passed as the first parameter.  A falsy return value will
  // prevent this fetch from occurring
  const { data: facilityData } = useSWR(
    () => (pastAppointments ? 'pastAppointmentsFacilityInfo' : null),
    () => getAdditionalFacilityInfo(pastAppointments),
  );

  return (
    <div role="tabpanel" aria-labelledby="tabpast" id="tabpanelpast">
      <h2 tabIndex="-1" id="pastAppts" className="vads-u-font-size--h3">
        Past appointments
      </h2>

      {error && (
        <AlertBox
          status="error"
          headline="We’re sorry. We’ve run into a problem"
        >
          We’re having trouble getting your past appointments. Please try again
          later.
        </AlertBox>
      )}

      {isValidating && (
        <div className="vads-u-margin-y--8">
          <LoadingIndicator message="Loading your appointments..." />
        </div>
      )}

      {pastAppointments.length > 0 && (
        <ul className="usa-unstyled-list" id="appointments-list">
          {pastAppointments
            .filter(isValidPastAppointment)
            .sort(sortByDateDescending)
            .map((appt, index) => {
              switch (appt.vaos?.appointmentType) {
                case APPOINTMENT_TYPES.ccAppointment:
                case APPOINTMENT_TYPES.vaAppointment:
                  return (
                    <ConfirmedAppointmentListItem
                      key={index}
                      index={index}
                      appointment={appt}
                      facility={
                        facilityData?.[getVAAppointmentLocationId(appt)]
                      }
                    />
                  );
                default:
                  return null;
              }
            })}
        </ul>
      )}

      {!error &&
        pastAppointments === 0 && (
          <h3 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
            You don’t have any appointments in the selected date range
          </h3>
        )}
    </div>
  );
}
