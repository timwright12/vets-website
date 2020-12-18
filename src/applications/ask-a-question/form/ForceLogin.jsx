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
            <button className="usa-button-primary" onClick={handleLogin}>
              Sign in to VA.gov
            </button>
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

function ForceLogin({
  isLoggedIn,
  toggleLoginModal,
  location,
  route,
  router,
  form,
  setNextStepData
}) {
  const [formData, setFormData] = useState(readTopicFromQueryParams());
  const loginRequired = !isLoggedIn && isLoginRequired(formData);

  return (
    <SchemaForm
      // `name` and `title` are required by SchemaForm, but are only used
      // internally in the component
      name="ID Form"
      title="ID Form"
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={() => {
        const defaultFormData = form.data;
        const merged = {
          ...defaultFormData,
          topic: formData,
        };
        setNextStepData(merged);
        goToNextPage(form, location, route, router);
      }}
      onChange={data => {
        updateQueryParams(data);
        setFormData(data);
      }}
      data={formData}
    >
      {loginRequired && (
        <LoginRequiredAlert handleLogin={() => toggleLoginModal(true)} />
      )}
    </SchemaForm>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForceLogin);
