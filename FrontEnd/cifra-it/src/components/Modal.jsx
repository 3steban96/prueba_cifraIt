import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import Button from './Button';

const Modal = ({ 
  visible, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'lg',
  ...props 
}) => {
  return (
    <CModal visible={visible} onClose={onClose} size={size} {...props}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {children}
      </CModalBody>
      {footer && (
        <CModalFooter>
          {footer}
        </CModalFooter>
      )}
    </CModal>
  );
};

export default Modal;