import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-500/15 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  danger:  'bg-red-500/15 text-red-400 border-red-500/20',
  info:    'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  neutral: 'bg-white/8 text-gray-400 border-white/10',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => (
  <span className={`
    inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
    ${variantClasses[variant]} ${className}
  `}>
    {children}
  </span>
);

export default Badge;
