import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import VAFacilityPage from '../../containers/VAFacilityPage';
import { fireEvent } from '@testing-library/dom';
import { getParentSiteMock, getFacilityMock } from '../mocks/v0';
import { createTestStore, setTypeOfCare } from '../mocks/form';
import { mockEligibilityFetches } from '../mocks/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
  },
  user: {
    profile: {
      facilities: [
        {
          facilityId: '983',
          isCerner: false,
        },
        {
          facilityId: '984',
          isCerner: false,
        },
      ],
    },
  },
};

describe.only('VAOS integration: VA facility page', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show VA sites and facilities questions', async () => {
    const parentSiteMock = getParentSiteMock();
    const parentSites = [
      {
        ...parentSiteMock,
        id: '983',
        attributes: {
          ...parentSiteMock.attributes,
          institutionCode: '983',
          authoritativeName: 'Some VA facility',
          rootStationCode: '983',
          adminParent: true,
          parentStationCode: '983',
        },
      },
      {
        ...parentSiteMock,
        id: '984',
        attributes: {
          ...parentSiteMock.attributes,
          institutionCode: '984',
          authoritativeName: 'Some other VA facility',
          rootStationCode: '984',
          adminParent: true,
          parentStationCode: '984',
        },
      },
    ];
    setFetchJSONResponse(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/facilities?facility_codes[]=983&facility_codes[]=984`,
      ),
      { data: parentSites },
    );

    const facility = getFacilityMock();
    facility.attributes = {
      ...facility.attributes,
      institutionCode: '984',
      city: 'Bozeman',
      stateAbbrev: 'MT',
      authoritativeName: 'Bozeman VA medical center',
      rootStationCode: '984',
      parentStationCode: '984',
      requestSupported: true,
      directSchedulingSupported: false,
    };
    facility.id = '984';

    setFetchJSONResponse(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/systems/984/direct_scheduling_facilities?type_of_care_id=323&parent_code=984`,
      ),
      { data: [facility] },
    );
    mockEligibilityFetches({
      siteId: '984',
      facilityId: '984',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const {
      findByText,
      getByLabelText,
      findByLabelText,
    } = renderInReduxProvider(<VAFacilityPage />, {
      store,
    });

    await findByText(/registered at the following VA/i);

    expect(getByLabelText(/some other va facility/i)).to.have.attribute(
      'value',
      'var984',
    );
    expect(getByLabelText(/some va facility/i)).to.have.attribute(
      'value',
      'var983',
    );

    fireEvent.click(getByLabelText(/some other va facility/i));

    fireEvent.click(await findByLabelText(/Bozeman VA medical center/));

    console.log(global.fetch.getCalls().map(c => c.args[0]));
  });
});
