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
import CreatorLayout from '@/Components/Creater/CreatorLayout';
import { apiRequest } from '@/lib/apiClient';
import { authUtils } from '@/lib/auth';

// Platform configurations
const PLATFORM_CONFIGS = {
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
      category: { required: false, options: ['Entertainment', 'Education', 'Gaming', 'Music', 'News', 'Sports', 'Technology'] },
      privacy: { required: false, options: ['public', 'unlisted', 'private'], default: 'public' },
      thumbnail: { required: false, type: 'file' }
    }
  },
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'sky',
    postTypes: ['tweet', 'thread', 'poll'],
    maxCaptionLength: 280,
    supportedMedia: ['image', 'video', 'gif'],
    fields: {
      // Basic content field for all tweet types
      content: { 
        required: true, 
        placeholder: "What's happening?", 
        maxLength: 280,
        label: 'Tweet Content'
      },
      // Additional fields will be handled in the TwitterPostForm component
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
      visibility: { required: false, options: ['public', 'connections'], default: 'public' },
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

// Twitter-specific form component
const TwitterPostForm = ({ postData, onFieldChange, selectedPostType }: { 
  postData: any; 
  onFieldChange: (field: string, value: any) => void; 
  selectedPostType: string;
}) => {
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [threadTweets, setThreadTweets] = useState(['']);

  // Handle poll option changes
  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
    onFieldChange('poll_options', newOptions.filter(opt => opt.trim()));
  };

  // Add poll option
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  // Remove poll option
  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
      onFieldChange('poll_options', newOptions.filter(opt => opt.trim()));
    }
  };

  // Handle thread tweet changes
  const handleThreadTweetChange = (index: number, value: string) => {
    const newThread = [...threadTweets];
    newThread[index] = value;
    setThreadTweets(newThread);
    onFieldChange('thread', newThread.filter(tweet => tweet.trim()));
  };

  // Add thread tweet
  const addThreadTweet = () => {
    if (threadTweets.length < 25) {
      setThreadTweets([...threadTweets, '']);
    }
  };

  // Remove thread tweet
  const removeThreadTweet = (index: number) => {
    if (threadTweets.length > 1) {
      const newThread = threadTweets.filter((_, i) => i !== index);
      setThreadTweets(newThread);
      onFieldChange('thread', newThread.filter(tweet => tweet.trim()));
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Tweet Content - Always shown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tweet Content *
        </label>
        <textarea
          value={postData.content || ''}
          onChange={(e) => onFieldChange('content', e.target.value)}
          placeholder="What's happening?"
          maxLength={280}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="text-xs text-gray-500 mt-1">
          {postData.content?.length || 0}/280 characters
        </div>
      </div>

      {/* Thread Section - Only for thread type */}
      {selectedPostType === 'thread' && (
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Thread Tweets</h4>
          <div className="space-y-3">
            {threadTweets.map((tweet, index) => (
              <div key={index} className="flex space-x-2">
                <div className="flex-shrink-0 pt-3 text-sm text-gray-500">{index + 1}.</div>
                <textarea
                  value={tweet}
                  onChange={(e) => handleThreadTweetChange(index, e.target.value)}
                  placeholder={`Tweet ${index + 1} of your thread`}
                  maxLength={280}
                  rows={2}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {threadTweets.length > 1 && (
                  <button
                    onClick={() => removeThreadTweet(index)}
                    className="flex-shrink-0 p-3 text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {threadTweets.length < 25 && (
              <button
                onClick={addThreadTweet}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                type="button"
              >
                <Plus size={14} />
                <span>Add Tweet to Thread</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Poll Section - Only for poll type */}
      {selectedPostType === 'poll' && (
        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Poll Settings</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poll Question *
            </label>
            <input
              type="text"
              value={postData.poll_question || ''}
              onChange={(e) => onFieldChange('poll_question', e.target.value)}
              placeholder="Ask a question for your poll..."
              maxLength={280}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Poll Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poll Options * (2-4 options)
            </label>
            <div className="space-y-2">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    maxLength={25}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => removePollOption(index)}
                      className="flex-shrink-0 p-3 text-red-500 hover:text-red-700"
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {pollOptions.length < 4 && (
              <button
                onClick={addPollOption}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm mt-2"
                type="button"
              >
                <Plus size={14} />
                <span>Add Option</span>
              </button>
            )}
          </div>

          {/* Poll Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poll Duration *
            </label>
            <select
              value={postData.poll_duration || 1440}
              onChange={(e) => onFieldChange('poll_duration', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={60}>1 hour</option>
              <option value={1440}>24 hours</option>
              <option value={10080}>7 days</option>
            </select>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h4>
            <pre className="text-xs text-gray-600">
              {JSON.stringify({
                poll_question: postData.poll_question,
                poll_options: postData.poll_options,
                poll_duration: postData.poll_duration
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Reply Settings - For all types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reply Settings
        </label>
        <select
          value={postData.reply_settings || 'everyone'}
          onChange={(e) => onFieldChange('reply_settings', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="everyone">Everyone can reply</option>
          <option value="following">People you follow</option>
          <option value="mentioned">Only people you mention</option>
        </select>
      </div>
    </div>
  );
};

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'scheduled' | 'published'>('create');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedPostType, setSelectedPostType] = useState<string>('');
  const [postData, setPostData] = useState<any>({});
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
  const [youtubeConnected, setYoutubeConnected] = useState<boolean>(false);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(false);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
    checkYouTubeConnection();
  }, []);

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

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedPostType('');
    setPostData({});
    setMediaFiles([]);
    setError('');
    setSuccess('');

    // Check YouTube connection when YouTube is selected
    if (platform === 'youtube') {
      checkYouTubeConnection();
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
      const config = PLATFORM_CONFIGS[selectedPlatform as keyof typeof PLATFORM_CONFIGS];
      
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

    const config = PLATFORM_CONFIGS[selectedPlatform as keyof typeof PLATFORM_CONFIGS];
    
    // Check required fields
    Object.entries(config.fields).forEach(([field, fieldConfig]) => {
      if (fieldConfig.required && (!postData[field] || postData[field].toString().trim().length === 0)) {
        throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required for ${config.name}`);
      }
    });

    // Check caption/content length
    const contentField = postData.caption || postData.content || '';
    if (contentField && contentField.length > config.maxCaptionLength) {
      throw new Error(`Content exceeds maximum length of ${config.maxCaptionLength} characters`);
    }

    // Platform-specific validations
    if (selectedPlatform === 'youtube') {
      if (!youtubeConnected) {
        throw new Error('Please connect your YouTube account in Settings before posting');
      }
      if (mediaFiles.length === 0) {
        throw new Error('Video file is required for YouTube posts');
      }
      if (!postData.title || postData.title.trim().length === 0) {
        throw new Error('Title is required for YouTube posts');
      }
    }

    if (selectedPlatform === 'twitter') {
      if (!postData.content || postData.content.trim().length === 0) {
        throw new Error('Content is required for Twitter posts');
      }
      
      // Validate thread data
      if (selectedPostType === 'thread' && postData.thread && Array.isArray(postData.thread)) {
        const validThreadTweets = postData.thread.filter((tweet: string) => tweet && tweet.trim().length > 0);
        if (validThreadTweets.length === 0) {
          throw new Error('Thread must contain at least one valid tweet');
        }
      }
      
      // Validate poll data
      if (selectedPostType === 'poll') {
        if (!postData.poll_question || postData.poll_question.trim().length === 0) {
          throw new Error('Poll question is required');
        }
        if (!postData.poll_options || postData.poll_options.length < 2) {
          throw new Error('Poll must have at least 2 options');
        }
        const validOptions = postData.poll_options.filter((opt: string) => opt && opt.trim().length > 0);
        if (validOptions.length < 2) {
          throw new Error('Poll must have at least 2 valid options');
        }
      }
    }

    if (selectedPlatform === 'linkedin') {
      if (!postData.content || postData.content.trim().length === 0) {
        throw new Error('Content is required for LinkedIn posts');
      }
    }

    // Validate media files
    if (mediaFiles.length > 0) {
      mediaFiles.forEach((file, index) => {
        const fileType = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 'other';
        if (!config.supportedMedia.includes(fileType)) {
          throw new Error(`File ${index + 1} (${file.name}) is not supported for ${config.name}`);
        }
      });
    }
  };

  // Test function to debug API connection
  const testApiConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('🧪 Health check response:', response.status, response.statusText);
    } catch (error) {
      console.error('🧪 API connection test failed:', error);
    }
  };

  // Test function to try minimal post creation
  const testMinimalPost = async () => {
    try {
      console.log('🧪 Testing minimal post creation...');
      
      const minimalPayload = {
        platform: 'twitter',
        post_type: 'tweet',
        status: 'draft',
        content: {
          caption: 'Test post from Bloocube',
          hashtags: [],
          mentions: []
        },
        media: []
      };
      
      console.log('🧪 Sending minimal payload:', JSON.stringify(minimalPayload, null, 2));
      
      const response = await apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify(minimalPayload)
      });
      
      console.log('🧪 Minimal post test successful:', response);
    } catch (error) {
      console.error('🧪 Minimal post test failed:', error);
    }
  };

  // Test function to check authentication
  const testAuth = async () => {
    try {
      console.log('🔐 Testing authentication...');
      
      // Check if we have a token
      const token = localStorage.getItem('token');
      console.log('🔐 Token exists:', !!token);
      
      // Test a simple authenticated request
      const response = await apiRequest('/api/user/profile', {
        method: 'GET'
      });
      
      console.log('🔐 Auth test successful:', response);
    } catch (error) {
      console.error('🔐 Auth test failed:', error);
    }
  };

  // Test function to debug form data
  const debugFormData = () => {
    console.log('🔍 FORM DEBUG:', {
      selectedPlatform,
      selectedPostType,
      postData,
      postDataKeys: Object.keys(postData),
      postDataValues: Object.values(postData),
      mediaFiles: mediaFiles.length
    });
  };

// Enhanced Twitter post payload creation
const createTwitterPostPayload = (postData: any, selectedPostType: string, mediaFiles: File[]) => {
  const basePayload: any = {
    platform: 'twitter',
    post_type: selectedPostType,
    status: 'draft',
    title: postData.content || postData.poll_question || 'Twitter Post',
    content: {
      caption: postData.content || '',
      hashtags: postData.hashtags ? 
        postData.hashtags.split(',').map((h: string) => h.trim()).filter(Boolean) : [],
      mentions: postData.mentions ? 
        postData.mentions.split(',').map((m: string) => m.trim()).filter(Boolean) : []
    }
  };

  // Twitter-specific content
  const twitterContent: any = {
    reply_settings: postData.reply_settings || 'everyone'
  };

  // Handle different Twitter post types
  if (selectedPostType === 'poll') {
    // For polls, use poll_question as the main content
    if (postData.poll_question) {
      basePayload.content.caption = postData.poll_question;
      basePayload.title = postData.poll_question;
    }
    
    twitterContent.poll = {
      question: postData.poll_question || postData.content || 'Poll',
      options: (postData.poll_options || []).filter((opt: string) => opt.trim()),
      duration_minutes: postData.poll_duration || 1440
    };
    twitterContent.tweet_type = 'poll';
    
  } else if (selectedPostType === 'thread' && postData.thread) {
    twitterContent.thread = postData.thread
      .filter((tweet: string) => tweet.trim())
      .map((text: string, index: number) => ({ text, position: index }));
    twitterContent.tweet_type = 'thread';
    
  } else {
    // Regular tweet
    twitterContent.tweet_type = 'tweet';
  }

  basePayload.platform_content = {
    twitter: twitterContent
  };

  // Add media information
  if (mediaFiles.length > 0) {
    basePayload.media = mediaFiles.map((file: File) => ({
      filename: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      mimeType: file.type
    }));
  }

  console.log('🐦 Twitter Payload Debug:', {
    selectedPostType,
    postData,
    twitterContent,
    finalPayload: basePayload
  });

  return basePayload;
};

  const createPost = async (action: 'draft' | 'publish' | 'schedule') => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('🚨 Creating post:', {
        action,
        selectedPlatform,
        selectedPostType,
        postData
      });

      validatePost();

      // Check if we're in mock mode (for testing without backend)
      const mockMode = localStorage.getItem('mockMode') === 'true';
      if (mockMode) {
        console.log('🎭 Mock mode: Simulating post creation');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(`Post ${action === 'draft' ? 'saved as draft' : action === 'publish' ? 'published' : 'scheduled'} successfully! (Mock Mode)`);
        setLoading(false);
        return;
      }

      let postPayload: any;

      // Build platform-specific payload
      if (selectedPlatform === 'twitter') {
        postPayload = createTwitterPostPayload(postData, selectedPostType, mediaFiles);
      } else {
        // Generic payload for other platforms
        const actualContent = postData.caption || postData.content || postData.title || '';
        
        postPayload = {
          platform: selectedPlatform,
          post_type: selectedPostType,
          status: 'draft',
          content: {
            caption: actualContent.trim(),
            hashtags: postData.hashtags ? 
              postData.hashtags.split(',').map((h: string) => h.trim()).filter(Boolean) : [],
            mentions: postData.mentions ? 
              postData.mentions.split(',').map((m: string) => m.trim()).filter(Boolean) : []
          },
          title: actualContent.trim(),
          media: mediaFiles.length > 0 ? mediaFiles.map(file => ({
            filename: file.name,
            type: file.type,
            size: file.size
          })) : []
        };

        // Add platform-specific content
        if (selectedPlatform === 'youtube') {
          postPayload.youtube_content = {
            title: postData.title?.trim() || '',
            description: postData.description?.trim() || '',
            tags: postData.tags ? 
              postData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            privacy_status: postData.privacy || 'public'
          };
        }
        // Add other platform content as needed...
      }

      // Add scheduling if applicable
      if (action === 'schedule' && postData.scheduledFor) {
        postPayload.scheduling = {
          scheduled_for: new Date(postData.scheduledFor).toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      }

      console.log('📤 Sending post payload:', JSON.stringify(postPayload, null, 2));

      // Create the post
      const response = await apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify(postPayload)
      }) as any;

      console.log('✅ Post created successfully:', response);

      const postId = response.post?._id || response.data?.post?._id || response._id;
      
      if (!postId) {
        console.warn('⚠️ No post ID found in response:', response);
        setSuccess(`Post ${action === 'draft' ? 'saved as draft' : action === 'publish' ? 'published' : 'scheduled'} successfully!`);
        return;
      }

      // Try to publish/schedule
      let publishSuccess = false;
      
      try {
        if (action === 'publish') {
          await apiRequest(`/api/posts/${postId}/publish`, {
            method: 'PUT'
          });
          console.log('✅ Post published successfully');
          publishSuccess = true;
        } else if (action === 'schedule' && postData.scheduledFor) {
          await apiRequest(`/api/posts/${postId}/schedule`, {
            method: 'PUT',
            body: JSON.stringify({
              scheduled_for: postData.scheduledFor,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })
          });
          console.log('✅ Post scheduled successfully');
          publishSuccess = true;
        }
      } catch (publishError: any) {
        console.error('❌ Publish/Schedule failed:', publishError);
        publishSuccess = false;
      }

      // Set appropriate success message
      if (action === 'publish') {
        if (publishSuccess) {
          setSuccess('Post created and published successfully!');
        } else {
          setSuccess('Post created successfully! (Publish failed - post saved as draft)');
        }
      } else if (action === 'schedule') {
        if (publishSuccess) {
          setSuccess('Post created and scheduled successfully!');
        } else {
          setSuccess('Post created successfully! (Schedule failed - post saved as draft)');
        }
      } else {
        setSuccess('Post saved as draft successfully!');
      }
      
      // Reset form
      setSelectedPlatform('');
      setSelectedPostType('');
      setPostData({});
      setMediaFiles([]);
      
      // Reload posts
      loadPosts();

    } catch (err: unknown) {
      console.error('❌ Post creation failed:', err);
      
      let errorMessage = 'Failed to create post';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPlatformFields = () => {
    if (!selectedPlatform || !selectedPostType) return null;

    // Use TwitterPostForm for Twitter
    if (selectedPlatform === 'twitter') {
      return (
        <TwitterPostForm
          postData={postData}
          onFieldChange={handleFieldChange}
          selectedPostType={selectedPostType}
        />
      );
    }

    const config = PLATFORM_CONFIGS[selectedPlatform as keyof typeof PLATFORM_CONFIGS];
    
    return (
      <div className="space-y-6">
        {Object.entries(config.fields).map(([field, fieldConfig]) => {
          if ((fieldConfig as any).type === 'textarea') {
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)} 
                  {fieldConfig.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={postData[field] || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={(fieldConfig as any).placeholder}
                  maxLength={(fieldConfig as any).maxLength}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {(fieldConfig as any).maxLength && (
                  <div className="text-xs text-gray-500 mt-1">
                    {(postData[field] || '').length}/{(fieldConfig as any).maxLength}
                  </div>
                )}
              </div>
            );
          }

          if ((fieldConfig as any).options) {
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {fieldConfig.required && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={postData[field] || (fieldConfig as any).default || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select {field}</option>
                  {(fieldConfig as any).options.map((option: string) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
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
                type={(fieldConfig as any).type === 'url' ? 'url' : 'text'}
                value={postData[field] || ''}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                placeholder={(fieldConfig as any).placeholder}
                maxLength={(fieldConfig as any).maxLength}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {(fieldConfig as any).maxLength && (
                <div className="text-xs text-gray-500 mt-1">
                  {(postData[field] || '').length}/{(fieldConfig as any).maxLength}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getPlatformIcon = (platform: string) => {
    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) return null;
    const IconComponent = config.icon;
    return <IconComponent size={16} className={`text-${config.color}-600`} />;
  };

  const headerActions = (
    <>
      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
        <Plus className="w-4 h-4" />
        <span>Create New Post</span>
      </button>
    </>
  );

  return (
    <CreatorLayout 
      title="Posts Management" 
      subtitle="Create, schedule, and manage your social media posts"
      headerActions={headerActions}
    >
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
                  return (
                    <button
                      key={platform}
                      onClick={() => handlePlatformSelect(platform)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                        selectedPlatform === platform
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
                  {PLATFORM_CONFIGS[selectedPlatform as keyof typeof PLATFORM_CONFIGS].postTypes.map((type) => (
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
                    Upload {PLATFORM_CONFIGS[selectedPlatform as keyof typeof PLATFORM_CONFIGS].supportedMedia.join(' or ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedPlatform === 'youtube' && 'Video required for YouTube posts'}
                  </p>
                  <input
                    type="file"
                    multiple={selectedPlatform !== 'youtube'}
                    accept={PLATFORM_CONFIGS[selectedPlatform as keyof typeof PLATFORM_CONFIGS].supportedMedia.includes('image') ? 'image/*,video/*' : 'video/*'}
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

            {/* YouTube Connection Warning */}
            {selectedPlatform === 'youtube' && !youtubeConnected && !checkingConnection && (
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

            {/* YouTube Connection Status */}
            {selectedPlatform === 'youtube' && checkingConnection && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-700">Checking YouTube connection...</span>
                </div>
              </div>
            )}

            {selectedPlatform === 'youtube' && youtubeConnected && !checkingConnection && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-700">YouTube account connected successfully!</span>
                </div>
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
                  onClick={() => testApiConnection()}
                  className="flex items-center space-x-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  <span>🧪 Test API</span>
                </button>
                
                <button
                  onClick={() => testMinimalPost()}
                  className="flex items-center space-x-2 px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  <span>🧪 Test Minimal Post</span>
                </button>
                
                <button
                  onClick={() => debugFormData()}
                  className="flex items-center space-x-2 px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <span>🔍 Debug Form</span>
                </button>
                
                <button
                  onClick={() => createPost('draft')}
                  disabled={loading || (selectedPlatform === 'youtube' && !youtubeConnected)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>Save Draft</span>
                </button>
                
                {postData.scheduledFor ? (
                  <button
                    onClick={() => createPost('schedule')}
                    disabled={loading || (selectedPlatform === 'youtube' && !youtubeConnected)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Clock size={16} />
                    <span>{loading ? 'Scheduling...' : 'Schedule Post'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => createPost('publish')}
                    disabled={loading || (selectedPlatform === 'youtube' && !youtubeConnected)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    <span>{loading ? 'Publishing...' : 'Publish Now'}</span>
                  </button>
                )}
                
                {selectedPlatform === 'youtube' && !youtubeConnected && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Connect YouTube to enable posting
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
    </CreatorLayout>
  );
};