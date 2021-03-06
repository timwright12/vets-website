import React from 'react';

export default function AppointmentInstructions({ instructions }) {
  if (!instructions) {
    return null;
  }

  const [header, body] = instructions.split(': ', 2);

  return (
    <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
      <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
        {header}
      </h5>
      <div>{body}</div>
    </div>
  );
}
