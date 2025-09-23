import { useState } from 'react';

export function useAuthStore() {
  const [token, setToken] = useState<string | null>(null);
  return { token, setToken };
}


