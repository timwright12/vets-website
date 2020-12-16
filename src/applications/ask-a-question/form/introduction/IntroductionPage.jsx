import React, { useState } from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { unauthStartText } from '../../constants/labels';
import SelectWidget from 'platform/forms-system/src/js/widgets/SelectWidget';
import {
  levelOneTopicLabels,
  valuesByLabelLookup,
} from '../inquiry/topic/topic';
import SignInWidget from './SignInWidget';
import { setTopicState } from './topicState';
import { setTopics } from './actions';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Contact Us" />
        <p>Equal to VA Form 0873 (Ask a Question).</p>
        <TopicSelection>
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
        </TopicSelection>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={10} ombNumber="2900-0619" expDate="11/30/2019" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;

function getTopics(levelTwo) {
  return valuesByLabelLookup[levelTwo]
    ? valuesByLabelLookup[levelTwo].map(label => ({
        label,
        value: label,
      }))
    : [];
}

function saveTopics(levelOne, levelTwo, levelThree) {
  setTopicState({ levelOne, levelTwo, levelThree });
}

function requiresAuth(levelOne, levelTwo, levelThree) {
  return levelOne === 'Education/ GI Bill';
}

function UnconnectedTopicSelection({ children, setTopics }) {
  const [levelOne, setLevelOne] = useState();
  const [levelTwo, setLevelTwo] = useState();
  const [levelThree, setLevelThree] = useState();

  const levelOneTopics = levelOneTopicLabels.map(label => ({
    label,
    value: label,
  }));

  const levelTwoTopics = getTopics(levelOne);

  const levelThreeTopics = getTopics(levelTwo);

  const needAuth = requiresAuth(levelOne, levelTwo, levelThree);

  function updateLevelOne(value) {
    setTopics({ levelOne: value, levelTwo, levelThree });
    setLevelOne(value);
  }

  return (
    <div>
      <TopicLevel
        label="Which category best describes your message?"
        value={levelOne}
        onChange={updateLevelOne}
        topics={levelOneTopics}
      />
      <TopicLevel
        label="Which topic best describes your message?"
        value={levelTwo}
        onChange={setLevelTwo}
        topics={levelTwoTopics}
      />
      {levelThreeTopics.length > 0 && (
        <TopicLevel
          label="Which subtopic best describes your message?"
          value={levelThree}
          onChange={setLevelThree}
          topics={levelThreeTopics}
        />
      )}
      {needAuth && <SignInWidget />}
      {!needAuth && children}
    </div>
  );
}

const mapDispatchToProps = { setTopics };
const TopicSelection = connect(
  null,
  mapDispatchToProps,
)(UnconnectedTopicSelection);

function TopicLevel({ label, value, onChange, topics }) {
  return (
    <>
      <label>{label}</label>
      <SelectWidget
        schema={{}}
        value={value}
        onChange={onChange}
        options={{ enumOptions: topics }}
      />
    </>
  );
}
