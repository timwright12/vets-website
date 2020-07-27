/* eslint-disable no-console */
import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

const AuthRecommendedFullNameWidget = props => {
  console.log({ props });
  const { user, onChange, isLoggedIn } = props;

  const { onReviewPage, reviewMode } = props.formContext;

  const fullName = user.profile.userFullName.first
    ? `${user.profile.userFullName.first} ${user.profile.userFullName.last}`
    : '';

  useEffect(
    () => {
      console.log('changed!', fullName);
      onChange(fullName);
    },
    [fullName, onChange],
  );

  if (onReviewPage && reviewMode) {
    return <>{fullName}</>;
  }

  if (isLoggedIn) {
    if (onReviewPage && !reviewMode) {
      return <TextWidget {...props} value={fullName} />;
    }
    return (
      <>
        <br />
        <TextWidget {...props} value={fullName} />
      </>
    );
  } else {
    if (onReviewPage && !reviewMode) {
      return <TextWidget {...props} />;
    }

    return (
      <>
        <br />
        <em>
          We noticed you are not logged in. Thats is okay, but if you do log in
          we might be able to fill out parts of this form for you.{' '}
        </em>
        <button
          type="button"
          onClick={() => props.toggleLoginModal(true, 'cta-form')}
        >
          LOGIN NOW{' '}
          <span role="img" aria-label="Smiling face!">
            😁
          </span>
        </button>
        <em>
          If you don't have an account, that's okay! You can still fill out the
          form
        </em>
        <label htmlFor="">Full Name</label>
        <TextWidget {...props} />
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
)(AuthRecommendedFullNameWidget);
