"use client";
import { useState } from 'react';
import { 
  Bell, 
  Check, 
  X, 
  AlertTriangle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

export default function BrandNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Campaign Approved',
      message: 'Your "Summer Fashion Campaign" has been approved and is now live.',
      timestamp: '2 minutes ago',
      read: false,
      action: { label: 'View Campaign', href: '/brand/campaigns' }
    },
    {
      id: '2',
      type: 'info',
      title: 'New Bid Received',
      message: 'Sarah Johnson submitted a bid for your "Tech Product Launch" campaign.',
      timestamp: '1 hour ago',
      read: false,
      action: { label: 'Review Bid', href: '/brand/bids' }
    },
    {
      id: '3',
      type: 'warning',
      title: 'Campaign Deadline Approaching',
      message: 'Your "Holiday Marketing" campaign deadline is in 3 days.',
      timestamp: '3 hours ago',
      read: true,
      action: { label: 'View Campaign', href: '/brand/campaigns' }
    },
    {
      id: '4',
      type: 'success',
      title: 'Payment Processed',
      message: 'Payment of ₹15,000 has been processed for campaign "Fitness Brand Partnership".',
      timestamp: '1 day ago',
      read: true
    },
    {
      id: '5',
      type: 'info',
      title: 'Creator Profile Updated',
      message: 'Mike Chen updated their profile with new portfolio samples.',
      timestamp: '2 days ago',
      read: true,
      action: { label: 'View Profile', href: '/brand/creator-profile/123' }
    },
    {
      id: '6',
      type: 'error',
      title: 'Campaign Rejected',
      message: 'Your "Controversial Topic" campaign was rejected due to policy violations.',
      timestamp: '3 days ago',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-7 h-7 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-7 h-7 text-yellow-600" />;
      case 'error':
        return <X className="w-7 h-7 text-red-600" />;
      default:
        return <Info className="w-7 h-7 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
      default:
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200';
    }
  };

  const getNotificationIconBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-100 to-green-200';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200';
      case 'error':
        return 'bg-gradient-to-br from-red-100 to-red-200';
      default:
        return 'bg-gradient-to-br from-blue-100 to-blue-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-3">Notifications</h1>
                <p className="text-blue-100 text-lg">Stay updated with your campaign activities</p>
              </div>
              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm font-semibold"
                  >
                    Mark all as read
                  </button>
                )}
                <div className="relative p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Bell className="w-8 h-8 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 w-fit">
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All', count: notifications.length, icon: '📋' },
              { key: 'unread', label: 'Unread', count: unreadCount, icon: '🔔' },
              { key: 'read', label: 'Read', count: notifications.length - unreadCount, icon: '✅' }
            ].map(({ key, label, count, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  filter === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{icon}</span>
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-6">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                notification.read 
                  ? 'bg-white/80 backdrop-blur-sm border-gray-200/50' 
                  : `${getNotificationBgColor(notification.type)} border-l-4 shadow-md`
              }`}
            >
              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 p-3 rounded-xl ${getNotificationIconBg(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-2 leading-relaxed ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-6 mt-4">
                        <span className="text-xs text-gray-400 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {notification.timestamp}
                        </span>
                        {!notification.read && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-6">
                      {notification.action && (
                        <a
                          href={notification.action.href}
                          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                          {notification.action.label}
                        </a>
                      )}
                      
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                          title="Mark as read"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        title="Delete notification"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto h-20 w-20 text-gray-400 mb-6">
              <Bell className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {(() => {
                if (filter === 'unread') return 'No unread notifications';
                if (filter === 'read') return 'No read notifications';
                return 'No notifications';
              })()}
            </h3>
            <p className="text-gray-500 text-lg">
              {(() => {
                if (filter === 'unread') return 'You\'re all caught up!';
                if (filter === 'read') return 'No notifications have been read yet';
                return 'You\'ll see notifications here when they arrive';
              })()}
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Notification Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-lg">📧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                <span className="sr-only">Toggle email notifications</span>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl border border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-lg">🔔</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive browser push notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600"></div>
                <span className="sr-only">Toggle push notifications</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-yellow-50/30 rounded-xl border border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-yellow-600 text-lg">📱</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive SMS for urgent updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-amber-600"></div>
                <span className="sr-only">Toggle SMS notifications</span>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl border border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-lg">📢</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Marketing Updates</h4>
                  <p className="text-sm text-gray-500">Receive promotional content</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-600"></div>
                <span className="sr-only">Toggle marketing notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

