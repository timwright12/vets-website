import React, { Component } from 'react';
import { connect } from 'react-redux';
import { satisfies } from 'semver';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';

// eslint-disable-next-line react/prefer-stateless-function
class EmailyWidget extends Component {
  render() {
    console.log({ props: this.props });
    const _user = <div>{JSON.stringify(this.props.user)}</div>;
    const { isLoggedIn } = this.props;
    const { onReviewPage } = this.props.formContext;

    if (onReviewPage) {
      return (
        <>
          <h3>
            you inputted ----
            {this.props?.value}
          </h3>
        </>
      );
    }

    if (isLoggedIn) {
      const { user, onChange } = this.props;

      if (user.profile?.email) {
        onChange(user.profile.email);
      }
      return (
        <>
          {_user}
          <br />
          <EmailWidget {...this.props} value={user.profile.email} />
          pre-popped email thing!!!
        </>
      );
    } else {
      return (
        <>
          {_user}
          <br />
          not logged in!, but you should be!
          <EmailWidget {...this.props} />
          <button onClick={() => this.props.toggleLoginModal(true, 'cta-form')}>
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
