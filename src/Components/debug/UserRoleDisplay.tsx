'use client';

import { useEffect, useState } from 'react';
import { authUtils } from '@/lib/auth';

export default function UserRoleDisplay() {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const user = authUtils.getUser?.();
    const token = authUtils.getToken?.();
    setUserInfo({
      user,
      hasToken: !!token,
      tokenLength: token?.length || 0
    });
  }, []);

  if (!userInfo) return null;

  return (
    <div className="fixed top-4 right-4 bg-gray-900 text-white p-3 rounded text-xs max-w-sm z-50">
      <div className="font-bold mb-1">Debug: User Info</div>
      <div>Role: <span className="text-yellow-300">{userInfo.user?.role || 'unknown'}</span></div>
      <div>ID: <span className="text-green-300">{userInfo.user?._id || userInfo.user?.id || 'none'}</span></div>
      <div>Email: <span className="text-blue-300">{userInfo.user?.email || 'none'}</span></div>
      <div>Token: <span className="text-purple-300">{userInfo.hasToken ? `${userInfo.tokenLength} chars` : 'none'}</span></div>
    </div>
  );
}
