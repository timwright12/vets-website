import React, { Component } from 'react';
import { connect } from 'react-redux';
import { satisfies } from 'semver';

// eslint-disable-next-line react/prefer-stateless-function
class EmailWidget extends Component {
  render() {
    // console.log(this.props);
    return <div>{JSON.stringify(this.props.user)}</div>;
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  user: state.user,
});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmailWidget);
