import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { mount } from 'enzyme';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import formConfig from '../../config/form';

describe('Separation location', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.separationLocation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should fail to submit for BDD separation dates when no separation location is entered', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          serviceInformation: {
            servicePeriods: [
              {
                dateRange: {
                  to: moment()
                    .add(90, 'days')
                    .format('YYYY-MM-DD'),
                },
              },
            ],
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit for non BDD separation dates when no separation location is entered', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
