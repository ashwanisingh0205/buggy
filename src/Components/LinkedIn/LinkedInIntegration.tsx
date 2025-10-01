"use client";
import React, { forwardRef, useImperativeHandle } from 'react';
import { useLinkedIn } from '@/hooks/useLinkedIn';

interface LinkedInIntegrationProps {
  className?: string;
}

export interface LinkedInIntegrationRef {
  checkConnection: () => void;
}

export const LinkedInIntegration = forwardRef<LinkedInIntegrationRef, LinkedInIntegrationProps>(({ className = '' }, ref) => {
  const { connect, loading, error } = useLinkedIn();

  // Expose checkConnection method to parent component (placeholder for now)
  useImperativeHandle(ref, () => ({
    checkConnection: () => {
      console.log('LinkedIn checkConnection called (not implemented yet)');
    }
  }));

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-medium text-sm">in</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">LinkedIn</p>
          <p className="text-sm text-gray-500">Not connected</p>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => connect()}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </div>
  );
});

LinkedInIntegration.displayName = 'LinkedInIntegration';


