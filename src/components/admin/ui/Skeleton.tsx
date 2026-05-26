import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-charcoal-800/60 border border-white/5 rounded-2xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-charcoal-800/40 rounded-xl">
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    ))}
  </div>
);

export const SkeletonForm: React.FC = () => (
  <div className="space-y-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    ))}
    <Skeleton className="h-11 w-32 rounded-xl mt-4" />
  </div>
);

export default Skeleton;
