/* eslint-disable no-console */
import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';

const AuthRecommendedWidget = props => {
  console.log({ props });
  const { user, onChange, isLoggedIn } = props;

  const { onReviewPage, reviewMode } = props.formContext;

  useEffect(
    () => {
      console.log('changed! - email', user.profile.email);
      onChange(user.profile.email);
    },
    [user.profile.email, onChange],
  );

  if (onReviewPage && reviewMode) {
    return <>{props?.value}</>;
  }

  if (isLoggedIn) {
    if (onReviewPage && !reviewMode) {
      return <EmailWidget {...props} value={user.profile.email} />;
    }
    return (
      <>
        <br />
        <EmailWidget {...props} value={user.profile.email} />
      </>
    );
  } else {
    if (onReviewPage && !reviewMode) {
      return <EmailWidget {...props} />;
    }

    return (
      <>
        <br />

        <EmailWidget {...props} />
        {/* <em>
          We noticed you are not logged in. Thats is okay, but if you do log in
          we might be able to fill out parts of this form for you.{' '}
        </em>
        <button
          type="button"
          onClick={() => props.toggleLoginModal(true, 'cta-form')}
        >
          LOGIN now
        </button> */}
      </>
    );
  }
};

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
)(AuthRecommendedWidget);
