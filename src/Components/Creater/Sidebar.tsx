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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logout from '../Logout';
import { authUtils } from '@/lib/auth';

const sidebarItems = [
  { name: 'Overview', icon: Home, href: '/creator' },
  { name: 'Posts', icon: FileText, href: '/creator/posts' },
  { name: 'Analytics', icon: BarChart3, href: '/creator/analytics' },
  { name: 'Marketplace', icon: Store, href: '/creator/marketplace' },
  { name: 'Competitor Analysis', icon: Users, href: '/creator/competitors' },
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
  onItemClick: (name: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onItemClick(item.name);
  }, [item.name, onItemClick]);

  return (
    <Link
      href={item.href}
      className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 cursor-pointer transition-all duration-200 rounded-xl mx-2 ${
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm border border-blue-200/50'
          : 'hover:shadow-sm'
      }`}
      onClick={handleClick}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors ${
        isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-100'
      }`}>
        <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
      </div>
      <span className="font-medium">{item.name}</span>
    </Link>
  );
});

SidebarItem.displayName = 'SidebarItem';

// Memoized user info component
const UserInfo = React.memo(({ user }: { user: Record<string, unknown> | null }) => {
  if (!user) return null;

  return (
    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {(user.name as string) || (user.email as string) || 'User'}
          </p>
          <p className="text-xs text-gray-500 capitalize font-medium">
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

  useEffect(() => {
    // Get user information on component mount
    const userData = authUtils.getUser();
    setUser(userData);
  }, []);

  const handleItemClick = useCallback((name: string) => {
    // This is now handled by Next.js routing, but keeping for potential future use
    console.log('Sidebar item clicked:', name);
  }, []);

  // Helper function to determine if a sidebar item is active
  const isItemActive = useCallback((item: typeof sidebarItems[0]) => {
    console.log(`🔍 Checking: ${item.name}`, { pathname, href: item.href });
    
    // Normalize pathname by removing trailing slashes and query params
    const normalizedPathname = pathname.replace(/\/$/, '').split('?')[0];
    const normalizedHref = item.href.replace(/\/$/, '');
    
    // Special case for Overview - only active on exact match
    if (normalizedHref === '/creator') {
      const isActive = normalizedPathname === '/creator';
      console.log(`${isActive ? '✅' : '❌'} Overview check:`, { 
        normalizedPathname, 
        normalizedHref, 
        isActive 
      });
      return isActive;
    }
    
    // For all other routes, check if pathname starts with the href
    const isActive = normalizedPathname.startsWith(normalizedHref);
    console.log(`${isActive ? '✅' : '❌'} Other route check:`, { 
      normalizedPathname, 
      normalizedHref, 
      isActive 
    });
    return isActive;
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
    <div className="w-64 bg-white/90 backdrop-blur-sm shadow-xl border-r border-gray-200/50 flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bloocube</h1>
            <p className="text-xs text-gray-500">Creator Platform</p>
          </div>
        </div>
        {/* Debug info */}
       
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3">
        <div className="space-y-1">
          {sidebarItemsList}
        </div>
      </nav>
      
      {/* User info and logout section at the bottom */}
      <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
        <UserInfo user={user} />
        <div className="mt-3">
          <Logout className="w-full justify-center flex bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm" />
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
