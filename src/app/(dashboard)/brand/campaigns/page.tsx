"use client";
import { useEffect, useMemo, useState } from 'react';
import { useCampaigns, createCampaign, updateCampaignApi } from '@/hooks/useCampaigns';
import type { Campaign } from '@/types/campaign';
import { acceptBidApi, rejectBidApi } from '@/hooks/useBids';
import { campaignService } from '@/lib/campaignService';
import { authUtils } from '@/lib/auth';

export default function BrandCampaignsPage() {
  const { data: campaigns, loading, error, refetch } = useCampaigns({ limit: 10 });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [draft, setDraft] = useState<Partial<Campaign>>({
    title: '',
    description: '',
    budget: 0,
    deadline: '',
    requirements: { platforms: [] },
    payment: { type: 'fixed', amount: 0, currency: 'INR' },
    isPublic: true
  });
  const [publishActive, setPublishActive] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState<string | null>(null);
  const [bids, setBids] = useState<import('@/types/bid').Bid[]>([]);

  useEffect(() => {
    (async () => {
      if (!selectedCampaignId) return;
      try {
        setBidsLoading(true);
        setBidsError(null);
        const res = await campaignService.listBids(selectedCampaignId, { limit: 20 });
        setBids(res.data.bids);
      } catch (e: any) {
        setBidsError(e?.message || 'Failed to load bids');
      } finally {
        setBidsLoading(false);
      }
    })();
  }, [selectedCampaignId]);

  const isValid = useMemo(() => {
    const titleOk = (draft.title || '').trim().length >= 5;
    const descOk = (draft.description || '').trim().length >= 10;
    const budgetOk = typeof draft.budget === 'number' && draft.budget >= 1000;
    const platformsOk = (draft.requirements?.platforms?.length || 0) >= 1;
    const deadlineOk = (deadlineDate && deadlineTime) ? (new Date(`${deadlineDate}T${deadlineTime}:00`) > new Date()) : false;
    return titleOk && descOk && budgetOk && platformsOk && deadlineOk;
  }, [draft, deadlineDate, deadlineTime]);

  const invalidReasons = useMemo(() => {
    const reasons: string[] = [];
    if (!draft.title || draft.title.trim().length < 5) reasons.push('Title must be at least 5 characters');
    if (!draft.description || draft.description.trim().length < 10) reasons.push('Description must be at least 10 characters');
    if (!(typeof draft.budget === 'number' && draft.budget >= 1000)) reasons.push('Budget must be at least 1000');
    if (!draft.requirements?.platforms || draft.requirements.platforms.length < 1) reasons.push('Select at least one platform');
    if (!(deadlineDate && deadlineTime && new Date(`${deadlineDate}T${deadlineTime}:00`) > new Date())) reasons.push('Choose a future deadline date and time');
    return reasons;
  }, [draft, deadlineDate, deadlineTime]);

  const onCreate = async () => {
    try {
      setCreating(true);
      setFormError(null);
      if (!isValid) {
        setFormError('Please fill all required fields: Title (≥5), Description (≥10), Budget (≥1000), Platforms (≥1), Future deadline.');
        return;
      }
      console.log('🚀 Creating campaign with draft:', draft, { deadlineDate, deadlineTime });
      // Combine date and time into ISO; fallback to end-of-day if parsing fails
      const combinedDeadline = (() => {
        if (deadlineDate) {
          const dt = new Date(`${deadlineDate}T${deadlineTime || '23:59'}:00`);
          if (!isNaN(dt.getTime())) return dt.toISOString();
        }
        const end = new Date();
        end.setHours(23,59,59,0);
        end.setDate(end.getDate() + 1);
        return end.toISOString();
      })();

      const payload = { 
        ...draft,
        deadline: combinedDeadline,
        payment: { ...(draft.payment as any), amount: Number(draft.budget || 0) }
      } as any;
      console.log('📦 Payload for POST /api/campaigns:', payload);
      const created = await createCampaign(payload);
      if (publishActive && created && created._id) {
        try {
          await updateCampaignApi(created._id, { status: 'active' } as any);
        } catch (e) {
          console.warn('Failed to set campaign active, leaving as draft', e);
        }
      }
      console.log('✅ Created campaign:', created);
      setDraft({ title: '', description: '', budget: 0, deadline: '', requirements: { platforms: [] }, payment: { type: 'fixed', amount: 0, currency: 'INR' }, isPublic: true });
      setDeadlineDate('');
      setDeadlineTime('23:59');
      setPublishActive(true);
      await refetch();
      alert(`Campaign created${publishActive ? ' and published' : ''}: ${created.title}`);
    } catch (e: any) {
      setFormError(e?.message || 'Failed to create campaign');
      console.error('❌ Create campaign failed:', e);
    } finally {
      setCreating(false);
    }
  };

  const user = (authUtils.getUser?.() as any) || null;

  const onAccept = async (campaignId: string, bidId: string) => {
    await acceptBidApi(campaignId, bidId);
    // refresh bids
    setSelectedCampaignId(prev => prev); // trigger useEffect
  };
  const onReject = async (campaignId: string, bidId: string) => {
    await rejectBidApi(campaignId, bidId);
    setSelectedCampaignId(prev => prev);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-4">Brand Campaigns</h1>

      <div className="border rounded-lg p-4 bg-white shadow-sm mb-8">
        <h2 className="font-semibold mb-3">Create Campaign</h2>
        {user && user.role !== 'brand' ? (
          <div className="mb-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
            You are logged in as a {user.role}. Only brand users can create campaigns.
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Title" value={draft.title || ''} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Budget (INR)" value={draft.budget || 0} onChange={e => setDraft(d => ({ ...d, budget: Number(e.target.value) }))} />
          <div className="flex gap-2">
            <input className="border rounded px-3 py-2 flex-1" type="date" placeholder="Deadline" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} />
            <input className="border rounded px-3 py-2 w-32" type="time" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={publishActive} onChange={e => setPublishActive(e.target.checked)} />
            Publish (set status to Active)
          </label>
          <select multiple className="border rounded px-3 py-2"
            value={draft.requirements?.platforms || []}
            onChange={e => {
              const values = Array.from(e.target.selectedOptions).map(o => o.value);
              setDraft(d => ({ ...d, requirements: { ...(d.requirements || { platforms: [] }), platforms: values as any } }));
            }}>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
          </select>
          <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Description" value={draft.description || ''} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
        </div>
        {formError && <div className="mt-2 text-sm text-red-600">{formError}</div>}
        {!isValid && invalidReasons.length > 0 && (
          <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
            {invalidReasons.map((r) => (<li key={r}>{r}</li>))}
          </ul>
        )}
        <div className="mt-3 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={creating || !isValid} onClick={onCreate}>{creating ? 'Creating...' : 'Create Campaign'}</button>
        </div>
      </div>

      {loading && <p>Loading campaigns...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map(c => (
          <div key={c._id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-base font-semibold capitalize">{c.status}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.requirements.platforms.map(p => (
                <span key={p} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{p}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button className={`px-3 py-2 rounded border ${selectedCampaignId === c._id ? 'bg-gray-900 text-white' : ''}`} onClick={() => setSelectedCampaignId(prev => prev === c._id ? null : c._id)}>View Bids</button>
              <div className="text-sm">Budget: ₹{c.budget.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {!!selectedCampaignId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Bids</h2>
              <button className="px-3 py-1 rounded border" onClick={() => setSelectedCampaignId(null)}>Close</button>
            </div>
            {bidsLoading && <div className="text-sm text-gray-500">Loading bids...</div>}
            {bidsError && <div className="text-sm text-red-600">{bidsError}</div>}
            <div className="space-y-3 max-h-[60vh] overflow-auto">
              {bids.map(b => (
                <div key={b._id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">₹{b.bid_amount.toLocaleString()} <span className="text-xs text-gray-500">{b.currency}</span></div>
                      <div className="text-sm text-gray-700 line-clamp-2">{b.proposal_text}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded border" onClick={() => onReject(selectedCampaignId, b._id)}>Reject</button>
                      <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => onAccept(selectedCampaignId, b._id)}>Accept</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


