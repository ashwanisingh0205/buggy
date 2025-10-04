"use client";
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useLinkedIn } from '@/hooks/useLinkedIn';

interface LinkedInIntegrationProps {
  className?: string;
}

export interface LinkedInIntegrationRef {
  checkConnection: () => void;
}

export const LinkedInIntegration = forwardRef<LinkedInIntegrationRef, LinkedInIntegrationProps>(({ className = '' }, ref) => {
  const { connect, loading, error } = useLinkedIn();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Checking...');

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      // Check if LinkedIn data exists in localStorage or make API call
      const linkedInData = localStorage.getItem('linkedin_data');
      if (linkedInData) {
        const data = JSON.parse(linkedInData);
        setIsConnected(true);
        setConnectionStatus(`Connected as ${data.firstName} ${data.lastName}`);
      } else {
        setIsConnected(false);
        setConnectionStatus('Not connected');
      }
    } catch {
      setIsConnected(false);
      setConnectionStatus('Not connected');
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('LinkedIn connection error:', err);
    }
  };

  // Expose checkConnection method to parent component
  useImperativeHandle(ref, () => ({
    checkConnection: checkConnectionStatus
  }));

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-medium text-sm">in</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">LinkedIn</p>
          <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
            {isConnected ? 'Connected' : connectionStatus}
          </p>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isConnected ? (
          <button
            onClick={checkConnectionStatus}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
});

LinkedInIntegration.displayName = 'LinkedInIntegration';


