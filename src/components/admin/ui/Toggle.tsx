import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled, id }) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none
          focus:ring-2 focus:ring-accent-cyan/40 focus:ring-offset-2 focus:ring-offset-charcoal-900
          ${checked ? 'bg-accent-cyan' : 'bg-white/15'}
        `}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          className={`
            absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md
            ${checked ? 'left-5' : 'left-0.5'}
          `}
        />
      </button>
      {label && (
        <span className="text-sm text-gray-300">{label}</span>
      )}
    </label>
  );
};

export default Toggle;
