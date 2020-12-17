import React, { useState } from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import * as topic from './inquiry/topic/topic';
import fullSchema from './0873-schema.json';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

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

function ForceLogin({toggleLoginModal}) {
  const [formData, setFormData] = useState();
  const loginRequired = true;

  return (
    <SchemaForm
      // `name` and `title` are required by SchemaForm, but are only used
      // internally in the component
      name="ID Form"
      title="ID Form"
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={() => {}}
      onChange={setFormData}
      data={formData}
    >
      {loginRequired && (
        <LoginRequiredAlert handleLogin={() => toggleLoginModal(true)} />
      )}
    </SchemaForm>
  );
}


const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(null, mapDispatchToProps)(ForceLogin);