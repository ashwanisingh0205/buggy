// src/lib/twitter.ts
import { config } from './config';
import { apiRequest } from './apiClient';

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  connectedAt: string;
  profileImageUrl?: string;
}

export interface TwitterAuthResponse {
  success: boolean;
  authURL?: string;
  state?: string;
  error?: string;
}

export interface TwitterCallbackResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    socialAccounts: {
      twitter: TwitterUser;
    };
  };
  error?: string;
}

export interface TwitterProfile {
  success: boolean;
  profile?: TwitterUser;
  error?: string;
}

export interface Tweet {
  tweet_id: string;
  text: string;
  created_at: string;
  position?: number; // For thread tweets
}

export interface TweetResponse {
  success: boolean;
  message?: string;
  tweet?: Tweet;
  tweets?: Tweet[]; // For thread responses
  thread?: Tweet[]; // Alternative thread response
  thread_id?: string; // Thread identifier
  tweet_count?: number; // Number of tweets in thread
  poll?: {
    options: string[];
    duration_minutes: number;
    ends_at: string;
  };
  error?: string;
  partial_success?: boolean; // For partial thread posts
  posted_tweets?: Tweet[]; // For partial success
  failed_at?: number; // Position where thread failed
}

export interface MediaUploadResponse {
  success: boolean;
  mediaId?: string;
  error?: string;
}

export interface PollOptions {
  options: string[];
  durationMinutes: number;
}

export interface ThreadTweet {
  text: string;
  mediaIds?: string[];
}

class TwitterService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.apiUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return apiRequest<T>(endpoint, options);
  }

  // Generate Twitter OAuth URL
  async generateAuthURL(redirectUri: string): Promise<TwitterAuthResponse> {
    try {
      const response = await this.request<TwitterAuthResponse>('/api/twitter/auth-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ redirectUri }),
      });
      return response;
    } catch (error) {
      console.error('Failed to generate Twitter auth URL:', error);
      return {
        success: false,
        error: 'Failed to generate authentication URL'
      };
    }
  }

  // Handle OAuth callback
  async handleCallback(code: string, state: string, redirectUri: string): Promise<TwitterCallbackResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/twitter/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&redirectUri=${encodeURIComponent(redirectUri)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
          success: false,
          error: errorData?.error || 'Callback failed'
        };
      }

      // For OAuth callbacks, we typically redirect, so this might not return JSON
      // If you need to handle the response differently, adjust accordingly
      return {
        success: true,
        message: 'Twitter account connected successfully'
      };
    } catch (error) {
      console.error('Twitter callback error:', error);
      return {
        success: false,
        error: 'Failed to complete Twitter authentication'
      };
    }
  }

  // Get user profile
  async getProfile(): Promise<TwitterProfile> {
    return this.request<TwitterProfile>('/api/twitter/profile');
  }

  // Post content with type detection
  async postContent(data: {
    type: 'post' | 'thread' | 'poll';
    content?: string;
    mediaIds?: string[];
    thread?: string[] | ThreadTweet[];
    poll?: PollOptions;
  }): Promise<TweetResponse> {
    return this.request<TweetResponse>('/api/twitter/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  // ✅ Single tweet (convenience method)
  async post(content: string, mediaIds?: string[]): Promise<TweetResponse> {
    return this.postContent({
      type: 'post',
      content,
      mediaIds
    });
  }

  // ✅ Thread of tweets (convenience method)
  async postThread(thread: string[] | ThreadTweet[]): Promise<TweetResponse> {
    return this.postContent({
      type: 'thread',
      thread
    });
  }

  // ✅ Poll (convenience method)
  async postPoll(content: string, poll: PollOptions): Promise<TweetResponse> {
    return this.postContent({
      type: 'poll',
      content,
      poll
    });
  }

  // Upload media
  async uploadMedia(file: File): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('media', file);

      const response = await fetch(`${this.baseURL}/api/twitter/upload-media`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Media upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Upload multiple media files
  async uploadMultipleMedia(files: File[]): Promise<{ success: boolean; mediaIds: string[]; errors?: string[] }> {
    const uploadPromises = files.map(file => this.uploadMedia(file));
    const results = await Promise.allSettled(uploadPromises);

    const mediaIds: string[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success && result.value.mediaId) {
        mediaIds.push(result.value.mediaId);
      } else {
        errors.push(`Failed to upload file ${index + 1}: ${result.status === 'rejected' ? result.reason : result.value?.error}`);
      }
    });

    return {
      success: mediaIds.length > 0,
      mediaIds,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  // Disconnect Twitter account
  async disconnect(): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.request('/api/twitter/disconnect', { 
      method: 'DELETE' 
    });
  }

  // Validate connection
  async validateConnection(): Promise<{ success: boolean; valid?: boolean; user?: any; canPost?: boolean; error?: string }> {
    return this.request('/api/twitter/validate');
  }

  // Check if connected
  async isConnected(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile.success && !!profile.profile;
    } catch {
      return false;
    }
  }

  // Get comprehensive connection status
  async getConnectionStatus(): Promise<{
    connected: boolean;
    profile?: TwitterUser;
    canPost: boolean;
    error?: string;
  }> {
    try {
      const [profile, validation] = await Promise.all([
        this.getProfile(),
        this.validateConnection()
      ]);

      return {
        connected: profile.success && !!profile.profile,
        profile: profile.profile,
        canPost: validation.success && validation.canPost === true,
        error: profile.error || validation.error
      };
    } catch (error) {
      return {
        connected: false,
        canPost: false,
        error: 'Failed to check connection status'
      };
    }
  }
}

export const twitterService = new TwitterService();