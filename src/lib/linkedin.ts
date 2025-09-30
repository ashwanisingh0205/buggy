import { config } from './config';
import { authUtils } from './auth';

export interface LinkedInUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  connectedAt?: string;
}

export interface LinkedInAuthResponse {
  success: boolean;
  authURL?: string;
  state?: string;
  error?: string;
}

export interface LinkedInProfileResponse {
  success: boolean;
  profile?: LinkedInUser;
  error?: string;
}

class LinkedInService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.apiUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authUtils.getToken();
    if (!token) throw new Error('Authentication required');
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

  async generateAuthURL(redirectUri: string): Promise<LinkedInAuthResponse> {
    return this.request<LinkedInAuthResponse>('/api/linkedin/auth-url', {
      method: 'POST',
      body: JSON.stringify({ redirectUri })
    });
  }

  async getProfile(): Promise<LinkedInProfileResponse> {
    return this.request<LinkedInProfileResponse>('/api/linkedin/profile');
  }
  
}

export const linkedInService = new LinkedInService();


