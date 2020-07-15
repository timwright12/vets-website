import React, { Component } from 'react';
import { connect } from 'react-redux';
import { satisfies } from 'semver';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';

// eslint-disable-next-line react/prefer-stateless-function
class EmailyWidget extends Component {
  componentDidMount() {
    const { user, onChange, isLoggedIn } = this.props;
    onChange(user.profile.email);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    const { user, onChange, isLoggedIn } = nextProps;
    onChange(user.profile.email);
  }

  render() {
    // console.log({ props: this.props });
    const _user = <div>{JSON.stringify(this.props.user)}</div>;
    const { user, onChange, isLoggedIn } = this.props;

    const { onReviewPage, reviewMode } = this.props.formContext;

    if (onReviewPage && reviewMode) {
      return <>{this.props?.value}</>;
    }

    if (isLoggedIn) {
      if (onReviewPage && !reviewMode) {
        return <EmailWidget {...this.props} value={user.profile.email} />;
      }
      // onChange(user.profile.email);
      return (
        <>
          {_user}
          <br />
          <EmailWidget {...this.props} value={user.profile.email} />
          pre-popped email thing!!!
        </>
      );
    } else {
      if (onReviewPage && !reviewMode) {
        return <EmailWidget {...this.props} />;
      }

      return (
        <>
          {_user}
          <br />
          not logged in!, but you should be!
          <EmailWidget {...this.props} />
          <button
            type="button"
            onClick={() => this.props.toggleLoginModal(true, 'cta-form')}
          >
            LOGIN MORTAL
          </button>
        </>
      );
    }
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  user: state.user,
});
const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmailyWidget);
