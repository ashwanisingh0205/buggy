'use client';
import React, { useState } from 'react';
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
  Home,
  FileText,
  BarChart3,
  Users,
  Settings,
  Plus,
  Eye,
  User,
  Menu
} from 'lucide-react';
import Sidebar from '@/Components/Creater/Sidebar';

const Dashboard = () => {

  // Sample data for charts
  const engagementData = [
    { month: '6/21', likes: 1200, comments: 200, shares: 150 },
    { month: '8/21', likes: 900, comments: 180, shares: 120 },
    { month: '10/21', likes: 1100, comments: 220, shares: 140 },
    { month: '12/21', likes: 800, comments: 160, shares: 110 },
    { month: '2/22', likes: 1300, comments: 250, shares: 180 },
    { month: '4/22', likes: 1000, comments: 200, shares: 160 },
    { month: '6/22', likes: 1400, comments: 280, shares: 200 },
    { month: '8/22', likes: 1100, comments: 230, shares: 170 },
    { month: '10/22', likes: 1200, comments: 240, shares: 180 },
    { month: '12/22', likes: 900, comments: 190, shares: 150 },
    { month: '2/23', likes: 1000, comments: 210, shares: 160 },
    { month: '4/23', likes: 800, comments: 170, shares: 130 },
    { month: '6/23', likes: 700, comments: 150, shares: 120 }
  ];

  const platformData = [
    { name: 'Instagram', posts: 680, color: '#E1306C' },
    { name: 'Facebook', posts: 520, color: '#1877F2' },
    { name: 'X', posts: 350, color: '#1DA1F2' },
    { name: 'LinkedIn', posts: 180, color: '#0077B5' },
    { name: 'YouTube', posts: 120, color: '#FF0000' }
  ];

  const topPosts = [
    {
      id: 1,
      thumbnail: '📸',
      content: 'Our new campaign launch was a huge success! So much positive feedback. Feeling grateful for our community.',
      platform: 'Instagram',
      engagement: '12,890',
      platformColor: '#E1306C'
    },
    {
      id: 2,
      thumbnail: '💡',
      content: 'Behind the scenes: Brainstorming fresh content ideas for Q1! Get ready for some exciting announcements!',
      platform: 'Facebook',
      engagement: '9,234',
      platformColor: '#1877F2'
    },
    {
      id: 3,
      thumbnail: '📊',
      content: 'Understanding audience demographics is key to targeted marketing. Dive deep into our latest insights report.',
      platform: 'LinkedIn',
      engagement: '7,891',
      platformColor: '#0077B5'
    },
    {
      id: 4,
      thumbnail: '🎯',
      content: 'Quick thoughts about the industry trends is sparking some great conversations. What are your thoughts?',
      platform: 'X',
      engagement: '5,678',
      platformColor: '#1DA1F2'
    },
    {
      id: 5,
      thumbnail: '👥',
      content: 'User-generated content is our favorite! Thanks for sharing your amazing experiences with our platform!',
      platform: 'Instagram',
      engagement: '4,123',
      platformColor: '#E1306C'
    }
  ];



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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Total Posts</h3>
              <p className="text-3xl font-bold text-gray-800">1,567</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Scheduled Posts</h3>
              <p className="text-3xl font-bold text-gray-800">245</p>
              <p className="text-xs text-blue-600 mt-1">+5% from last month</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Engagement Rate</h3>
              <p className="text-3xl font-bold text-gray-800">8.7%</p>
              <p className="text-xs text-green-600 mt-1">+2.1% from last month</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Avg. All Engagement Score</h3>
              <p className="text-3xl font-bold text-gray-800">78</p>
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