import React from 'react';
import { Element as ScrollElement, scroller } from 'react-scroll';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import {
  isFailedTransaction,
  isPendingTransaction,
} from 'vet360/util/transactions';
import Vet360EditModalActionButtons from './Vet360EditModalActionButtons';
import Vet360EditModalErrorMessage from './Vet360EditModalErrorMessage';

export default class Vet360EditModal extends React.Component {
  static propTypes = {
    analyticsSectionName: PropTypes.string.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getInitialFormValues: PropTypes.func.isRequired,
    field: PropTypes.shape({
      value: PropTypes.object,
      validations: PropTypes.object,
    }),
    hasValidationError: PropTypes.func,
    isEmpty: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChangeFormDataAndSchemas: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    transactionRequest: PropTypes.object,
    useSchemaForm: PropTypes.bool,
  };

  componentDidMount() {
    this.props.onChangeFormDataAndSchemas(
      this.props.getInitialFormValues(),
      this.props.formSchema,
      this.props.uiSchema,
    );
  }

  componentWillUpdate(nextProps) {
    if (nextProps.transactionRequest !== this.props.transactionRequest) {
      if (nextProps.transactionRequest.error) {
        // This setTimeout ensures the DOM is able to update with the error message
        // after a transaction failure
        setTimeout(
          () =>
            scroller.scrollTo('profileError', {
              containerId: '.va-modal-body',
            }),
          300,
        );
        focusElement('.usa-alert .usa-alert-error');
      }
    }
  }

  componentWillUnmount() {
    // Errors returned directly from the API request (as opposed through a transaction lookup) are
    // displayed in this modal, rather than on the page. Once the modal is closed, reset the state
    // for the next time the modal is opened by removing any existing transaction request from the store.
    if (this.props.transactionRequest && this.props.transactionRequest.error) {
      this.props.clearErrors();
    }
  }

  onSubmit = () => {
    this.props.onSubmit(this.props.field.value);
  };

  isInitialized = () =>
    this.props.isInitialized ? this.props.isInitialized() : !!this.props.field;

  render() {
    const {
      onSubmit,
      isInitialized,
      props: {
        isEmpty,
        onCancel,
        title,
        clearErrors,
        render,
        onDelete,
        transaction,
        transactionRequest,
        analyticsSectionName,
        deleteDisabled,
      },
    } = this;

    const isFormReady = isInitialized();
    const isLoading =
      transactionRequest?.isPending || isPendingTransaction(transaction);
    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    const actionButtons = (
      <Vet360EditModalActionButtons
        onCancel={onCancel}
        onDelete={onDelete}
        title={title}
        analyticsSectionName={analyticsSectionName}
        transactionRequest={transactionRequest}
        deleteEnabled={!isEmpty && !deleteDisabled}
      >
        <LoadingButton data-action="save-edit" isLoading={isLoading}>
          Update
        </LoadingButton>
        <button
          type="button"
          className="usa-button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </Vet360EditModalActionButtons>
    );

    return (
      <Modal id="profile-edit-modal" onClose={onCancel} visible={isFormReady}>
        <h3>Edit {title.toLowerCase()}</h3>
        {error && (
          <ScrollElement name="profileError">
            <div className="vads-u-margin-bottom--1">
              <Vet360EditModalErrorMessage
                title={title}
                error={error}
                clearErrors={clearErrors}
              />
            </div>
          </ScrollElement>
        )}
        {isFormReady && render(actionButtons, onSubmit)}
      </Modal>
    );
  }
}
