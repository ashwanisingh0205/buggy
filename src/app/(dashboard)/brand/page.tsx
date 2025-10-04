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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100">Here&apos;s what&apos;s happening with your campaigns today.</p>
          </div>
          <Link 
            href="/brand/campaigns"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create Campaign
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns?.length || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalBids}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Bids</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.pendingBids}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{loading ? '...' : stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
            <Link 
              href="/brand/campaigns"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {campaignsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.slice(0, 5).map(campaign => (
                <div key={campaign._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{campaign.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500">
                        Budget: ₹{campaign.budget.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </span>
                    <Link 
                      href={`/brand/campaigns`}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <ChartBarIcon className="w-12 h-12" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-sm text-gray-500 mb-4">Get started by creating your first campaign.</p>
              <Link 
                href="/brand/campaigns"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
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
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <PlusIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Create Campaign</h3>
              <p className="text-sm text-gray-500">Launch a new campaign</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/brand/marketplace"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Browse Creators</h3>
              <p className="text-sm text-gray-500">Discover talented creators</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/brand/bids"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <CheckCircleIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Review Bids</h3>
              <p className="text-sm text-gray-500">Manage incoming proposals</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}


