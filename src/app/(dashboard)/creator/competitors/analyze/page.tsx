'use client';
import React, { useState } from 'react';
import { Plus, X, Search, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import Sidebar from '@/Components/Creater/Sidebar';
import { apiRequest } from '@/lib/apiClient';

interface CompetitorUrl {
  id: string;
  url: string;
  platform?: string;
  username?: string;
  isValid?: boolean;
  error?: string;
}

interface AnalysisResult {
  analysis_id: string;
  competitors_analyzed: number;
  competitors_failed: number;
  analysis_type: string;
  results: {
    ai_insights: any;
    competitive_landscape: any;
    market_insights: any;
    benchmark_metrics: any;
    recommendations: any[];
    competitors_data: any[];
    metadata: any;
  };
  warnings?: {
    failed_competitors: Array<{ url: string; error: string }>;
  };
}

const CompetitorAnalysisPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [competitorUrls, setCompetitorUrls] = useState<CompetitorUrl[]>([
    { id: '1', url: '' }
  ]);
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add new competitor URL input
  const addCompetitorUrl = () => {
    if (competitorUrls.length < 10) {
      setCompetitorUrls([
        ...competitorUrls,
        { id: Date.now().toString(), url: '' }
      ]);
    }
  };

  // Remove competitor URL input
  const removeCompetitorUrl = (id: string) => {
    if (competitorUrls.length > 1) {
      setCompetitorUrls(competitorUrls.filter(comp => comp.id !== id));
    }
  };

  // Update competitor URL
  const updateCompetitorUrl = (id: string, url: string) => {
    setCompetitorUrls(competitorUrls.map(comp => 
      comp.id === id 
        ? { ...comp, url, ...validateUrl(url) }
        : comp
    ));
  };

  // Validate social media URL
  const validateUrl = (url: string) => {
    if (!url.trim()) return { isValid: false };

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname;

      if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        const username = pathname.split('/')[1];
        return {
          isValid: !!username,
          platform: 'Twitter',
          username: username?.replace('@', ''),
          error: !username ? 'Invalid Twitter URL format' : undefined
        };
      }

      if (hostname.includes('instagram.com')) {
        const username = pathname.split('/')[1];
        return {
          isValid: !!username,
          platform: 'Instagram',
          username: username?.replace('@', ''),
          error: !username ? 'Invalid Instagram URL format' : undefined
        };
      }

      if (hostname.includes('youtube.com')) {
        if (pathname.includes('/channel/') || pathname.includes('/c/') || pathname.includes('/@')) {
          return {
            isValid: true,
            platform: 'YouTube',
            username: pathname.split('/').pop()?.replace('@', ''),
          };
        }
        return { isValid: false, error: 'Invalid YouTube URL format' };
      }

      if (hostname.includes('linkedin.com')) {
        if (pathname.includes('/in/') || pathname.includes('/company/')) {
          return {
            isValid: true,
            platform: 'LinkedIn',
            username: pathname.split('/')[2],
          };
        }
        return { isValid: false, error: 'Invalid LinkedIn URL format' };
      }

      return { isValid: false, error: 'Unsupported platform' };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  };

  // Start competitor analysis
  const startAnalysis = async () => {
    const validUrls = competitorUrls.filter(comp => comp.isValid && comp.url.trim());
    
    if (validUrls.length === 0) {
      setError('Please add at least one valid competitor profile URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await apiRequest<{ success: boolean; data: AnalysisResult }>('/api/competitors/analyze', {
        method: 'POST',
        body: JSON.stringify({
          competitorUrls: validUrls.map(comp => comp.url),
          analysisType,
          options: {
            maxPosts: 50,
            timePeriodDays: 30,
            includeContentAnalysis: true,
            includeEngagementAnalysis: true,
            includeAudienceAnalysis: true,
            includeCompetitiveInsights: true,
            includeRecommendations: true
          }
        })
      });

      if (response.success) {
        setResults(response.data);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitors</h1>
              <p className="text-gray-600">
                Analyze your competitors' social media strategies and get AI-powered insights
              </p>
            </div>

            {!results ? (
              /* Analysis Setup Form */
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">Setup Analysis</h2>

                {/* Competitor URLs */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Competitor Profile URLs
                  </label>
                  <div className="space-y-3">
                    {competitorUrls.map((competitor, index) => (
                      <div key={competitor.id} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type="url"
                              value={competitor.url}
                              onChange={(e) => updateCompetitorUrl(competitor.id, e.target.value)}
                              placeholder={`https://instagram.com/competitor${index + 1}`}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                competitor.url && !competitor.isValid 
                                  ? 'border-red-300 bg-red-50' 
                                  : competitor.isValid 
                                    ? 'border-green-300 border bg-green-50' 
                                    : 'border-gray-300 border'
                              }`}
                            />
                            {competitor.isValid && (
                              <div className="absolute right-3 top-2.5">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          {competitor.platform && (
                            <div className="mt-1 text-sm text-gray-600">
                              {competitor.platform} • @{competitor.username}
                            </div>
                          )}
                          {competitor.error && (
                            <div className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {competitor.error}
                            </div>
                          )}
                        </div>
                        {competitorUrls.length > 1 && (
                          <button
                            onClick={() => removeCompetitorUrl(competitor.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {competitorUrls.length < 10 && (
                    <button
                      onClick={addCompetitorUrl}
                      className="mt-3 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add another competitor
                    </button>
                  )}
                </div>

                {/* Analysis Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Analysis Type
                  </label>
                  <select
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="comprehensive">Comprehensive Analysis</option>
                    <option value="content_focused">Content-Focused Analysis</option>
                    <option value="engagement_focused">Engagement-Focused Analysis</option>
                    <option value="quick">Quick Overview</option>
                  </select>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-700">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {error}
                    </div>
                  </div>
                )}

                {/* Start Analysis Button */}
                <button
                  onClick={startAnalysis}
                  disabled={loading || competitorUrls.filter(c => c.isValid).length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Competitors...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Start Analysis
                    </>
                  )}
                </button>

                {loading && (
                  <div className="mt-4 text-center text-gray-600">
                    <p>This may take a few minutes as we collect and analyze data from social media platforms...</p>
                  </div>
                )}
              </div>
            ) : (
              /* Analysis Results */
              <div className="space-y-6">
                {/* Results Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                    <button
                      onClick={() => setResults(null)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      New Analysis
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {results.competitors_analyzed}
                      </div>
                      <div className="text-sm text-green-700">Competitors Analyzed</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.results.metadata.platforms_analyzed.length}
                      </div>
                      <div className="text-sm text-blue-700">Platforms Covered</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.results.metadata.total_posts_analyzed}
                      </div>
                      <div className="text-sm text-purple-700">Posts Analyzed</div>
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {results.warnings && results.warnings.failed_competitors.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center text-yellow-700 mb-2">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Some competitors couldn't be analyzed
                    </div>
                    <div className="space-y-1">
                      {results.warnings.failed_competitors.map((failed, index) => (
                        <div key={index} className="text-sm text-yellow-600">
                          • {failed.url}: {failed.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                {results.results.ai_insights && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      AI-Powered Insights
                    </h3>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                        {JSON.stringify(results.results.ai_insights, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Competitors Data */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-xl font-semibold mb-4">Competitor Profiles</h3>
                  <div className="space-y-4">
                    {results.results.competitors_data.map((competitor, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">@{competitor.username}</h4>
                            <div className="text-sm text-black text-gray-600">{competitor.platform}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{competitor.key_metrics.followers.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">followers</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Engagement Rate</div>
                            <div>{competitor.key_metrics.engagement_rate}%</div>
                          </div>
                          <div>
                            <div className="font-medium">Posts Analyzed</div>
                            <div>{competitor.key_metrics.posts_analyzed}</div>
                          </div>
                          <div>
                            <div className="font-medium">Data Quality</div>
                            <div className="capitalize">{competitor.key_metrics.data_quality}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {results.results.recommendations && results.results.recommendations.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                    <div className="space-y-3">
                      {results.results.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-900">{rec.title || `Recommendation ${index + 1}`}</div>
                          <div className="text-blue-700 mt-1">{rec.description || JSON.stringify(rec)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorAnalysisPage;
