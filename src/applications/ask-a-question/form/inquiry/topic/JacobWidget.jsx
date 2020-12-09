import React from 'react';
import SignInLink from 'platform/forms/components/SignInLink';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';

class JacobWidget extends React.Component {
  componentDidMount() {}

  render() {
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
});

const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JacobWidget);
