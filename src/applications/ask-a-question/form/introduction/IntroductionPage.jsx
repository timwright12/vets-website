import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormStartControls from 'platform/forms/save-in-progress/FormStartControls';
import {
  fetchInProgressForm,
  removeInProgressForm,
} from 'platform/forms/save-in-progress/actions';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    // const profile = this.props.user?.profile;
    // const prefillAvailable = !!(
    //   profile && profile.prefillsAvailable.includes(this.props.formId)
    // );

    return (
      <div className="schemaform-intro">
        <FormTitle title="Contact Us" />
        <p>Equal to VA Form 0873 (Ask a Question).</p>
        {/* {profile.loading && (
          <div>
            <LoadingIndicator message={'loading'} />
            <br />
          </div>
        )} */}
        {/* <FormStartControls
          startPage={'/topic'}
          formId={this.props.route.formConfig.formId}
          fetchInProgressForm={this.props.fetchInProgressForm}
          removeInProgressForm={this.props.removeInProgressForm}
          prefillAvailable={prefillAvailable}
          formSaved={false}
        /> */}
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={10} ombNumber="2900-0619" expDate="11/30/2019" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // ...getIntroState(state),
  };
}
const mapDispatchToProps = {
  fetchInProgressForm,
  removeInProgressForm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
