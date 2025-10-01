// src/hooks/useYouTube.ts
import { useState, useEffect } from "react";
import { youtubeService, YouTubeChannel } from "@/lib/youtube";
import { authUtils } from "@/lib/auth";

export const useYouTube = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Removed automatic checkConnection() to prevent 429 errors
    // Connection status will be checked manually when needed
    if (!authUtils.isAuthenticated()) {
      setLoading(false);
      setIsConnected(false);
      setChannel(null);
    } else {
      // Set initial state without making API calls
      setLoading(false);
      setIsConnected(false);
      setChannel(null);
    }
  }, []);

  const checkConnection = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 YouTube checkConnection called (attempt ${retryCount + 1})`);

      // First check if user is authenticated
      if (!authUtils.isAuthenticated()) {
        console.log('❌ User not authenticated, skipping YouTube connection check');
        setIsConnected(false);
        setChannel(null);
        return;
      }

      const isYouTubeConnected = await youtubeService.isConnected();

      if (!isYouTubeConnected) {
        console.log('❌ YouTube not connected, setting state to disconnected');
        setIsConnected(false);
        setChannel(null);
        return;
      }

      console.log('✅ YouTube is connected, fetching channel info...');
      const channelResponse = await youtubeService.getChannelInfo();

      if (channelResponse.success && channelResponse.channel?.id) {
        console.log('✅ YouTube channel info retrieved successfully:', channelResponse.channel.title);
        setIsConnected(true);
        setChannel(channelResponse.channel);
      } else {
        console.log('❌ Failed to get channel info or invalid response');
        setIsConnected(false);
        setChannel(null);
      }
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Unknown error';
      console.error("❌ Error checking YouTube connection:", errorMessage);
      
      // If it's a "not connected" error and we haven't retried too many times, retry after a delay
      if (errorMessage.includes('YouTube account not connected') && retryCount < 3) {
        console.log(`🔄 Retrying YouTube connection check in 2 seconds... (attempt ${retryCount + 1})`);
        setTimeout(() => {
          checkConnection(retryCount + 1);
        }, 2000);
        return;
      }
      
      setError(errorMessage);
      setIsConnected(false);
      setChannel(null);
    } finally {
      setLoading(false);
    }
  };

  const connect = async (redirectUri?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure user is authenticated before requesting auth URL
      const existingToken = authUtils.getToken();
      const directToken = localStorage.getItem('token');
      
      console.log('🔍 YouTube connect - Token check:', {
        hasToken: !!existingToken,
        tokenLength: existingToken?.length || 0,
        localStorageToken: directToken ? 'exists' : 'missing',
        directTokenLength: directToken?.length || 0,
        isAuthenticated: authUtils.isAuthenticated(),
        tokenPreview: existingToken ? existingToken.substring(0, 20) + '...' : 'none',
        directTokenPreview: directToken ? directToken.substring(0, 20) + '...' : 'none',
        cacheInfo: 'Auth cache details available via debugAuth()'
      });
      
      // Use direct token if authUtils.getToken() returns null but localStorage has a token
      let tokenToUse = existingToken || directToken;
      
      if (!tokenToUse) {
        // Try to force refresh the token
        console.log('🔄 Attempting to force refresh token...');
        const refreshedToken = authUtils.forceRefreshToken();
        
        if (!refreshedToken) {
          console.error('❌ No token found in localStorage. User needs to log in again.');
          throw new Error('Please log in to connect YouTube');
        }
        
        console.log('✅ Token refreshed successfully');
        // Continue with the refreshed token
        tokenToUse = authUtils.getToken() || localStorage.getItem('token');
        if (!tokenToUse) {
          throw new Error('Please log in to connect YouTube');
        }
      }

      // Test authentication first
      try {
        console.log('🧪 Testing authentication before YouTube connect...');
        const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/test`, {
          headers: {
            'Authorization': `Bearer ${tokenToUse}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!testResponse.ok) {
          console.error('❌ Authentication test failed:', testResponse.status, testResponse.statusText);
          throw new Error('Authentication test failed');
        }
        
        const testData = await testResponse.json();
        console.log('✅ Authentication test passed:', testData);
      } catch (testError) {
        console.error('❌ Authentication test error:', testError);
        throw new Error('Please log in to connect YouTube');
      }

      const callbackUrl = redirectUri || `${window.location.origin}/auth/youtube/callback`;
      const response = await youtubeService.generateAuthURL(callbackUrl);
      
      if (response.success && response.authURL) {
        localStorage.setItem("youtube_state", response.state || "");
        window.location.href = response.authURL;
      } else {
        throw new Error(response.error || "Failed to generate auth URL");
      }
    } catch (err: unknown) {
      console.error("Error connecting to YouTube:", err);
      setError((err as Error).message || "Failed to connect to YouTube");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await youtubeService.disconnect();

      if (response.success) {
        setIsConnected(false);
        setChannel(null);
        return true;
      } else {
        throw new Error(response.error || "Failed to disconnect");
      }
    } catch (err: unknown) {
      console.error("Error disconnecting YouTube:", err);
      setError((err as Error).message || "Failed to disconnect YouTube");
      throw err;
    } finally {
      setLoading(false);
    } 
  };

  // Upload video to YouTube
  const uploadVideo = async (file: File, title: string, description: string, tags: string[] = []): Promise<unknown> => {
    try {
      setError(null);
      const response = await youtubeService.uploadVideo(file, title, description, tags);
  
      if (!response.success) {
        throw new Error(response.error || "Failed to upload video");
      }
  
      return response.video;
    } catch (err: unknown) {
      console.error("Error uploading video:", err);
      setError((err as Error).message || "Failed to upload video");
      throw err;
    }
  };

  // Get video analytics
  const getVideoAnalytics = async (videoId: string): Promise<unknown> => {
    try {
      setError(null);
      const response = await youtubeService.getVideoAnalytics(videoId);
  
      if (!response.success) {
        throw new Error(response.error || "Failed to get video analytics");
      }
  
      return response.analytics;
    } catch (err: unknown) {
      console.error("Error getting video analytics:", err);
      setError((err as Error).message || "Failed to get video analytics");
      throw err;
    }
  };

  return {
    isConnected,
    channel,
    loading,
    error,
    connect,
    disconnect,
    checkConnection,
    uploadVideo,
    getVideoAnalytics,
  };
};
