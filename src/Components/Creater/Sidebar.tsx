'use client';

import {
  Home,
  FileText,
  BarChart3,
  Users,
  Settings,
  User,
  Store,
} from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Logout from '../Logout';
import { authUtils } from '@/lib/auth';

const sidebarItems = [
  { name: 'Overview', icon: Home, href: '/creator' },
  { name: 'Posts', icon: FileText, href: '/creator/posts' },
  { name: 'Analytics', icon: BarChart3, href: '/creator/analytics' },
  { name: 'Marketplace', icon: Store, href: '/creator/marketplace' },
  { name: 'Competitors', icon: Users, href: '/creator/competitors' },
  { name: 'Settings', icon: Settings, href: '/creator/settings' },
];

// Memoized sidebar item component
const SidebarItem = React.memo(({ 
  item, 
  isActive, 
  onItemClick 
}: { 
  item: typeof sidebarItems[0]; 
  isActive: boolean; 
  onItemClick: (href: string) => void;
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onItemClick(item.href);
  }, [onItemClick, item.href]);

  return (
    <button
      className={`group flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 cursor-pointer transition-all duration-300 ease-in-out rounded-xl mx-2 transform hover:scale-[1.02] hover:shadow-lg text-left ${
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-lg border border-blue-200/50 scale-[1.02]'
          : 'hover:shadow-md'
      }`}
      onClick={handleClick}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ease-in-out ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md scale-105' 
          : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:to-purple-100 group-hover:scale-105'
      }`}>
        <item.icon className={`w-5 h-5 transition-all duration-300 ${
          isActive ? 'text-white scale-110' : 'text-gray-600 group-hover:text-blue-600 group-hover:scale-110'
        }`} />
      </div>
      <span className="font-semibold transition-all duration-300 group-hover:translate-x-1 whitespace-nowrap">{item.name}</span>
    </button>
  );
});

SidebarItem.displayName = 'SidebarItem';

// Memoized user info component
const UserInfo = React.memo(({ user }: { user: Record<string, unknown> | null }) => {
  if (!user) return null;

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {(user.name as string) || (user.email as string) || 'User'}
          </p>
          <p className="text-xs text-gray-500 capitalize font-semibold">
            {(user.role as string) || 'Creator'}
          </p>
        </div>
      </div>
    </div>
  );
});

UserInfo.displayName = 'UserInfo';

const Sidebar = React.memo(() => {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get user information on component mount
    const userData = authUtils.getUser();
    setUser(userData);
  }, []);

  const handleItemClick = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  // Helper function to determine if a sidebar item is active
  const isItemActive = useCallback((item: typeof sidebarItems[0]) => {
    // Normalize pathname by removing trailing slashes and query params
    const normalizedPathname = pathname.replace(/\/$/, '').split('?')[0];
    const normalizedHref = item.href.replace(/\/$/, '');
    
    // Special case for Overview - only active on exact match
    if (normalizedHref === '/creator') {
      return normalizedPathname === '/creator';
    }
    
    // For all other routes, check if pathname starts with the href
    return normalizedPathname.startsWith(normalizedHref);
  }, [pathname]);

  // Memoized sidebar items
  const sidebarItemsList = useMemo(() => 
    sidebarItems.map((item) => (
      <SidebarItem
        key={item.name}
        item={item}
        isActive={isItemActive(item)}
        onItemClick={handleItemClick}
      />
    )), [isItemActive, handleItemClick]);

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-200/50 flex flex-col z-50">
      {/* Enhanced Logo Section */}
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bloocube</h1>
            <p className="text-xs text-gray-500 font-medium">Creator Platform</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Navigation */}
      <nav className="mt-6 flex-1 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="space-y-1">
          {sidebarItemsList}
        </div>
      </nav>
      
      {/* Enhanced User info and logout section */}
      <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
        <UserInfo user={user} />
        <div className="mt-3">
          <Logout className="w-full justify-center flex bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105" />
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
