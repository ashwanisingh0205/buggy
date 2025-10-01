export type BidDeliverables = {
  posts?: number;
  stories?: number;
  reels?: number;
  videos?: number;
  timeline?: string;
};

export type Bid = {
  _id: string;
  campaign_id: string | { _id: string; title?: string };
  creator_id: string | { _id: string; name?: string };
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'completed';
  proposal_text: string;
  bid_amount: number;
  currency: 'INR' | 'USD' | 'EUR';
  deliverables?: BidDeliverables;
  createdAt?: string;
  updatedAt?: string;
};

export type BidListResponse = {
  success: boolean;
  data: {
    bids: Bid[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
};

export type BidResponse = { success: boolean; data: { bid: Bid } };

