'use client';
import React, { useState } from 'react';
import { useTwitter } from '@/hooks/useTwitter';
import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface TwitterIntegrationProps {
  className?: string;
}

export const TwitterIntegration: React.FC<TwitterIntegrationProps> = ({ className = '' }) => {
  const { isConnected, profile, loading, error, connect, disconnect } = useTwitter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (error) {
      console.error('Twitter connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await disconnect();
    } catch (error) {
      console.error('Twitter disconnection error:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-medium text-sm">X</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">X (Twitter)</p>
          {loading ? (
            <p className="text-sm text-gray-500">Checking connection...</p>
          ) : isConnected && profile ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-600">@{profile.username}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Not connected</p>
          )}
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Disconnecting...</span>
              </>
            ) : (
              'Disconnect'
            )}
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting || loading}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3 h-3" />
                <span>Connect</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
