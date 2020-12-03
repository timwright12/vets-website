import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const AppointmentId = props => {
  const { appointment, onChange } = props;
  const { id } = appointment;
  // console.log({ props });
  useEffect(
    () => {
      if (id) {
        setTimeout(() => {
          onChange(id);
        }, 1000);
      }
    },
    [onChange, id],
  );
  if (id) {
    return (
      <section>
        <h2>appointment id is {appointment.id}</h2>
      </section>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = state => ({
  appointment: state?.questionnaireData?.context?.appointment,
});

export default connect(
  mapStateToProps,
  null,
)(AppointmentId);
