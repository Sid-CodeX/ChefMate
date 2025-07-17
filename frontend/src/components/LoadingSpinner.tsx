
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner = React.memo(({ size = 'md', color = 'orange-500' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin ${sizeClasses[size]} border-3 border-${color} border-t-transparent rounded-full`}></div>
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
