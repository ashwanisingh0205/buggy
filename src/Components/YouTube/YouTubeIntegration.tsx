import React, { useState, forwardRef, useImperativeHandle } from "react";
import { ExternalLink, Loader2, Play } from "lucide-react";
import { useYouTube } from "@/hooks/useYouTube";

interface YouTubeIntegrationProps {
  className?: string;
}

export interface YouTubeIntegrationRef {
  checkConnection: () => void;
}

export const YouTubeIntegration = forwardRef<YouTubeIntegrationRef, YouTubeIntegrationProps>(({ className = '' }, ref) => {
  const { isConnected, channel, loading, error, connect, disconnect, checkConnection } = useYouTube();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Expose checkConnection method to parent component
  useImperativeHandle(ref, () => ({
    checkConnection
  }));

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect();
      // After successful connection, check the status to update UI
      setTimeout(() => {
        checkConnection();
      }, 1000);
    } catch (error) {
      console.error('YouTube connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await disconnect();
    } catch (error) {
      console.error('YouTube disconnection error:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Note: Removed automatic checkConnection() call to prevent 429 errors
  // Connection status will be checked only when user manually clicks connect/disconnect

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <Play className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-medium text-gray-900">YouTube</p>
          {isConnected && channel ? (
            <div className="text-sm text-gray-500">
              <p>@{channel.customUrl || channel.title}</p>
              <p>{channel.subscriberCount} subscribers</p>
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
          <>
            <button
              onClick={() => checkConnection()}
              disabled={loading}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
              <>
                <ExternalLink className="w-3 h-3" />
                <span>Check Status</span>
              </>
              )}
            </button>
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
          </>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting || loading}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
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
});

YouTubeIntegration.displayName = 'YouTubeIntegration';
