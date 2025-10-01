'use client';

import {
  Home,
  FileText,
  BarChart3,
  Users,
  Settings,
  User,
} from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Logout from '../Logout';
import { authUtils } from '@/lib/auth';

const sidebarItems = [
  { name: 'Overview', icon: Home, href: '/creator' },
  { name: 'Posts', icon: FileText, href: '/creator/posts' },
  { name: 'Analytics', icon: BarChart3, href: '/creator/analytics' },
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
      className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
          : ''
      }`}
      onClick={handleClick}
    >
      <item.icon className="w-5 h-5 mr-3" />
      <span>{item.name}</span>
    </Link>
  );
});

SidebarItem.displayName = 'SidebarItem';

// Memoized user info component
const UserInfo = React.memo(({ user }: { user: Record<string, unknown> | null }) => {
  if (!user) return null;

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {(user.name as string) || (user.email as string) || 'User'}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {(user.role as string) || 'Creator'}
          </p>
        </div>
      </div>
    </div>
  );
});

UserInfo.displayName = 'UserInfo';

const Sidebar = React.memo(() => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [user, setUser] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Get user information on component mount
    const userData = authUtils.getUser();
    setUser(userData);
  }, []);

  const handleItemClick = useCallback((name: string) => {
    setActiveTab(name);
  }, []);

  // Memoized sidebar items
  const sidebarItemsList = useMemo(() => 
    sidebarItems.map((item) => (
      <SidebarItem
        key={item.name}
        item={item}
        isActive={item.name === activeTab}
        onItemClick={handleItemClick}
      />
    )), [activeTab, handleItemClick]);

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">Bloocube</h1>
      </div>
      
      <nav className="mt-6 flex-1">
        {sidebarItemsList}
        <Logout className="w-full justify-center bg-black" />
      </nav>
      
      {/* User info and logout section at the bottom */}
      <div className="p-6 border-t border-gray-200">
        <UserInfo user={user} />
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
