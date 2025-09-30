// src/lib/twitter.ts
import { config } from './config';
import { authUtils } from './auth';

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  connectedAt: string;
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

export interface TweetResponse {
  success: boolean;
  message?: string;
  tweet?: {
    tweet_id: string;
    text: string;
    created_at: string;
  };
  error?: string;
}

export interface MediaUploadResponse {
  success: boolean;
  mediaId?: string;
  error?: string;
}

class TwitterService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.apiUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authUtils.getToken();
    console.log('Token:', token, 'Requesting:', `${this.baseURL}${endpoint}`);

    if (!token) {
      throw new Error('Authentication required. Please log in first.');
    }
  
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Request failed');
    }
  
    return response.json();
  }
  

  // Generate Twitter OAuth URL
  async generateAuthURL(redirectUri: string): Promise<TwitterAuthResponse> {
    return this.request<TwitterAuthResponse>('/api/twitter/auth-url', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authUtils.getToken()}`, // ✅ add app JWT
      },
      body: JSON.stringify({ redirectUri }),    });
  }

  // Handle Twitter OAuth callback (this would be called by the backend)
  async handleCallback(code: string, state: string, redirectUri: string): Promise<TwitterCallbackResponse> {
    return this.request<TwitterCallbackResponse>(
      `/api/twitter/callback?code=${code}&state=${state}&redirectUri=${redirectUri}`,
      { method: 'GET' }
    );
    
  }

  // Get Twitter profile
  async getProfile(): Promise<TwitterProfile> {
    return this.request<TwitterProfile>('/api/twitter/profile');
  }

  // Post a tweet
  async postTweet(content: string, mediaIds?: string[]): Promise<TweetResponse> {
    return this.request<TweetResponse>('/api/twitter/tweet', {
      method: 'POST',
      body: JSON.stringify({ content, mediaIds }),
    });
  }

  // Upload media
  async uploadMedia(file: File): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('media', file);
  
    const token = authUtils.getToken();
    if (!token) throw new Error('Authentication required');
  
    const response = await fetch(`${this.baseURL}/api/twitter/upload-media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Upload failed');
    }
  
    return response.json();
  }
  

  // Disconnect Twitter account
  async disconnect(): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.request('/api/twitter/disconnect', {
      method: 'DELETE',
    });
  }

  // Check if Twitter is connected
  async isConnected(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile.success;
    } catch {
      return false;
    }
  }
}

export const twitterService = new TwitterService();
