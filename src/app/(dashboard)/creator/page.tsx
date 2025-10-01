'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  Plus,
  Eye,
  User
} from 'lucide-react';
import Sidebar from '@/Components/Creater/Sidebar';
import { apiRequest } from '@/lib/apiClient';
import { authUtils } from '@/lib/auth';

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Array<Record<string, any>>>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const user = authUtils.getUser() as { id?: string } | null;
      const userId = user?.id || (authUtils as unknown as { getUserId?: () => string }).getUserId?.();
      if (!userId) throw new Error('Not authenticated');
      const res = await apiRequest<{ success: boolean; data: { analytics: any[] } }>(`/api/analytics/user/${userId}`);
      setAnalytics(res?.data?.analytics || []);
      setLastUpdated(Date.now());
    } catch (e) {
      setError((e as Error).message || 'Failed to load analytics');
      setAnalytics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const engagementData = useMemo(() => {
    const byMonth: Record<string, { likes: number; comments: number; shares: number }> = {};
    analytics.forEach((a) => {
      const d = a?.timing?.posted_at ? new Date(a.timing.posted_at) : new Date();
      const key = `${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;
      if (!byMonth[key]) byMonth[key] = { likes: 0, comments: 0, shares: 0 };
      byMonth[key].likes += a?.metrics?.likes || 0;
      byMonth[key].comments += a?.metrics?.comments || 0;
      byMonth[key].shares += a?.metrics?.shares || 0;
    });
    return Object.entries(byMonth).map(([month, v]) => ({ month, ...v }));
  }, [analytics]);

  const platformData = useMemo(() => {
    const colors: Record<string, string> = {
      instagram: '#E1306C',
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      linkedin: '#0077B5',
      youtube: '#FF0000',
      tiktok: '#010101'
    };
    const counts: Record<string, number> = {};
    analytics.forEach((a) => {
      const p = String(a.platform || '').toLowerCase();
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).map(([name, posts]) => ({ name, posts, color: colors[name] || '#999999' }));
  }, [analytics]);

  const topPosts = useMemo(() => {
    return [...analytics]
      .map((a) => ({
        id: a.post_id,
        thumbnail: a.content?.media_type === 'video' ? '🎥' : '📸',
        content: a.content?.caption || a.post_id,
        platform: (a.platform || '').toString(),
        engagement: String((a.metrics?.likes || 0) + (a.metrics?.comments || 0) + (a.metrics?.shares || 0)),
        platformColor:
          a.platform === 'instagram' ? '#E1306C' :
          a.platform === 'facebook' ? '#1877F2' :
          a.platform === 'twitter' ? '#1DA1F2' :
          a.platform === 'linkedin' ? '#0077B5' :
          a.platform === 'youtube' ? '#FF0000' : '#999999'
      }))
      .sort((p1, p2) => parseInt(p2.engagement) - parseInt(p1.engagement))
      .slice(0, 5);
  }, [analytics]);

  const totals = useMemo(() => {
    const sum = (key: string) => analytics.reduce((s, a) => s + (a.metrics?.[key] || 0), 0);
    return {
      totalPosts: analytics.length,
      scheduledPosts: 0,
      engagementRate: analytics.length ? (((sum('likes') + sum('comments') + sum('shares')) / Math.max(sum('views'), 1)) * 100).toFixed(1) : '0.0',
      avgEngagementScore: analytics.length ? Math.round((sum('likes') + sum('comments') * 2 + sum('shares') * 3) / analytics.length) : 0,
      lastUpdated
    };
  }, [analytics, lastUpdated]);



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
     <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 overflow-y-auto h-full bg-gradient-to-br from-purple-100 to-blue-100">
          {loading && (
            <div className="bg-white rounded-lg p-4 mb-4 border shadow-sm">Loading analytics…</div>
          )}
          {!!error && (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4 border border-red-200">{error}</div>
          )}
          {!loading && !error && (
            <p className="text-xs text-gray-500 mb-4">Last updated: {new Date(totals.lastUpdated).toLocaleTimeString()}</p>
          )}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Total Posts</h3>
              <p className="text-3xl font-bold text-gray-800">{totals.totalPosts}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Scheduled Posts</h3>
              <p className="text-3xl font-bold text-gray-800">{totals.scheduledPosts}</p>
              <p className="text-xs text-blue-600 mt-1">+5% from last month</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Engagement Rate</h3>
              <p className="text-3xl font-bold text-gray-800">{totals.engagementRate}%</p>
              <p className="text-xs text-green-600 mt-1">+2.1% from last month</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Avg. All Engagement Score</h3>
              <p className="text-3xl font-bold text-gray-800">{totals.avgEngagementScore}</p>
              <p className="text-xs text-red-600 mt-1">-3% from last month</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Engagement Trends */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="likes" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Likes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    name="Comments"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="shares" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                    name="Shares"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Posts by Platform */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Posts by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="posts" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-2">
                <span className="text-sm text-blue-600 font-medium">● Posts</span>
              </div>
            </div>
          </div>

          {/* Top Performing Posts */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Posts</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Thumbnail</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Content</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Platform</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Engagement Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {post.thumbnail}
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-md">
                        <p className="text-sm text-gray-800 line-clamp-2">{post.content}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: post.platformColor }}
                        >
                          {post.platform}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-800">{post.engagement}</span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;