import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {children}

      {hint && !error && (
        <p className="text-xs text-gray-600">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormField;
