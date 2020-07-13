import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../containers/App';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import SignIn from 'platform/site-wide/cta-widget/components/messages/SignIn';

import '../sass/tiki-room.scss';

class RoomWrapper extends Component {
  componentDidMount() {
    // console.log({ props: this.props, state: this.state });
  }

  render() {
    const { location, children, isLoggedIn, isLoading } = this.props;
    if (isLoading) {
      return (
        <>
          <LoadingIndicator />
        </>
      );
    } else if (isLoggedIn) {
      return (
        <>
          <App location={location}>{children}</App>
        </>
      );
    } else {
      return (
        <>
          <h1>
            There is no way to tell if the user profile is being loaded or
            not???
          </h1>
          <CallToActionWidget appId="tiki-room" />
        </>
      );
    }
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isLoading: state.featureToggles.loading,
});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomWrapper);

// export default RoomWrapper;
