import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

const DaysTillExpires = props => {
  const { appointment, onChange } = props;
  const appointmentDetails =
    appointment?.attributes?.vdsAppointments &&
    appointment.attributes.vdsAppointments[0];
  let diff = 0;
  useEffect(
    () => {
      setTimeout(() => {
        onChange(diff);
      }, 2000);
    },
    [diff, onChange],
  );
  if (appointmentDetails) {
    const { appointmentTime } = appointmentDetails;
    const x = moment(appointmentTime);
    const y = moment();
    diff = x.diff(y, 'days') + 1;
    // console.log({ props });

    return (
      <section>
        <h2>
          appointment time is : {appointmentTime} and diff is {diff}
        </h2>
      </section>
    );
  } else {
    return <>...</>;
  }
};

const mapStateToProps = state => ({
  appointment: state?.questionnaireData?.context?.appointment,
});

export default connect(
  mapStateToProps,
  null,
)(DaysTillExpires);
