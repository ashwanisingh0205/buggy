"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Briefcase, Home, Settings, Users, Store } from 'lucide-react';
import React from 'react';

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = [
    { name: 'Overview', href: '/brand', icon: Home },
    { name: 'Campaigns', href: '/brand/campaigns', icon: Briefcase },
    { name: 'Marketplace', href: '/brand/marketplace', icon: Store },
    { name: 'Bids', href: '/brand/bids', icon: Users },
    { name: 'Notifications', href: '/brand/notifications', icon: Bell },
    { name: 'Settings', href: '/brand/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <aside className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">Bloocube</h1>
            <p className="text-xs text-gray-500">Brand Panel</p>
          </div>
          <nav className="flex-1 py-4">
            {nav.map(item => (
              <Link key={item.name} href={item.href} className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${pathname.startsWith(item.href) ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}`}>
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t text-xs text-gray-500">© {new Date().getFullYear()} Bloocube</div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Brand Dashboard</h2>
              <p className="text-xs text-gray-500">Manage campaigns and interact with creators</p>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

