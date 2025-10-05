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
  User,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Activity
} from 'lucide-react';
import CreatorLayout from '@/Components/Creater/CreatorLayout';
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



  const headerActions = (
    <>
      <button 
        onClick={fetchAnalytics}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        <span className="text-sm">Refresh</span>
      </button>
      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
        <Plus className="w-4 h-4" />
        <span className="font-medium">Create Post</span>
      </button>
      <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
        <User className="w-5 h-5 text-gray-600" />
      </div>
    </>
  );

  return (
    <CreatorLayout 
      title="Creator Dashboard" 
      subtitle="Welcome back! Here's your content overview"
      headerActions={headerActions}
    >
      {/* Loading and Error States */}
      {loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200/50 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">Loading your analytics...</span>
          </div>
        </div>
      )}
      
      {!!error && (
        <div className="bg-red-50/80 backdrop-blur-sm text-red-700 rounded-2xl p-6 mb-6 border border-red-200/50 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date(totals.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+12%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{totals.totalPosts}</p>
          <p className="text-xs text-gray-500">From last month</p>
        </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+5%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Scheduled Posts</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{totals.scheduledPosts}</p>
              <p className="text-xs text-gray-500">From last month</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+2.1%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Engagement Rate</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{totals.engagementRate}%</p>
              <p className="text-xs text-gray-500">From last month</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-red-600 text-sm font-medium">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>-3%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Avg. Engagement Score</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{totals.avgEngagementScore}</p>
              <p className="text-xs text-gray-500">From last month</p>
            </div>
          </div>

          {/* Enhanced Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Engagement Trends */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Engagement Trends</h3>
                  <p className="text-sm text-gray-500">Performance over time</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
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
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Posts by Platform</h3>
                  <p className="text-sm text-gray-500">Distribution across platforms</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>
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
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="posts" 
                    fill="#8884d8"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

      {/* Enhanced Top Performing Posts */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Top Performing Posts</h3>
            <p className="text-sm text-gray-500">Your best content this month</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Content</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Platform</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Engagement</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl">
                        {post.thumbnail}
                      </div>
                      <div className="max-w-md">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{post.content}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: post.platformColor }}
                    >
                      {post.platform}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{post.engagement}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
    </CreatorLayout>
  );
};

export default Dashboard;