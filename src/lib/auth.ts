export type Role = 'creator' | 'brand';

export function isAuthorized(role: Role) {
  // basic placeholder rule using param to satisfy linter
  return role === 'creator' || role === 'brand';
}

// Authentication utilities
export const authUtils = {
  // Get token from localStorage
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  },

  // Get user data from localStorage
  getUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Clear authentication data
  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Set authentication data
  setAuth(token: string, user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};


