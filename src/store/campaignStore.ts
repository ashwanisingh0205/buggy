import { useState } from 'react';

export type Campaign = { id: string; name: string };

export function useCampaignStore() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  return { campaigns, setCampaigns };
}


