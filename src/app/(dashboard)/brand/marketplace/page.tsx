"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Users, Star, MapPin, TrendingUp, Eye, Heart, MessageCircle, Share2, Plus, Target, Zap } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  handle: string;
  bio: string;
  location: string;
  platforms: string[];
  followers: {
    total: number;
    breakdown: { [key: string]: number };
  };
  engagement: {
    rate: number;
    avgLikes: number;
    avgComments: number;
    avgShares: number;
  };
  rating: number;
  reviewCount: number;
  categories: string[];
  verified: boolean;
  recentWork: {
    title: string;
    platform: string;
    metrics: {
      views: number;
      likes: number;
      comments: number;
    };
  }[];
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: string;
  completionRate: number;
}

export default function BrandMarketplacePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for demonstration
  useEffect(() => {
    const mockCreators: Creator[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        handle: '@sarahjohnson',
        bio: 'Lifestyle & Fashion Content Creator | Brand Collaborations | Authentic Storytelling',
        location: 'Mumbai, India',
        platforms: ['Instagram', 'YouTube', 'TikTok'],
        followers: {
          total: 125000,
          breakdown: { Instagram: 85000, YouTube: 25000, TikTok: 15000 }
        },
        engagement: {
          rate: 4.8,
          avgLikes: 4200,
          avgComments: 320,
          avgShares: 180
        },
        rating: 4.9,
        reviewCount: 47,
        categories: ['Fashion', 'Lifestyle', 'Beauty'],
        verified: true,
        recentWork: [
          {
            title: 'Summer Fashion Haul',
            platform: 'Instagram',
            metrics: { views: 45000, likes: 5200, comments: 380 }
          },
          {
            title: 'Skincare Routine Video',
            platform: 'YouTube',
            metrics: { views: 28000, likes: 3100, comments: 245 }
          }
        ],
        pricing: { min: 15000, max: 50000, currency: 'INR' },
        availability: 'available',
        responseTime: '< 2 hours',
        completionRate: 98
      },
      {
        id: '2',
        name: 'Tech Reviewer Pro',
        handle: '@techreviewerpro',
        bio: 'Technology Reviews | Gadget Unboxings | Tech Tips & Tutorials',
        location: 'Bangalore, India',
        platforms: ['YouTube', 'Twitter', 'LinkedIn'],
        followers: {
          total: 890000,
          breakdown: { YouTube: 650000, Twitter: 180000, LinkedIn: 60000 }
        },
        engagement: {
          rate: 6.2,
          avgLikes: 12000,
          avgComments: 850,
          avgShares: 420
        },
        rating: 4.7,
        reviewCount: 89,
        categories: ['Technology', 'Reviews', 'Education'],
        verified: true,
        recentWork: [
          {
            title: 'iPhone 15 Pro Review',
            platform: 'YouTube',
            metrics: { views: 125000, likes: 8900, comments: 1200 }
          }
        ],
        pricing: { min: 25000, max: 100000, currency: 'INR' },
        availability: 'busy',
        responseTime: '< 4 hours',
        completionRate: 95
      },
      {
        id: '3',
        name: 'Fitness Guru',
        handle: '@fitnessguru',
        bio: 'Certified Personal Trainer | Nutrition Expert | Fitness Motivation',
        location: 'Delhi, India',
        platforms: ['Instagram', 'YouTube', 'TikTok'],
        followers: {
          total: 450000,
          breakdown: { Instagram: 280000, YouTube: 120000, TikTok: 50000 }
        },
        engagement: {
          rate: 7.1,
          avgLikes: 8500,
          avgComments: 650,
          avgShares: 320
        },
        rating: 4.8,
        reviewCount: 62,
        categories: ['Fitness', 'Health', 'Lifestyle'],
        verified: false,
        recentWork: [
          {
            title: '30-Day Abs Challenge',
            platform: 'Instagram',
            metrics: { views: 85000, likes: 9200, comments: 780 }
          }
        ],
        pricing: { min: 20000, max: 75000, currency: 'INR' },
        availability: 'available',
        responseTime: '< 1 hour',
        completionRate: 99
      }
    ];

    setTimeout(() => {
      setCreators(mockCreators);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = selectedPlatform === 'all' || creator.platforms.some(p => p.toLowerCase() === selectedPlatform);
    const matchesCategory = selectedCategory === 'all' || creator.categories.some(cat => cat.toLowerCase() === selectedCategory);
    
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'followers':
        return b.followers.total - a.followers.total;
      case 'engagement':
        return b.engagement.rate - a.engagement.rate;
      case 'price-low':
        return a.pricing.min - b.pricing.min;
      case 'price-high':
        return b.pricing.max - a.pricing.max;
      default:
        return 0;
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'busy':
        return 'text-yellow-600 bg-yellow-100';
      case 'unavailable':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 6) return 'text-green-600';
    if (rate >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creator Marketplace</h1>
            <p className="mt-2 text-gray-600">Discover and collaborate with top creators for your campaigns</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
          
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={selectedPlatform} 
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="fashion">Fashion</option>
            <option value="technology">Technology</option>
            <option value="fitness">Fitness</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="beauty">Beauty</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
          </select>

          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Highest Rated</option>
            <option value="followers">Most Followers</option>
            <option value="engagement">Best Engagement</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <div className="ml-auto flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading creators...</span>
        </div>
      )}

      {/* Creators Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCreators.map(creator => (
            <div key={creator.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {creator.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                      {creator.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{creator.handle}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(creator.availability)}`}>
                  {creator.availability}
                </span>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{creator.bio}</p>

              {/* Location & Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {creator.location}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{creator.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({creator.reviewCount})</span>
                </div>
              </div>

              {/* Platforms */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {creator.platforms.map(platform => (
                    <span key={platform} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Followers</div>
                  <div className="font-semibold">{formatNumber(creator.followers.total)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Engagement</div>
                  <div className={`font-semibold ${getEngagementColor(creator.engagement.rate)}`}>
                    {creator.engagement.rate}%
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <div className="text-sm text-gray-600">Price Range</div>
                <div className="font-semibold text-green-600">
                  ₹{formatNumber(creator.pricing.min)} - ₹{formatNumber(creator.pricing.max)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  <Eye className="w-4 h-4 inline mr-1" />
                  View Profile
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedCreators.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Users className="w-12 h-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No creators found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Insights Section */}
      {!loading && sortedCreators.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Marketplace Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Creators</div>
              <div className="text-2xl font-bold text-blue-900">{sortedCreators.length}</div>
              <div className="text-xs text-blue-600">Available for collaboration</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Avg. Engagement</div>
              <div className="text-2xl font-bold text-green-900">
                {(sortedCreators.reduce((sum, c) => sum + c.engagement.rate, 0) / sortedCreators.length).toFixed(1)}%
              </div>
              <div className="text-xs text-green-600">Across all creators</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Total Reach</div>
              <div className="text-2xl font-bold text-purple-900">
                {formatNumber(sortedCreators.reduce((sum, c) => sum + c.followers.total, 0))}
              </div>
              <div className="text-xs text-purple-600">Combined followers</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Avg. Rating</div>
              <div className="text-2xl font-bold text-yellow-900">
                {(sortedCreators.reduce((sum, c) => sum + c.rating, 0) / sortedCreators.length).toFixed(1)}
              </div>
              <div className="text-xs text-yellow-600">Creator satisfaction</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}