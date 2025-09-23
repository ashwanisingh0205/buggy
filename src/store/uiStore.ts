import { useState } from 'react';

export function useUiStore() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return { sidebarOpen, setSidebarOpen };
}


