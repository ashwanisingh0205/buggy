import { useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<null | { id: string; role: 'creator' | 'brand' }>(null);
  return { user, setUser };
}


