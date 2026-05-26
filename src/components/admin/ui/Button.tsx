import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent-cyan text-charcoal-950 hover:bg-accent-cyan/90 font-bold shadow-[0_0_20px_rgba(0,243,255,0.15)]',
  secondary: 'bg-white/8 text-white border border-white/10 hover:bg-white/12 hover:border-white/20',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 hover:text-red-300',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
