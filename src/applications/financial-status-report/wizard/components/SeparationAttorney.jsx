import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const SeparationAttorney = () => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, this isn’t the form you need.
      </p>
      <p>
        <strong>
          For help with debt related to{' '}
          <span className="separation-pay">[separation pay/attorney fees]</span>
        </strong>
        , call us at <Telephone contact={'800-827-1000'} />. We're here Monday
        through Friday, 8:00 a.m. to 8:00 p.m. ET. If you have hearing loss,
        call TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />.
      </p>
    </div>
  );
};

export default SeparationAttorney;
