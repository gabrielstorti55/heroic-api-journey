
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-marvel-red border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-3 border-4 border-marvel-red/70 border-b-transparent rounded-full animate-spin animation-delay-150 animate-[spin_1.5s_linear_infinite]"></div>
      </div>
      <p className="mt-6 text-lg text-white/70">{message}</p>
    </div>
  );
};

export default LoadingState;
