import React from 'react';
import IntroductionPage from '../../../../form/introduction/IntroductionPage';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { screen } from '@testing-library/react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

describe('Introduction Page', () => {
  it('should show a loading indicator while waiting on profile to load', () => {
    const container = renderInReduxProvider(<IntroductionPage />);

    container.getByRole('progressbar');
  });

  it('should show the start button when profile is finished loading');
});
