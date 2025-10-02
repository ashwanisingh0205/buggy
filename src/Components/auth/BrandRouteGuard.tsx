'use client';

import { useEffect, useState } from 'react';
import { authUtils } from '@/lib/auth';

interface BrandRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function BrandRouteGuard({ children, fallback }: BrandRouteGuardProps) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authUtils.getUser?.();
    const userRole = user?.role;
    
    if (userRole === 'brand' || userRole === 'admin') {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!authorized) {
    return fallback || (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-400 mt-2">This page is for brand users only.</p>
        <p className="text-sm text-gray-500 mt-4">
          If you're a creator, please visit the <a href="/creator" className="text-blue-600 hover:underline">Creator Dashboard</a> instead.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
