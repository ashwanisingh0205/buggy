export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}


