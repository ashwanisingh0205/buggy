import { useState } from 'react';
import { linkedInService } from '@/lib/linkedin';
import { config } from '@/lib/config';

export const useLinkedIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async (redirectUri?: string) => {
    try {
      setLoading(true);
      setError(null);
      const callbackUrl = redirectUri || `${window.location.origin}/auth/linkedin/callback`;
      const res = await linkedInService.generateAuthURL(callbackUrl);
      if (res.success && res.authURL) {
        localStorage.setItem('linkedin_state', res.state || '');
        window.location.href = res.authURL;
      } else {
        throw new Error(res.error || 'Failed to generate LinkedIn auth URL');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to connect to LinkedIn');
    } finally {
      setLoading(false);
    }
  };

  return { connect, loading, error };
};


