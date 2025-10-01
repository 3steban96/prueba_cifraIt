import React from 'react';
import { CFormTextarea, CFormLabel, CFormFeedback } from '@coreui/react';

const TextArea = ({ 
  label, 
  error, 
  required = false,
  rows = 4,
  ...props 
}) => {
  return (
    <div className="mb-3">
      {label && (
        <CFormLabel>
          {label} {required && <span className="text-danger">*</span>}
        </CFormLabel>
      )}
      <CFormTextarea
        rows={rows}
        invalid={!!error}
        {...props}
      />
      {error && <CFormFeedback invalid>{error}</CFormFeedback>}
    </div>
  );
};

export default TextArea;