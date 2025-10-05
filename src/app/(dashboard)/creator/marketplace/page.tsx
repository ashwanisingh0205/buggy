"use client";
import { useMemo, useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { createBidApi } from '@/hooks/useBids';
import type { Campaign } from '@/types/campaign';
import { authUtils } from '@/lib/auth';
import { Search, Filter, DollarSign, Calendar, Users, Globe, Menu } from 'lucide-react';
import CreatorLayout from '@/Components/Creater/CreatorLayout';

export default function CreatorMarketplacePage() {
  const { data: campaigns, loading, error, params, setParams, refetch } = useCampaigns({ status: 'active', limit: 10 });
  const [placing, setPlacing] = useState<string | null>(null);
  const [proposal, setProposal] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const user = (authUtils.getUser?.() as { role?: string } | null) || null;
  const isCreator = user?.role === 'creator';

  const filtered = useMemo(() => campaigns, [campaigns]);

  const placeBid = async () => {
    if (!isCreator) {
      alert('Only creator accounts can place bids. Please login as a creator.');
      return;
    }
    if (!selectedCampaign) return;
    try {
      setPlacing(selectedCampaign._id);
      await createBidApi({ campaign_id: selectedCampaign._id, proposal_text: proposal, bid_amount: amount, currency: 'INR' });
      setProposal('');
      setAmount(0);
      setSelectedCampaign(null);
      await refetch();
      alert('Bid submitted');
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to place bid';
      alert(errorMessage);
    } finally {
      setPlacing(null);
    }
  };

  return (
    <CreatorLayout 
      title="Creator Marketplace" 
      subtitle="Discover and bid on brand campaigns"
    >
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="hidden md:block text-3xl font-bold text-gray-900">Creator Marketplace</h1>
            <p className="hidden md:block mt-2 text-gray-600">Discover and bid on exciting brand campaigns</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors duration-200 min-w-[300px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Filter Campaigns</h3>
              <p className="text-sm text-gray-500">Refine your search to find the perfect campaigns</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{filtered.length} campaigns found</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-black font-medium text-gray-700">Platform</label>
            <select 
              className="w-full border text-black border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors duration-200" 
              value={params.platform || ''} 
              onChange={e => setParams({ platform: e.target.value || undefined })}
            >
              <option value="">All Platforms</option>
              <option value="instagram">📸 Instagram</option>
              <option value="youtube">🎥 YouTube</option>
              <option value="twitter">🐦 X (Twitter)</option>
              <option value="linkedin">💼 LinkedIn</option>
              <option value="facebook">👥 Facebook</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select 
              className="w-full border text-black border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors duration-200" 
              value={params.sort || '-createdAt'} 
              onChange={e => setParams({ sort: e.target.value })}
            >
              <option value="-createdAt">🕒 Newest First</option>
              <option value="createdAt">📅 Oldest First</option>
              <option value="-budget">💰 Highest Budget</option>
              <option value="budget">💵 Lowest Budget</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Budget Range</label>
            <select 
              className="w-full border text-black border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors duration-200"
              defaultValue=""
            >
              <option value="">Any Budget</option>
              <option value="0-10000">₹0 - ₹10K</option>
              <option value="10000-50000">₹10K - ₹50K</option>
              <option value="50000-100000">₹50K - ₹1L</option>
              <option value="100000+">₹1L+</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Campaign Type</label>
            <select 
              className="w-full border text-black border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors duration-200"
              defaultValue=""
            >
              <option value="">All Types</option>
              <option value="sponsored">🎯 Sponsored Posts</option>
              <option value="collaboration">🤝 Collaborations</option>
              <option value="review">⭐ Product Reviews</option>
              <option value="brand">🏷️ Brand Partnerships</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Quick filters:</span>
            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200">
              High Budget
            </button>
            <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200">
              Instagram
            </button>
            <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors duration-200">
              YouTube
            </button>
          </div>
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
            Clear all filters
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading campaigns...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading campaigns</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(c => (
          <div key={c._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{c.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-green-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="text-lg font-bold">₹{c.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Active</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Globe className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Platforms</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.requirements.platforms.map(p => (
                    <span key={p} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Target: {(c as Campaign & { targetAudience?: string }).targetAudience || 'General'}</span>
                </div>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" 
                  disabled={!isCreator} 
                  onClick={() => setSelectedCampaign(c)}
                >
                  {isCreator ? 'Place Bid' : 'Login Required'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      )}

      {selectedCampaign && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Place Your Bid</h2>
              <button 
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">{selectedCampaign.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Budget: ₹{selectedCampaign.budget.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Proposal
                </label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                  rows={4} 
                  value={proposal} 
                  onChange={e => setProposal(e.target.value)}
                  placeholder="Describe how you'll approach this campaign..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (INR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="number" 
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" 
                onClick={() => setSelectedCampaign(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" 
                disabled={!isCreator || placing === selectedCampaign._id || !proposal || !amount} 
                onClick={placeBid}
              >
                {placing === selectedCampaign._id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Bid'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </CreatorLayout>
  );
}


