import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { fetchProfile, setPageTitle, showModal, hideModal } from '../actions';
import VetTecInstitutionProfile from '../components/vet-tec/VetTecInstitutionProfile';
import InstitutionProfile from '../components/profile/InstitutionProfile';
import ServiceError from '../components/ServiceError';

const { Element: ScrollElement, scroller } = Scroll;

export class ProfilePage extends React.Component {
  componentDidMount() {
    this.props.fetchProfile(
      this.props.params.facilityCode,
      this.props.location.query.version,
    );
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: { version: uuid },
      },
      params: { facilityCode },
      profile,
    } = this.props;

    const institutionName = _.get(profile, 'attributes.name');
    const shouldUpdateTitle = !_.isEqual(
      institutionName,
      prevProps?.profile?.attributes?.name,
    );

    if (shouldUpdateTitle) {
      this.props.setPageTitle(`${institutionName} - GI Bill® Comparison Tool`);
    }

    if (profile.inProgress !== prevProps.profile.inProgress) {
      scroller.scrollTo('profilePage', getScrollOptions());
      focusElement('.profile-page h1');
    }

    if (prevProps.location.query.version !== uuid) {
      this.props.fetchProfile(facilityCode, uuid);
    }
  }

  componentWillUnmount() {
    this.props.hideModal();
  }

  handleViewWarnings = () => {
    this._cautionaryInfo.setState({ expanded: true });
    focusElement('#viewWarnings');
  };

  render() {
    const { constants, profile } = this.props;

    let content;

    if (profile.inProgress || _.isEmpty(profile.attributes)) {
      content = <LoadingIndicator message="Loading your profile..." />;
    } else {
      const isOJT = profile.attributes.type.toLowerCase() === 'ojt';

      if (profile.attributes.vetTecProvider) {
        content = (
          <VetTecInstitutionProfile
            institution={profile.attributes}
            showModal={this.props.showModal}
            preSelectedProgram={this.props.params.preSelectedProgram}
            selectedProgram={this.props.calculator.selectedProgram}
          />
        );
      } else {
        content = (
          <InstitutionProfile
            profile={profile}
            isOJT={isOJT}
            constants={constants}
            showModal={this.props.showModal}
            calculator={this.props.calculator}
            eligibility={this.props.eligibility}
            version={this.props.location.query.version}
            gibctEybBottomSheet={this.props.gibctEybBottomSheet}
            gibctFilterEnhancement={this.props.gibctFilterEnhancement}
          />
        );
      }
    }

    return (
      <ScrollElement
        name="profilePage"
        className="profile-page vads-u-padding-top--3"
      >
        {profile.error ? <ServiceError /> : content}
      </ScrollElement>
    );
  }
}

const mapStateToProps = state => {
  const {
    constants: { constants },
    profile,
    calculator,
    eligibility,
  } = state;
  return {
    constants,
    profile,
    calculator,
    eligibility,
    gibctEybBottomSheet: toggleValues(state)[
      FEATURE_FLAG_NAMES.gibctEybBottomSheet
    ],
    gibctFilterEnhancement: toggleValues(state)[
      FEATURE_FLAG_NAMES.gibctFilterEnhancement
    ],
  };
};

const mapDispatchToProps = {
  fetchProfile,
  setPageTitle,
  showModal,
  hideModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfilePage);
