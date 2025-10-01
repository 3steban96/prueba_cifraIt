import React from 'react';
import { CFormInput, CFormLabel, CFormFeedback } from '@coreui/react';

const Input = ({ 
  label, 
  error, 
  required = false,
  type = 'text',
  ...props 
}) => {
  return (
    <div className="mb-3">
      {label && (
        <CFormLabel>
          {label} {required && <span className="text-danger">*</span>}
        </CFormLabel>
      )}
      <CFormInput
        type={type}
        invalid={!!error}
        {...props}
      />
      {error && <CFormFeedback invalid>{error}</CFormFeedback>}
    </div>
  );
};

export default Input;