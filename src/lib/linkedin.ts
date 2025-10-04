// LinkedIn service for handling OAuth flow and profile data

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
  private readonly baseURL: string;

  constructor() {
    // Use relative URLs for Next.js API routes
    this.baseURL = '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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


