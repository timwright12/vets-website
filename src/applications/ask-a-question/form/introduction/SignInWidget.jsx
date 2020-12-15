import React from 'react';
import SignInLink from 'platform/forms/components/SignInLink';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';

function SignInWidget({ toggleLoginModal, showLoginModal }) {
  return (
    <SignInLink
      toggleLoginModal={toggleLoginModal}
      showLoginModal={showLoginModal}
    >
      {'Click here u b'}
    </SignInLink>
  );
}

const mapStateToProps = state => ({
  showLoginModal: state.navigation.showLoginModal,
  loggedIn: state.user.login.currentlyLoggedIn,
});

const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInWidget);
