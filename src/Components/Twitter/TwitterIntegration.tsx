'use client';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useTwitter } from '@/hooks/useTwitter';
import { Loader2, CheckCircle, ExternalLink, MessageSquare, ListChecks, BarChart3, X } from 'lucide-react';

interface TwitterIntegrationProps {
  className?: string;
  onPostTypeChange?: (postType: 'post' | 'thread' | 'poll') => void;
}

export interface TwitterIntegrationRef {
  checkConnection: () => void;
  getPostType: () => 'post' | 'thread' | 'poll';
}

export const TwitterIntegration = forwardRef<TwitterIntegrationRef, TwitterIntegrationProps>(
  ({ className = '', onPostTypeChange }, ref) => {
    const { isConnected, profile, loading, error, connect, disconnect, checkConnection } = useTwitter();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [postType, setPostType] = useState<'post' | 'thread' | 'poll'>('post');

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      checkConnection,
      getPostType: () => postType,
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

    const handlePostTypeChange = (newPostType: 'post' | 'thread' | 'poll') => {
      setPostType(newPostType);
      onPostTypeChange?.(newPostType);
    };

    const handleCheckConnection = async () => {
      try {
        await checkConnection();
      } catch (error) {
        console.error('Connection check error:', error);
      }
    };

    // Get connection status text and color
    const getConnectionStatus = () => {
      if (loading) {
        return { text: 'Checking connection...', color: 'text-gray-500' };
      }
      if (isConnected && profile) {
        return { text: `@${profile.username}`, color: 'text-green-600' };
      }
      return { text: 'Not connected', color: 'text-gray-500' };
    };

    const status = getConnectionStatus();

    return (
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3 bg-white ${className}`}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
            <X className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate">X (Twitter)</p>
            <div className="flex items-center space-x-2 mt-1">
              {loading ? (
                <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
              ) : isConnected && profile ? (
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              ) : null}
              <p className={`text-sm truncate ${status.color}`}>
                {status.text}
              </p>
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-1 truncate" title={error}>
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-shrink-0">
          {/* Post Type Selector - Only show when connected */}
          {isConnected && (
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handlePostTypeChange('post')}
                className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-all ${
                  postType === 'post'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Post</span>
              </button>
              <button
                onClick={() => handlePostTypeChange('thread')}
                className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-all ${
                  postType === 'thread'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ListChecks className="w-3 h-3" />
                <span>Thread</span>
              </button>
              <button
                onClick={() => handlePostTypeChange('poll')}
                className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-all ${
                  postType === 'poll'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Poll</span>
              </button>
            </div>
          )}

          {/* Connection Buttons */}
          <div className="flex space-x-2">
            {isConnected ? (
              <>
                <button
                  onClick={handleCheckConnection}
                  disabled={loading}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 min-w-[100px] justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3 h-3" />
                      <span>Refresh</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 min-w-[100px] justify-center"
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
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 min-w-[100px] justify-center"
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
      </div>
    );
  }
);

TwitterIntegration.displayName = 'TwitterIntegration';