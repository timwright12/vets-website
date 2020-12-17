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

function requiresAuth({ levelOne, levelTwo, levelThree }) {
  return levelOne === 'Education/ GI Bill';
}

function updateQueryParams(topic) {
  const levelOne = encodeURIComponent(topic.levelOne);
  const levelTwo = encodeURIComponent(topic.levelTwo);
  const levelThree = encodeURIComponent(topic.levelThree);
  const newUrl = `${
    window.location.pathname
  }?levelOne=${levelOne}&levelTwo=${levelTwo}&levelThree=${levelThree}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

function readTopicFromQueryParams() {
  const params = new URL(document.location).searchParams;
  return {
    levelOne: params.get('levelOne'),
    levelTwo: params.get('levelTwo'),
    levelThree: params.get('levelThree'),
  };
}

function UnconnectedTopicSelection({ children, setTopics, data }) {
  const [topics, changeTopics] = useState(readTopicFromQueryParams());

  const levelOneTopics = levelOneTopicLabels.map(label => ({
    label,
    value: label,
  }));

  const levelTwoTopics = getTopics(topics.levelOne);

  const levelThreeTopics = getTopics(topics.levelTwo);

  const needAuth = requiresAuth(topics);

  function updateTopics(topicLevel) {
    const newState = { ...topics, ...topicLevel };
    setTopics(newState, data);
    changeTopics(newState);
    updateQueryParams(newState);
  }

  return (
    <div>
      <TopicLevel
        label="Which category best describes your message?"
        value={topics.levelOne}
        onChange={value => updateTopics({ levelOne: value })}
        topics={levelOneTopics}
      />
      <TopicLevel
        label="Which topic best describes your message?"
        value={topics.levelTwo}
        onChange={value => updateTopics({ levelTwo: value })}
        topics={levelTwoTopics}
      />
      {levelThreeTopics.length > 0 && (
        <TopicLevel
          label="Which subtopic best describes your message?"
          value={topics.levelThree}
          onChange={value => updateTopics({ levelThree: value })}
          topics={levelThreeTopics}
        />
      )}
      {needAuth && <SignInWidget />}
      {!needAuth && children}
    </div>
  );
}

const mapDispatchToProps = { setTopics };
const mapStateToProps = state => {
  return { data: state.form.data };
};
const TopicSelection = connect(
  mapStateToProps,
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
