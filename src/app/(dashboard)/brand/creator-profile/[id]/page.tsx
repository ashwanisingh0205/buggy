"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/lib/apiClient';
import { 
  UserIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon, 
  EyeIcon,
  MapPinIcon,
  LinkIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

type Creator = { 
  _id: string; 
  name?: string; 
  email?: string; 
  profile?: { 
    bio?: string; 
    avatar_url?: string;
    location?: string;
    website?: string;
    social_links?: {
      instagram?: string;
      youtube?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  stats?: {
    followers?: number;
    engagement_rate?: number;
    total_posts?: number;
    avg_views?: number;
  };
  verified?: boolean;
  categories?: string[];
  pricing?: {
    post_rate?: number;
    story_rate?: number;
    reel_rate?: number;
  };
};

export default function CreatorProfilePage() {
  const params = useParams<{ id: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiRequest<{ success: boolean; data: { user: Creator } }>(`/api/admin/users/${params.id}`);
        setCreator(res.data.user);
      } catch (e: unknown) {
        const error = e as Error;
        setError(error?.message || 'Failed to load creator');
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-red-400 mb-4">
          <UserIcon className="w-12 h-12" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Error loading creator</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <UserIcon className="w-12 h-12" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Creator not found</h3>
        <p className="text-sm text-gray-500">The creator you're looking for doesn't exist.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'portfolio', name: 'Portfolio', icon: PhotoIcon },
    { id: 'pricing', name: 'Pricing', icon: CurrencyDollarIcon }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
        <p className="text-gray-600 leading-relaxed">
          {creator.profile?.bio || 'No bio available'}
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {creator.profile?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              {creator.profile.location}
            </div>
          )}
          {creator.profile?.website && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LinkIcon className="w-4 h-4" />
              <a href={creator.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                Website
              </a>
            </div>
          )}
        </div>

        {/* Social Links */}
        {creator.profile?.social_links && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Social Media</h4>
            <div className="flex gap-4">
              {Object.entries(creator.profile.social_links).map(([platform, url]) => (
                url && (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                  >
                    <span className="capitalize">{platform}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {creator.categories && creator.categories.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {creator.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Followers</p>
              <p className="text-2xl font-bold text-gray-900">{creator.stats?.followers?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{creator.stats?.engagement_rate || '0'}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <HeartIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{creator.stats?.total_posts || '0'}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <PhotoIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Views</p>
              <p className="text-2xl font-bold text-gray-900">{creator.stats?.avg_views?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <EyeIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics</h3>
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <ChartBarIcon className="w-12 h-12" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
          <p className="text-sm text-gray-500">Detailed performance analytics will be available here.</p>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <PhotoIcon className="w-12 h-12" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Portfolio Coming Soon</h3>
          <p className="text-sm text-gray-500">Creator's portfolio samples will be displayed here.</p>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
        {creator.pricing ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PhotoIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Post</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{creator.pricing.post_rate?.toLocaleString() || '0'}</p>
              <p className="text-sm text-gray-500">per post</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Story</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{creator.pricing.story_rate?.toLocaleString() || '0'}</p>
              <p className="text-sm text-gray-500">per story</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <VideoCameraIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Reel</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{creator.pricing.reel_rate?.toLocaleString() || '0'}</p>
              <p className="text-sm text-gray-500">per reel</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Pricing information not available</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'analytics':
        return renderAnalytics();
      case 'portfolio':
        return renderPortfolio();
      case 'pricing':
        return renderPricing();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ 
                backgroundImage: creator.profile?.avatar_url ? `url(${creator.profile.avatar_url})` : undefined,
                backgroundSize: 'cover'
              }}
            >
              {!creator.profile?.avatar_url && (creator.name?.charAt(0) || creator.email?.charAt(0) || 'C')}
            </div>
            {creator.verified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckBadgeIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {creator.name || creator.email}
              </h1>
              {creator.verified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Verified
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{creator.profile?.bio}</p>
            
            <div className="flex items-center gap-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Contact
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <HeartIcon className="w-4 h-4" />
                Save
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <ShareIcon className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

