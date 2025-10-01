"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/lib/apiClient';

type Creator = { _id: string; name?: string; email?: string; profile?: { bio?: string; avatar_url?: string } };

export default function CreatorProfilePage() {
  const params = useParams<{ id: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiRequest<{ success: boolean; data: { user: Creator } }>(`/api/admin/users/${params.id}`);
        setCreator(res.data.user);
      } catch (e: any) {
        setError(e?.message || 'Failed to load creator');
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!creator) return <p>Creator not found</p>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" style={{ backgroundImage: `url(${creator.profile?.avatar_url || ''})`, backgroundSize: 'cover' }} />
        <div>
          <h1 className="text-2xl font-semibold">{creator.name || creator.email}</h1>
          <p className="text-gray-500">{creator.profile?.bio}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Analytics</h2>
        <p className="text-sm text-gray-600">Analytics integration to be added.</p>
      </div>
    </div>
  );
}

