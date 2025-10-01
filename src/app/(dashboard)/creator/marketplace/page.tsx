"use client";
import { useMemo, useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { createBidApi } from '@/hooks/useBids';
import type { Campaign } from '@/types/campaign';
import { authUtils } from '@/lib/auth';

export default function CreatorMarketplacePage() {
  const { data: campaigns, loading, error, params, setParams, refetch } = useCampaigns({ status: 'active', limit: 10 });
  const [placing, setPlacing] = useState<string | null>(null);
  const [proposal, setProposal] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const user = (authUtils.getUser?.() as any) || null;
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
    } catch (e: any) {
      alert(e?.message || 'Failed to place bid');
    } finally {
      setPlacing(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Creator Marketplace</h1>
          <p className="text-gray-500 text-sm">Browse active brand campaigns and place bids.</p>
        </div>
        <div className="flex gap-3">
          <select className="border rounded px-3 py-2" value={params.platform || ''} onChange={e => setParams({ platform: e.target.value || undefined })}>
            <option value="">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
          </select>
          <select className="border rounded px-3 py-2" value={params.sort || '-createdAt'} onChange={e => setParams({ sort: e.target.value })}>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading campaigns...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(c => (
          <div key={c._id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Budget</div>
                <div className="text-base font-semibold">₹{c.budget.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.requirements.platforms.map(p => (
                <span key={p} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{p}</span>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={!isCreator} onClick={() => setSelectedCampaign(c)}>{isCreator ? 'Place Bid' : 'Login as Creator to Bid'}</button>
            </div>
          </div>
        ))}
      </div>

      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-2">Bid on {selectedCampaign.title}</h2>
            <label className="block text-sm text-gray-700 mb-1">Proposal</label>
            <textarea className="w-full border rounded p-2 mb-3" rows={4} value={proposal} onChange={e => setProposal(e.target.value)} />
            <label className="block text-sm text-gray-700 mb-1">Amount (INR)</label>
            <input type="number" className="w-full border rounded p-2 mb-4" value={amount} onChange={e => setAmount(Number(e.target.value))} />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-2 rounded border" onClick={() => setSelectedCampaign(null)}>Cancel</button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={!isCreator || placing === selectedCampaign._id || !proposal || !amount} onClick={placeBid}>{placing ? 'Submitting...' : 'Submit Bid'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


