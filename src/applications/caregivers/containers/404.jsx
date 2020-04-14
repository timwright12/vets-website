import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const Caregivers404 = () => (
  <AlertBox
    className="vads-u-margin-bottom--7"
    headline="Sorry Caregivers 10-10CG is currently not available"
    status="error"
  >
    <p>Please apply via mail, find additional at the page below:</p>
    <a href="https://www.va.gov/health-care/family-caregiver-benefits/comprehensive-assistance/">
      The Program of Comprehensive Assistance for Family Caregivers
    </a>
  </AlertBox>
);

export default Caregivers404;
