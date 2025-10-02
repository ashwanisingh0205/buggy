'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Upload, 
  MoreHorizontal, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Music,
  BarChart3, 
  Users, 
  MessageCircle, 
  Heart, 
  Share, 
  Eye,
  Image as ImageIcon,
  Video,
  FileText,
  Hash,
  AtSign,
  Clock,
  Send,
  Save,
  Trash2,
  Edit3,
  Plus,
  X,
  Menu
} from 'lucide-react';
import Sidebar from '@/Components/Creater/Sidebar';
import { apiRequest } from '@/lib/apiClient';
import { authUtils } from '@/lib/auth';

// Platform configurations with proper typing
interface PlatformFieldConfig {
  required: boolean;
  placeholder: string;
  maxLength?: number;
  type?: string;
  options?: string[];
  default?: string;
  label?: string;
}

interface PlatformConfig {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  postTypes: string[];
  maxCaptionLength: number;
  supportedMedia: string[];
  fields: Record<string, PlatformFieldConfig>;
}

// Platform configurations
const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'pink',
    postTypes: ['post', 'story', 'reel', 'carousel'],
    maxCaptionLength: 2200,
    supportedMedia: ['image', 'video'],
    fields: {
      caption: { required: false, placeholder: 'Write a caption...' },
      hashtags: { required: false, placeholder: '#fashion #style #ootd' },
      mentions: { required: false, placeholder: '@username' },
      location: { required: false, placeholder: 'Add location' },
      altText: { required: false, placeholder: 'Describe this image for accessibility' }
    }
  },
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: 'red',
    postTypes: ['video', 'short'],
    maxCaptionLength: 5000,
    supportedMedia: ['video'],
    fields: {
      title: { required: true, placeholder: 'Enter video title (max 100 characters)', maxLength: 100 },
      description: { required: false, placeholder: 'Tell viewers about your video', maxLength: 5000 },
      tags: { required: false, placeholder: 'gaming, tutorial, review' },
      category: { required: false, placeholder: 'Select category', options: ['Entertainment', 'Education', 'Gaming', 'Music', 'News', 'Sports', 'Technology'] },
      privacy: { required: false, placeholder: 'Select privacy', options: ['public', 'unlisted', 'private'], default: 'public' },
      thumbnail: { required: false, placeholder: 'Upload thumbnail', type: 'file' }
    }
  },
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'sky',
    postTypes: ['post', 'thread', 'poll'],
    maxCaptionLength: 280,
    supportedMedia: ['image', 'video'],
    fields: {
      content: { required: true, placeholder: "What's happening?", maxLength: 280 },
      thread: { required: false, type: 'array', placeholder: 'Add another tweet to thread' },
      poll: { required: false, placeholder: 'Create a poll', type: 'poll', options: ['Option 1', 'Option 2'] },
      replySettings: { required: false, placeholder: 'Who can reply?', options: ['everyone', 'following', 'mentioned'], default: 'everyone' }
    }
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'blue',
    postTypes: ['post', 'article'],
    maxCaptionLength: 3000,
    supportedMedia: ['image', 'video', 'document'],
    fields: {
      content: { required: true, placeholder: 'Share your professional thoughts...' },
      hashtags: { required: false, placeholder: '#professional #networking #career' },
      mentions: { required: false, placeholder: '@connection' },
      visibility: { required: false, placeholder: 'Who can see this?', options: ['public', 'connections'], default: 'public' },
      articleTitle: { required: false, placeholder: 'Article title (for article posts)' },
      articleBody: { required: false, placeholder: 'Article content', type: 'textarea' }
    }
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'blue',
    postTypes: ['post', 'story', 'event'],
    maxCaptionLength: 63206,
    supportedMedia: ['image', 'video'],
    fields: {
      content: { required: false, placeholder: "What's on your mind?" },
      hashtags: { required: false, placeholder: '#facebook #social' },
      mentions: { required: false, placeholder: '@friend' },
      feeling: { required: false, placeholder: 'How are you feeling?' },
      location: { required: false, placeholder: 'Check in somewhere' },
      linkPreview: { required: false, type: 'url', placeholder: 'Add a link' }
    }
  },
};

interface Post {
  _id?: string;
  platform: string;
  post_type: string;
  status: string;
  content: {
    caption?: string;
    hashtags?: string[];
    mentions?: string[];
  };
  [key: string]: any;
}

export default function PostsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedPostType, setSelectedPostType] = useState<string>('');
  const [postData, setPostData] = useState<any>({});
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('create');
  const [youtubeConnected, setYoutubeConnected] = useState<boolean>(false);
  const [twitterConnected, setTwitterConnected] = useState<boolean>(false);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(false);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
    checkConnections();
  }, []);

  const checkConnections = async () => {
    try {
      setCheckingConnection(true);
      
      // Check YouTube connection
      try {
        const youtubeResponse = await apiRequest('/api/youtube/channel') as any;
        setYoutubeConnected(youtubeResponse.success);
      } catch (err) {
        setYoutubeConnected(false);
      }
      
      // Check Twitter connection
      try {
        const twitterResponse = await apiRequest('/api/twitter/profile') as any;
        setTwitterConnected(twitterResponse.success && !!twitterResponse.profile);
      } catch (err) {
        setTwitterConnected(false);
      }
    } catch (err) {
      console.error('Connection check error:', err);
    } finally {
      setCheckingConnection(false);
    }
  };

  const checkYouTubeConnection = async () => {
    try {
      setCheckingConnection(true);
      const response = await apiRequest('/api/youtube/channel') as any;
      setYoutubeConnected(response.success);
    } catch (err) {
      setYoutubeConnected(false);
    } finally {
      setCheckingConnection(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await apiRequest<{posts: Post[], pagination: any}>('/api/posts');
      const allPosts = response.posts || [];
      setPosts(allPosts.filter(p => p.status === 'published'));
      setScheduledPosts(allPosts.filter(p => p.status === 'scheduled'));
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  };

  const handlePlatformSelect = async (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedPostType('');
    setPostData({});
    setMediaFiles([]);
    setError('');
    setSuccess('');

    // Check platform connections when selected
    if (platform === 'youtube') {
      try {
        setCheckingConnection(true);
        const response = await apiRequest('/api/youtube/channel') as any;
        setYoutubeConnected(response.success);
      } catch (err) {
        setYoutubeConnected(false);
      } finally {
        setCheckingConnection(false);
      }
    } else if (platform === 'twitter') {
      try {
        setCheckingConnection(true);
        const response = await apiRequest('/api/twitter/profile') as any;
        setTwitterConnected(response.success && !!response.profile);
      } catch (err) {
        setTwitterConnected(false);
      } finally {
        setCheckingConnection(false);
      }
    }
  };

  const handlePostTypeSelect = (postType: string) => {
    setSelectedPostType(postType);
    setPostData({});
  };

  const handleFieldChange = (field: string, value: any) => {
    setPostData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      const config = PLATFORM_CONFIGS[selectedPlatform];
      
      if (!config) return;

      // Validate file types
      const validFiles = fileArray.filter(file => {
        const fileType = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 'other';
        return config.supportedMedia.includes(fileType);
      });

      setMediaFiles(validFiles);
    }
  };

  const validatePost = () => {
    if (!selectedPlatform || !selectedPostType) {
      throw new Error('Please select platform and post type');
    }
  
    const config = PLATFORM_CONFIGS[selectedPlatform];
    if (!config) {
      throw new Error('Invalid platform selected');
    }
    
    // Check required fields with better error messages
    Object.entries(config.fields).forEach(([field, fieldConfig]) => {
      if (fieldConfig.required) {
        if (!postData[field] && postData[field] !== false) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required for ${config.name}`);
        }
        
        // Additional validation for specific fields
        if (field === 'title' && postData[field] && postData[field].length > 100) {
          throw new Error('Title must be 100 characters or less');
        }
        
        if (field === 'content' && postData[field] && postData[field].length > config.maxCaptionLength) {
          throw new Error(`Content exceeds maximum length of ${config.maxCaptionLength} characters`);
        }
      }
    });
  
    // Check platform connections
    if (selectedPlatform === 'youtube' && !youtubeConnected) {
      throw new Error('Please connect your YouTube account in Settings before posting');
    }
  
    if (selectedPlatform === 'twitter' && !twitterConnected) {
      throw new Error('Please connect your Twitter account in Settings before posting');
    }
  
    // Check media requirements
    if (selectedPlatform === 'youtube' && mediaFiles.length === 0) {
      throw new Error('Video file is required for YouTube posts');
    }
  };

  const createPost = async (action: 'draft' | 'publish' | 'schedule') => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
  
      validatePost();
  
      // For Twitter posts, use the Twitter API directly
      if (selectedPlatform === 'twitter' && action === 'publish') {
        console.log('🐦 Publishing directly to Twitter API');
        
        const twitterPayload = {
          type: selectedPostType,
          content: postData.content || '',
          thread: postData.thread || [],
          poll: postData.poll
        };
  
        console.log('🚀 Sending to Twitter API:', twitterPayload);
  
        // Use Twitter API endpoint directly
        const result = await apiRequest('/api/twitter/post', {
          method: 'POST',
          body: JSON.stringify(twitterPayload)
        }) as any;
  
        if (result.success) {
          setSuccess('Tweet posted successfully!');
          // Also save to your database as a published post
          await savePostToDatabase(action);
        } else {
          throw new Error(result.error || 'Failed to post tweet');
        }
  
      } else {
        // For other platforms or draft/scheduled posts, use the regular posts API
        console.log('💾 Saving to database');
        
        const postPayload: any = {
          platform: selectedPlatform,
          post_type: selectedPostType,
          status: action === 'draft' ? 'draft' : action === 'publish' ? 'published' : 'scheduled',
          content: {
            caption: postData.caption || postData.content || '',
            hashtags: postData.hashtags ? postData.hashtags.split(',').map((h: string) => h.trim()) : [],
            mentions: postData.mentions ? postData.mentions.split(',').map((m: string) => m.trim()) : []
          }
        };
  
        // Add platform-specific content for database storage
        if (selectedPlatform === 'youtube') {
          postPayload.platform_content = {
            youtube: {
              title: postData.title,
              description: postData.description,
              tags: postData.tags ? postData.tags.split(',').map((t: string) => t.trim()) : [],
              privacy_status: postData.privacy || 'public'
            }
          };
        } else if (selectedPlatform === 'twitter') {
          postPayload.platform_content = {
            twitter: {
              text: postData.content,
              thread: postData.thread || [],
              reply_settings: postData.replySettings || 'everyone',
              poll: postData.poll ? {
                options: postData.poll.options || [],
                duration_minutes: postData.poll.durationMinutes || 1440
              } : undefined
            }
          };
        }
  
        // Add scheduling if applicable
        if (postData.scheduledFor) {
          postPayload.scheduling = {
            scheduled_for: postData.scheduledFor,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          };
        }
  
        console.log('💾 Saving to posts database:', postPayload);
  
        const response = await apiRequest('/api/posts', {
          method: 'POST',
          body: JSON.stringify(postPayload)
        }) as any;
  
        setSuccess(`Post ${action === 'draft' ? 'saved as draft' : action === 'publish' ? 'published' : 'scheduled'} successfully!`);
      }
  
      // Reset form and reload posts
      setSelectedPlatform('');
      setSelectedPostType('');
      setPostData({});
      setMediaFiles([]);
      loadPosts();
  
    } catch (err: any) {
      console.error('❌ Create post error:', err);
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to save published Twitter posts to database
  const savePostToDatabase = async (action: 'draft' | 'publish' | 'schedule') => {
    try {
      const postPayload = {
        platform: 'twitter',
        post_type: selectedPostType,
        status: 'published', // Since we already published to Twitter
        content: {
          caption: postData.content || '',
          hashtags: postData.hashtags ? postData.hashtags.split(',').map((h: string) => h.trim()) : [],
          mentions: postData.mentions ? postData.mentions.split(',').map((m: string) => m.trim()) : []
        },
        platform_content: {
          twitter: {
            text: postData.content,
            thread: postData.thread || [],
            reply_settings: postData.replySettings || 'everyone',
            poll: postData.poll ? {
              options: postData.poll.options || [],
              duration_minutes: postData.poll.durationMinutes || 1440
            } : undefined
          }
        },
        publishing: {
          published_at: new Date().toISOString()
        }
      };
  
      await apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify(postPayload)
      });
  
      console.log('✅ Twitter post saved to database');
    } catch (error) {
      console.error('❌ Failed to save Twitter post to database:', error);
      // Don't throw error here - the main Twitter post was successful
    }
  };

  const renderPlatformFields = () => {
    if (!selectedPlatform || !selectedPostType) return null;

    const config = PLATFORM_CONFIGS[selectedPlatform];
    if (!config) return null;
    
    return (
      <div className="space-y-6">
        {Object.entries(config.fields).map(([field, fieldConfig]) => {
          if (fieldConfig.type === 'array' && field === 'thread') {
            return (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Thread Tweets {fieldConfig.required && <span className="text-red-500">*</span>}
                </label>
                {(postData.thread || ['']).map((tweet: string, index: number) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={tweet}
                      onChange={(e) => {
                        const newThread = [...(postData.thread || [''])];
                        newThread[index] = e.target.value;
                        handleFieldChange('thread', newThread);
                      }}
                      placeholder={`Tweet ${index + 1}`}
                      maxLength={280}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {index > 0 && (
                      <button
                        onClick={() => {
                          const newThread = (postData.thread || []).filter((_: any, i: number) => i !== index);
                          handleFieldChange('thread', newThread);
                        }}
                        className="p-3 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newThread = [...(postData.thread || ['']), ''];
                    handleFieldChange('thread', newThread);
                  }}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} />
                  <span>Add Tweet</span>
                </button>
              </div>
            );
          }

          if (fieldConfig.type === 'textarea') {
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)} 
                  {fieldConfig.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={postData[field] || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={fieldConfig.placeholder}
                  maxLength={fieldConfig.maxLength}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {fieldConfig.maxLength && (
                  <div className="text-xs text-gray-500 mt-1">
                    {(postData[field] || '').length}/{fieldConfig.maxLength}
                  </div>
                )}
              </div>
            );
          }

          if (fieldConfig.options) {
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {fieldConfig.required && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={postData[field] || fieldConfig.default || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select {field}</option>
                  {fieldConfig.options.map((option: string) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (fieldConfig.type === 'boolean') {
            return (
              <div key={field} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={field}
                  checked={postData[field] || false}
                  onChange={(e) => handleFieldChange(field, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={field} className="text-sm font-medium text-gray-700">
                  {fieldConfig.label || field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            );
          }

          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {fieldConfig.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={fieldConfig.type === 'url' ? 'url' : 'text'}
                value={postData[field] || ''}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                placeholder={fieldConfig.placeholder}
                maxLength={fieldConfig.maxLength}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {fieldConfig.maxLength && (
                <div className="text-xs text-gray-500 mt-1">
                  {(postData[field] || '').length}/{fieldConfig.maxLength}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getPlatformIcon = (platform: string) => {
    const config = PLATFORM_CONFIGS[platform];
    if (!config) return null;
    const IconComponent = config.icon;
    return <IconComponent size={16} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Posts</h1>
          <div className="w-8"></div>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="hidden md:block text-3xl font-bold text-gray-900">Posts</h1>
              <p className="hidden md:block mt-2 text-gray-600">Create, schedule, and manage your social media content</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'create'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Create Post
                  </button>
                  <button
                    onClick={() => setActiveTab('scheduled')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'scheduled'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Scheduled ({scheduledPosts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('published')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'published'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Published ({posts.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Create Post Tab */}
            {activeTab === 'create' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Create New Post</h2>
                  <p className="text-sm text-gray-600">Choose your platform and customize your content</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Platform Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Select Platform</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {Object.entries(PLATFORM_CONFIGS).map(([platform, config]) => {
                        const IconComponent = config.icon;
                        const isSelected = selectedPlatform === platform;
                        return (
                          <button
                            key={platform}
                            onClick={() => handlePlatformSelect(platform)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                              isSelected
                                ? `border-${config.color}-500 bg-${config.color}-50 shadow-md`
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <IconComponent size={24} className={`text-${config.color}-600`} />
                            <span className="text-xs font-medium text-gray-700">{config.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Post Type Selection */}
                  {selectedPlatform && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Post Type</h3>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORM_CONFIGS[selectedPlatform]?.postTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => handlePostTypeSelect(type)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              selectedPostType === type
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400 text-gray-700'
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Media Upload */}
                  {selectedPlatform && selectedPostType && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Media Upload</h3>
                      <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-1">
                          Upload {PLATFORM_CONFIGS[selectedPlatform]?.supportedMedia.join(' or ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedPlatform === 'youtube' && 'Video required for YouTube posts'}
                        </p>
                        <input
                          type="file"
                          multiple={selectedPlatform !== 'youtube'}
                          accept={PLATFORM_CONFIGS[selectedPlatform]?.supportedMedia.includes('image') ? 'image/*,video/*' : 'video/*'}
                          className="hidden"
                          onChange={(e) => handleMediaUpload(e.target.files)}
                        />
                      </label>
                      {mediaFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {mediaFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <button
                                onClick={() => setMediaFiles(files => files.filter((_, i) => i !== index))}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Platform Connection Status */}
                  {selectedPlatform && (selectedPlatform === 'youtube' || selectedPlatform === 'twitter') && (
                    <div className="space-y-3">
                      {/* YouTube Connection Status */}
                      {selectedPlatform === 'youtube' && (
                        <>
                          {checkingConnection && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-blue-700">Checking YouTube connection...</span>
                              </div>
                            </div>
                          )}
                          {!checkingConnection && !youtubeConnected && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-yellow-800">YouTube Not Connected</h3>
                                  <p className="text-sm text-yellow-700 mt-1">
                                    You need to connect your YouTube account before you can post videos. 
                                    <a href="/creator/settings" className="font-medium underline hover:text-yellow-900 ml-1">
                                      Go to Settings to connect YouTube
                                    </a>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {!checkingConnection && youtubeConnected && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-green-700">YouTube account connected successfully!</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Twitter Connection Status */}
                      {selectedPlatform === 'twitter' && (
                        <>
                          {checkingConnection && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-blue-700">Checking Twitter connection...</span>
                              </div>
                            </div>
                          )}
                          {!checkingConnection && !twitterConnected && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-yellow-800">Twitter Not Connected</h3>
                                  <p className="text-sm text-yellow-700 mt-1">
                                    You need to connect your Twitter account before you can post. 
                                    <a href="/creator/settings" className="font-medium underline hover:text-yellow-900 ml-1">
                                      Go to Settings to connect Twitter
                                    </a>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {!checkingConnection && twitterConnected && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-green-700">Twitter account connected successfully!</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Platform-Specific Fields */}
                  {renderPlatformFields()}

                  {/* Scheduling */}
                  {selectedPlatform && selectedPostType && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Schedule (Optional)</h3>
                      <input
                        type="datetime-local"
                        value={postData.scheduledFor || ''}
                        onChange={(e) => handleFieldChange('scheduledFor', e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Error/Success Messages */}
                  {(error || success) && (
                    <div className="space-y-2">
                      {error && (
                        <div className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-3 text-sm">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="bg-green-50 text-green-700 border border-green-200 rounded-md px-4 py-3 text-sm">
                          {success}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {selectedPlatform && selectedPostType && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => createPost('draft')}
                        disabled={loading || 
                          (selectedPlatform === 'youtube' && !youtubeConnected) ||
                          (selectedPlatform === 'twitter' && !twitterConnected)
                        }
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={16} />
                        <span>Save Draft</span>
                      </button>
                      
                      {postData.scheduledFor ? (
                        <button
                          onClick={() => createPost('schedule')}
                          disabled={loading || 
                            (selectedPlatform === 'youtube' && !youtubeConnected) ||
                            (selectedPlatform === 'twitter' && !twitterConnected)
                          }
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Clock size={16} />
                          <span>{loading ? 'Scheduling...' : 'Schedule Post'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => createPost('publish')}
                          disabled={loading || 
                            (selectedPlatform === 'youtube' && !youtubeConnected) ||
                            (selectedPlatform === 'twitter' && !twitterConnected)
                          }
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                          <span>{loading ? 'Publishing...' : 'Publish Now'}</span>
                        </button>
                      )}
                      
                      {((selectedPlatform === 'youtube' && !youtubeConnected) || 
                       (selectedPlatform === 'twitter' && !twitterConnected)) && (
                        <p className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Connect {selectedPlatform === 'youtube' ? 'YouTube' : selectedPlatform === 'twitter' ? 'Twitter' : selectedPlatform} to enable posting
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scheduled Posts Tab */}
            {activeTab === 'scheduled' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Scheduled Posts</h2>
                  <p className="text-sm text-gray-600">Manage your upcoming posts</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled For</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scheduledPosts.map((post) => (
                        <tr key={post._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                                {post.media?.length > 0 ? <ImageIcon size={16} /> : <FileText size={16} />}
                              </div>
                              <span className="text-sm text-gray-900 truncate max-w-xs">
                                {post.content?.caption || 'No caption'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getPlatformIcon(post.platform)}
                              <span className="text-sm text-gray-900 capitalize">{post.platform}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {post.scheduling?.scheduled_for ? new Date(post.scheduling.scheduled_for).toLocaleString() : 'Not scheduled'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              {post.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {scheduledPosts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            No scheduled posts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Published Posts Tab */}
            {activeTab === 'published' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Published Posts</h2>
                  <p className="text-sm text-gray-600">View your post history and performance</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                                {post.media?.length > 0 ? <ImageIcon size={14} /> : <FileText size={14} />}
                              </div>
                              <span className="text-sm text-gray-900 truncate max-w-xs">
                                {post.content?.caption || 'No caption'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getPlatformIcon(post.platform)}
                              <span className="text-sm text-gray-900 capitalize">{post.platform}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {post.publishing?.published_at ? new Date(post.publishing.published_at).toLocaleString() : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Heart size={12} className="mr-1" />
                                {post.analytics?.likes || 0}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle size={12} className="mr-1" />
                                {post.analytics?.comments || 0}
                              </span>
                              <span className="flex items-center">
                                <Share size={12} className="mr-1" />
                                {post.analytics?.shares || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            No published posts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}