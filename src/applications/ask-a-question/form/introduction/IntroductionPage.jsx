import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import SignInLink from 'platform/forms/components/SignInLink';
import { unauthStartText } from '../../constants/labels';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { connect } from 'react-redux';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Contact Us" />
        <p>Equal to VA Form 0873 (Ask a Question).</p>
        <SignInLink
          toggleLoginModal={this.props.toggleLoginModal}
          showLoginModal={this.props.showLoginModal}
        >
          click here u b
        </SignInLink>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          formConfig={{
            customText: this.props.route.formConfig.customText,
          }}
          unauthStartText={unauthStartText}
        >
          Please complete the 0873 form to send a message.
        </SaveInProgressIntro>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={10} ombNumber="2900-0619" expDate="11/30/2019" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showLoginModal: state.navigation.showLoginModal,
});

const mapDispatchToProps = {
  toggleLoginModal,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
