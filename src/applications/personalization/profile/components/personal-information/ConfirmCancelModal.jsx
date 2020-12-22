import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

const ConfirmCancelModal = props => {
  const {
    activeSection,
    closeModal,
    hideConfirmCancelModal,
    showConfirmCancelModal,
  } = props;

  return (
    <Modal
      title="Are you sure?"
      status="warning"
      visible={showConfirmCancelModal}
      onClose={hideConfirmCancelModal}
    >
      <p>
        {`You haven’t finished editing your ${activeSection}. If you cancel, your in-progress work won’t be saved.`}
      </p>
      <button
        className="usa-button-secondary"
        onClick={() => {
          hideConfirmCancelModal();
        }}
      >
        Continue Editing
      </button>
      <button
        onClick={() => {
          hideConfirmCancelModal();
          closeModal();
        }}
      >
        Cancel
      </button>
    </Modal>
  );
};

export default ConfirmCancelModal;
