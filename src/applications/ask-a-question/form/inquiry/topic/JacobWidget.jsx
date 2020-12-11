import React from 'react';
import SignInLink from 'platform/forms/components/SignInLink';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';

class JacobWidget extends React.Component {
  componentDidMount() {}

  render() {
    if (this.props.loggedIn) {
      this.props.onChange('I am logged in');
      return null;
    }
    return (
      <SignInLink
        toggleLoginModal={this.props.toggleLoginModal}
        showLoginModal={this.props.showLoginModal}
        onLogin={() => {
          alert('Hello World');
        }}
      >
        {'Click here u b'}
      </SignInLink>
    );
  }
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
)(JacobWidget);
