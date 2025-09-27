'use client';

import {
  Home,
  FileText,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

const sidebarItems = [
  { name: 'Overview', icon: Home, href: '/creator' },
  { name: 'Posts', icon: FileText, href: '/creator/posts' },
  { name: 'Analytics', icon: BarChart3, href: '/creator/analytics' },
  { name: 'Competitor Analysis', icon: Users, href: '/creator/competitors' },
  { name: 'Settings', icon: Settings, href: '/creator/settings' },
];

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">Bloocube</h1>
      </div>
      <nav className="mt-6">
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer ${
              item.name === activeTab
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                : ''
            }`}
            onClick={() => setActiveTab(item.name)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
