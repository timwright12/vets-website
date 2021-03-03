import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester, // selectCheckbox
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('8940 supporting documents upload', () => {
  const opts = { showSubforms: true };
  const page = formConfig(opts).chapters.disabilities.pages
    .uploadUnemployabilitySupportingDocuments;
  const defaultDefinitions = formConfig(opts).defaultDefinitions;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={defaultDefinitions}
          schema={schema}
          data={{
            'view:unemployabilityUploadChoice': 'answerQuestions',
            'view:uploadUnemployabilitySupportingDocumentsChoice': true,
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should submit without required upload', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          onSubmit={onSubmit}
          definitions={defaultDefinitions}
          schema={schema}
          data={{
            'view:unemployabilityUploadChoice': 'answerQuestions',
            'view:uploadUnemployabilitySupportingDocumentsChoice': true,
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with uploaded documents', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          onSubmit={onSubmit}
          definitions={defaultDefinitions}
          schema={schema}
          data={{
            unemployabilitySupportingDocuments: [
              {
                confirmationCode: 'testing',
                name: '8940.pdf',
                attachmentId: 'L149',
              },
            ],
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
