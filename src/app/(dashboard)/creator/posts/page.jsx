'use client'

import React, { useState } from 'react';
import { Calendar, Upload, MoreHorizontal, Facebook, Instagram, Twitter, Linkedin, BarChart3, Users, MessageCircle, Heart, Share, Eye } from 'lucide-react';
import Sidebar from '@/Components/Creater/Sidebar';

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    instagram: false,
    facebook: false,
    twitter: false,
    linkedin: false
  });

  const scheduledPosts = [
    {
      id: 1,
      preview: '/api/placeholder/60/60',
      content: 'Excited to announce...',
      platforms: ['instagram'],
      scheduledFor: '2024-07-04 10:00 AM',
      status: 'Scheduled',
      engagement: 'N/A'
    },
    {
      id: 2,
      preview: '/api/placeholder/60/60',
      content: 'Tips for healthy living...',
      platforms: ['facebook'],
      scheduledFor: '2024-07-05 02:30 PM',
      status: 'Scheduled',
      engagement: 'N/A'
    },
    {
      id: 3,
      preview: '/api/placeholder/60/60',
      content: 'Join our webinar for...',
      platforms: ['linkedin'],
      scheduledFor: '2024-07-06 09:00 AM',
      status: 'Draft',
      engagement: 'N/A'
    },
    {
      id: 4,
      preview: '/api/placeholder/60/60',
      content: 'Our startup journey...',
      platforms: ['instagram'],
      scheduledFor: '2024-07-08 11:15 AM',
      status: 'Scheduled',
      engagement: 'N/A'
    },
    {
      id: 5,
      preview: '/api/placeholder/60/60',
      content: 'Our new features...',
      platforms: ['twitter'],
      scheduledFor: '2024-07-09 08:00 AM',
      status: 'Scheduled',
      engagement: 'N/A'
    }
  ];

  const postHistory = [
    {
      id: 1,
      preview: '/api/placeholder/40/40',
      content: 'Join our new launch!',
      platform: 'Facebook',
      postedOn: '2024-07-03 8:30 PM',
      status: 'Published',
      engagement: '145 likes, 23 comments'
    },
    {
      id: 2,
      preview: '/api/placeholder/40/40',
      content: 'New product lineup...',
      platform: 'Instagram',
      postedOn: '2024-07-02 10:15 AM',
      status: 'Published',
      engagement: '520 Likes, 15 Comments'
    },
    {
      id: 3,
      preview: '/api/placeholder/40/40',
      content: 'About our meetup',
      platform: 'LinkedIn',
      postedOn: '2024-07-01 11:30 AM',
      status: 'Published',
      engagement: '89 Likes, 12 Comments'
    },
    {
      id: 4,
      preview: '/api/placeholder/40/40',
      content: 'About our company',
      platform: 'Twitter',
      postedOn: '2024-06-30 7:45 PM',
      status: 'Published',
      engagement: '234 Likes, 15 Comments'
    },
    {
      id: 5,
      preview: '/api/placeholder/40/40',
      content: 'Summer road trip!',
      platform: 'Instagram',
      postedOn: '2024-06-29 9:15 AM',
      status: 'Published',
      engagement: '145 Likes, 20 Comments'
    }
  ];

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook size={16} className="text-blue-600" />;
      case 'instagram': return <Instagram size={16} className="text-pink-600" />;
      case 'twitter': return <Twitter size={16} className="text-sky-500" />;
      case 'linkedin': return <Linkedin size={16} className="text-blue-700" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
        <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Posts</h1>

            {/* Create New Post Section */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Create New Post</h2>
                <p className="text-sm text-gray-600">Craft your next engaging content across media</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What's on your mind? Share your thoughts, updates, or promotional content."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">MEDIA UPLOAD</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-1">Drag & Drop or Click to Upload Media</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">SCHEDULING SUGGESTIONS</h3>
                  <input
                    type="text"
                    placeholder="Best times (eg - Weekday)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">SELECT PLATFORMS</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handlePlatformToggle('instagram')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedPlatforms.instagram 
                          ? 'border-pink-500 bg-pink-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Instagram size={20} className="text-pink-600" />
                    </button>
                    <button
                      onClick={() => handlePlatformToggle('facebook')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedPlatforms.facebook 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Facebook size={20} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handlePlatformToggle('twitter')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedPlatforms.twitter 
                          ? 'border-sky-500 bg-sky-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Twitter size={20} className="text-sky-500" />
                    </button>
                    <button
                      onClick={() => handlePlatformToggle('linkedin')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedPlatforms.linkedin 
                          ? 'border-blue-700 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Linkedin size={20} className="text-blue-700" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule
                  </button>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Publish Now
                  </button>
                </div>
              </div>
            </div>

            {/* Scheduled Posts Section */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Scheduled Posts</h2>
                <p className="text-sm text-gray-600">View and manage your scheduled posts</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled For</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scheduledPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                            <span className="text-sm text-gray-900 truncate max-w-xs">{post.content}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-1">
                            {post.platforms.map((platform) => (
                              <span key={platform} className="inline-flex">
                                {getPlatformIcon(platform)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{post.scheduledFor}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            post.status === 'Scheduled' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{post.engagement}</td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Post History Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Post History</h2>
                <p className="text-sm text-gray-600">View your post history and performance</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {postHistory.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                            <span className="text-sm text-gray-900 truncate max-w-xs">{post.content}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getPlatformIcon(post.platform)}
                            <span className="text-sm text-gray-900">{post.platform}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{post.postedOn}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{post.engagement}</td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={16} />
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
    </div>
  );
}