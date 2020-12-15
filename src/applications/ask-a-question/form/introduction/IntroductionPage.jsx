import React, { useState } from 'react';

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

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Contact Us" />
        <p>Equal to VA Form 0873 (Ask a Question).</p>
        <TopicSelection />
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

export default IntroductionPage;

function getTopics(levelTwo) {
  return valuesByLabelLookup[levelTwo]
    ? valuesByLabelLookup[levelTwo].map(label => ({
        label,
        value: label,
      }))
    : [];
}

function TopicSelection() {
  const [levelOne, setLevelOne] = useState();
  const [levelTwo, setLevelTwo] = useState();
  const [levelThree, setLevelThree] = useState();

  const levelOneTopics = levelOneTopicLabels.map(label => ({
    label,
    value: label,
  }));

  const levelTwoTopics = getTopics(levelOne);

  const levelThreeTopics = getTopics(levelTwo);

  return (
    <div>
      <SelectWidget
        schema={{}}
        value={levelOne}
        onChange={value => setLevelOne(value)}
        options={{ enumOptions: levelOneTopics }}
      />
      <SelectWidget
        schema={{}}
        value={levelTwo}
        onChange={value => setLevelTwo(value)}
        options={{ enumOptions: levelTwoTopics }}
      />
      <SelectWidget
        schema={{}}
        value={levelThree}
        onChange={value => setLevelThree(value)}
        options={{ enumOptions: levelThreeTopics }}
      />
    </div>
  );
}
