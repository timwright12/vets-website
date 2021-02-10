import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { formatAddress } from '~/platform/forms/address/helpers';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import {
  openModal,
  createTransaction,
  updateSelectedAddress,
  updateValidationKeyAndSave,
  closeModal,
  resetAddressValidation as resetAddressValidationAction,
} from '../actions';
import { focusElement } from '~/platform/utilities/ui';
import { getValidationMessageKey } from '../util';
import { ADDRESS_VALIDATION_MESSAGES } from '../constants/addressValidationMessages';
import recordEvent from '~/platform/monitoring/record-event';

import * as VAP_SERVICE from '../constants';

import {
  isFailedTransaction,
  isPendingTransaction,
} from '@@vap-svc/util/transactions';

import VAPServiceEditModalErrorMessage from '@@vap-svc/components/base/VAPServiceEditModalErrorMessage';

class AddressValidationModal extends React.Component {
  componentWillUnmount() {
    focusElement(`#${this.props.addressValidationType}-edit-link`);
  }

  onChangeHandler = (address, selectedAddressId) => _event => {
    this.props.updateSelectedAddress(address, selectedAddressId);
  };

  onSubmit = event => {
    event.preventDefault();
    const {
      validationKey,
      addressValidationType,
      selectedAddress,
      selectedAddressId,
      analyticsSectionName,
    } = this.props;

    const payload = {
      ...selectedAddress,
      validationKey,
    };

    const suggestedAddressSelected = selectedAddressId !== 'userEntered';

    const method = payload.id ? 'PUT' : 'POST';

    recordEvent({
      event: 'profile-transaction',
      'profile-section': analyticsSectionName,
      'profile-addressSuggestionUsed': suggestedAddressSelected ? 'yes' : 'no',
    });

    if (suggestedAddressSelected) {
      this.props.updateValidationKeyAndSave(
        VAP_SERVICE.API_ROUTES.ADDRESSES,
        method,
        addressValidationType,
        payload,
        analyticsSectionName,
      );
    } else {
      this.props.createTransaction(
        VAP_SERVICE.API_ROUTES.ADDRESSES,
        method,
        addressValidationType,
        payload,
        analyticsSectionName,
      );
    }
  };

  onEditClick = () => {
    const {
      addressValidationType,
      addressFromUser,
      analyticsSectionName,
    } = this.props;
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'edit-link',
      'profile-section': analyticsSectionName,
    });
    this.props.openModal(addressValidationType, addressFromUser);
  };

  renderPrimaryButton = () => {
    const {
      addressValidationError,
      validationKey,
      isLoading,
      confirmedSuggestions,
    } = this.props;

    let buttonText = 'Update';

    if (confirmedSuggestions.length === 0 && validationKey) {
      buttonText = 'Use this address';
    }

    if (confirmedSuggestions.length === 1 && !validationKey) {
      buttonText = 'Use suggested address';
    }

    if (
      addressValidationError ||
      (!confirmedSuggestions.length && !validationKey)
    ) {
      return (
        <button className="usa-button-primary" onClick={this.onEditClick}>
          Edit Address
        </button>
      );
    }

    return (
      <LoadingButton isLoading={isLoading} className="usa-button-primary">
        {buttonText}
      </LoadingButton>
    );
  };

  renderAddressOption = (address, id = 'userEntered') => {
    const {
      validationKey,
      addressValidationError,
      selectedAddressId,
      confirmedSuggestions,
    } = this.props;

    const isAddressFromUser = id === 'userEntered';
    const hasConfirmedSuggestions =
      (confirmedSuggestions.length > 0 && validationKey) ||
      confirmedSuggestions.length > 1;
    const showEditLinkErrorState = addressValidationError && validationKey;
    const showEditLinkNonErrorState = !addressValidationError;
    const showEditLink = showEditLinkErrorState || showEditLinkNonErrorState;
    const isFirstOptionOrEnabled =
      (isAddressFromUser && validationKey) || !isAddressFromUser;

    const { street, cityStateZip, country } = formatAddress(address);

    return (
      <div
        key={id}
        className="vads-u-margin-bottom--1p5 address-validation-container"
      >
        {isFirstOptionOrEnabled &&
          hasConfirmedSuggestions && (
            <input
              type="radio"
              id={id}
              onChange={
                isFirstOptionOrEnabled && this.onChangeHandler(address, id)
              }
              checked={selectedAddressId === id}
            />
          )}
        <label
          htmlFor={id}
          className="vads-u-margin-top--2 vads-u-display--flex vads-u-align-items--center"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-bottom--0p5">
            <span>{street}</span>
            <span>{cityStateZip}</span>
            <span>{country}</span>

            {isAddressFromUser &&
              showEditLink && (
                <button className="va-button-link" onClick={this.onEditClick}>
                  Edit Address
                </button>
              )}
          </div>
        </label>
      </div>
    );
  };

  render() {
    const {
      addressValidationType,
      suggestedAddresses,
      addressFromUser,
      validationKey,
      addressValidationError,
      resetAddressValidation,
      confirmedSuggestions,
      transaction,
      transactionRequest,
      title,
      clearErrors,
    } = this.props;

    const resetDataAndCloseModal = () => {
      resetAddressValidation();
      this.props.closeModal();
    };

    const validationMessageKey = getValidationMessageKey(
      suggestedAddresses,
      validationKey,
      addressValidationError,
      confirmedSuggestions,
    );

    const addressValidationMessage =
      ADDRESS_VALIDATION_MESSAGES[validationMessageKey];

    const shouldShowSuggestions = confirmedSuggestions.length > 0;

    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    return (
      <Modal
        title={
          addressValidationType.includes('mailing')
            ? 'Edit mailing address'
            : 'Edit home address'
        }
        id="address-validation-warning"
        onClose={resetDataAndCloseModal}
        visible
      >
        {error && (
          <div className="vads-u-margin-bottom--1">
            <VAPServiceEditModalErrorMessage
              title={title}
              error={error}
              clearErrors={clearErrors}
            />
          </div>
        )}
        <AlertBox
          className="vads-u-margin-bottom--1"
          status="warning"
          headline={addressValidationMessage.headline}
        >
          <addressValidationMessage.ModalText editFunction={this.onEditClick} />
        </AlertBox>
        <form onSubmit={this.onSubmit}>
          <span className="vads-u-font-weight--bold">You entered:</span>
          {this.renderAddressOption(addressFromUser)}
          {shouldShowSuggestions && (
            <span className="vads-u-font-weight--bold">
              Suggested Addresses:
            </span>
          )}
          {shouldShowSuggestions &&
            confirmedSuggestions.map((address, index) =>
              this.renderAddressOption(address, String(index)),
            )}
          {this.renderPrimaryButton()}
          <button
            type="button"
            className="usa-button-secondary"
            onClick={resetDataAndCloseModal}
          >
            Cancel
          </button>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { transaction } = ownProps;
  const addressValidationType =
    state.vapService.addressValidation.addressValidationType;

  return {
    analyticsSectionName:
      VAP_SERVICE.ANALYTICS_FIELD_MAP[addressValidationType],
    isLoading:
      state.vapService.fieldTransactionMap[addressValidationType]?.isPending ||
      isPendingTransaction(transaction),
    addressValidationError:
      state.vapService.addressValidation.addressValidationError,
    suggestedAddresses: state.vapService.addressValidation.suggestedAddresses,
    confirmedSuggestions:
      state.vapService.addressValidation.confirmedSuggestions,
    addressValidationType,
    validationKey: state.vapService.addressValidation.validationKey,
    addressFromUser: state.vapService.addressValidation.addressFromUser,
    selectedAddress: state.vapService.addressValidation.selectedAddress,
    selectedAddressId: state.vapService.addressValidation.selectedAddressId,
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      closeModal,
      openModal,
      updateSelectedAddress,
      updateValidationKeyAndSave,
      createTransaction,
      resetAddressValidation: resetAddressValidationAction,
    },
    dispatch,
  ),
});

AddressValidationModal.propTypes = {
  analyticsSectionName: PropTypes.string,
  addressValidationError: PropTypes.bool.isRequired,
  suggestedAddresses: PropTypes.array.isRequired,
  confirmedSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      addressLine1: PropTypes.string.isRequired,
      addressType: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      countryName: PropTypes.string.isRequired,
      countryCodeIso3: PropTypes.string.isRequired,
      countyCode: PropTypes.string.isRequired,
      countyName: PropTypes.string.isRequired,
      stateCode: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      addressPou: PropTypes.string.isRequired,
    }),
  ),
  addressValidationType: PropTypes.string.isRequired,
  validationKey: PropTypes.number,
  addressFromUser: PropTypes.object.isRequired,
  selectedAddress: PropTypes.object,
  selectedAddressId: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  updateSelectedAddress: PropTypes.func.isRequired,
  updateValidationKeyAndSave: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationModal);
