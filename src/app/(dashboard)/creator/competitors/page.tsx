"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Users, Eye, Heart, MessageCircle, Share2, BarChart3, Target, Zap, Plus, ExternalLink } from 'lucide-react';
import Sidebar from '@/Components/Creater/Sidebar';
import { Menu } from 'lucide-react';
import { apiRequest } from '@/lib/apiClient';
import Link from 'next/link';

interface Competitor {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  engagement: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  recentPosts: number;
  growthRate: number;
  category: string;
  verified: boolean;
  avatar: string;
  profileUrl?: string;
  lastAnalyzed?: string;
  analysisId?: string;
}

interface AnalysisHistory {
  id: string;
  competitorUrls: string[];
  analysisType: string;
  competitorsAnalyzed: number;
  createdAt: string;
  status: 'completed' | 'failed' | 'processing';
}

const CompetitorAnalysisPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load competitor data and analysis history
  useEffect(() => {
    loadCompetitorData();
    loadAnalysisHistory();
  }, []);

  const loadCompetitorData = async () => {
    // For now, using mock data. In production, this would load from saved competitors
    const mockCompetitors: Competitor[] = [
      {
        id: '1',
        name: 'TechReviewer Pro',
        handle: '@techreviewerpro',
        platform: 'YouTube',
        followers: 1250000,
        engagement: 4.2,
        avgLikes: 45000,
        avgComments: 3200,
        avgShares: 1800,
        recentPosts: 12,
        growthRate: 8.5,
        category: 'Technology',
        verified: true,
        avatar: '/api/placeholder/60/60',
        profileUrl: 'https://youtube.com/@techreviewerpro',
        lastAnalyzed: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Fashion Forward',
        handle: '@fashionforward',
        platform: 'Instagram',
        followers: 890000,
        engagement: 6.8,
        avgLikes: 52000,
        avgComments: 4800,
        avgShares: 2100,
        recentPosts: 8,
        growthRate: 12.3,
        category: 'Fashion',
        verified: true,
        avatar: '/api/placeholder/60/60'
      },
      {
        id: '3',
        name: 'Fitness Guru',
        handle: '@fitnessguru',
        platform: 'Instagram',
        followers: 2100000,
        engagement: 9.1,
        avgLikes: 180000,
        avgComments: 12000,
        avgShares: 8500,
        recentPosts: 15,
        growthRate: 15.7,
        category: 'Fitness',
        verified: false,
        avatar: '/api/placeholder/60/60'
      },
      {
        id: '4',
        name: 'Foodie Adventures',
        handle: '@foodieadventures',
        platform: 'YouTube',
        followers: 750000,
        engagement: 5.4,
        avgLikes: 38000,
        avgComments: 2900,
        avgShares: 1600,
        recentPosts: 6,
        growthRate: 6.2,
        category: 'Food',
        verified: true,
        avatar: '/api/placeholder/60/60'
      },
      {
        id: '5',
        name: 'Travel Explorer',
        handle: '@travelexplorer',
        platform: 'Instagram',
        followers: 1450000,
        engagement: 7.2,
        avgLikes: 95000,
        avgComments: 7200,
        avgShares: 4200,
        recentPosts: 10,
        growthRate: 9.8,
        category: 'Travel',
        verified: true,
        avatar: '/api/placeholder/60/60'
      }
    ];

    setTimeout(() => {
      setCompetitors(mockCompetitors);
      setLoading(false);
    }, 1000);
  };

  const loadAnalysisHistory = async () => {
    try {
      const response = await apiRequest<{
        success: boolean;
        data: { analyses: AnalysisHistory[] };
      }>('/api/competitors/history');
      
      if (response.success) {
        setAnalysisHistory(response.data.analyses);
      }
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    }
  };

  const filteredCompetitors = competitors.filter(competitor => {
    const matchesSearch = competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         competitor.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || competitor.platform.toLowerCase() === selectedPlatform;
    const matchesCategory = selectedCategory === 'all' || competitor.category.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 7) return 'text-green-600 bg-green-100';
    if (engagement >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 10) return 'text-green-600';
    if (growth >= 5) return 'text-yellow-600';
    return 'text-red-600';
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
          <h1 className="text-lg font-semibold text-gray-900">Competitor Analysis</h1>
          <div className="w-8"></div>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="hidden md:block text-3xl font-bold text-gray-900">Competitor Analysis</h1>
                  <p className="hidden md:block mt-2 text-gray-600">Analyze your competitors and discover growth opportunities</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/creator/competitors/analyze">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>New Analysis</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>History</span>
                  </button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search competitors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={selectedPlatform} 
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option value="all">All Platforms</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                </select>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="fashion">Fashion</option>
                  <option value="fitness">Fitness</option>
                  <option value="food">Food</option>
                  <option value="travel">Travel</option>
                </select>
              </div>
            </div>

            {/* Analysis History Section */}
            {showHistory && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Analysis History</h2>
                {analysisHistory.length > 0 ? (
                  <div className="space-y-4">
                    {analysisHistory.slice(0, 5).map((analysis) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <div className="font-medium">
                            {analysis.competitorsAnalyzed} competitors analyzed
                          </div>
                          <div className="text-sm text-gray-600">
                            {analysis.analysisType} • {new Date(analysis.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {analysis.competitorUrls.slice(0, 2).join(', ')}
                            {analysis.competitorUrls.length > 2 && ` +${analysis.competitorUrls.length - 2} more`}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            analysis.status === 'completed' ? 'bg-green-100 text-green-800' :
                            analysis.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {analysis.status}
                          </span>
                          {analysis.status === 'completed' && (
                            <button className="text-blue-600 hover:text-blue-700">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No analysis history yet</p>
                    <p className="text-sm">Start your first competitor analysis to see results here</p>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading competitors...</span>
              </div>
            )}

            {/* Competitors Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompetitors.map(competitor => (
                  <div key={competitor.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                              {competitor.verified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{competitor.handle}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {competitor.platform}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Followers</span>
                          <span className="font-semibold">{formatNumber(competitor.followers)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Engagement</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(competitor.engagement)}`}>
                            {competitor.engagement}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Growth Rate</span>
                          <span className={`font-semibold ${getGrowthColor(competitor.growthRate)}`}>
                            +{competitor.growthRate}%
                          </span>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Likes</div>
                          <div className="text-sm font-semibold">{formatNumber(competitor.avgLikes)}</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <MessageCircle className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Comments</div>
                          <div className="text-sm font-semibold">{formatNumber(competitor.avgComments)}</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <Share2 className="w-4 h-4 text-green-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Shares</div>
                          <div className="text-sm font-semibold">{formatNumber(competitor.avgShares)}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Link 
                          href={`/creator/competitors/analyze?url=${encodeURIComponent(competitor.profileUrl || '')}`}
                          className="flex-1"
                        >
                          <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                            <Eye className="w-4 h-4 inline mr-1" />
                            Analyze
                          </button>
                        </Link>
                        {competitor.lastAnalyzed && (
                          <button 
                            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            title="View last analysis"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Last analyzed info */}
                      {competitor.lastAnalyzed && (
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          Last analyzed: {new Date(competitor.lastAnalyzed).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredCompetitors.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Target className="w-12 h-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No competitors found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}

            {/* Insights Section */}
            {!loading && filteredCompetitors.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Key Insights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Top Performer</div>
                    <div className="text-lg font-bold text-blue-900">
                      {filteredCompetitors.reduce((prev, current) => 
                        prev.engagement > current.engagement ? prev : current
                      ).name}
                    </div>
                    <div className="text-xs text-blue-600">
                      {Math.max(...filteredCompetitors.map(c => c.engagement))}% engagement
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Fastest Growing</div>
                    <div className="text-lg font-bold text-green-900">
                      {filteredCompetitors.reduce((prev, current) => 
                        prev.growthRate > current.growthRate ? prev : current
                      ).name}
                    </div>
                    <div className="text-xs text-green-600">
                      +{Math.max(...filteredCompetitors.map(c => c.growthRate))}% growth
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Largest Audience</div>
                    <div className="text-lg font-bold text-purple-900">
                      {filteredCompetitors.reduce((prev, current) => 
                        prev.followers > current.followers ? prev : current
                      ).name}
                    </div>
                    <div className="text-xs text-purple-600">
                      {formatNumber(Math.max(...filteredCompetitors.map(c => c.followers)))} followers
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorAnalysisPage;
