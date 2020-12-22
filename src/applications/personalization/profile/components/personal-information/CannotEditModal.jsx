import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

const CannotEditModal = props => {
  const { activeSection, showCannotEditModal, hideCannotEditModal } = props;
  return (
    <Modal
      title={`You’re currently editing your ${activeSection}`}
      status="warning"
      visible={showCannotEditModal}
      onClose={hideCannotEditModal}
    >
      <p>
        Please go back and save or cancel your work before editing a new section
        of your profile. If you cancel, your in-progress work won’t be saved.
      </p>
      <button onClick={hideCannotEditModal}>OK</button>
    </Modal>
  );
};

export default CannotEditModal;
