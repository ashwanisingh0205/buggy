// lib/api.ts
export const apiFetch = (path: string, options: RequestInit = {}) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && localStorage.getItem('token')
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {})
    },
    ...options,
    credentials: 'include'
  });

export const apiJson = async <T = unknown>(path: string, options: RequestInit = {}): Promise<T> => {
  const res = await apiFetch(path, options);
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || 'Request failed');
  return res.json();
};
