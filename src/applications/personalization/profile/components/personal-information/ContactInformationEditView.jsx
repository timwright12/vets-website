import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from '~/platform/monitoring/record-event';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import { focusElement } from '~/platform/utilities/ui';

import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  updateFormFieldWithSchema,
  openModal,
  validateAddress,
} from '@@vap-svc/actions';

import * as VAP_SERVICE from '@@vap-svc/constants';

import {
  isFailedTransaction,
  isPendingTransaction,
} from '@@vap-svc/util/transactions';
import VAPServiceEditModalErrorMessage from '@@vap-svc/components/base/VAPServiceEditModalErrorMessage';
import ContactInformationActionButtons from './ContactInformationActionButtons';
import CopyMailingAddress from '@@vap-svc/containers/CopyMailingAddress';
import ContactInfoForm from '@@vap-svc/components/ContactInfoForm';

import {
  selectCurrentlyOpenEditModal,
  selectEditedFormField,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
  selectEditViewData,
} from '@@vap-svc/selectors';

import { transformInitialFormValues } from '@@profile/util/contact-information';

import { FIELD_NAMES, USA } from '@@vap-svc/constants';

class ContactInformationEditView extends Component {
  static propTypes = {
    analyticsSectionName: PropTypes.string.isRequired,
    deleteDisabled: PropTypes.bool,
    field: PropTypes.shape({
      value: PropTypes.object,
      validations: PropTypes.object,
    }),
    uiSchema: PropTypes.object,
    formSchema: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    refreshTransaction: PropTypes.func,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    transaction: PropTypes.object,
    transactionRequest: PropTypes.object,
    convertCleanDataToPayload: PropTypes.func,
  };

  componentDidMount() {
    this.onChangeFormDataAndSchemas(
      this.props.getInitialFormValues(),
      this.props.formSchema,
      this.props.uiSchema,
    );
  }

  componentDidUpdate(prevProps) {
    // if the transaction just became pending, start calling the
    // refreshTransaction() on an interval
    if (
      isPendingTransaction(this.props.transaction) &&
      !isPendingTransaction(prevProps.transaction)
    ) {
      this.interval = window.setInterval(
        this.props.refreshTransaction,
        window.VetsGov.pollTimeout || 1000,
      );
    }
    // if the transaction is no longer pending, stop refreshing it
    if (
      isPendingTransaction(prevProps.transaction) &&
      !isPendingTransaction(this.props.transaction)
    ) {
      window.clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    // Errors returned directly from the API request (as opposed through a transaction lookup) are
    // displayed in this modal, rather than on the page. Once the modal is closed, reset the state
    // for the next time the modal is opened by removing any existing transaction request from the store.
    if (this.props.transactionRequest?.error) {
      this.props.clearTransactionRequest(this.props.fieldName);
    }

    // AS DONE IN ADDRESSEDITVIEW, CHECK FOR CORRECTNESS
    if (this.props.fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS) {
      focusElement(`#${this.props.fieldName}-edit-link`);
    }
  }

  captureEvent(actionName) {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': actionName,
      'profile-section': this.props.analyticsSectionName,
    });
  }

  onSubmit = () => {
    const {
      convertCleanDataToPayload,
      fieldName,
      analyticsSectionName,
      apiRoute,
      field,
    } = this.props;
    if (!fieldName.toLowerCase().includes('address')) {
      this.captureEvent('update-button');
    }

    let payload = field.value;
    if (convertCleanDataToPayload) {
      payload = convertCleanDataToPayload(payload, fieldName);
    }

    const method = payload.id ? 'PUT' : 'POST';

    if (fieldName.toLowerCase().includes('address')) {
      this.props.validateAddress(
        apiRoute,
        method,
        fieldName,
        payload,
        analyticsSectionName,
      );
      return;
    }

    this.props.createTransaction(
      apiRoute,
      method,
      fieldName,
      payload,
      analyticsSectionName,
    );
  };

  onInput = (value, schema, uiSchema) => {
    const newFieldValue = {
      ...value,
    };
    if (newFieldValue['view:livesOnMilitaryBase']) {
      newFieldValue.countryCodeIso3 = USA.COUNTRY_ISO3_CODE;
    }
    this.onChangeFormDataAndSchemas(newFieldValue, schema, uiSchema);
  };

  onChangeFormDataAndSchemas = (value, schema, uiSchema) => {
    this.props.updateFormFieldWithSchema(
      this.props.fieldName,
      value,
      schema,
      uiSchema,
    );
  };

  onDelete = () => {
    let payload = this.props.data;
    if (this.props.convertCleanDataToPayload) {
      payload = this.props.convertCleanDataToPayload(
        payload,
        this.props.fieldName,
      );
    }
    this.props.createTransaction(
      this.props.apiRoute,
      'DELETE',
      this.props.fieldName,
      payload,
      this.props.analyticsSectionName,
    );
  };

  copyMailingAddress = mailingAddress => {
    const newAddressValue = { ...this.props.field.value, ...mailingAddress };
    this.onChangeFormDataAndSchemas(
      transformInitialFormValues(newAddressValue),
      this.props.field.formSchema,
      this.props.field.uiSchema,
    );
  };

  render() {
    const {
      onSubmit,
      props: {
        analyticsSectionName,
        data,
        deleteDisabled,
        field,
        hasUnsavedEdits,
        onCancel,
        onDelete,
        type,
        title,
        transaction,
        transactionRequest,
        fieldName,
      },
    } = this;

    const isLoading =
      transactionRequest?.isPending || isPendingTransaction(transaction);
    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    const actionButtons = (
      <ContactInformationActionButtons
        onCancel={onCancel}
        onDelete={onDelete}
        title={title}
        analyticsSectionName={analyticsSectionName}
        isLoading={isLoading}
        deleteEnabled={data && !deleteDisabled}
      >
        <div>
          <LoadingButton
            data-action="save-edit"
            data-testid="save-edit-button"
            isLoading={isLoading}
            className="vads-u-width--auto vads-u-margin-top--0"
            disabled={!hasUnsavedEdits}
          >
            Update
          </LoadingButton>

          {!isLoading && (
            <button
              type="button"
              className="usa-button-secondary vads-u-margin-top--0 vads-u-width--auto"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </ContactInformationActionButtons>
    );

    return (
      <>
        {error && (
          <div
            className="vads-u-margin-bottom--1"
            data-testid="edit-error-alert"
          >
            <VAPServiceEditModalErrorMessage
              title={title}
              error={error}
              clearErrors={this.props.clearTransactionRequest(fieldName)}
            />
          </div>
        )}

        {!!field && (
          <div>
            {fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS && (
              <CopyMailingAddress
                copyMailingAddress={this.copyMailingAddress}
              />
            )}
            <ContactInfoForm
              formData={field.value}
              formSchema={field.formSchema}
              uiSchema={field.uiSchema}
              onUpdateFormData={
                type === 'address'
                  ? this.onInput
                  : this.onChangeFormDataAndSchemas
              }
              onSubmit={onSubmit}
            >
              {actionButtons}
            </ContactInfoForm>
          </div>
        )}
      </>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    fieldName,
  );
  const data = selectVAPContactInfoField(state, fieldName);
  // const addressValidationType = selectAddressValidationType(state);
  const activeEditView = selectCurrentlyOpenEditModal(state);

  return {
    hasUnsavedEdits: state.vapService.hasUnsavedEdits,
    /*
    This ternary is to deal with an edge case: if the user is currently viewing
    the address validation view we need to handle things differently or text in
    the modal would be inaccurate. This is an unfortunate hack to get around an
    existing hack we've been using to determine if we need to show the address
    validation view or not.
    */
    activeEditView:
      activeEditView === 'addressValidation'
        ? 'addressValidation'
        : selectCurrentlyOpenEditModal(state),
    data,
    fieldName,
    analyticsSectionName: VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName],
    field: selectEditedFormField(state, fieldName),
    transaction,
    transactionRequest,
    editViewData: selectEditViewData(state),
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  refreshTransaction,
  openModal,
  createTransaction,
  updateFormFieldWithSchema,
  validateAddress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInformationEditView);
