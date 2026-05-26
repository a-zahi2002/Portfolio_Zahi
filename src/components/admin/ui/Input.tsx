import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`
          w-full px-4 py-2.5 bg-charcoal-900/80 border rounded-xl text-white
          placeholder-gray-600 text-sm transition-colors
          focus:outline-none focus:ring-1
          ${error
            ? 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/20'
            : 'border-white/10 focus:border-accent-cyan/50 focus:ring-accent-cyan/20'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
