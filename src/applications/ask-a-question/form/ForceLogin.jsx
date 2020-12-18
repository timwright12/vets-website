import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import * as topic from './inquiry/topic/topic';
import fullSchema from './0873-schema.json';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { isLoggedIn } from 'platform/user/selectors';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import { fetchInProgressForm } from '../../../platform/forms/save-in-progress/actions';
import SelectWidget from 'platform/forms-system/src/js/widgets/SelectWidget';
import {
  levelOneTopicLabels,
  valuesByLabelLookup,
} from './inquiry/topic/topic';
import { submitForm } from '../../../platform/forms-system/src/js/actions';

const schema = topic.schema(fullSchema);

schema.definitions = {
  ssn: {
    type: 'string',
    pattern: '^[0-9]{9}$',
  },
};

const uiSchema = topic.uiSchema();

function LoginRequiredAlert({ handleLogin }) {
  return (
    <>
      <AlertBox
        isVisible
        status="error"
        headline="Please sign in to review your information"
        content={
          <>
            <p>You gotta log in, gurl.</p>
            <a className="usa-button-primary" onClick={handleLogin}>
              Sign in to VA.gov
            </a>
          </>
        }
      />
      <br />
    </>
  );
}

function isLoginRequired(formData) {
  return formData?.levelOne === 'Education/ GI Bill';
}

const goToNextPage = (form, location, route, router) => {
  const nextPagePath = getNextPagePath(
    route.pageList,
    form.data,
    location.pathname,
  );
  router.push(nextPagePath);
};

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
    levelOne: params.get('levelOne') || '',
    levelTwo: params.get('levelTwo') || '',
    levelThree: params.get('levelThree') || '',
  };
}

function getTopics(levelTwo) {
  return valuesByLabelLookup[levelTwo]
    ? valuesByLabelLookup[levelTwo].map(label => ({
        label,
        value: label,
      }))
    : [];
}

function setTopicForForm(topic) {
  return async (dispatch, getState) => {
    if (isLoggedIn(getState())) {
      await dispatch(fetchInProgressForm('0873', [], true));
    }

    const defaultFormData = getState().form.data;
    const merged = {
      ...defaultFormData,
      topic,
    };
    dispatch(setData(merged));
  };
}

function ForceLogin({
  isLoggedIn,
  toggleLoginModal,
  location,
  route,
  router,
  form,
  setNextStepData,
  setTopicForForm,
}) {
  const [topic, setTopic] = useState(readTopicFromQueryParams());
  const loginRequired = !isLoggedIn && isLoginRequired(topic);

  function updateTopics(topicLevel) {
    const data = { ...topic, ...topicLevel };
    updateQueryParams(data);
    setTopic(data);
  }

  const levelOneTopics = levelOneTopicLabels.map(label => ({
    label,
    value: label,
  }));

  const levelTwoTopics = getTopics(topic.levelOne);

  const levelThreeTopics = getTopics(topic.levelTwo);

  function onSubmit() {
    setTopicForForm(topic);
    goToNextPage(form, location, route, router);
  }

  return (
    <div>
      <TopicLevel
        label="Which category best describes your message?"
        value={topic.levelOne}
        onChange={value => updateTopics({ levelOne: value })}
        topics={levelOneTopics}
      />
      <TopicLevel
        label="Which topic best describes your message?"
        value={topic.levelTwo}
        onChange={value => updateTopics({ levelTwo: value })}
        topics={levelTwoTopics}
      />
      {levelThreeTopics.length > 0 && (
        <TopicLevel
          label="Which subtopic best describes your message?"
          value={topic.levelThree}
          onChange={value => updateTopics({ levelThree: value })}
          topics={levelThreeTopics}
        />
      )}
      {!loginRequired && <button onClick={onSubmit}>Ask your question</button>}
      {loginRequired && (
        <LoginRequiredAlert handleLogin={() => toggleLoginModal(true)} />
      )}
    </div>
  );

  // return (
  //   <SchemaForm
  //     // `name` and `title` are required by SchemaForm, but are only used
  //     // internally in the component
  //     name="ID Form"
  //     title="ID Form"
  //     schema={schema}
  //     uiSchema={uiSchema}
  //     onSubmit={() => {
  //       setTopicForForm(topic);
  //       goToNextPage(form, location, route, router);
  //     }}
  //     onChange={data => {
  //       updateQueryParams(data);
  //       setTopic(data);
  //     }}
  //     data={topic}
  //   >
  //     {loginRequired && (
  //       <LoginRequiredAlert handleLogin={() => toggleLoginModal(true)} />
  //     )}
  //   </SchemaForm>
  // );
}

function TopicLevel({ label, value, onChange, topics }) {
  return (
    <>
      <label>{label}</label>
      <SelectWidget
        schema={{}}
        value={value}
        onChange={onChange}
        onBlur={() => {}}
        options={{ enumOptions: topics }}
      />
    </>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: isLoggedIn(state),
    form: state.form,
  };
};

const mapDispatchToProps = {
  toggleLoginModal,
  setNextStepData: setData,
  setTopicForForm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForceLogin);
