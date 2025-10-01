"use client";
import { useEffect, useMemo, useState } from 'react';
import { campaignService } from '@/lib/campaignService';
import { authUtils } from '@/lib/auth';
import type { Bid } from '@/types/bid';

export default function BrandBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

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

  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Bids</h1>
          <p className="text-gray-500 text-sm">All bids across your campaigns.</p>
        </div>
        <select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && bids.length === 0 && (
        <p className="text-sm text-gray-500">No bids found for your campaigns{status ? ` with status "${status}"` : ''}.</p>
      )}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-600">
              <th className="p-3">Campaign</th>
              <th className="p-3">Creator</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bids.map(b => (
              <tr key={b._id} className="border-t">
                <td className="p-3">{typeof b.campaign_id === 'object' ? b.campaign_id.title : b.campaign_id}</td>
                <td className="p-3">{typeof b.creator_id === 'object' ? b.creator_id.name : b.creator_id}</td>
                <td className="p-3">₹{b.bid_amount.toLocaleString()} {b.currency}</td>
                <td className="p-3 capitalize">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

