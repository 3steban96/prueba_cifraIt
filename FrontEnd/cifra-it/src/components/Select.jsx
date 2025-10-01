import React from 'react';
import { CFormSelect, CFormLabel, CFormFeedback } from '@coreui/react';

const Select = ({ 
  label, 
  error, 
  required = false,
  options = [],
  placeholder = 'Seleccione una opción',
  ...props 
}) => {
  return (
    <div className="mb-3">
      {label && (
        <CFormLabel>
          {label} {required && <span className="text-danger">*</span>}
        </CFormLabel>
      )}
      <CFormSelect
        invalid={!!error}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </CFormSelect>
      {error && <CFormFeedback invalid>{error}</CFormFeedback>}
    </div>
  );
};

export default Select;