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

describe('781 record upload', () => {
  const page = formConfig().chapters.disabilities.pages.uploadPtsdDocuments781;
  const defaultDefinitions = formConfig().defaultDefinitions;
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
            'view:selectablePtsdTypes': {
              'view:combatPtsdType': true,
            },
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should not submit without required upload', () => {
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
            'view:selectablePtsdTypes': {
              'view:combatPtsdType': true,
            },
          }}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with uploaded form', () => {
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
            form781Upload: [
              {
                confirmationCode: 'testing',
                name: '781.pdf',
                attachmentId: 'L228',
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
