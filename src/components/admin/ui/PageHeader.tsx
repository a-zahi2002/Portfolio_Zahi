import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/5">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">{title}</h1>
        {description && (
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
