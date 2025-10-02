"use client";
import { useEffect, useMemo, useState } from 'react';
import { campaignService } from '@/lib/campaignService';
import { authUtils } from '@/lib/auth';
import type { Bid } from '@/types/bid';
import { ChevronDownIcon, CheckIcon, EyeIcon, ChatBubbleLeftRightIcon, CalendarIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline';

export default function BrandBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const brandId = useMemo(() => {
    const user = authUtils.getUser?.();
    return user?._id || user?.id || null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        if (!brandId) {
          setError('Login required');
          return;
        }
        const res = await campaignService.listByBrand(brandId as string, { limit: 50 });
        const campaigns = res.data.campaigns || [];
        if (campaigns.length === 0) {
          setBids([]);
          return;
        }
        const results = await Promise.allSettled(
          campaigns.map(c => status
            ? campaignService.listBids(c._id as string, { status })
            : campaignService.listBids(c._id as string)
          )
        );
        const allBids: Bid[] = [];
        results.forEach(r => {
          if (r.status === 'fulfilled') {
            allBids.push(...(r.value.data?.bids || []));
          }
        });
        if (!cancelled) setBids(allBids);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load bids');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [brandId, status]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown]')) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { value: '', label: 'All Bids', icon: '📋', color: 'gray' },
    { value: 'pending', label: 'Pending', icon: '⏳', color: 'yellow' },
    { value: 'accepted', label: 'Accepted', icon: '✅', color: 'green' },
    { value: 'rejected', label: 'Rejected', icon: '❌', color: 'red' },
    { value: 'withdrawn', label: 'Withdrawn', icon: '↩️', color: 'gray' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaign Bids</h1>
              <p className="mt-2 text-gray-600">Review and manage all bids across your campaigns</p>
            </div>
            
            {/* Status Filter */}
            <div className="relative" data-dropdown>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left min-w-[160px] bg-white"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span className="text-gray-700">
                  {statusOptions.find(opt => opt.value === status)?.icon} {statusOptions.find(opt => opt.value === status)?.label}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isStatusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded text-left transition-colors"
                        onClick={() => {
                          setStatus(option.value);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        <span>{option.icon}</span>
                        <span className="text-sm text-gray-700">{option.label}</span>
                        {status === option.value && (
                          <CheckIcon className="w-4 h-4 text-blue-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading bids...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bids.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
              <TagIcon className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
            <p className="text-gray-500 mb-6">
              {status 
                ? `No bids found with status "${statusOptions.find(opt => opt.value === status)?.label.toLowerCase()}"`
                : 'No bids have been submitted to your campaigns yet.'
              }
            </p>
            {status && (
              <button 
                onClick={() => setStatus('')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Bids
              </button>
            )}
          </div>
        )}

        {/* Bids Grid */}
        {!loading && !error && bids.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bids.map(bid => (
              <div key={bid._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {typeof bid.campaign_id === 'object' ? bid.campaign_id.title : bid.campaign_id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by {typeof bid.creator_id === 'object' ? bid.creator_id.name : bid.creator_id}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bid.status)}`}>
                    {bid.status}
                  </span>
                </div>

                {/* Bid Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Bid Amount</div>
                      <div className="font-bold text-lg text-gray-900">
                        ₹{bid.bid_amount.toLocaleString()} {bid.currency}
                      </div>
                    </div>
                  </div>

                  {bid.proposal_text && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Proposal</div>
                      <p className="text-sm text-gray-700 line-clamp-3">{bid.proposal_text}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Submitted</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(bid.created_at || bid.updated_at || '')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <EyeIcon className="w-4 h-4 inline mr-2" />
                    View Details
                  </button>
                  {bid.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                        Accept
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && bids.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bid Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium uppercase tracking-wide">Total Bids</div>
                <div className="text-2xl font-bold text-blue-900 mt-1">{bids.length}</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-sm text-yellow-600 font-medium uppercase tracking-wide">Pending</div>
                <div className="text-2xl font-bold text-yellow-900 mt-1">
                  {bids.filter(b => b.status === 'pending').length}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-medium uppercase tracking-wide">Accepted</div>
                <div className="text-2xl font-bold text-green-900 mt-1">
                  {bids.filter(b => b.status === 'accepted').length}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600 font-medium uppercase tracking-wide">Total Value</div>
                <div className="text-2xl font-bold text-purple-900 mt-1">
                  ₹{bids.reduce((sum, b) => sum + b.bid_amount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

