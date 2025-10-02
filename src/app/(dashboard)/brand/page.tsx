"use client";
import { useState, useEffect } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { campaignService } from '@/lib/campaignService';
import { authUtils } from '@/lib/auth';
import { 
  PlusIcon, 
  EyeIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BrandDashboard() {
  const { data: campaigns, loading: campaignsLoading } = useCampaigns({ limit: 5 });
  const [stats, setStats] = useState({
    totalBids: 0,
    pendingBids: 0,
    acceptedBids: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  const brandId = authUtils.getUser?.()?._id || authUtils.getUser?.()?.id;

  useEffect(() => {
    const fetchStats = async () => {
      if (!brandId) return;
      
      try {
        setLoading(true);
        const res = await campaignService.listByBrand(brandId as string, { limit: 100 });
        const campaigns = res.data.campaigns || [];
        
        if (campaigns.length === 0) {
          setLoading(false);
          return;
        }

        const results = await Promise.allSettled(
          campaigns.map(c => campaignService.listBids(c._id as string))
        );

        let totalBids = 0;
        let pendingBids = 0;
        let acceptedBids = 0;
        let totalSpent = 0;

        results.forEach(r => {
          if (r.status === 'fulfilled') {
            const bids = r.value.data?.bids || [];
            totalBids += bids.length;
            pendingBids += bids.filter(b => b.status === 'pending').length;
            acceptedBids += bids.filter(b => b.status === 'accepted').length;
            totalSpent += bids.filter(b => b.status === 'accepted').reduce((sum, b) => sum + b.bid_amount, 0);
          }
        });

        setStats({ totalBids, pendingBids, acceptedBids, totalSpent });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [brandId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'draft':
        return <ClockIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-3">Welcome back!</h1>
              <p className="text-blue-100 text-lg">Here&apos;s what&apos;s happening with your campaigns today.</p>
            </div>
            <Link 
              href="/brand/campaigns"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              Create Campaign
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Campaigns</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{campaigns?.length || 0}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ChartBarIcon className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Bids</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : stats.totalBids}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Bids</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : stats.pendingBids}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ClockIcon className="w-7 h-7 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">₹{loading ? '...' : stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <CurrencyDollarIcon className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Campaigns</h2>
            <Link 
              href="/brand/campaigns"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-colors"
            >
              View all →
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {campaignsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading campaigns...</span>
              </div>
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.slice(0, 5).map(campaign => (
                <div key={campaign._id} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>
                    <div className="flex items-center gap-6 mt-3">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        ₹{campaign.budget.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {new Date(campaign.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </span>
                    <Link 
                      href={`/brand/campaigns`}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                <ChartBarIcon className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first campaign.</p>
              <Link 
                href="/brand/campaigns"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                Create Campaign
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/brand/campaigns"
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <PlusIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Create Campaign</h3>
              <p className="text-sm text-gray-500 mt-1">Launch a new campaign</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/brand/marketplace"
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Browse Creators</h3>
              <p className="text-sm text-gray-500 mt-1">Discover talented creators</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/brand/bids"
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircleIcon className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Review Bids</h3>
              <p className="text-sm text-gray-500 mt-1">Manage incoming proposals</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}


