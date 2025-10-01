import { useState, useCallback, useMemo } from 'react';
import { authUtils } from '@/lib/auth';

export function useAuthStore() {
  const [token, setToken] = useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return authUtils.getToken();
    }
    return null;
  });

  // Memoized token state
  const tokenState = useMemo(() => ({
    token,
    isAuthenticated: !!token
  }), [token]);

  // Optimized setToken with localStorage sync
  const updateToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
      authUtils.clearCache(); // Clear auth cache when token is removed
    }
  }, []);

  return { 
    ...tokenState, 
    setToken: updateToken 
  };
}


