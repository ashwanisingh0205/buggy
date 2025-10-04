import { measureApiCall } from '@/lib/performance';

type TokenPair = { accessToken: string; refreshToken: string; expiresIn: number };

// Request cache for GET requests
const requestCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
const pendingRequests = new Map<string, Promise<unknown>>();

// Cache TTL in milliseconds
const CACHE_TTL = {
  SHORT: 30 * 1000,    // 30 seconds
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000   // 30 minutes
};

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Enhanced token refresh with caching
let refreshPromise: Promise<string | null> | null = null;

async function refreshAppToken(): Promise<string | null> {
  // Prevent multiple simultaneous refresh attempts
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('refreshToken');
    if (!stored) return null;

    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${base}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refreshToken: stored })
    });
    
    if (!res.ok) return null;
    
    const data: { success?: boolean; data?: TokenPair } = await res.json().catch(() => ({}));
    if (data && data.data) {
      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      // Clear auth cache to ensure fresh token is used
      const { authUtils } = await import('@/lib/auth');
      authUtils.clearCache();
      return data.data.accessToken;
    }
    return null;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// Generate cache key for requests
function getCacheKey(path: string, init: RequestInit): string {
  const method = init.method || 'GET';
  const body = init.body ? JSON.stringify(init.body) : '';
  return `${method}:${path}:${body}`;
}

// Check if request should be cached
function shouldCache(path: string, method: string): boolean {
  return method === 'GET' && !path.includes('/auth/') && !path.includes('/callback');
}

// Get cache TTL based on endpoint
function getCacheTTL(path: string): number {
  if (path.includes('/profile') || path.includes('/channel')) return CACHE_TTL.MEDIUM;
  if (path.includes('/analytics') || path.includes('/campaigns')) return CACHE_TTL.SHORT;
  return CACHE_TTL.SHORT;
}

export async function apiRequest<T = unknown>(path: string, init: RequestInit = {}, retries = 1): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const method = init.method || 'GET';
  const cacheKey = getCacheKey(path, init);
  
  // Check cache for GET requests
  if (shouldCache(path, method)) {
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`📦 Cache hit: ${method} ${path}`);
      return cached.data as T;
    }
  }

  // Check for pending requests to prevent duplicates
  if (pendingRequests.has(cacheKey)) {
    console.log(`⏳ Request deduplication: ${method} ${path}`);
    return pendingRequests.get(cacheKey)! as Promise<T>;
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  console.log(`🌐 API Request: ${method} ${base}${path}`, {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    retries,
    cached: false,
    baseUrl: base,
    fullUrl: `${base}${path}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  // Create request promise with performance monitoring
  const requestPromise = (async (): Promise<T> => {
    return measureApiCall(async (): Promise<T> => {
    try {
      const res = await fetch(`${base}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });

      if (res.status === 401 && retries > 0) {
        console.log('🔑 Token expired, attempting refresh...');
        const newToken = await refreshAppToken();
        if (newToken) {
          console.log('✅ Token refreshed successfully, retrying request');
          return apiRequest<T>(path, init, retries - 1);
        } else {
          console.log('❌ Token refresh failed, redirecting to login');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            // Clear auth cache to prevent stale data
            const { authUtils } = await import('@/lib/auth');
            authUtils.clearCache();
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }
      }

      // Exponential backoff for 429 and 5xx
      if ((res.status === 429 || (res.status >= 500 && res.status <= 599)) && retries > 0) {
        const attempt = Math.max(1, 2 - retries + 1);
        const delay = Math.min(300 * Math.pow(2, attempt - 1), 3000);
        await sleep(delay);
        return apiRequest<T>(path, init, retries - 1);
      }

      if (!res.ok) {
        let body: any = null;
        try {
          body = await res.json();
        } catch (e) {
          console.log(`❌ Failed to parse error response as JSON:`, e);
          body = { message: `HTTP ${res.status} ${res.statusText}` };
        }
        
        const baseMessage = (body?.error || body?.message);
        const message = res.status === 403 ? (baseMessage || 'Permission denied') : (baseMessage || `HTTP ${res.status}`);
        
        console.log(`❌ API Error: ${res.status} ${res.statusText}`, {
          path,
          message,
          code: body?.code,
          details: body?.details,
          validationErrors: body?.validation_errors || body?.errors || body?.validation,
          fullResponse: body,
          responseText: await res.text().catch(() => 'Could not read response text')
        });
        
        // For validation errors, include more details
        if (res.status === 400 && body?.validation_errors) {
          throw new Error(`Validation failed: ${JSON.stringify(body.validation_errors)}`);
        } else if (res.status === 400 && body?.errors) {
          throw new Error(`Validation failed: ${JSON.stringify(body.errors)}`);
        }
        
        throw new Error(message);
      }

      const data = await res.json() as T;

      // Cache successful GET requests
      if (shouldCache(path, method)) {
        const ttl = getCacheTTL(path);
        requestCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl
        });
        console.log(`💾 Cached: ${method} ${path} (TTL: ${ttl}ms)`);
      }

      return data;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
    }, path);
  })();

  // Store pending request
  pendingRequests.set(cacheKey, requestPromise);

  return requestPromise;
}

// Cache management utilities
export const cacheUtils = {
  // Clear all cache
  clearAll(): void {
    requestCache.clear();
    pendingRequests.clear();
    console.log('🗑️ All API cache cleared');
  },

  // Clear cache for specific path pattern
  clearPattern(pattern: string): void {
    const keysToDelete = Array.from(requestCache.keys()).filter(key => key.includes(pattern));
    keysToDelete.forEach(key => requestCache.delete(key));
    console.log(`🗑️ Cleared cache for pattern: ${pattern} (${keysToDelete.length} entries)`);
  },

  // Get cache stats
  getStats(): { size: number; keys: string[] } {
    return {
      size: requestCache.size,
      keys: Array.from(requestCache.keys())
    };
  }
};

