import React from 'react';
import { Plus } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-gray-600">
        {icon ?? <Plus className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} leftIcon={<Plus className="w-4 h-4" />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
